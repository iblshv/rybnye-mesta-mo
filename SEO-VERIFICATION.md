# Проверка, deploy и ручные действия

## Изменения в коде

- Добавлена единая функция canonical URL со слешем.
- Все canonical и sitemap URL приведены к фактическому формату production.
- `robots.ts` заменён на явный `public/robots.txt` с `Clean-param` для Яндекса.
- Sitemap использует фиксированную дату значимого изменения, а не дату каждого build.
- Добавлены страницы по щуке, сому, судаку, домикам, ночной рыбалке, аренде снастей и расстоянию 30/50/100 км.
- Добавлены видимые хлебные крошки и Schema.org `BreadcrumbList`.
- Добавлены `WebSite`, `Organization`, `CollectionPage`, `ItemList`, `Place`.
- Удалена бесполезная для Google FAQ rich-result разметка; видимый FAQ сохранён.
- Старые зарыбления исключены из блока «Свежие»; исторические даты получили пояснение.
- Расширена внутренняя перелинковка с главной и из footer.
- Созданы аудит, roadmap, семантика, контент-план, шаблоны и gap-анализ.

## Команды проверки

```powershell
node_modules\.bin\tsc.CMD --noEmit
node_modules\.bin\next.CMD lint
node_modules\.bin\next.CMD build
```

После build проверить:

```powershell
Select-String -Path out\sitemap.xml -Pattern '<loc>'
Get-Content out\robots.txt
Select-String -Path out\ponds\index.html -Pattern 'canonical|CollectionPage|BreadcrumbList'
Select-String -Path out\ponds\fishka-petryaiha\index.html -Pattern 'canonical|"@type":"Place"|BreadcrumbList'
```

Критерии:

- typecheck, lint и build завершаются с кодом 0;
- sitemap содержит 27 уникальных URL со слешем;
- каждый sitemap URL после deploy отвечает 200 без промежуточного редиректа;
- canonical совпадает с финальным URL;
- фильтры не попадают в sitemap;
- неизвестный URL отвечает 404;
- главная, каталог, подборка и карточка имеют ровно один H1;
- JSON-LD разбирается как JSON и соответствует видимому контенту.

## Обязательная настройка nginx

Это нельзя исправить статическим Next.js-кодом. Перед изменением сохранить текущий конфиг и выполнить `nginx -t`. Сертификат должен покрывать `fishno.ru` и `www.fishno.ru`.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name fishno.ru www.fishno.ru;
    return 301 https://fishno.ru$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.fishno.ru;

    # ssl_certificate /actual/path/fullchain.pem;
    # ssl_certificate_key /actual/path/privkey.pem;
    return 301 https://fishno.ru$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name fishno.ru;

    root /actual/path/to/out;
    index index.html;

    # Существующие SSL/security/cache-настройки сохранить.
    # Для статического export нужен текущий рабочий try_files.
}
```

Проверить после reload:

```powershell
curl.exe -I http://fishno.ru/ponds/
curl.exe -I https://www.fishno.ru/ponds/
curl.exe -I https://fishno.ru/ponds/
```

Ожидается: первые два — один `301` на `https://fishno.ru/ponds/`; последний — `200`.

## Яндекс Вебмастер

1. Добавить и подтвердить `https://fishno.ru/`.
2. Проверить главное зеркало и диагностику HTTPS/дублей.
3. Добавить `https://fishno.ru/sitemap.xml`; дождаться статуса OK.
4. Проверить robots анализатором, включая URL с `fish`, `distance`, `price`, `feature`, `sort`.
5. В «Настройке GET-параметров» отметить фильтры каталога незначимыми; правила не должны противоречить `Clean-param`.
6. Проверить ответы сервера для главной, каталога, 3 подборок, 3 карточек и 404.
7. Отправить на переобход: главную, каталог, основные рыба/условия/расстояние.
8. Проверить «Страницы в поиске» и причины исключения; выгрузить baseline.
9. Проверить микроразметку главной, списка и карточки валидатором Яндекса.
10. Связать сайт с Метрикой после установки счётчика.

## Google Search Console

1. Создать Domain property `fishno.ru` через DNS.
2. Отправить sitemap.
3. URL Inspection: главная, каталог, одна рыбная, одна сервисная, одна дистанционная и две карточки.
4. Проверить Page indexing, Crawled/Discovered currently not indexed, duplicate canonical и 404.
5. Проверить HTTPS и Core Web Vitals после накопления данных.
6. Валидировать Breadcrumb structured data и общую Schema.org-разметку.
7. Сохранить baseline: queries, pages, countries/devices, impressions, clicks, CTR, average position.
8. Не ждать FAQ rich result: Google прекратил этот тип выдачи в мае 2026 года.

## Метрика и события

Нужен реальный ID счётчика. После согласия на аналитику и проверки политики конфиденциальности настроить:

- `outbound_pond_site` — переход на официальный сайт;
- `phone_click` — клик по телефону;
- `map_open` — открытие Яндекс Карт;
- `route_build` — маршрут, когда появится отдельное действие;
- `filter_apply` — изменение фильтра;
- `collection_to_pond` — переход из подборки;
- `stocking_view` — просмотр подтверждённого зарыбления;
- `data_error_submit` — сообщение об ошибке;
- `owner_lead_submit` — отправка формы владельца.

## Ручная работа, которую нельзя автоматизировать безопасно

- Доступ к nginx/DNS и настройка редиректов.
- Права в Яндекс Вебмастере, Search Console и Метрике.
- Получение Wordstat-частотностей по региону 213/Московская область.
- Проверка цен, правил, телефонов, графика и зарыблений у первоисточников.
- Получение разрешений на реальные фотографии.
- Добавление новых водоёмов и модерация владельцев.
- Настройка отправки формы вместо текущей MVP-заглушки.
- Региональный мониторинг 50+ запросов отдельно в Яндексе и Google.

## План контроля после deploy

- Через 1 день: HTTP-коды, canonical, robots, sitemap, schema.
- Через 3–7 дней: обход роботов и первые статусы URL.
- Через 2 недели: индексируемые страницы, показы, запросы, причины исключения.
- Через 4 недели: сравнить baseline по небрендовым показам, CTR и кликам на карточки.
- Ежемесячно: обновлять roadmap на основании данных, а не общей посещаемости.
