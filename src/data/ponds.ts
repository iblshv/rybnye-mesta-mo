export type Pond = {
  id: string;
  name: string;
  slug: string;
  description: string;
  district: string;
  direction: string;
  distanceFromMkad: number;
  address: string;
  phone: string;
  mapUrl: string;
  websiteUrl?: string;
  coordinates: [number, number];
  priceFrom: number;
  workingHours: string;
  fish: string[];
  services: string[];
  features: {
    gazebos: boolean;
    tackleRental: boolean;
    familyFriendly: boolean;
    nightFishing: boolean;
    parking: boolean;
    cafe: boolean;
    houses: boolean;
  };
  lastStocking?: {
    date: string;
    fish: string;
    amount: string;
    comment?: string;
  };
  rules: string[];
  whatToBring: string[];
  images: string[];
  status: "draft" | "published";
  placement: "standard" | "priority";
  position: number | null;
  clientUntil?: string;
  isFeatured: boolean;
};

export const ponds: Pond[] = [
  {
    id: "pond-001",
    name: "РК «Фишка», Петряиха",
    slug: "fishka-petryaiha",
    description:
      "Крупный рыболовный клуб на Новорижском направлении с несколькими водоёмами, VIP-зонами, домиками, беседками и большим выбором рыбы.",
    district: "Рузский район",
    direction: "Новорижское шоссе",
    distanceFromMkad: 72,
    address:
      "Московская область, Рузский район, Новорижское шоссе, 72-й км, деревня Петряиха",
    phone: "+7 (969) 255-52-22",
    mapUrl:
      "https://yandex.ru/maps/?text=Московская%20область%20Рузский%20район%20Петряиха%20Фишка",
    websiteUrl: "https://fishka.fish",
    coordinates: [55.7738, 36.5166],
    priceFrom: 1000,
    workingHours:
      "Зависит от водоёма и тарифа: есть дневные, вечерние, ночные и суточные путёвки",
    fish: [
      "форель",
      "карп",
      "щука",
      "сом",
      "канальный сом",
      "белый амур",
      "осётр",
      "толстолобик",
      "сиг",
      "налим",
      "линь",
      "карась",
      "окунь",
      "веслонос",
      "муксун"
    ],
    services: [
      "Несколько водоёмов",
      "Беседки",
      "Домики",
      "Аренда снастей",
      "Продажа прикормки",
      "Парковка"
    ],
    features: {
      gazebos: true,
      tackleRental: true,
      familyFriendly: true,
      nightFishing: true,
      parking: true,
      cafe: false,
      houses: true
    },
    lastStocking: {
      date: "2026-01-14",
      fish: "форель",
      amount: "навеска 1,3-2,7 кг",
      comment: "По найденной информации на сайте: свежая форель 1,3-2,7 кг."
    },
    rules: [
      "Лимиты снастей зависят от выбранного водоёма и тарифа.",
      "На части водоёмов нельзя переходить между прудами.",
      "Дополнительные снасти оплачиваются отдельно.",
      "Есть запреты на отдельные виды оснастки и прикормки."
    ],
    whatToBring: [
      "Спиннинг, поплавочную или фидерную снасть под нужный водоём.",
      "Садок и подсачек либо деньги на аренду.",
      "Наживку, пасту, блёсны и прикормку под выбранную рыбу.",
      "Непромокаемую одежду и запас обуви."
    ],
    images: ["/images/placeholders/pond-1.svg"],
    status: "published",
    placement: "standard",
    position: null,
    isFeatured: true
  },
  {
    id: "pond-002",
    name: "«Золотой Сазан», Поливаново",
    slug: "zolotoy-sazan-polivanovo",
    description:
      "Премиальная рыболовная база на Симферопольском шоссе с беседками, коттеджами, рестораном, детским клубом и развитой инфраструктурой.",
    district: "городской округ Подольск",
    direction: "Симферопольское шоссе",
    distanceFromMkad: 41,
    address: "Московская область, городской округ Подольск, 41-й км Симферопольского шоссе",
    phone: "+7 (495) 782-44-86",
    mapUrl:
      "https://yandex.ru/maps/?text=Золотой%20Сазан%20Поливаново%2041-й%20км%20Симферопольского%20шоссе",
    websiteUrl: "https://goldsazan.ru",
    coordinates: [55.3878, 37.5128],
    priceFrom: 5000,
    workingHours: "Водоёмы: ориентир 07:00-20:00, актуальный режим лучше уточнять",
    fish: [
      "карп",
      "сазан",
      "линь",
      "белый амур",
      "форель",
      "щука",
      "сиг",
      "сом",
      "белуга",
      "осётр",
      "окунь",
      "карась"
    ],
    services: [
      "49 беседок",
      "Коттеджи",
      "SPA и баня",
      "Ресторан",
      "Детский клуб",
      "Магазин снастей",
      "Аренда снастей",
      "Парковка"
    ],
    features: {
      gazebos: true,
      tackleRental: true,
      familyFriendly: true,
      nightFishing: false,
      parking: true,
      cafe: true,
      houses: true
    },
    lastStocking: {
      date: "2025-10-07",
      fish: "форель",
      amount: "запуск по новости",
      comment: "В найденных новостях также упоминались запуски налима и щуки."
    },
    rules: [
      "Рыбалка по путёвкам, бронирование желательно заранее.",
      "Можно взять инструктора.",
      "Правила зависят от выбранного водоёма и тарифа.",
      "Беседки оплачиваются отдельно."
    ],
    whatToBring: [
      "Свои снасти или деньги на аренду.",
      "Садок, подсачек, наживку и одежду по погоде.",
      "Термос или еду, если не планируете ресторан.",
      "Бронь беседки при семейной поездке."
    ],
    images: ["/images/placeholders/pond-2.svg"],
    status: "published",
    placement: "standard",
    position: null,
    isFeatured: true
  },
  {
    id: "pond-003",
    name: "РК «Ихтиолог»",
    slug: "ihtiolog-kushelovo",
    description:
      "Рыболовный клуб в Лотошино с несколькими водоёмами, форелью, осетром, проживанием, зоопарком и семейной инфраструктурой.",
    district: "городской округ Лотошино",
    direction: "Волоколамское шоссе",
    distanceFromMkad: 118,
    address:
      "Московская область, городской округ Лотошино, деревня Кушелово, Большая улица, 64",
    phone: "+7 (499) 390-88-90",
    mapUrl:
      "https://yandex.ru/maps/?text=РК%20Ихтиолог%20Кушелово%20Большая%2064",
    websiteUrl: "https://club-ihtiolog.ru",
    coordinates: [56.2978, 35.7349],
    priceFrom: 1000,
    workingHours: "Ориентир: с утра до 20:00, перед поездкой лучше уточнить режим",
    fish: [
      "форель",
      "осётр",
      "стерлядь",
      "карп",
      "сазан",
      "щука",
      "карась",
      "линь",
      "сиг",
      "налим",
      "белый амур",
      "окунь",
      "канальный сом"
    ],
    services: [
      "Несколько водоёмов",
      "Аренда снастей",
      "Проживание",
      "Зоопарк",
      "Детская площадка",
      "Парковка"
    ],
    features: {
      gazebos: false,
      tackleRental: true,
      familyFriendly: true,
      nightFishing: false,
      parking: true,
      cafe: false,
      houses: true
    },
    lastStocking: {
      date: "2026-06-07",
      fish: "осётр",
      amount: "до 20 кг",
      comment:
        "Найдено официальное сообщение за 1-7 июня 2026 о зарыблении осетром до 20 кг."
    },
    rules: [
      "Мужчины от 12 лет покупают путёвку.",
      "Женщины и дети могут ловить на снасти рыбака по правилам тарифа.",
      "Обычно разрешено до трёх снастей.",
      "Нельзя оставлять снасть без присмотра; возможен контроль улова на выезде."
    ],
    whatToBring: [
      "Максимум разрешённых снастей под выбранный тариф.",
      "Подсачек, садок и наживку под форель, осетра или карпа.",
      "Тёплую одежду для раннего старта.",
      "Деньги на доплату за рыбу по прайсу."
    ],
    images: ["/images/placeholders/pond-3.svg"],
    status: "published",
    placement: "standard",
    position: null,
    isFeatured: true
  },
  {
    id: "pond-004",
    name: "«Золотые Караси»",
    slug: "zolotye-karasi-ogudnevo",
    description:
      "Рыболовная усадьба в Щёлково с проживанием, рестораном, беседками с мангалами, мостками, прокатом снастей и семейным отдыхом.",
    district: "городской округ Щёлково",
    direction: "Щёлковское шоссе",
    distanceFromMkad: 42,
    address: "Московская область, городской округ Щёлково, деревня Огуднево, 2Ас3",
    phone: "+7 (495) 135-43-04",
    mapUrl:
      "https://yandex.ru/maps/?text=Золотые%20Караси%20Огуднево%202Ас3",
    websiteUrl: "https://carasi.ru",
    coordinates: [56.0792, 38.2557],
    priceFrom: 3000,
    workingHours: "По карточке: до 18:00; рыбалку и беседки лучше бронировать заранее",
    fish: [
      "форель",
      "осётр",
      "щука",
      "судак",
      "налим",
      "карась",
      "карп",
      "сазан",
      "толстолобик",
      "сом",
      "белый амур"
    ],
    services: [
      "Проживание",
      "Ресторан",
      "Беседки",
      "Мангал",
      "Аренда снастей",
      "Соревнования",
      "Парковка"
    ],
    features: {
      gazebos: true,
      tackleRental: true,
      familyFriendly: true,
      nightFishing: false,
      parking: true,
      cafe: true,
      houses: true
    },
    rules: [
      "Рыбу нельзя отпускать обратно.",
      "Перелимит оплачивается по прайсу.",
      "Трофейная рыба может считаться по повышенному коэффициенту.",
      "На разных акваториях действуют разные лимиты снастей."
    ],
    whatToBring: [
      "Снасти под карпа, форель или щуку.",
      "Садок, подсачек и наживку.",
      "Мангальные принадлежности при брони беседки.",
      "Контейнер или термосумку для рыбы."
    ],
    images: ["/images/placeholders/pond-4.svg"],
    status: "published",
    placement: "standard",
    position: null,
    isFeatured: true
  },
  {
    id: "pond-005",
    name: "РК «Марлин»",
    slug: "marlin-holmy",
    description:
      "Клуб в Истринском округе с дневными, ночными и суточными форматами, тёплыми беседками, мостками и прокатом снастей.",
    district: "городской округ Истра",
    direction: "Новорижское шоссе",
    distanceFromMkad: 48,
    address: "Московская область, городской округ Истра, деревня Холмы",
    phone: "+7 (925) 296-83-96",
    mapUrl: "https://yandex.ru/maps/?text=РК%20Марлин%20деревня%20Холмы%20Истра",
    websiteUrl: "https://marlin-club.ru",
    coordinates: [55.8906, 36.8846],
    priceFrom: 2300,
    workingHours:
      "Есть дневные, ночные и суточные форматы; актуальный режим лучше уточнять",
    fish: [
      "форель",
      "осётр",
      "стерлядь",
      "сом",
      "карась",
      "белый амур",
      "щука",
      "окунь",
      "толстолобик",
      "линь",
      "карп",
      "сазан",
      "сиг",
      "налим",
      "судак"
    ],
    services: [
      "Беседки",
      "Мангал",
      "Аренда снастей",
      "Помощь на водоёме",
      "Ночная рыбалка",
      "Парковка"
    ],
    features: {
      gazebos: true,
      tackleRental: true,
      familyFriendly: true,
      nightFishing: true,
      parking: true,
      cafe: false,
      houses: false
    },
    lastStocking: {
      date: "2026-02-11",
      fish: "форель",
      amount: "68 кг",
      comment:
        "Сайт сообщает о зарыблении форелью обычно два раза в неделю; найденная публичная дата - 11 февраля 2026."
    },
    rules: [
      "Мужчины старше 15 лет оплачивают рыбалку.",
      "Женщины и дети до 15 лет могут ловить на снасти рыбака.",
      "Беседки оплачиваются отдельно.",
      "Правила зависят от выбранного тарифа."
    ],
    whatToBring: [
      "Спиннинг или поплавочную снасть.",
      "Подсачек, садок и форелевые приманки.",
      "Карповые насадки при ловле карпа и сазана.",
      "Тёплую одежду для ночной рыбалки и бронь беседки."
    ],
    images: ["/images/placeholders/pond-5.svg"],
    status: "published",
    placement: "standard",
    position: null,
    isFeatured: true
  },
  {
    id: "pond-006",
    name: "ULTRAlight-world",
    slug: "ultralight-world-kononovo",
    description:
      "Комплекс в Клинском округе с малым и большим водоёмами, домами, баней, беседками, VIP-беседками, прокатом и копчением рыбы.",
    district: "городской округ Клин",
    direction: "Ленинградское шоссе",
    distanceFromMkad: 82,
    address: "Московская область, городской округ Клин, деревня Кононово",
    phone: "+7 (915) 473-50-09",
    mapUrl: "https://yandex.ru/maps/?text=ULTRAlight-world%20Кононово%20Клин",
    websiteUrl: "https://ultralight-world.ru",
    coordinates: [56.3192, 36.7736],
    priceFrom: 500,
    workingHours: "Малый водоём 07:00-21:00, большой водоём 07:00-19:00",
    fish: [
      "форель",
      "осётр",
      "стерлядь",
      "белый амур",
      "сом",
      "сиг",
      "карп",
      "линь",
      "щука"
    ],
    services: [
      "Два водоёма",
      "Домики",
      "Баня",
      "Беседки",
      "VIP-беседки",
      "Аренда снастей",
      "Копчение рыбы",
      "Детская зона"
    ],
    features: {
      gazebos: true,
      tackleRental: true,
      familyFriendly: true,
      nightFishing: false,
      parking: true,
      cafe: false,
      houses: true
    },
    rules: [
      "На водоёмах действует лимит снастей.",
      "Дополнительная снасть оплачивается отдельно.",
      "На малом водоёме есть запреты на прикормку и отдельные оснастки.",
      "Рыба оплачивается по килограммам."
    ],
    whatToBring: [
      "Разрешённые приманки под конкретный водоём.",
      "Одну-две снасти, подсачек и садок.",
      "Деньги на оплату улова по весу.",
      "Одежду для отдыха у воды."
    ],
    images: ["/images/placeholders/pond-6.svg"],
    status: "published",
    placement: "standard",
    position: null,
    isFeatured: true
  },
  {
    id: "pond-007",
    name: "РК «Каньон»",
    slug: "kanion-byakontovo",
    description:
      "Круглосуточный проточный родниковый водоём в Подольске с форелью, ежедневными запусками, беседками, прокатом и магазином наживки.",
    district: "городской округ Подольск",
    direction: "Симферопольское шоссе",
    distanceFromMkad: 35,
    address: "Московская область, городской округ Подольск, деревня Бяконтово",
    phone: "+7 (985) 532-22-72",
    mapUrl: "https://yandex.ru/maps/?text=РК%20Каньон%20Бяконтово%20Подольск",
    websiteUrl: "https://kanion-fish.ru",
    coordinates: [55.4222, 37.5098],
    priceFrom: 2500,
    workingHours: "Круглосуточно",
    fish: ["форель", "осётр", "карп", "сом", "белый амур"],
    services: [
      "Ежедневные запуски",
      "Беседки",
      "Мангал",
      "Аренда снастей",
      "Магазин наживки",
      "Парковка",
      "Корпоративные мероприятия"
    ],
    features: {
      gazebos: true,
      tackleRental: true,
      familyFriendly: true,
      nightFishing: true,
      parking: true,
      cafe: false,
      houses: false
    },
    lastStocking: {
      date: "2026-07-05",
      fish: "форель",
      amount: "ежедневные запуски",
      comment:
        "По тарифам указаны ежедневные запуски: 4 кг на путёвку в 08:00 или 2 кг на путёвку в 12:00."
    },
    rules: [
      "Путёвка оформляется с залогом.",
      "Сопровождающие проходят по правилам тарифа.",
      "По завершении рыбалки проходят взвешивание, фото и закрытие путёвки.",
      "Прокатные снасти оплачиваются при утере или поломке."
    ],
    whatToBring: [
      "Спиннинг под форель.",
      "Подсачек и садок или деньги на прокат.",
      "Форелевые приманки.",
      "Тёплую одежду для ночной рыбалки и деньги на залог."
    ],
    images: ["/images/placeholders/pond-1.svg"],
    status: "published",
    placement: "standard",
    position: null,
    isFeatured: false
  },
  {
    id: "pond-008",
    name: "Рыбное хозяйство «У Ромыча!»",
    slug: "u-romycha-sokolovskoe",
    description:
      "Форелевое хозяйство в Солнечногорске с шестичасовыми окнами, беседками, VIP-беседками, SPA и трофейным прудом.",
    district: "городской округ Солнечногорск",
    direction: "Пятницкое шоссе",
    distanceFromMkad: 55,
    address:
      "Московская область, городской округ Солнечногорск, территориальное управление Соколовское",
    phone: "+7 (965) 230-07-49",
    mapUrl:
      "https://yandex.ru/maps/?text=У%20Ромыча%20рыбное%20хозяйство%20Солнечногорск%20Соколовское",
    websiteUrl: "https://uromicha.ru",
    coordinates: [56.0889, 37.0792],
    priceFrom: 500,
    workingHours: "6-часовые окна: 07:00-13:00 и 13:00-19:00",
    fish: ["форель", "щука", "карп", "белый амур", "толстолобик"],
    services: [
      "Форелевая рыбалка",
      "Экскурсия по хозяйству",
      "SPA с бассейном",
      "Беседки",
      "VIP-беседки",
      "Мангал"
    ],
    features: {
      gazebos: true,
      tackleRental: false,
      familyFriendly: true,
      nightFishing: false,
      parking: true,
      cafe: false,
      houses: false
    },
    lastStocking: {
      date: "2026-05-16",
      fish: "щука, карп, белый амур, толстолобик",
      amount: "трофейная рыба 3-5 кг",
      comment:
        "Найдена новость об открытии трофейного пруда 16 мая 2026 с рыбой от 3 до 5 кг."
    },
    rules: [
      "Путёвки оформляются на конкретное 6-часовое окно.",
      "Рыба оплачивается по факту вылова.",
      "Тарифы зависят от пруда и формата отдыха.",
      "Условия по улову лучше подтверждать перед выездом."
    ],
    whatToBring: [
      "Снасти под форель, щуку или карпа.",
      "Разрешённую наживку, садок и подсачек.",
      "Контейнер для рыбы.",
      "Купальные принадлежности, если планируете SPA."
    ],
    images: ["/images/placeholders/pond-2.svg"],
    status: "published",
    placement: "standard",
    position: null,
    isFeatured: false
  },
  {
    id: "pond-009",
    name: "Рыболовная база отдыха «Львово»",
    slug: "lvovo-fishing-base",
    description:
      "База отдыха в Волоколамском округе с несколькими водоёмами, домиками на воде, ECO POD, баней, проживанием и семейным форматом.",
    district: "Волоколамский муниципальный округ",
    direction: "Новорижское шоссе",
    distanceFromMkad: 105,
    address: "Московская область, Волоколамский муниципальный округ, деревня Львово",
    phone: "+7 (903) 003-26-50",
    mapUrl:
      "https://yandex.ru/maps/?text=Рыболовная%20база%20Львово%20Волоколамский%20округ",
    websiteUrl: "https://lvovo.ru",
    coordinates: [56.0518, 35.8754],
    priceFrom: 700,
    workingHours: "Есть дневные и суточные тарифы; время зависит от водоёма и сезона",
    fish: [
      "карась",
      "окунь",
      "щука",
      "форель",
      "карп",
      "судак",
      "сазан",
      "сиг",
      "осётр",
      "сом",
      "белый амур"
    ],
    services: [
      "Несколько водоёмов",
      "Домики на воде",
      "ECO POD",
      "Баня",
      "Проживание",
      "Семейный отдых"
    ],
    features: {
      gazebos: false,
      tackleRental: false,
      familyFriendly: true,
      nightFishing: true,
      parking: true,
      cafe: false,
      houses: true
    },
    rules: [
      "Рыбалка по путёвкам на конкретный пруд и тариф.",
      "Круглогодичная рыбалка заявлена на отдельных водоёмах.",
      "Актуальные условия зависят от сезона.",
      "Проживание бронируется отдельно."
    ],
    whatToBring: [
      "Снасти под выбранный пруд.",
      "Наживку, приманки, садок и подсачек.",
      "Одежду для загородного отдыха.",
      "Бронь проживания при поездке на сутки."
    ],
    images: ["/images/placeholders/pond-3.svg"],
    status: "published",
    placement: "standard",
    position: null,
    isFeatured: false
  },
  {
    id: "pond-010",
    name: "РК «Фишпарк»",
    slug: "fishpark-almazovo",
    description:
      "Рыболовный клуб в Щёлково с тремя водоёмами, форелью, карпом, осетром, беседками, кафе, тёплыми туалетами и парковкой.",
    district: "городской округ Щёлково",
    direction: "Щёлковское шоссе",
    distanceFromMkad: 28,
    address: "Московская область, городской округ Щёлково, деревня Алмазово",
    phone: "+7 (926) 410-03-03",
    mapUrl: "https://yandex.ru/maps/?text=РК%20Фишпарк%20Алмазово%20Щёлково",
    websiteUrl: "https://fishpark.su",
    coordinates: [55.8299, 38.1184],
    priceFrom: 670,
    workingHours: "Ежедневно 07:00-17:00; сезонные новости могут менять открытие",
    fish: ["форель", "осётр", "карп", "белый амур", "линь", "африканский сом"],
    services: [
      "Три водоёма",
      "Беседки",
      "Закрытые беседки",
      "Мангал",
      "Кафе",
      "Тёплые туалеты",
      "Прокат садка и подсачека",
      "Парковка"
    ],
    features: {
      gazebos: true,
      tackleRental: true,
      familyFriendly: true,
      nightFishing: false,
      parking: true,
      cafe: true,
      houses: false
    },
    rules: [
      "Билет покупается до рыбалки.",
      "С берега разрешены две снасти, дополнительная снасть платная.",
      "Рыбу выпускать нельзя.",
      "Садок и подсачек обязательны; алкоголь запрещён."
    ],
    whatToBring: [
      "Садок и подсачек обязательно.",
      "Одну-две снасти и наживку.",
      "Тару для рыбы.",
      "Одежду по погоде; алкоголь не брать."
    ],
    images: ["/images/placeholders/pond-4.svg"],
    status: "published",
    placement: "priority",
    position: 1,
    isFeatured: false
  }
];

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isPriorityPond(pond: Pond, now = new Date()) {
  if (
    pond.placement !== "priority" ||
    !Number.isInteger(pond.position) ||
    (pond.position ?? 0) <= 0
  ) {
    return false;
  }

  if (!pond.clientUntil) {
    return true;
  }

  if (!isValidDate(pond.clientUntil)) {
    return false;
  }

  return new Date(`${pond.clientUntil}T23:59:59`).getTime() >= now.getTime();
}

export function sortPondsRecommended(items: Pond[], now = new Date()) {
  return [...items].sort((a, b) => {
    const aPriority = isPriorityPond(a, now);
    const bPriority = isPriorityPond(b, now);

    if (aPriority !== bPriority) {
      return aPriority ? -1 : 1;
    }

    if (aPriority && bPriority && a.position !== b.position) {
      return (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER);
    }

    return a.distanceFromMkad - b.distanceFromMkad || a.name.localeCompare(b.name, "ru") || a.id.localeCompare(b.id);
  });
}

export function getPublishedPonds() {
  return ponds.filter((pond) => pond.status === "published");
}

export const fishOptions = Array.from(
  new Set(getPublishedPonds().flatMap((pond) => pond.fish))
).sort(
  (a, b) => a.localeCompare(b, "ru")
);

export function getPondBySlug(slug: string) {
  return getPublishedPonds().find((pond) => pond.slug === slug);
}

export function getFeaturedPonds() {
  return sortPondsRecommended(getPublishedPonds().filter((pond) => pond.isFeatured)).slice(0, 6);
}

export function isRecentStocking(pond: Pond, now = new Date(), maxAgeDays = 60) {
  if (!pond.lastStocking) {
    return false;
  }

  const stockingTime = new Date(`${pond.lastStocking.date}T00:00:00`).getTime();
  if (Number.isNaN(stockingTime) || stockingTime > now.getTime()) {
    return false;
  }

  const ageInDays = (now.getTime() - stockingTime) / 86_400_000;
  return ageInDays <= maxAgeDays;
}

export function getRecentStockings(limit = 6) {
  return getPublishedPonds()
    .filter((pond) => isRecentStocking(pond))
    .sort(
      (a, b) =>
        new Date(b.lastStocking?.date ?? 0).getTime() -
        new Date(a.lastStocking?.date ?? 0).getTime()
    )
    .slice(0, limit);
}

export function getTicketFormats(pond: Pond) {
  const formats = [`Дневная путёвка от ${pond.priceFrom.toLocaleString("ru-RU")} ₽`];

  if (pond.features.nightFishing) {
    formats.push("Ночная или суточная путёвка по правилам водоёма");
  }

  if (pond.features.familyFriendly) {
    formats.push("Формат для семейной поездки и гостей");
  }

  return formats;
}
