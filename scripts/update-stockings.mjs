import { appendFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import * as cheerio from "cheerio";
import ts from "typescript";
import { stockingSources } from "./stocking-sources.mjs";

const projectRoot = process.cwd();
const pondsFile = path.join(projectRoot, "src", "data", "ponds.ts");
const maxAgeDays = 60;
const requestTimeoutMs = 20_000;
const debugEnabled = process.env.DEBUG_STOCKINGS === "1";

function debug(message) {
  if (debugEnabled) console.log(`  [debug] ${message}`);
}

const fishPatterns = [
  ["форель", /форел(?:ь|и|ью|ев)/i],
  ["карп", /карп(?:а|ом|ов|ы)?/i],
  ["осётр", /ос[её]тр(?:а|ом|ов|ы)?/i],
  ["щука", /щук(?:а|и|у|ой)/i],
  ["сом", /сом(?:а|ом|ов|ы)?/i],
  ["белый амур", /бел(?:ый|ого|ым)\s+амур(?:а|ом|ов)?/i],
  ["толстолобик", /толстолобик(?:а|ом|ов|и)?/i],
  ["линь", /лин(?:ь|я|ем|и)/i],
  ["сиг", /сиг(?:а|ом|ов|и)?/i],
  ["налим", /налим(?:а|ом|ов|ы)?/i],
  ["стерлядь", /стерляд(?:ь|и|ью)/i],
  ["белуга", /белуг(?:а|и|у|ой)/i],
  ["карась", /карас(?:ь|я|ем|и)/i]
];

const eventPattern = /зарыблен|запуск|запустил|запустили|выпустил|выпустили|привезли|пополнил[^.]{0,80}садк/i;
const completedEventPattern = /зарыблени[ея]\s+состоял|произвели\s+зарыбление|прошло\s+зарыбление|запустил(?:и|а)?|запускаем|выпустил(?:и|а)?|выпускаем|привезли|пополнил(?:и|а)?(?:[^.]{0,80}садк|\s+пруд)/i;
const futureOrNegativePattern = /(?:не\s+будет\s+(?:зарыблен|запуск)|запусков\s+нет|без\s+запуск|планируется\s+(?:зарыбление|запуск)|ожидается\s+(?:зарыбление|запуск)|предстоит\s+(?:зарыбление|запуск)|запустим|выпустим|будет\s+(?:зарыбление|запуск)|завтра\s+(?:запуст|выпуст))/i;

function normalizeText(value) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function getProperty(objectNode, name) {
  return objectNode.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) &&
      ((ts.isIdentifier(property.name) && property.name.text === name) ||
        (ts.isStringLiteral(property.name) && property.name.text === name))
  );
}

function stringValue(property) {
  return property && ts.isStringLiteralLike(property.initializer)
    ? property.initializer.text
    : undefined;
}

function readPublishedPonds(sourceText) {
  const sourceFile = ts.createSourceFile(pondsFile, sourceText, ts.ScriptTarget.Latest, true);
  let pondsArray;

  sourceFile.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const declaration of node.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === "ponds" &&
        declaration.initializer &&
        ts.isArrayLiteralExpression(declaration.initializer)
      ) {
        pondsArray = declaration.initializer;
      }
    }
  });

  if (!pondsArray) {
    throw new Error("Не найден массив ponds в src/data/ponds.ts");
  }

  return pondsArray.elements
    .filter(ts.isObjectLiteralExpression)
    .map((objectNode) => {
      const lastStocking = getProperty(objectNode, "lastStocking");
      const stockingObject =
        lastStocking && ts.isObjectLiteralExpression(lastStocking.initializer)
          ? lastStocking.initializer
          : undefined;

      return {
        objectNode,
        slug: stringValue(getProperty(objectNode, "slug")),
        name: stringValue(getProperty(objectNode, "name")),
        status: stringValue(getProperty(objectNode, "status")),
        websiteUrl: stringValue(getProperty(objectNode, "websiteUrl")),
        lastStocking,
        currentDate: stockingObject
          ? stringValue(getProperty(stockingObject, "date"))
          : undefined,
        rulesProperty: getProperty(objectNode, "rules")
      };
    })
    .filter((pond) => pond.slug && pond.status === "published");
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(url, {
      headers: {
        "accept-language": "ru-RU,ru;q=0.9",
        "user-agent": "Fishno stocking verifier/1.0 (+https://fishno.ru)"
      },
      redirect: "follow",
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return { html: await response.text(), finalUrl: response.url };
  } finally {
    clearTimeout(timeout);
  }
}

function resolveCandidateLinks(html, pageUrl) {
  const $ = cheerio.load(html);
  const links = new Map();
  const sourceHost = new URL(pageUrl).hostname.replace(/^www\./, "");

  $("a[href]").each((_, element) => {
    const anchor = $(element);
    let context = anchor;
    let nearby = "";
    for (let depth = 0; depth < 5 && context.length; depth += 1) {
      nearby = normalizeText(context.text());
      if (eventPattern.test(`${nearby} ${anchor.attr("href") ?? ""}`)) break;
      context = context.parent();
    }
    const label = normalizeText(`${anchor.text()} ${anchor.attr("title") ?? ""} ${nearby}`).slice(0, 2500);
    const rawHref = anchor.attr("href");
    if (!rawHref || !eventPattern.test(`${label} ${rawHref}`)) return;

    try {
      const url = new URL(rawHref, pageUrl);
      if (url.hostname.replace(/^www\./, "") !== sourceHost) return;
      url.hash = "";
      links.set(url.href, label);
    } catch {
      // Игнорируем повреждённые ссылки источника.
    }
  });

  return [...links.entries()].slice(0, 15).map(([url, label]) => ({ url, label }));
}

const russianMonths = new Map([
  ["января", 1], ["февраля", 2], ["марта", 3], ["апреля", 4],
  ["мая", 5], ["июня", 6], ["июля", 7], ["августа", 8],
  ["сентября", 9], ["октября", 10], ["ноября", 11], ["декабря", 12]
]);

function validIsoDate(year, month, day) {
  const iso = `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return undefined;
  }
  return { iso, time: date.getTime() };
}

function datesFromText(text) {
  const results = [];
  const nowYear = new Date().getFullYear();
  for (const match of text.matchAll(/\b(20\d{2})[-/.](0?[1-9]|1[0-2])[-/.](0?[1-9]|[12]\d|3[01])\b/g)) {
    const parsed = validIsoDate(Number(match[1]), Number(match[2]), Number(match[3]));
    if (parsed) results.push(parsed);
  }
  for (const match of text.matchAll(/\b(0?[1-9]|[12]\d|3[01])[.\/-](0?[1-9]|1[0-2])[.\/-](2\d|20\d{2})\b/g)) {
    const rawYear = Number(match[3]);
    const year = rawYear < 100 ? 2000 + rawYear : rawYear;
    const parsed = validIsoDate(year, Number(match[2]), Number(match[1]));
    if (parsed) results.push(parsed);
  }
  for (const match of text.toLocaleLowerCase("ru").matchAll(/(?<!\d)(0?[1-9]|[12]\d|3[01])\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)(?:\s+(20\d{2}))?(?!\d)/g)) {
    const parsed = validIsoDate(Number(match[3] ?? nowYear), russianMonths.get(match[2]), Number(match[1]));
    if (parsed) results.push(parsed);
  }
  return results;
}

function findPublishedDate($, title, pageText, url, fallbackLabel) {
  const preferred = [
    $('meta[property="article:published_time"]').attr("content"),
    $('meta[itemprop="datePublished"]').attr("content"),
    $("time[datetime]").first().attr("datetime"),
    $(".page-header__date, .news-detail__date, .post-date, .entry-date, [itemprop='datePublished']").first().text(),
    title,
    url,
    fallbackLabel
  ].filter(Boolean);

  for (const value of preferred) {
    const dates = datesFromText(value);
    if (dates.length) return dates.sort((a, b) => b.time - a.time)[0];
  }

  const dates = datesFromText(pageText.slice(0, 5000));
  return dates.sort((a, b) => b.time - a.time)[0];
}

function eventExcerpt(title, text) {
  const joined = normalizeText(`${title}. ${text}`);
  const indexes = [];
  const globalEventPattern = new RegExp(eventPattern.source, "gi");
  for (const match of joined.matchAll(globalEventPattern)) indexes.push(match.index);
  if (!indexes.length) return joined.slice(0, 1500);
  const excerpts = indexes.map((index) => joined.slice(Math.max(0, index - 350), index + 1200));
  return excerpts.find((excerpt) => completedEventPattern.test(excerpt)) ?? excerpts[0];
}

function eventDateFromExcerpt(excerpt, published) {
  const monthNames = "января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря";
  const numericDate = "(?:0?[1-9]|[12]\\d|3[01])[./-](?:0?[1-9]|1[0-2])[./-](?:2\\d|20\\d{2})";
  const wordDate = `(?:0?[1-9]|[12]\\d|3[01])\\s+(?:${monthNames})(?:\\s+20\\d{2})?`;
  const dateToken = `(?:${numericDate}|${wordDate})`;
  const completedAction = "(?:зарыбление\\s+состоялось|запустили|запустила|запускаем|выпустили|выпустила|выпускаем|привезли|пополнили|пополнила)";
  const patterns = [
    new RegExp(`(${dateToken})[^.!?]{0,60}?${completedAction}`, "gi"),
    new RegExp(`${completedAction}[^.!?]{0,60}?(${dateToken})`, "gi")
  ];
  const dates = [];
  for (const pattern of patterns) {
    for (const match of excerpt.matchAll(pattern)) {
      const parsedDates = datesFromText(match[1]);
      debug(`Дата рядом с событием: «${match[0].slice(0, 100)}» -> ${parsedDates.map((date) => date.iso).join(", ") || "нет"}`);
      dates.push(...parsedDates);
    }
  }
  const eligible = dates.filter((date) => !published || date.time <= published.time);
  return eligible.sort((a, b) => b.time - a.time)[0] ?? published;
}

function fishFromText(text) {
  return fishPatterns
    .filter(([, pattern]) => pattern.test(text))
    .map(([fish]) => fish)
    .slice(0, 4)
    .join(", ");
}

function amountFromText(text) {
  const preferred = text.match(
    /(?:общ(?:им|его)\s+вес(?:ом|а)|парт(?:ия|ию|ией)|запустил(?:и|а)?|выпустил(?:и|а)?)[^.]{0,100}?\b(\d[\d\s]*(?:[.,]\d+)?)\s*(кг|килограмм(?:а|ов)?|тонн(?:а|ы|у)?|т)\b/i
  );
  const amounts = [...text.matchAll(/\b(\d[\d\s]*(?:[.,]\d+)?)\s*(кг|килограмм(?:а|ов)?|тонн(?:а|ы|у)?|т)\b/gi)];
  const amount = preferred ?? amounts[0];
  if (!amount) return "количество не указано";
  const [number, unit] = [amount[1].replace(/\s+/g, " "), amount[2].toLocaleLowerCase("ru")];
  const normalizedUnit = unit.startsWith("т") && unit !== "т" ? "т" : unit.startsWith("килограмм") ? "кг" : unit;
  const amountIndex = amount.index ?? 0;
  const prefix = text.slice(Math.max(0, amountIndex - 30), amountIndex).toLocaleLowerCase("ru");
  if (/навеск/.test(prefix) && !preferred) {
    return `количество не указано, навеска ${number} ${normalizedUnit}`;
  }
  return `${number} ${normalizedUnit}`;
}

function candidateFromPage(html, url, fallbackLabel) {
  const $ = cheerio.load(html);
  $("script, style, noscript, svg").remove();
  const title = normalizeText(
    $('meta[property="og:title"]').attr("content") ||
      $("article h1, main h1").last().text() ||
      $("h1").last().text() ||
      fallbackLabel ||
      $("title").text() ||
      ""
  );
  const contentSelectors = [
    ".news-detail-content",
    ".r-detail-text",
    ".entry-content",
    ".post-content",
    "article",
    "main",
    "body"
  ];
  const contentElement = contentSelectors
    .map((selector) => $(selector).first())
    .find((element) => element.length && normalizeText(element.text()).length > 40);
  const pageText = normalizeText(contentElement?.text() ?? $("body").text());
  const excerpt = eventExcerpt(title, pageText);
  const headlineLooksLikeEvent = eventPattern.test(title);

  if (
    !headlineLooksLikeEvent ||
    futureOrNegativePattern.test(title) ||
    !completedEventPattern.test(excerpt)
  ) {
    debug(`Отклонено ${url}: заголовок «${title.slice(0, 100)}», фактическое событие=${completedEventPattern.test(excerpt)}`);
    return undefined;
  }

  const published = findPublishedDate($, title, pageText, url, fallbackLabel);
  const eventDate = eventDateFromExcerpt(`${title}. ${pageText}`, published);
  const fish = fishFromText(eventPattern.test(title) ? title : excerpt);
  if (!eventDate || !fish) {
    debug(`Отклонено ${url}: дата=${eventDate?.iso ?? "нет"}, рыба=${fish || "нет"}`);
    return undefined;
  }

  const now = Date.now();
  const ageDays = (now - eventDate.time) / 86_400_000;
  if (eventDate.time > now || ageDays > maxAgeDays) {
    debug(`Отклонено ${url}: дата события ${eventDate.iso} вне допустимого периода`);
    return undefined;
  }

  return {
    date: eventDate.iso,
    time: eventDate.time,
    fish,
    amount: amountFromText(excerpt),
    comment: `Подтверждено по официальной публикации «${title.slice(0, 180)}».`,
    sourceUrl: url
  };
}

async function newestStockingForPond(pond) {
  const listingUrls = stockingSources[pond.slug] ?? (pond.websiteUrl ? [pond.websiteUrl] : []);
  const candidates = [];

  for (const listingUrl of listingUrls) {
    try {
      const listing = await fetchHtml(listingUrl);
      const links = resolveCandidateLinks(listing.html, listing.finalUrl);
      debug(`${listingUrl}: найдено ссылок-кандидатов ${links.length}`);
      for (const link of links) {
        debug(`Проверяем ${link.url}`);
        try {
          const page = await fetchHtml(link.url);
          const candidate = candidateFromPage(page.html, page.finalUrl, link.label);
          if (candidate) candidates.push(candidate);
        } catch (error) {
          console.warn(`  Не удалось проверить ${link.url}: ${error.message}`);
        }
      }
    } catch (error) {
      console.warn(`  Источник недоступен ${listingUrl}: ${error.message}`);
    }
  }

  return candidates.sort((a, b) => b.time - a.time)[0];
}

function stockingInitializer(candidate, verifiedAt) {
  return `{
      date: ${JSON.stringify(candidate.date)},
      fish: ${JSON.stringify(candidate.fish)},
      amount: ${JSON.stringify(candidate.amount)},
      comment: ${JSON.stringify(candidate.comment)},
      sourceUrl: ${JSON.stringify(candidate.sourceUrl)},
      verifiedAt: ${JSON.stringify(verifiedAt)}
    }`;
}

async function setGithubOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `${name}=${value}\n`, "utf8");
  }
}

async function main() {
  let sourceText = await readFile(pondsFile, "utf8");
  const ponds = readPublishedPonds(sourceText);
  const replacements = [];
  const updates = [];
  const verifiedAtParts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const verifiedAtPart = (type) => verifiedAtParts.find((part) => part.type === type)?.value;
  const verifiedAt = `${verifiedAtPart("year")}-${verifiedAtPart("month")}-${verifiedAtPart("day")}`;

  console.log(`Проверяем опубликованные пруды: ${ponds.length}`);
  for (const pond of ponds) {
    console.log(`- ${pond.name}`);
    const candidate = await newestStockingForPond(pond);
    if (!candidate) {
      console.log("  Нового подтверждённого зарыбления нет.");
      continue;
    }

    if (pond.currentDate && candidate.date <= pond.currentDate) {
      console.log(`  Актуальная запись уже не старше найденной (${candidate.date}).`);
      continue;
    }

    const initializer = stockingInitializer(candidate, verifiedAt);
    if (pond.lastStocking) {
      replacements.push({
        start: pond.lastStocking.initializer.getStart(),
        end: pond.lastStocking.initializer.getEnd(),
        text: initializer
      });
    } else if (pond.rulesProperty) {
      replacements.push({
        start: pond.rulesProperty.getStart(),
        end: pond.rulesProperty.getStart(),
        text: `lastStocking: ${initializer},\n    `
      });
    } else {
      throw new Error(`У ${pond.slug} не найдено место для lastStocking`);
    }

    updates.push({ pond: pond.name, ...candidate });
    console.log(`  Найдено: ${candidate.date}, ${candidate.fish}, ${candidate.amount}`);
  }

  replacements.sort((a, b) => b.start - a.start);
  for (const replacement of replacements) {
    sourceText = sourceText.slice(0, replacement.start) + replacement.text + sourceText.slice(replacement.end);
  }

  if (updates.length) {
    await writeFile(pondsFile, sourceText, "utf8");
  }

  await setGithubOutput("changed", updates.length ? "true" : "false");
  await setGithubOutput("count", String(updates.length));

  if (process.env.GITHUB_STEP_SUMMARY) {
    const lines = updates.length
      ? updates.map((item) => `- **${item.pond}** — ${item.date}, ${item.fish}, ${item.amount} ([источник](${item.sourceUrl}))`)
      : ["Новых подтверждённых зарыблений не найдено; публикация не требуется."];
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `## Проверка зарыблений\n\n${lines.join("\n")}\n`, "utf8");
  }

  console.log(`Готово. Изменений: ${updates.length}.`);
}

main().catch(async (error) => {
  console.error(error);
  await setGithubOutput("changed", "false");
  process.exitCode = 1;
});
