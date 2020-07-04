'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var sirv = _interopDefault(require('sirv'));
var polka = _interopDefault(require('polka'));
var compression = _interopDefault(require('compression'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var Stream = _interopDefault(require('stream'));
var http = _interopDefault(require('http'));
var Url = _interopDefault(require('url'));
var https = _interopDefault(require('https'));
var zlib = _interopDefault(require('zlib'));

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}

// source: https://html.spec.whatwg.org/multipage/indices.html
const boolean_attributes = new Set([
    'allowfullscreen',
    'allowpaymentrequest',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'ismap',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected'
]);

const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
// https://infra.spec.whatwg.org/#noncharacter
function spread(args, classes_to_add) {
    const attributes = Object.assign({}, ...args);
    if (classes_to_add) {
        if (attributes.class == null) {
            attributes.class = classes_to_add;
        }
        else {
            attributes.class += ' ' + classes_to_add;
        }
    }
    let str = '';
    Object.keys(attributes).forEach(name => {
        if (invalid_attribute_name_character.test(name))
            return;
        const value = attributes[name];
        if (value === true)
            str += " " + name;
        else if (boolean_attributes.has(name.toLowerCase())) {
            if (value)
                str += " " + name;
        }
        else if (value != null) {
            str += ` ${name}="${String(value).replace(/"/g, '&#34;').replace(/'/g, '&#39;')}"`;
        }
    });
    return str;
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}

/* src/icons/Arrow.svg generated by Svelte v3.21.0 */

const Arrow = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<svg${spread([
		{ width: "16" },
		{ height: "16" },
		{ viewBox: "0 0 16 16" },
		{ fill: "none" },
		{ xmlns: "http://www.w3.org/2000/svg" },
		$$props
	])}><path d="${"M0 4H16L8 16L0 4Z"}" fill="${"#731DD8"}"></path></svg>`;
});

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

var currentLanguage = "укр";
var languages = [
	{
		key: "/",
		name: "українська"
	},
	{
		key: "/ru",
		name: "російська"
	}
];
var menu = {
	download: "Завантажити",
	advantages: "Переваги",
	features: "Особливості",
	contact: "Зв’язатись"
};
var download = {
	title: "Medlibra",
	titleDescription: "мобільний застосунок №1 для підготовки до КРОК",
	downloadFree: "Завантажити безкоштовно"
};
var advantages = {
	overview: [
		{
			title: "5",
			content: "Типів КРОК\n(1, 2, 3, М, Б)"
		},
		{
			title: "20",
			content: "Окремих\nспеціалізацій"
		},
		{
			title: "3 000",
			content: "Буклетів та\nбаз"
		},
		{
			title: "160 000",
			content: "Унікальних\nпитань"
		}
	],
	infographics: [
		{
			title: "Найбільша бібліотека тестів",
			content: "Найповніша база тестів. Починайте навчання одразу, без потреби шукати необхідне"
		},
		{
			title: "Доступ офлайн",
			content: "Швидке і зручне завантаження тестів до офлайну. Усі потрібні тести доступні будь-коли"
		},
		{
			title: "Збереження питань",
			content: "Жодних скріншотів. Зберігайте складні або незрозумілі питання прямо у застосунку"
		},
		{
			title: "Зручний інтерфейс",
			content: "Нічого зайвого. Ви бачите лише тести з власної спеціалізації. Режими день/ніч допоможуть очам не перевтомлюватись"
		},
		{
			title: "Контроль прогресу",
			content: "Відслідковуйте рівень власних знань. Вибудовуйте таку стратегію навчання, як вам зручно"
		}
	]
};
var features = {
	title: "Особливості роботи. Як працює застосунок для КРОК Medlibra?",
	content: [
		"Перш за все, повноцінно використовуючи застосунок, ви зможете максимально наблизити себе до умов проходження іспиту КРОК.\n\nПо-друге, застосунок допоможе вам максимально якісно підготуватись до тестових питань завдяки різним режимам тестування (іспит та тренування), що дає можливість перевірити себе в різних умовах та закріпити вивчений матеріал.\n\nПо-третє, продумані та зручні особливості додатку допоможуть у наступних ситуаціях:\n– Щоб відслідковувати свій успіх та розуміти, наскільки добре йде підготовка, створено різні типи статистик та історій проходження тестів.\n– Незрозуміле конкретне питання – не проблема, його можна зберегти та навчатись далі, щоб повернутись до нього згодом.",
		"– Знайти відповідь на складне питання не вдалося? Є можливість перевірити коментарі: інші користувачі можуть залишити посилання на літературу або поділись цим питанням з іншими одразу із застосунку.\n\n– Якщо є перебої з інтернетом – не проблема! Додаток Medlibra працює без підключення до інтернету і дозволяє без обмежень готуватись у зручний для себе час.\n\n– Інтуїтивно зрозуміла навігація дає змогу не витрачати зусиль на безглузде вивчення інструкцій.\nЗастосунок Medlibra створено для допомоги студентам у підготовці до тестування КРОК. Він працює з Android та iOS і дає змогу, незалежно від смартфону, однаково зручно навчитись проходити тестування, адже тут є буклети і бази з більш ніж 160 000 питань."
	],
	testBaseTitle: "База тестів Крок у Medlibra",
	testBaseContent: [
		"Яким чином допомогти студентам-медикам у навчанні? Про це подумала команда розробників застосунку Medlibra. Ними було створено зручну програму для підготовки до тестів КРОК 1, КРОК 2, КРОК 3, КРОК М, КРОК Б, що складається з численних буклетів та баз по всіх медичних спеціальностях.\n\nВикористовуючи для підготовки до тестування цей застосунок, ви з легкістю опануєте будь-які тести КРОК. Він поєднує у собі продумані та зручні функціональності разом з інтуїтивно зрозумілим використанням.\nНагадаємо, що ви маєте можливість зберігати питання у програмі для їх подальшого вивчення, а також ділитись незрозумілими питаннями тесту з друзями, слідкувати за прогресом підготовки, отримувати нагороди за досягнення, тощо. Але одними з найголовніших переваг Medlibra є відсутність необхідності постійного підключення до інтернету та найбільш повна база буклетів та баз КРОК.\n\nНаші майбутні лікарі мають право на зручне та комфортне навчання, незалежне від сторонніх факторів, та протягом усього перебування у стінах ЗВО.\n\nMedlibra покликана допомогти зручно підготуватись до іспиту з медичних спеціальностей за будь-якої ситуації завдяки зручному інтерфейсу, унікальним особливостям і найповнішій бібліотеці буклетів та баз КРОК.\nУвага! Розробники не несуть відповідальності за сумнівне використання застосунку, адже його розроблено винятково для допомоги у навчанні та підготовці до іспитів.",
		"В застосунку є наступні предмети та бази:\n\n1) КРОК 1\n– Стоматологія\n– Лікувальна справа\n– Фармація\n\n2) КРОК 2 містить у собі інформацію з предметів:\n– Стоматологія\n– Лікувальна справа\n– Медична психологія\n– Лабораторна діагностика\n– Фармація\n– Клінічна фармація\n– Косметологія\n\n3) КРОК 3 складається з предметів:\n– Стоматологія\n– Лабораторна діагностика\n– Лікувальна справа\n\n4) Готуйтесь до КРОК М, Б зі спеціальностей:\n– Акушерська справа\n– Лікувальна справа\n– Медична профілактика\n– Сестринська справа\n– Лабораторна діагностика"
	]
};
var contactUs = "Написати розробникам";
var copyright = "© Medlibra 2020. Усі права захищено";
var ua = {
	currentLanguage: currentLanguage,
	languages: languages,
	menu: menu,
	download: download,
	advantages: advantages,
	features: features,
	contactUs: contactUs,
	copyright: copyright
};

var currentLanguage$1 = "рус";
var languages$1 = [
	{
		key: "/",
		name: "украинский"
	},
	{
		key: "/ru",
		name: "русский"
	}
];
var menu$1 = {
	download: "Загрузить",
	advantages: "Преимущества",
	features: "Особенности",
	contact: "Связаться"
};
var download$1 = {
	title: "Medlibra",
	titleDescription: "мобильное приложение №1 для подготовки к КРОК ",
	downloadFree: "Загрузить бесплатно"
};
var advantages$1 = {
	overview: [
		{
			title: "5",
			content: "Типов КРОК\n(1, 2, 3, М, Б)"
		},
		{
			title: "20",
			content: "Отдельных\nспециализаций"
		},
		{
			title: "3 000",
			content: "Буклетов и\nбаз"
		},
		{
			title: "160 000",
			content: "Уникальных\nвопросов"
		}
	],
	infographics: [
		{
			title: "Самая большая библиотека",
			content: "Самая полная библиотека тестов. Начинайте обучение сразу, без нужды искать необходимое"
		},
		{
			title: "Доступ оффлайн",
			content: "Быстрая и удобная загрузка тестов в оффлайн-режим. Все нужные тесты доступны в любое время"
		},
		{
			title: "Сохранение вопросов",
			content: "Никаких скриншотов. Сохраняйте сложные или непонятные вопросы прямо в приложении"
		},
		{
			title: "Удобный интерфейс",
			content: "Ничего лишнего. Вы видите только тесты по своей специализации. Режимы день/ночь помогут глазам не уставать"
		},
		{
			title: "Контроль прогресса",
			content: "Отслеживайте уровень собственных знаний. Выстраивайте наиболее удобную для вас стратегию обучения"
		}
	]
};
var features$1 = {
	title: "Особенности работы. Как работает приложение для КРОК Medlibra?",
	content: [
		"Прежде всего, полноценно используя приложение, вы сможете максимально приблизить себя к условиям прохождения экзамена КРОК.\n\nВо-вторых, приложение поможет вам максимально качественно подготовиться к тестовым вопросам благодаря различным режимам тестирования (экзамен и тренировка), что дает возможность проверить себя в различных условиях и закрепить изученный материал.\n\nВ-третьих, продуманные и удобные особенности приложения помогут в следующих ситуациях:\n– Чтобы отслеживать свой успех и понимать, насколько хорошо идет подготовка, созданы различные типы статистик и историй прохождения тестов.\n– Непонятен конкретный вопрос – не проблема, можно сохранить и учиться дальше, чтобы вернуться к нему позже.",
		"– Найти ответ на сложный вопрос не удалось? Есть возможность проверить комментарии: другие пользователи могут оставить ссылки на литературу или поделиться этим вопросом с другими сразу из приложения.\n\n– Если есть перебои с интернетом – не проблема! Приложение Medlibra работает без подключения к интернету и позволяет без ограничений готовиться в удобное для себя время.\n\n– Интуитивно понятная навигация позволяет не тратить усилия на бессмысленное изучение инструкций.\nПриложение Medlibra создано для помощи студентам в подготовке к тестированию КРОК. Оно работает с Android и iOS и позволяет, независимо от смартфона, научиться проходить тестирование, ведь здесь доступны буклеты и базы с более 160 000 вопросами."
	],
	testBaseTitle: "База тестов Крок у Medlibra",
	testBaseContent: [
		"Каким образом помочь студентам-медикам в обучении? Об этом подумала команда разработчиков приложения Medlibra. Ими была создана удобная программа для подготовки к тестам КРОК 1, КРОК 2, КРОК 3, КРОК М, КРОК Б, состоящая из многочисленных буклетов и баз по всем медицинским специальностям.\n\nИспользуя для подготовки к тестированию это приложение, вы с легкостью овладеете знаниями для тестирования КРОК. Medlibra сочетает в себе продуманные и удобные функциональные особенности вместе с интуитивно понятным интерфейсом.\n\nНапомним, что вы можете хранить вопросы в программе для их дальнейшего изучения, а также делиться непонятными вопросами с друзьями, следить за прогрессом подготовки, получать награды за достижения, и так далее. Но одними из главных преимуществ Medlibra является отсутствие необходимости постоянного подключения к интернету, а также наиболее полная база буклетов и баз КРОК.\n\nНаши будущие врачи имеют право на удобное и комфортное обучение, независимое от посторонних факторов, и в течение всего пребывания в стенах ВУЗа.\n\nMedlibra призвана помочь удобно подготовиться к экзамену по медицинским специальностям благодаря удобному интерфейсу, уникальным особенностям и самой полной библиотеке буклетов и баз КРОК. Внимание! Разработчики не несут ответственности за сомнительное использование приложения, ведь оно разработано исключительно для помощи в обучении и подготовке к экзаменам.",
		"В приложении есть базы тестов и буклетов по:\n\n1) КРОК 1\n– Стоматология\n– Лечебное дело\n– Фармация\n\n2) КРОК 2 включает в себя информацию по предметам:\n– Стоматология\n– Лечебное дело\n– Медицинская психология\n– Лабораторная диагностика\n– Фармация\n– Клиническая фармация\n– Косметология\n\n3) КРОК 3 состоит из предметов:\n– Стоматология\n– Лабораторная диагностика\n– Лечебное дело\n\n4) Готовьтесь к КРОК М, Б по специальностям:\n– Акушерское дело\n– Лечебное дело\n– Медицинская профилактика\n– Сестринское дело\n– Лабораторная диагностика"
	]
};
var contactUs$1 = "Написать разработчикам";
var copyright$1 = "© Medlibra 2020. Все права защищены";
var ru = {
	currentLanguage: currentLanguage$1,
	languages: languages$1,
	menu: menu$1,
	download: download$1,
	advantages: advantages$1,
	features: features$1,
	contactUs: contactUs$1,
	copyright: copyright$1
};

const lang = { ua, ru };

function setLocale(locale) {
  localization.set(lang[locale]);
}

const localization = writable(ua);

/* src/components/Header.svelte generated by Svelte v3.21.0 */

const css = {
	code: "img.svelte-1olulv.svelte-1olulv{opacity:1}header.svelte-1olulv.svelte-1olulv{top:0;z-index:2;position:sticky;background:#1a1d1d;padding:12px 0;font-size:20px}.container.svelte-1olulv.svelte-1olulv{display:flex;flex-wrap:wrap}.segment.svelte-1olulv.svelte-1olulv{display:flex;align-items:center;width:50%}@media screen and (max-width: 575px){header.svelte-1olulv.svelte-1olulv{padding-top:8px}.logo.svelte-1olulv.svelte-1olulv{height:48px}.segment.svelte-1olulv.svelte-1olulv{width:100%}.main.svelte-1olulv.svelte-1olulv{margin-bottom:12px}}@media screen and (max-width: 1023px){header.svelte-1olulv.svelte-1olulv{font-size:16px}.main.svelte-1olulv.svelte-1olulv{justify-content:space-between}.menu.svelte-1olulv.svelte-1olulv a[href='/#features'],.menu.svelte-1olulv.svelte-1olulv a[href='/ru#features']{display:none}}@media screen and (min-width: 1024px){.menu.svelte-1olulv.svelte-1olulv{flex:1;max-width:652px}.segment.svelte-1olulv.svelte-1olulv{width:auto}.container.svelte-1olulv.svelte-1olulv{justify-content:space-between}}@media screen and (min-width: 768px){.menu.svelte-1olulv.svelte-1olulv{box-sizing:border-box;padding-left:32px}}.menu.svelte-1olulv a.svelte-1olulv{transition:color 150ms}.menu.svelte-1olulv a.active.svelte-1olulv{color:#fefbf6}.home.svelte-1olulv.svelte-1olulv{display:flex}.language.svelte-1olulv.svelte-1olulv{display:flex;padding-bottom:4px;display:flex;align-items:center;cursor:pointer;margin-left:44px;outline:0;position:relative}@media screen and (min-width: 576px) and (max-width: 1023px){.logo.svelte-1olulv.svelte-1olulv{height:48px}.segment.svelte-1olulv.svelte-1olulv{justify-content:flex-start}.language.svelte-1olulv.svelte-1olulv{margin-left:16px}}.language.svelte-1olulv span.svelte-1olulv{font-style:normal;font-weight:500;line-height:28px;margin-right:5px}.language.svelte-1olulv.svelte-1olulv svg{transition:transform 150ms}.language.svelte-1olulv.svelte-1olulv:focus svg{transform:rotate(180deg) translateY(-4px);transform-origin:center center}.language.svelte-1olulv:not(:focus) .language-select.svelte-1olulv{pointer-events:none}.language.svelte-1olulv:not(:focus) .language-overlay.svelte-1olulv{display:none}.language.svelte-1olulv .language-overlay.svelte-1olulv{content:'';position:absolute;width:100%;height:100%;top:0;left:0;outline:0}.language-select.svelte-1olulv.svelte-1olulv{position:absolute;top:100%;right:0;transition:all 150ms;transform:translateY(-8px);opacity:0;background:#1a1d1d;border:2px solid #731dd8;box-sizing:border-box;border-radius:8px;padding:8px;padding-right:20px}.language-select.svelte-1olulv a.svelte-1olulv,.language-select.svelte-1olulv a.svelte-1olulv:active{color:rgba(254, 251, 246, 0.35);text-decoration:none;text-transform:none}.language-select.svelte-1olulv>a.svelte-1olulv:not(:nth-last-child(1)){text-decoration:none;text-transform:none;padding-bottom:8px}.language-select.svelte-1olulv>a.active.svelte-1olulv{color:rgba(254, 251, 246, 0.65)}.language.svelte-1olulv:focus .language-select.svelte-1olulv{opacity:1;transform:translateY(0)}.menu.svelte-1olulv.svelte-1olulv{display:flex;justify-content:space-between}.menu.svelte-1olulv a.svelte-1olulv{font-weight:500;text-decoration:none;letter-spacing:0.0025em;line-height:24px}",
	map: "{\"version\":3,\"file\":\"Header.svelte\",\"sources\":[\"Header.svelte\"],\"sourcesContent\":[\"<script>\\n  import Arrow from '../icons/Arrow.svg';\\n  import { setLocale, localization } from '../localization';\\n\\n  export let currentObservedItem;\\n\\n  $: menuItems = [\\n    { link: '#download', title: $localization.menu.download },\\n    { link: '#advantages', title: $localization.menu.advantages },\\n    { link: '#features', title: $localization.menu.features },\\n    { link: '#contact', title: $localization.menu.contact },\\n  ];\\n</script>\\n\\n<style>\\n  img {\\n    opacity: 1;\\n  }\\n\\n  header {\\n    top: 0;\\n    z-index: 2;\\n    position: sticky;\\n    background: #1a1d1d;\\n    padding: 12px 0;\\n    font-size: 20px;\\n  }\\n\\n  .container {\\n    display: flex;\\n    flex-wrap: wrap;\\n    /* width: 100%; */\\n  }\\n\\n  .segment {\\n    display: flex;\\n    align-items: center;\\n    width: 50%;\\n  }\\n\\n  @media screen and (max-width: 575px) {\\n    header {\\n      padding-top: 8px;\\n    }\\n\\n    .logo {\\n      height: 48px;\\n    }\\n\\n    .segment {\\n      width: 100%;\\n    }\\n\\n    .main {\\n      margin-bottom: 12px;\\n    }\\n  }\\n\\n  @media screen and (max-width: 1023px) {\\n    header {\\n      font-size: 16px;\\n    }\\n\\n    .main {\\n      justify-content: space-between;\\n    }\\n\\n    .menu :global(a[href='/#features']),\\n    .menu :global(a[href='/ru#features']) {\\n      display: none;\\n    }\\n  }\\n\\n  @media screen and (min-width: 1024px) {\\n    .menu {\\n      flex: 1;\\n      max-width: 652px;\\n    }\\n\\n    .segment {\\n      width: auto;\\n    }\\n\\n    .container {\\n      justify-content: space-between;\\n    }\\n  }\\n\\n  @media screen and (min-width: 768px) {\\n    .menu {\\n      box-sizing: border-box;\\n      padding-left: 32px;\\n    }\\n  }\\n\\n  .menu a {\\n    transition: color 150ms;\\n  }\\n\\n  .menu a.active {\\n    color: #fefbf6;\\n  }\\n\\n  .home {\\n    display: flex;\\n  }\\n\\n  .language {\\n    display: flex;\\n    padding-bottom: 4px;\\n    display: flex;\\n    align-items: center;\\n    cursor: pointer;\\n    margin-left: 44px;\\n    outline: 0;\\n    position: relative;\\n  }\\n\\n  @media screen and (min-width: 576px) and (max-width: 1023px) {\\n    .logo {\\n      height: 48px;\\n    }\\n\\n    .segment {\\n      justify-content: flex-start;\\n    }\\n\\n    .language {\\n      margin-left: 16px;\\n    }\\n  }\\n\\n  .language span {\\n    font-style: normal;\\n    font-weight: 500;\\n    line-height: 28px;\\n    margin-right: 5px;\\n  }\\n\\n  .language :global(svg) {\\n    transition: transform 150ms;\\n  }\\n\\n  .language:focus :global(svg) {\\n    transform: rotate(180deg) translateY(-4px);\\n    transform-origin: center center;\\n  }\\n\\n  .language:not(:focus) .language-select {\\n    pointer-events: none;\\n  }\\n\\n  .language:not(:focus) .language-overlay {\\n    display: none;\\n  }\\n\\n  .language .language-overlay {\\n    content: '';\\n    position: absolute;\\n    width: 100%;\\n    height: 100%;\\n    top: 0;\\n    left: 0;\\n    outline: 0;\\n  }\\n\\n  .language-select {\\n    position: absolute;\\n    top: 100%;\\n    right: 0;\\n    transition: all 150ms;\\n    transform: translateY(-8px);\\n    opacity: 0;\\n    background: #1a1d1d;\\n    border: 2px solid #731dd8;\\n    box-sizing: border-box;\\n    border-radius: 8px;\\n    padding: 8px;\\n    padding-right: 20px;\\n  }\\n\\n  .language-select a,\\n  .language-select a:active {\\n    color: rgba(254, 251, 246, 0.35);\\n    text-decoration: none;\\n    text-transform: none;\\n  }\\n\\n  .language-select > a:not(:nth-last-child(1)) {\\n    text-decoration: none;\\n    text-transform: none;\\n    padding-bottom: 8px;\\n  }\\n\\n  .language-select > a.active {\\n    color: rgba(254, 251, 246, 0.65);\\n  }\\n\\n  .language:focus .language-select {\\n    opacity: 1;\\n    transform: translateY(0);\\n  }\\n\\n  .menu {\\n    display: flex;\\n    justify-content: space-between;\\n  }\\n\\n  .menu a {\\n    font-weight: 500;\\n    text-decoration: none;\\n    letter-spacing: 0.0025em;\\n    line-height: 24px;\\n  }\\n</style>\\n\\n<header>\\n  <div class=\\\"container\\\">\\n    <div class=\\\"segment main\\\">\\n      <a class=\\\"home\\\" href=\\\"/\\\">\\n        <img class=\\\"logo\\\" src=\\\"/images/Logo.svg\\\" alt=\\\"medlibra\\\" />\\n      </a>\\n\\n      <div class=\\\"language text-secondary\\\" href=\\\"/\\\" tabindex=\\\"0\\\">\\n        <div class=\\\"language-overlay\\\" tabindex=\\\"0\\\" />\\n        <span>{$localization.currentLanguage}</span>\\n        <Arrow />\\n        <div class=\\\"language-select\\\" tabindex=\\\"0\\\">\\n          {#each $localization.languages as language}\\n            <a\\n              class:active={language.name.startsWith($localization.currentLanguage)}\\n              on:mousedown={e => e.preventDefault()}\\n              href={language.key}>\\n              {language.name}\\n            </a>\\n          {/each}\\n        </div>\\n      </div>\\n    </div>\\n\\n    <div class=\\\"segment menu\\\">\\n      {#each menuItems as item}\\n        <a\\n          class=\\\"text-inactive\\\"\\n          class:active={item.link === `#${currentObservedItem}`}\\n          href={`${$localization.languages.find(i =>\\n              i.name.startsWith($localization.currentLanguage),\\n            ).key}${item.link}`}>\\n          {item.title}\\n        </a>\\n      {/each}\\n    </div>\\n  </div>\\n</header>\\n\"],\"names\":[],\"mappings\":\"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\"}"
};

const Header = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $localization = get_store_value(localization);
	let { currentObservedItem } = $$props;
	if ($$props.currentObservedItem === void 0 && $$bindings.currentObservedItem && currentObservedItem !== void 0) $$bindings.currentObservedItem(currentObservedItem);
	$$result.css.add(css);

	let menuItems = [
		{
			link: "#download",
			title: $localization.menu.download
		},
		{
			link: "#advantages",
			title: $localization.menu.advantages
		},
		{
			link: "#features",
			title: $localization.menu.features
		},
		{
			link: "#contact",
			title: $localization.menu.contact
		}
	];

	return `<header class="${"svelte-1olulv"}"><div class="${"container svelte-1olulv"}"><div class="${"segment main svelte-1olulv"}"><a class="${"home svelte-1olulv"}" href="${"/"}"><img class="${"logo svelte-1olulv"}" src="${"/images/Logo.svg"}" alt="${"medlibra"}"></a>

      <div class="${"language text-secondary svelte-1olulv"}" href="${"/"}" tabindex="${"0"}"><div class="${"language-overlay svelte-1olulv"}" tabindex="${"0"}"></div>
        <span class="${"svelte-1olulv"}">${escape($localization.currentLanguage)}</span>
        ${validate_component(Arrow, "Arrow").$$render($$result, {}, {}, {})}
        <div class="${"language-select svelte-1olulv"}" tabindex="${"0"}">${each($localization.languages, language => `<a${add_attribute("href", language.key, 0)} class="${[
		"svelte-1olulv",
		language.name.startsWith($localization.currentLanguage)
		? "active"
		: ""
	].join(" ").trim()}">${escape(language.name)}
            </a>`)}</div></div></div>

    <div class="${"segment menu svelte-1olulv"}">${each(menuItems, item => `<a class="${[
		"text-inactive svelte-1olulv",
		item.link === `#${currentObservedItem}` ? "active" : ""
	].join(" ").trim()}"${add_attribute("href", `${$localization.languages.find(i => i.name.startsWith($localization.currentLanguage)).key}${item.link}`, 0)}>${escape(item.title)}
        </a>`)}</div></div></header>`;
});

/* src/components/Background.svelte generated by Svelte v3.21.0 */

const css$1 = {
	code: ".background.svelte-18xba48.svelte-18xba48{top:0;left:0;position:absolute;width:100%;height:100%;overflow:hidden;pointer-events:none}.background.svelte-18xba48 .dark.svelte-18xba48{transform:translateY(-48px)}.background.svelte-18xba48 .light.svelte-18xba48{transform:translateY(48px)}.background.mounted.svelte-18xba48 img.svelte-18xba48{transform:translateY(0);opacity:1}img.svelte-18xba48.svelte-18xba48{position:absolute;opacity:0;transition:all 600ms}@media screen and (max-width: 359px){img.svelte-18xba48.svelte-18xba48{width:360px}.light.svelte-18xba48.svelte-18xba48{left:96px;top:464px}.dark.svelte-18xba48.svelte-18xba48{left:160px;top:380px}}@media screen and (min-width: 360px) and (max-width: 575px){img.svelte-18xba48.svelte-18xba48{width:100%}.light.svelte-18xba48.svelte-18xba48{top:452px;left:0}.dark.svelte-18xba48.svelte-18xba48{top:364px;left:64px}}@media screen and (min-width: 576px) and (max-width: 767px){img.svelte-18xba48.svelte-18xba48{width:480px}.dark.svelte-18xba48.svelte-18xba48{top:64px;right:-210px}.light.svelte-18xba48.svelte-18xba48{top:176px;right:-124px}}@media screen and (min-width: 768px){img.svelte-18xba48.svelte-18xba48{height:600px}.dark.svelte-18xba48.svelte-18xba48{top:0;left:calc(50% + 114px)}.light.svelte-18xba48.svelte-18xba48{left:50%;top:272px}}",
	map: "{\"version\":3,\"file\":\"Background.svelte\",\"sources\":[\"Background.svelte\"],\"sourcesContent\":[\"<script>\\n  import { onMount } from 'svelte';\\n\\n  let mounted = false;\\n\\n  onMount(() => {\\n    setTimeout(() => {\\n      mounted = true;\\n    }, 200);\\n  });\\n</script>\\n\\n<style>\\n  .background {\\n    top: 0;\\n    left: 0;\\n    position: absolute;\\n    width: 100%;\\n    height: 100%;\\n    overflow: hidden;\\n    pointer-events: none;\\n  }\\n\\n  .background .dark {\\n    transform: translateY(-48px);\\n  }\\n\\n  .background .light {\\n    transform: translateY(48px);\\n  }\\n\\n  .background.mounted img {\\n    transform: translateY(0);\\n    opacity: 1;\\n  }\\n\\n  img {\\n    position: absolute;\\n    opacity: 0;\\n    transition: all 600ms;\\n  }\\n\\n  @media screen and (max-width: 359px) {\\n    img {\\n      width: 360px;\\n    }\\n\\n    .light {\\n      left: 96px;\\n      top: 464px;\\n    }\\n\\n    .dark {\\n      left: 160px;\\n      top: 380px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 360px) and (max-width: 575px) {\\n    img {\\n      width: 100%;\\n    }\\n\\n    .light {\\n      top: 452px;\\n      left: 0;\\n    }\\n\\n    .dark {\\n      top: 364px;\\n      left: 64px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 576px) and (max-width: 767px) {\\n    img {\\n      width: 480px;\\n    }\\n\\n    .dark {\\n      top: 64px;\\n      right: -210px;\\n    }\\n\\n    .light {\\n      top: 176px;\\n      right: -124px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 768px) {\\n    img {\\n      height: 600px;\\n    }\\n\\n    .dark {\\n      top: 0;\\n      left: calc(50% + 114px);\\n    }\\n\\n    .light {\\n      left: 50%;\\n      top: 272px;\\n    }\\n  }\\n</style>\\n\\n<div class=\\\"background\\\" class:mounted>\\n  <img class=\\\"light\\\" src=\\\"/images/light.png\\\" alt=\\\"light\\\" />\\n  <img class=\\\"dark\\\" src=\\\"/images/dark.png\\\" alt=\\\"dark\\\" />\\n</div>\\n\"],\"names\":[],\"mappings\":\"AAaE,WAAW,8BAAC,CAAC,AACX,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,MAAM,CAChB,cAAc,CAAE,IAAI,AACtB,CAAC,AAED,0BAAW,CAAC,KAAK,eAAC,CAAC,AACjB,SAAS,CAAE,WAAW,KAAK,CAAC,AAC9B,CAAC,AAED,0BAAW,CAAC,MAAM,eAAC,CAAC,AAClB,SAAS,CAAE,WAAW,IAAI,CAAC,AAC7B,CAAC,AAED,WAAW,uBAAQ,CAAC,GAAG,eAAC,CAAC,AACvB,SAAS,CAAE,WAAW,CAAC,CAAC,CACxB,OAAO,CAAE,CAAC,AACZ,CAAC,AAED,GAAG,8BAAC,CAAC,AACH,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,GAAG,CAAC,KAAK,AACvB,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACpC,GAAG,8BAAC,CAAC,AACH,KAAK,CAAE,KAAK,AACd,CAAC,AAED,MAAM,8BAAC,CAAC,AACN,IAAI,CAAE,IAAI,CACV,GAAG,CAAE,KAAK,AACZ,CAAC,AAED,KAAK,8BAAC,CAAC,AACL,IAAI,CAAE,KAAK,CACX,GAAG,CAAE,KAAK,AACZ,CAAC,AACH,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC3D,GAAG,8BAAC,CAAC,AACH,KAAK,CAAE,IAAI,AACb,CAAC,AAED,MAAM,8BAAC,CAAC,AACN,GAAG,CAAE,KAAK,CACV,IAAI,CAAE,CAAC,AACT,CAAC,AAED,KAAK,8BAAC,CAAC,AACL,GAAG,CAAE,KAAK,CACV,IAAI,CAAE,IAAI,AACZ,CAAC,AACH,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC3D,GAAG,8BAAC,CAAC,AACH,KAAK,CAAE,KAAK,AACd,CAAC,AAED,KAAK,8BAAC,CAAC,AACL,GAAG,CAAE,IAAI,CACT,KAAK,CAAE,MAAM,AACf,CAAC,AAED,MAAM,8BAAC,CAAC,AACN,GAAG,CAAE,KAAK,CACV,KAAK,CAAE,MAAM,AACf,CAAC,AACH,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACpC,GAAG,8BAAC,CAAC,AACH,MAAM,CAAE,KAAK,AACf,CAAC,AAED,KAAK,8BAAC,CAAC,AACL,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,GAAG,CAAC,CAAC,CAAC,KAAK,CAAC,AACzB,CAAC,AAED,MAAM,8BAAC,CAAC,AACN,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,KAAK,AACZ,CAAC,AACH,CAAC\"}"
};

const Background = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let mounted = false;

	onMount(() => {
		setTimeout(
			() => {
				mounted = true;
			},
			200
		);
	});

	$$result.css.add(css$1);

	return `<div class="${["background svelte-18xba48", mounted ? "mounted" : ""].join(" ").trim()}"><img class="${"light svelte-18xba48"}" src="${"/images/light.png"}" alt="${"light"}">
  <img class="${"dark svelte-18xba48"}" src="${"/images/dark.png"}" alt="${"dark"}"></div>`;
});

/* src/components/Download.svelte generated by Svelte v3.21.0 */

const css$2 = {
	code: "svg.svelte-1wb670r.svelte-1wb670r,img.svelte-1wb670r.svelte-1wb670r{opacity:1}h1.svelte-1wb670r.svelte-1wb670r{padding-bottom:64px}h3.svelte-1wb670r.svelte-1wb670r{padding-bottom:32px}.container.svelte-1wb670r.svelte-1wb670r{display:flex;flex-direction:column}.download-buttons.svelte-1wb670r.svelte-1wb670r{display:flex}.download-buttons.svelte-1wb670r a.svelte-1wb670r{width:196px}.download-buttons.svelte-1wb670r a.svelte-1wb670r:not(:nth-last-child(1)){margin-right:32px}.download-buttons.svelte-1wb670r a.svelte-1wb670r{padding:20px 0;padding-left:16px;position:relative;border:none;outline:0;background:transparent;width:196px;display:flex;text-decoration:none;box-sizing:border-box}.download-buttons.svelte-1wb670r a .border.svelte-1wb670r{position:absolute;width:100%;height:100%;top:0;left:0}.download-buttons.svelte-1wb670r a .content.svelte-1wb670r{display:flex;align-items:center;justify-content:space-between;width:100%}.download-buttons.svelte-1wb670r a .text-content.svelte-1wb670r{width:100%;display:flex;justify-content:center}.text-accent.svelte-1wb670r.svelte-1wb670r{text-align:center;width:100%}@media screen and (max-width: 359px){.download-buttons.svelte-1wb670r.svelte-1wb670r{flex-direction:column}.download-buttons.svelte-1wb670r a.svelte-1wb670r:nth-child(1){margin-bottom:26px}}@media screen and (max-width: 767px){h1.svelte-1wb670r.svelte-1wb670r{max-width:328px;padding-bottom:32px}.download-buttons.svelte-1wb670r a.svelte-1wb670r{width:156px}.container.svelte-1wb670r.svelte-1wb670r{height:572px;padding-top:32px}}@media screen and (min-width: 576px) and (max-width: 767px){.container.svelte-1wb670r.svelte-1wb670r{height:auto}}@media screen and (max-width: 767px){h1.svelte-1wb670r.svelte-1wb670r{max-width:328px}}@media screen and (min-width: 1280px){h1.svelte-1wb670r.svelte-1wb670r{max-width:876px}}@media screen and (min-width: 768px) and (max-width: 1279px){h1.svelte-1wb670r.svelte-1wb670r{max-width:650px}.container.svelte-1wb670r.svelte-1wb670r{height:656px;justify-content:center}}@media screen and (min-width: 1280px){.container.svelte-1wb670r.svelte-1wb670r{height:704px;justify-content:center}}@media screen and (min-width: 768px){h1.svelte-1wb670r.svelte-1wb670r{padding-bottom:64px}}",
	map: "{\"version\":3,\"file\":\"Download.svelte\",\"sources\":[\"Download.svelte\"],\"sourcesContent\":[\"<script>\\n  import { localization } from '../localization';\\n</script>\\n\\n<style>\\n  svg,\\n  img {\\n    opacity: 1;\\n  }\\n\\n  h1 {\\n    padding-bottom: 64px;\\n  }\\n\\n  h3 {\\n    padding-bottom: 32px;\\n  }\\n\\n  .container {\\n    display: flex;\\n    flex-direction: column;\\n  }\\n\\n  .download-buttons {\\n    display: flex;\\n  }\\n\\n  .download-buttons a {\\n    width: 196px;\\n  }\\n\\n  .download-buttons a:not(:nth-last-child(1)) {\\n    margin-right: 32px;\\n  }\\n\\n  .download-buttons a {\\n    padding: 20px 0;\\n    padding-left: 16px;\\n    position: relative;\\n    border: none;\\n    outline: 0;\\n    background: transparent;\\n    width: 196px;\\n    display: flex;\\n    text-decoration: none;\\n    box-sizing: border-box;\\n  }\\n\\n  .download-buttons a .border {\\n    position: absolute;\\n    width: 100%;\\n    height: 100%;\\n    top: 0;\\n    left: 0;\\n  }\\n\\n  .download-buttons a .content {\\n    display: flex;\\n    align-items: center;\\n    justify-content: space-between;\\n    width: 100%;\\n  }\\n\\n  .download-buttons a .text-content {\\n    width: 100%;\\n    display: flex;\\n    justify-content: center;\\n  }\\n\\n  .text-accent {\\n    text-align: center;\\n    width: 100%;\\n  }\\n\\n  @media screen and (max-width: 359px) {\\n    .download-buttons {\\n      flex-direction: column;\\n    }\\n\\n    .download-buttons a:nth-child(1) {\\n      margin-bottom: 26px;\\n    }\\n  }\\n\\n  @media screen and (max-width: 767px) {\\n    h1 {\\n      max-width: 328px;\\n      padding-bottom: 32px;\\n    }\\n\\n    .download-buttons a {\\n      width: 156px;\\n    }\\n\\n    .container {\\n      height: 572px;\\n      padding-top: 32px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 576px) and (max-width: 767px) {\\n    .container {\\n      height: auto;\\n    }\\n  }\\n\\n  @media screen and (max-width: 767px) {\\n    h1 {\\n      max-width: 328px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 1280px) {\\n    h1 {\\n      max-width: 876px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 768px) and (max-width: 1279px) {\\n    h1 {\\n      max-width: 650px;\\n    }\\n\\n    .container {\\n      height: 656px;\\n      justify-content: center;\\n    }\\n  }\\n\\n  @media screen and (min-width: 1280px) {\\n    .container {\\n      height: 704px;\\n      justify-content: center;\\n    }\\n  }\\n\\n  @media screen and (min-width: 768px) {\\n    h1 {\\n      padding-bottom: 64px;\\n    }\\n  }\\n</style>\\n\\n<div class=\\\"path container\\\" id=\\\"download\\\">\\n  <h1 class=\\\"text-primary\\\">\\n    {$localization.download.title}\\n    <br />\\n    <br />\\n    {$localization.download.titleDescription}\\n  </h1>\\n\\n  <h3 class=\\\"text-secondary\\\">{$localization.download.downloadFree}</h3>\\n\\n  <div class=\\\"download-buttons\\\">\\n    <a href=\\\"/\\\">\\n      <div class=\\\"border\\\">\\n        <svg width=\\\"100%\\\" height=\\\"100%\\\">\\n          <defs>\\n            <linearGradient\\n              id=\\\"gradient-appstore\\\"\\n              x1=\\\"0%\\\"\\n              y1=\\\"0%\\\"\\n              x2=\\\"100%\\\"\\n              y2=\\\"0%\\\">\\n              <stop offset=\\\"0%\\\" stop-color=\\\"#1AC6FB\\\" />\\n              <stop offset=\\\"100%\\\" stop-color=\\\"#1C72F0\\\" />\\n            </linearGradient>\\n          </defs>\\n          <rect\\n            x=\\\"1\\\"\\n            y=\\\"1\\\"\\n            rx=\\\"16\\\"\\n            ry=\\\"16\\\"\\n            width=\\\"calc(100% - 2px)\\\"\\n            fill=\\\"rgba(254, 251, 246, 0.05)\\\"\\n            height=\\\"calc(100% - 2px)\\\"\\n            stroke=\\\"url(#gradient-appstore)\\\"\\n            stroke-width=\\\"2\\\" />\\n        </svg>\\n      </div>\\n\\n      <div class=\\\"content\\\">\\n        <img src=\\\"/images/appstore.svg\\\" alt=\\\"app store\\\" />\\n        <div class=\\\"text-content\\\">\\n          <span class=\\\"text-accent text-primary\\\">AppStore</span>\\n        </div>\\n      </div>\\n    </a>\\n\\n    <a href=\\\"/\\\">\\n      <div class=\\\"border\\\">\\n        <svg width=\\\"100%\\\" height=\\\"100%\\\">\\n          <defs>\\n            <linearGradient\\n              id=\\\"gradient-playmarket\\\"\\n              x1=\\\"0%\\\"\\n              y1=\\\"0%\\\"\\n              x2=\\\"100%\\\"\\n              y2=\\\"0%\\\">\\n              <stop offset=\\\"0%\\\" stop-color=\\\"#00E0FF\\\" />\\n              <stop offset=\\\"33%\\\" stop-color=\\\"#00F085\\\" />\\n              <stop offset=\\\"66%\\\" stop-color=\\\"#FFE300\\\" />\\n              <stop offset=\\\"100%\\\" stop-color=\\\"#FF4E54\\\" />\\n            </linearGradient>\\n          </defs>\\n          <rect\\n            x=\\\"1\\\"\\n            y=\\\"1\\\"\\n            rx=\\\"16\\\"\\n            ry=\\\"16\\\"\\n            width=\\\"calc(100% - 2px)\\\"\\n            fill=\\\"rgba(254, 251, 246, 0.05)\\\"\\n            height=\\\"calc(100% - 2px)\\\"\\n            stroke=\\\"url(#gradient-playmarket)\\\"\\n            stroke-width=\\\"2\\\" />\\n        </svg>\\n      </div>\\n\\n      <div class=\\\"content\\\">\\n        <img src=\\\"/images/playstore.svg\\\" alt=\\\"play market\\\" />\\n        <div class=\\\"text-content\\\">\\n          <span class=\\\"text-accent text-primary\\\">PlayMarket</span>\\n        </div>\\n      </div>\\n    </a>\\n  </div>\\n</div>\\n\"],\"names\":[],\"mappings\":\"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\"}"
};

const Download = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $localization = get_store_value(localization);
	$$result.css.add(css$2);

	return `<div class="${"path container svelte-1wb670r"}" id="${"download"}"><h1 class="${"text-primary svelte-1wb670r"}">${escape($localization.download.title)}
    <br>
    <br>
    ${escape($localization.download.titleDescription)}</h1>

  <h3 class="${"text-secondary svelte-1wb670r"}">${escape($localization.download.downloadFree)}</h3>

  <div class="${"download-buttons svelte-1wb670r"}"><a href="${"/"}" class="${"svelte-1wb670r"}"><div class="${"border svelte-1wb670r"}"><svg width="${"100%"}" height="${"100%"}" class="${"svelte-1wb670r"}"><defs><linearGradient id="${"gradient-appstore"}" x1="${"0%"}" y1="${"0%"}" x2="${"100%"}" y2="${"0%"}"><stop offset="${"0%"}" stop-color="${"#1AC6FB"}"></stop><stop offset="${"100%"}" stop-color="${"#1C72F0"}"></stop></linearGradient></defs><rect x="${"1"}" y="${"1"}" rx="${"16"}" ry="${"16"}" width="${"calc(100% - 2px)"}" fill="${"rgba(254, 251, 246, 0.05)"}" height="${"calc(100% - 2px)"}" stroke="${"url(#gradient-appstore)"}" stroke-width="${"2"}"></rect></svg></div>

      <div class="${"content svelte-1wb670r"}"><img src="${"/images/appstore.svg"}" alt="${"app store"}" class="${"svelte-1wb670r"}">
        <div class="${"text-content svelte-1wb670r"}"><span class="${"text-accent text-primary svelte-1wb670r"}">AppStore</span></div></div></a>

    <a href="${"/"}" class="${"svelte-1wb670r"}"><div class="${"border svelte-1wb670r"}"><svg width="${"100%"}" height="${"100%"}" class="${"svelte-1wb670r"}"><defs><linearGradient id="${"gradient-playmarket"}" x1="${"0%"}" y1="${"0%"}" x2="${"100%"}" y2="${"0%"}"><stop offset="${"0%"}" stop-color="${"#00E0FF"}"></stop><stop offset="${"33%"}" stop-color="${"#00F085"}"></stop><stop offset="${"66%"}" stop-color="${"#FFE300"}"></stop><stop offset="${"100%"}" stop-color="${"#FF4E54"}"></stop></linearGradient></defs><rect x="${"1"}" y="${"1"}" rx="${"16"}" ry="${"16"}" width="${"calc(100% - 2px)"}" fill="${"rgba(254, 251, 246, 0.05)"}" height="${"calc(100% - 2px)"}" stroke="${"url(#gradient-playmarket)"}" stroke-width="${"2"}"></rect></svg></div>

      <div class="${"content svelte-1wb670r"}"><img src="${"/images/playstore.svg"}" alt="${"play market"}" class="${"svelte-1wb670r"}">
        <div class="${"text-content svelte-1wb670r"}"><span class="${"text-accent text-primary svelte-1wb670r"}">PlayMarket</span></div></div></a></div></div>`;
});

/* src/components/Advantages.svelte generated by Svelte v3.21.0 */

const css$3 = {
	code: ".overview.svelte-1klc38t.svelte-1klc38t{position:relative;display:flex;flex-wrap:wrap;justify-content:space-between}.overview-wrapper.svelte-1klc38t.svelte-1klc38t{width:100%;overflow:hidden}.overview.container.svelte-1klc38t.svelte-1klc38t{padding:0}.overview.svelte-1klc38t h2.svelte-1klc38t,.overview.svelte-1klc38t p.svelte-1klc38t{white-space:pre-line;text-align:center}.overview.svelte-1klc38t h2.svelte-1klc38t{padding-bottom:8px}@media screen and (max-width: 767px){.overview.svelte-1klc38t.svelte-1klc38t{height:464px;align-items:center}.overview.svelte-1klc38t .item.svelte-1klc38t{width:50%}}@media screen and (min-width: 767px) and (max-width: 1023px){.overview.svelte-1klc38t.svelte-1klc38t{height:344px;align-items:center}.overview.container.svelte-1klc38t.svelte-1klc38t{padding:0 12px}}@media screen and (min-width: 1024px){.overview.svelte-1klc38t.svelte-1klc38t:before,.overview.svelte-1klc38t.svelte-1klc38t:after{content:'';position:absolute;width:100%;left:-100%;height:4px;margin-top:-2px;background:rgba(254, 251, 246, 0.15);border-radius:2px;top:50%}.overview.svelte-1klc38t.svelte-1klc38t:before{left:-100%}.overview.svelte-1klc38t.svelte-1klc38t:after{left:100%}.overview.svelte-1klc38t .item.svelte-1klc38t{background:rgba(254, 251, 246, 0.105);border:4px solid rgba(254, 251, 246, 0.105);border-radius:32px;display:flex;flex-direction:column;justify-content:center}}@media screen and (min-width: 1024px) and (max-width: 1279px){.overview.svelte-1klc38t.svelte-1klc38t{height:344px;align-items:center}.overview.svelte-1klc38t .item.svelte-1klc38t{width:196px;height:200px}}@media screen and (min-width: 1280px) and (max-width: 1919px){.overview.svelte-1klc38t.svelte-1klc38t{height:472px;align-items:center}.overview.svelte-1klc38t .item.svelte-1klc38t{width:256px;height:256px}}@media screen and (min-width: 1920px){.overview.svelte-1klc38t.svelte-1klc38t{height:472px;align-items:center}.overview.svelte-1klc38t .item.svelte-1klc38t{width:310px;height:256px}}.infographics.svelte-1klc38t.svelte-1klc38t{position:relative;display:flex;align-items:center}.infographics.svelte-1klc38t img.svelte-1klc38t{transition:all 1.5s}.infographics.svelte-1klc38t.svelte-1klc38t:not(:nth-last-child(1)):after{content:'';position:absolute;bottom:0;left:0;margin:0 auto;width:50%;border-radius:2px;height:4px;background:rgba(254, 251, 246, 0.15);margin-left:25%}.infographics.svelte-1klc38t.svelte-1klc38t:nth-child(2n){flex-direction:row-reverse}.infographics.svelte-1klc38t>.svelte-1klc38t{width:50%}@media screen and (max-width: 359px){.infographics.svelte-1klc38t h2.svelte-1klc38t{padding-bottom:8px}}@media screen and (min-width: 360px) and (max-width: 1279px){.infographics.svelte-1klc38t h2.svelte-1klc38t{padding-bottom:32px}}@media screen and (min-width: 576px) and (max-width: 767px){.overview.container.svelte-1klc38t.svelte-1klc38t{max-width:360px;max-height:360px}}@media screen and (max-width: 767px){.infographics.svelte-1klc38t img.svelte-1klc38t{max-width:360px;opacity:0;transform:translateY(-64px)}.infographics.svelte-1klc38t.svelte-1klc38t img.appear{opacity:1;transform:translateY(0)}.infographics.svelte-1klc38t.svelte-1klc38t{padding:32px 0}.infographics.svelte-1klc38t.svelte-1klc38t:nth-child(n){flex-direction:column;align-items:center}.infographics.svelte-1klc38t:nth-child(n) .svelte-1klc38t{width:100%}.infographics.svelte-1klc38t img.svelte-1klc38t{margin-bottom:32px}}@media screen and (min-width: 768px){.infographics.svelte-1klc38t img.svelte-1klc38t{transition:all 1s}.infographics.svelte-1klc38t img.svelte-1klc38t{opacity:0}.infographics.svelte-1klc38t:nth-child(2n) img.svelte-1klc38t{transform:translateX(64px)}.infographics.svelte-1klc38t:nth-child(2n + 1) img.svelte-1klc38t{transform:translateX(-64px)}.infographics.svelte-1klc38t.svelte-1klc38t img.appear{opacity:1;transform:translateX(0)}}@media screen and (min-width: 768px) and (max-width: 1279px){.infographics.svelte-1klc38t.svelte-1klc38t{height:352px}p.svelte-1klc38t.svelte-1klc38t{font-size:24px;line-height:32px}}@media screen and (min-width: 1280px){.infographics.svelte-1klc38t.svelte-1klc38t{height:448px}.infographics.svelte-1klc38t h2.svelte-1klc38t{padding-bottom:40px}p.svelte-1klc38t.svelte-1klc38t{font-size:32px;line-height:48px}}",
	map: "{\"version\":3,\"file\":\"Advantages.svelte\",\"sources\":[\"Advantages.svelte\"],\"sourcesContent\":[\"<script>\\n  import { localization } from '../localization';\\n\\n  function appear(node) {\\n    const io = new IntersectionObserver(\\n      ([entry]) => {\\n        if (!entry.isIntersecting) return;\\n        node.classList.add('appear');\\n        io.unobserve(node);\\n      },\\n      {\\n        threshold: 0.2,\\n      },\\n    );\\n\\n    io.observe(node);\\n  }\\n</script>\\n\\n<style>\\n  /* overview */\\n  .overview {\\n    position: relative;\\n    display: flex;\\n    flex-wrap: wrap;\\n    justify-content: space-between;\\n  }\\n\\n  .overview-wrapper {\\n    width: 100%;\\n    overflow: hidden;\\n  }\\n\\n  .overview.container {\\n    padding: 0;\\n  }\\n\\n  .overview h2,\\n  .overview p {\\n    white-space: pre-line;\\n    text-align: center;\\n  }\\n\\n  .overview h2 {\\n    padding-bottom: 8px;\\n  }\\n\\n  @media screen and (max-width: 767px) {\\n    .overview {\\n      height: 464px;\\n      align-items: center;\\n    }\\n\\n    .overview .item {\\n      width: 50%;\\n    }\\n  }\\n\\n  @media screen and (min-width: 767px) and (max-width: 1023px) {\\n    .overview {\\n      height: 344px;\\n      align-items: center;\\n    }\\n\\n    .overview.container {\\n      /* max-width: 100%; */\\n      padding: 0 12px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 1024px) {\\n    .overview:before,\\n    .overview:after {\\n      content: '';\\n      position: absolute;\\n      width: 100%;\\n      left: -100%;\\n      height: 4px;\\n      margin-top: -2px;\\n      background: rgba(254, 251, 246, 0.15);\\n      border-radius: 2px;\\n      top: 50%;\\n    }\\n\\n    .overview:before {\\n      left: -100%;\\n    }\\n\\n    .overview:after {\\n      left: 100%;\\n    }\\n\\n    .overview .item {\\n      background: rgba(254, 251, 246, 0.105);\\n      border: 4px solid rgba(254, 251, 246, 0.105);\\n      border-radius: 32px;\\n      display: flex;\\n      flex-direction: column;\\n      justify-content: center;\\n    }\\n  }\\n\\n  @media screen and (min-width: 1024px) and (max-width: 1279px) {\\n    .overview {\\n      height: 344px;\\n      align-items: center;\\n    }\\n\\n    .overview .item {\\n      width: 196px;\\n      height: 200px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 1280px) and (max-width: 1919px) {\\n    .overview {\\n      height: 472px;\\n      align-items: center;\\n    }\\n\\n    .overview .item {\\n      width: 256px;\\n      height: 256px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 1920px) {\\n    .overview {\\n      height: 472px;\\n      align-items: center;\\n    }\\n\\n    .overview .item {\\n      width: 310px;\\n      height: 256px;\\n    }\\n  }\\n\\n  /* infographics */\\n  .infographics {\\n    position: relative;\\n    display: flex;\\n    align-items: center;\\n  }\\n\\n  .infographics img {\\n    transition: all 1.5s;\\n  }\\n\\n  .infographics:not(:nth-last-child(1)):after {\\n    content: '';\\n    position: absolute;\\n    bottom: 0;\\n    left: 0;\\n    margin: 0 auto;\\n    width: 50%;\\n    border-radius: 2px;\\n    height: 4px;\\n    background: rgba(254, 251, 246, 0.15);\\n    margin-left: 25%;\\n  }\\n\\n  .infographics:nth-child(2n) {\\n    flex-direction: row-reverse;\\n  }\\n\\n  .infographics > * {\\n    width: 50%;\\n  }\\n\\n  @media screen and (max-width: 359px) {\\n    .infographics h2 {\\n      padding-bottom: 8px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 360px) and (max-width: 1279px) {\\n    .infographics h2 {\\n      padding-bottom: 32px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 576px) and (max-width: 767px) {\\n    .overview.container {\\n      max-width: 360px;\\n      max-height: 360px;\\n    }\\n  }\\n\\n  @media screen and (max-width: 767px) {\\n    .infographics img {\\n      max-width: 360px;\\n      opacity: 0;\\n      transform: translateY(-64px);\\n    }\\n\\n    .infographics :global(img.appear) {\\n      opacity: 1;\\n      transform: translateY(0);\\n    }\\n\\n    .infographics {\\n      padding: 32px 0;\\n    }\\n\\n    .infographics:nth-child(n) {\\n      flex-direction: column;\\n      align-items: center;\\n    }\\n\\n    .infographics:nth-child(n) * {\\n      width: 100%;\\n    }\\n\\n    .infographics img {\\n      margin-bottom: 32px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 768px) {\\n    .infographics img {\\n      transition: all 1s;\\n    }\\n\\n    .infographics img {\\n      opacity: 0;\\n    }\\n\\n    .infographics:nth-child(2n) img {\\n      transform: translateX(64px);\\n    }\\n\\n    .infographics:nth-child(2n + 1) img {\\n      transform: translateX(-64px);\\n    }\\n\\n    .infographics :global(img.appear) {\\n      opacity: 1;\\n      transform: translateX(0);\\n    }\\n  }\\n\\n  @media screen and (min-width: 768px) and (max-width: 1279px) {\\n    .infographics {\\n      height: 352px;\\n    }\\n\\n    p {\\n      font-size: 24px;\\n      line-height: 32px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 1280px) {\\n    .infographics {\\n      height: 448px;\\n    }\\n\\n    .infographics h2 {\\n      padding-bottom: 40px;\\n    }\\n\\n    p {\\n      font-size: 32px;\\n      line-height: 48px;\\n    }\\n  }\\n</style>\\n\\n<div class=\\\"path\\\" id=\\\"advantages\\\">\\n  <div class=\\\"overview-wrapper\\\">\\n    <div class=\\\"container overview\\\">\\n      {#each $localization.advantages.overview as overview}\\n        <div class=\\\"item\\\">\\n          <h2 class=\\\"text-primary\\\">{overview.title}</h2>\\n          <p class=\\\"text-secondary\\\">{overview.content}</p>\\n        </div>\\n      {/each}\\n    </div>\\n  </div>\\n\\n  <div class=\\\"container\\\">\\n    {#each $localization.advantages.infographics as infographics, index}\\n      <div class=\\\"infographics\\\">\\n        <img use:appear src=\\\"/images/illustration{index + 1}.svg\\\" alt=\\\"img\\\" />\\n\\n        <div>\\n          <h2 class=\\\"text-primary\\\">{infographics.title}</h2>\\n          <p class=\\\"text-secondary\\\">{infographics.content}</p>\\n        </div>\\n      </div>\\n    {/each}\\n  </div>\\n</div>\\n\"],\"names\":[],\"mappings\":\"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\"}"
};

const Advantages = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $localization = get_store_value(localization);
	$$result.css.add(css$3);

	return `<div class="${"path svelte-1klc38t"}" id="${"advantages"}"><div class="${"overview-wrapper svelte-1klc38t"}"><div class="${"container overview svelte-1klc38t"}">${each($localization.advantages.overview, overview => `<div class="${"item svelte-1klc38t"}"><h2 class="${"text-primary svelte-1klc38t"}">${escape(overview.title)}</h2>
          <p class="${"text-secondary svelte-1klc38t"}">${escape(overview.content)}</p>
        </div>`)}</div></div>

  <div class="${"container"}">${each($localization.advantages.infographics, (infographics, index) => `<div class="${"infographics svelte-1klc38t"}"><img src="${"/images/illustration" + escape(index + 1) + ".svg"}" alt="${"img"}" class="${"svelte-1klc38t"}">

        <div class="${"svelte-1klc38t"}"><h2 class="${"text-primary svelte-1klc38t"}">${escape(infographics.title)}</h2>
          <p class="${"text-secondary svelte-1klc38t"}">${escape(infographics.content)}</p></div>
      </div>`)}</div></div>`;
});

/* src/components/Features.svelte generated by Svelte v3.21.0 */

const css$4 = {
	code: "p.svelte-1719quu.svelte-1719quu{padding:32px 0}.row.svelte-1719quu.svelte-1719quu{white-space:pre-line;display:flex}.split.svelte-1719quu.svelte-1719quu{width:32px;height:32px}.row.svelte-1719quu p.svelte-1719quu{flex:1}.container.svelte-1719quu.svelte-1719quu{padding-bottom:32px}@media screen and (max-width: 1279px){.row.svelte-1719quu.svelte-1719quu{flex-direction:column}}@media screen and (min-width: 1024px){p.svelte-1719quu.svelte-1719quu{padding:72px 0}}@media screen and (min-width: 1024px) and (max-width: 1279px){.container.svelte-1719quu.svelte-1719quu{padding-bottom:56px}}@media screen and (min-width: 1280px) and (max-width: 1919px){.container.svelte-1719quu.svelte-1719quu{padding-bottom:72px}}@media screen and (min-width: 1920px){.container.svelte-1719quu.svelte-1719quu{padding-bottom:104px}}",
	map: "{\"version\":3,\"file\":\"Features.svelte\",\"sources\":[\"Features.svelte\"],\"sourcesContent\":[\"<script>\\n  import { localization } from '../localization';\\n</script>\\n\\n<style>\\n  p {\\n    padding: 32px 0;\\n  }\\n\\n  .row {\\n    white-space: pre-line;\\n    display: flex;\\n  }\\n\\n  .split {\\n    width: 32px;\\n    height: 32px;\\n  }\\n\\n  .row p {\\n    flex: 1;\\n  }\\n\\n  .container {\\n    padding-bottom: 32px;\\n  }\\n\\n  @media screen and (max-width: 1279px) {\\n    .row {\\n      flex-direction: column;\\n    }\\n  }\\n\\n  @media screen and (min-width: 1024px) {\\n    p {\\n      padding: 72px 0;\\n    }\\n  }\\n\\n  @media screen and (min-width: 1024px) and (max-width: 1279px) {\\n    .container {\\n      padding-bottom: 56px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 1280px) and (max-width: 1919px) {\\n    .container {\\n      padding-bottom: 72px;\\n    }\\n  }\\n\\n  @media screen and (min-width: 1920px) {\\n    .container {\\n      padding-bottom: 104px;\\n    }\\n  }\\n</style>\\n\\n<div class=\\\"path container\\\" id=\\\"features\\\">\\n  <h2 class=\\\"text-primary\\\">{$localization.features.title}</h2>\\n\\n  <div class=\\\"row text-secondary\\\">\\n    <p>{$localization.features.content[0]}</p>\\n    <div class=\\\"split\\\" />\\n    <p>{$localization.features.content[1]}</p>\\n  </div>\\n\\n  <h2 class=\\\"text-primary\\\">{$localization.features.testBaseTitle}</h2>\\n\\n  <div class=\\\"row text-secondary\\\">\\n    <p>{$localization.features.testBaseContent[0]}</p>\\n    <div class=\\\"split\\\" />\\n    <p>{$localization.features.testBaseContent[1]}</p>\\n  </div>\\n</div>\\n\"],\"names\":[],\"mappings\":\"AAKE,CAAC,8BAAC,CAAC,AACD,OAAO,CAAE,IAAI,CAAC,CAAC,AACjB,CAAC,AAED,IAAI,8BAAC,CAAC,AACJ,WAAW,CAAE,QAAQ,CACrB,OAAO,CAAE,IAAI,AACf,CAAC,AAED,MAAM,8BAAC,CAAC,AACN,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,AACd,CAAC,AAED,mBAAI,CAAC,CAAC,eAAC,CAAC,AACN,IAAI,CAAE,CAAC,AACT,CAAC,AAED,UAAU,8BAAC,CAAC,AACV,cAAc,CAAE,IAAI,AACtB,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,MAAM,CAAC,AAAC,CAAC,AACrC,IAAI,8BAAC,CAAC,AACJ,cAAc,CAAE,MAAM,AACxB,CAAC,AACH,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,MAAM,CAAC,AAAC,CAAC,AACrC,CAAC,8BAAC,CAAC,AACD,OAAO,CAAE,IAAI,CAAC,CAAC,AACjB,CAAC,AACH,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,MAAM,CAAC,CAAC,GAAG,CAAC,YAAY,MAAM,CAAC,AAAC,CAAC,AAC7D,UAAU,8BAAC,CAAC,AACV,cAAc,CAAE,IAAI,AACtB,CAAC,AACH,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,MAAM,CAAC,CAAC,GAAG,CAAC,YAAY,MAAM,CAAC,AAAC,CAAC,AAC7D,UAAU,8BAAC,CAAC,AACV,cAAc,CAAE,IAAI,AACtB,CAAC,AACH,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,MAAM,CAAC,AAAC,CAAC,AACrC,UAAU,8BAAC,CAAC,AACV,cAAc,CAAE,KAAK,AACvB,CAAC,AACH,CAAC\"}"
};

const Features = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $localization = get_store_value(localization);
	$$result.css.add(css$4);

	return `<div class="${"path container svelte-1719quu"}" id="${"features"}"><h2 class="${"text-primary"}">${escape($localization.features.title)}</h2>

  <div class="${"row text-secondary svelte-1719quu"}"><p class="${"svelte-1719quu"}">${escape($localization.features.content[0])}</p>
    <div class="${"split svelte-1719quu"}"></div>
    <p class="${"svelte-1719quu"}">${escape($localization.features.content[1])}</p></div>

  <h2 class="${"text-primary"}">${escape($localization.features.testBaseTitle)}</h2>

  <div class="${"row text-secondary svelte-1719quu"}"><p class="${"svelte-1719quu"}">${escape($localization.features.testBaseContent[0])}</p>
    <div class="${"split svelte-1719quu"}"></div>
    <p class="${"svelte-1719quu"}">${escape($localization.features.testBaseContent[1])}</p></div></div>`;
});

/* src/components/Footer.svelte generated by Svelte v3.21.0 */

const css$5 = {
	code: "img.svelte-b7caeg.svelte-b7caeg{opacity:1}footer.svelte-b7caeg.svelte-b7caeg{background:#1a1d1d}.contact-container.svelte-b7caeg.svelte-b7caeg{padding:56px 0;display:flex;justify-content:center}.contact.svelte-b7caeg.svelte-b7caeg{width:260px;height:64px;border-radius:16px;border:2px solid #fefbf6;background:rgba(254, 251, 246, 0.05);outline:0;display:flex;align-items:center;justify-content:space-between;padding:0 16px;text-decoration:none;box-sizing:border-box}.contact.svelte-b7caeg span.svelte-b7caeg{font-family:IBM Plex Sans;font-style:normal;font-weight:500;font-size:16px;line-height:24px;letter-spacing:0.005em}.copyright.svelte-b7caeg.svelte-b7caeg{padding-bottom:16px;text-align:center}",
	map: "{\"version\":3,\"file\":\"Footer.svelte\",\"sources\":[\"Footer.svelte\"],\"sourcesContent\":[\"<script>\\n  import { localization } from '../localization';\\n</script>\\n\\n<style>\\n  img {\\n    opacity: 1;\\n  }\\n\\n  footer {\\n    background: #1a1d1d;\\n  }\\n\\n  .contact-container {\\n    padding: 56px 0;\\n    display: flex;\\n    justify-content: center;\\n  }\\n\\n  .contact {\\n    width: 260px;\\n    height: 64px;\\n    border-radius: 16px;\\n    border: 2px solid #fefbf6;\\n    background: rgba(254, 251, 246, 0.05);\\n    outline: 0;\\n    display: flex;\\n    align-items: center;\\n    justify-content: space-between;\\n    padding: 0 16px;\\n    text-decoration: none;\\n    box-sizing: border-box;\\n  }\\n\\n  .contact span {\\n    font-family: IBM Plex Sans;\\n    font-style: normal;\\n    font-weight: 500;\\n    font-size: 16px;\\n    line-height: 24px;\\n    letter-spacing: 0.005em;\\n  }\\n\\n  .copyright {\\n    padding-bottom: 16px;\\n    text-align: center;\\n  }\\n</style>\\n\\n<footer class=\\\"path\\\" id=\\\"contact\\\">\\n  <div class=\\\"contact-container\\\">\\n    <a class=\\\"contact\\\" href=\\\"mailto:medlibra@gmail.com\\\">\\n      <span class=\\\"text-primary\\\">{$localization.contactUs}</span>\\n      <img src=\\\"/images/mail.svg\\\" alt=\\\"mail\\\" />\\n    </a>\\n  </div>\\n  <div class=\\\"copyright text-secondary\\\">{$localization.copyright}</div>\\n</footer>\\n\"],\"names\":[],\"mappings\":\"AAKE,GAAG,4BAAC,CAAC,AACH,OAAO,CAAE,CAAC,AACZ,CAAC,AAED,MAAM,4BAAC,CAAC,AACN,UAAU,CAAE,OAAO,AACrB,CAAC,AAED,kBAAkB,4BAAC,CAAC,AAClB,OAAO,CAAE,IAAI,CAAC,CAAC,CACf,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,AACzB,CAAC,AAED,QAAQ,4BAAC,CAAC,AACR,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,IAAI,CACnB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,OAAO,CACzB,UAAU,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,CAAC,CACrC,OAAO,CAAE,CAAC,CACV,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,aAAa,CAC9B,OAAO,CAAE,CAAC,CAAC,IAAI,CACf,eAAe,CAAE,IAAI,CACrB,UAAU,CAAE,UAAU,AACxB,CAAC,AAED,sBAAQ,CAAC,IAAI,cAAC,CAAC,AACb,WAAW,CAAE,GAAG,CAAC,IAAI,CAAC,IAAI,CAC1B,UAAU,CAAE,MAAM,CAClB,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,IAAI,CACjB,cAAc,CAAE,OAAO,AACzB,CAAC,AAED,UAAU,4BAAC,CAAC,AACV,cAAc,CAAE,IAAI,CACpB,UAAU,CAAE,MAAM,AACpB,CAAC\"}"
};

const Footer = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $localization = get_store_value(localization);
	$$result.css.add(css$5);

	return `<footer class="${"path svelte-b7caeg"}" id="${"contact"}"><div class="${"contact-container svelte-b7caeg"}"><a class="${"contact svelte-b7caeg"}" href="${"mailto:medlibra@gmail.com"}"><span class="${"text-primary svelte-b7caeg"}">${escape($localization.contactUs)}</span>
      <img src="${"/images/mail.svg"}" alt="${"mail"}" class="${"svelte-b7caeg"}"></a></div>
  <div class="${"copyright text-secondary svelte-b7caeg"}">${escape($localization.copyright)}</div></footer>`;
});

/* src/components/MainPage.svelte generated by Svelte v3.21.0 */

const css$6 = {
	code: "svg{opacity:1}main.svelte-gbim4i{z-index:1;position:relative}",
	map: "{\"version\":3,\"file\":\"MainPage.svelte\",\"sources\":[\"MainPage.svelte\"],\"sourcesContent\":[\"<script>\\n  import { onMount } from 'svelte';\\n  import Header from './Header.svelte';\\n  import Background from './Background.svelte';\\n  import Download from './Download.svelte';\\n  import Advantages from './Advantages.svelte';\\n  import Features from './Features.svelte';\\n  import Footer from './Footer.svelte';\\n  import { setLocale } from '../localization';\\n\\n  export let lang;\\n\\n  setLocale(lang);\\n\\n  let currentObservedItem = null;\\n\\n  function observe() {\\n    const observedItems = new Map();\\n\\n    function callback(entries) {\\n      for (const entry of entries) {\\n        observedItems.set(\\n          entry.target.getAttribute('id'),\\n          entry.isIntersecting,\\n        );\\n      }\\n\\n      const next = [...observedItems.entries()].reverse().find(([_, i]) => i);\\n\\n      if (next && next[0]) {\\n        currentObservedItem = next[0];\\n      }\\n    }\\n\\n    const io = new IntersectionObserver(callback, {\\n      threshold: 0.2,\\n    });\\n\\n    const nodes = document.querySelectorAll('.path');\\n    for (const node of [...nodes]) {\\n      observedItems.set(node.getAttribute('id'), false);\\n      io.observe(node);\\n    }\\n  }\\n\\n  onMount(() => {\\n    observe();\\n  });\\n</script>\\n\\n<style>\\n  :global(svg) {\\n    opacity: 1;\\n  }\\n\\n  main {\\n    z-index: 1;\\n    position: relative;\\n  }\\n</style>\\n\\n<Background />\\n<Header {currentObservedItem} />\\n\\n<main>\\n  <Download />\\n  <Advantages />\\n  <Features />\\n</main>\\n\\n<Footer />\\n\"],\"names\":[],\"mappings\":\"AAmDU,GAAG,AAAE,CAAC,AACZ,OAAO,CAAE,CAAC,AACZ,CAAC,AAED,IAAI,cAAC,CAAC,AACJ,OAAO,CAAE,CAAC,CACV,QAAQ,CAAE,QAAQ,AACpB,CAAC\"}"
};

const MainPage = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { lang } = $$props;
	setLocale(lang);
	let currentObservedItem = null;

	function observe() {
		const observedItems = new Map();

		function callback(entries) {
			for (const entry of entries) {
				observedItems.set(entry.target.getAttribute("id"), entry.isIntersecting);
			}

			const next = [...observedItems.entries()].reverse().find(([_, i]) => i);

			if (next && next[0]) {
				currentObservedItem = next[0];
			}
		}

		const io = new IntersectionObserver(callback, { threshold: 0.2 });
		const nodes = document.querySelectorAll(".path");

		for (const node of [...nodes]) {
			observedItems.set(node.getAttribute("id"), false);
			io.observe(node);
		}
	}

	onMount(() => {
		observe();
	});

	if ($$props.lang === void 0 && $$bindings.lang && lang !== void 0) $$bindings.lang(lang);
	$$result.css.add(css$6);

	return `${validate_component(Background, "Background").$$render($$result, {}, {}, {})}
${validate_component(Header, "Header").$$render($$result, { currentObservedItem }, {}, {})}

<main class="${"svelte-gbim4i"}">${validate_component(Download, "Download").$$render($$result, {}, {}, {})}
  ${validate_component(Advantages, "Advantages").$$render($$result, {}, {}, {})}
  ${validate_component(Features, "Features").$$render($$result, {}, {}, {})}</main>

${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});

/* src/routes/index.svelte generated by Svelte v3.21.0 */

const Routes = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `${validate_component(MainPage, "MainPage").$$render($$result, { lang: "ua" }, {}, {})}`;
});

/* src/routes/ru.svelte generated by Svelte v3.21.0 */

const Ru = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `${validate_component(MainPage, "MainPage").$$render($$result, { lang: "ru" }, {}, {})}`;
});

/* src/routes/_layout.svelte generated by Svelte v3.21.0 */

const Layout = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { segment } = $$props;
	if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0) $$bindings.segment(segment);

	return `${($$result.head += `${($$result.title = `<title>Medlibra</title>`, "")}`, "")}

${$$slots.default ? $$slots.default({}) : ``}`;
});

/* src/node_modules/@sapper/internal/error.svelte generated by Svelte v3.21.0 */

const Error$1 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { error } = $$props;
	let { status } = $$props;
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);

	return `<h1>${escape(status)}</h1>

<p>${escape(error.message)}</p>

${ ``}`;
});

// This file is generated by Sapper — do not edit it!

const manifest = {
	server_routes: [
		
	],

	pages: [
		{
			// index.svelte
			pattern: /^\/$/,
			parts: [
				{ name: "index", file: "index.svelte", component: Routes }
			]
		},

		{
			// ru.svelte
			pattern: /^\/ru\/?$/,
			parts: [
				{ name: "ru", file: "ru.svelte", component: Ru }
			]
		}
	],

	root: Layout,
	root_preload: () => {},
	error: Error$1
};

const build_dir = "__sapper__/build";

const CONTEXT_KEY = {};

/* src/node_modules/@sapper/internal/App.svelte generated by Svelte v3.21.0 */

const App = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { stores } = $$props;
	let { error } = $$props;
	let { status } = $$props;
	let { segments } = $$props;
	let { level0 } = $$props;
	let { level1 = null } = $$props;
	setContext(CONTEXT_KEY, stores);
	if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0) $$bindings.stores(stores);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
	if ($$props.segments === void 0 && $$bindings.segments && segments !== void 0) $$bindings.segments(segments);
	if ($$props.level0 === void 0 && $$bindings.level0 && level0 !== void 0) $$bindings.level0(level0);
	if ($$props.level1 === void 0 && $$bindings.level1 && level1 !== void 0) $$bindings.level1(level1);

	return `


${validate_component(Layout, "Layout").$$render($$result, Object.assign({ segment: segments[0] }, level0.props), {}, {
		default: () => `${error
		? `${validate_component(Error$1, "Error").$$render($$result, { error, status }, {}, {})}`
		: `${validate_component(level1.component || missing_component, "svelte:component").$$render($$result, Object.assign(level1.props), {}, {})}`}`
	})}`;
});

/**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
function Mime() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);

  for (var i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }

  this.define = this.define.bind(this);
  this.getType = this.getType.bind(this);
  this.getExtension = this.getExtension.bind(this);
}

/**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * If a type declares an extension that has already been defined, an error will
 * be thrown.  To suppress this error and force the extension to be associated
 * with the new type, pass `force`=true.  Alternatively, you may prefix the
 * extension with "*" to map the type to extension, without mapping the
 * extension to the type.
 *
 * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
 *
 *
 * @param map (Object) type definitions
 * @param force (Boolean) if true, force overriding of existing definitions
 */
Mime.prototype.define = function(typeMap, force) {
  for (var type in typeMap) {
    var extensions = typeMap[type].map(function(t) {return t.toLowerCase()});
    type = type.toLowerCase();

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];

      // '*' prefix = not the preferred type for this extension.  So fixup the
      // extension, and skip it.
      if (ext[0] == '*') {
        continue;
      }

      if (!force && (ext in this._types)) {
        throw new Error(
          'Attempt to change mapping for "' + ext +
          '" extension from "' + this._types[ext] + '" to "' + type +
          '". Pass `force=true` to allow this, otherwise remove "' + ext +
          '" from the list of extensions for "' + type + '".'
        );
      }

      this._types[ext] = type;
    }

    // Use first extension as default
    if (force || !this._extensions[type]) {
      var ext = extensions[0];
      this._extensions[type] = (ext[0] != '*') ? ext : ext.substr(1);
    }
  }
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.getType = function(path) {
  path = String(path);
  var last = path.replace(/^.*[/\\]/, '').toLowerCase();
  var ext = last.replace(/^.*\./, '').toLowerCase();

  var hasPath = last.length < path.length;
  var hasDot = ext.length < last.length - 1;

  return (hasDot || !hasPath) && this._types[ext] || null;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};

var Mime_1 = Mime;

var standard = {"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomsvc+xml":["atomsvc"],"application/bdoc":["bdoc"],"application/ccxml+xml":["ccxml"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma","es"],"application/emma+xml":["emma"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/patch-ops-error+xml":["xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-diff+xml":["xdf"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/ktx":["ktx"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/webp":["webp"],"image/wmf":["wmf"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/stl":["stl"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["*x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["*x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]};

var lite = new Mime_1(standard);

function get_server_route_handler(routes) {
	async function handle_route(route, req, res, next) {
		req.params = route.params(route.pattern.exec(req.path));

		const method = req.method.toLowerCase();
		// 'delete' cannot be exported from a module because it is a keyword,
		// so check for 'del' instead
		const method_export = method === 'delete' ? 'del' : method;
		const handle_method = route.handlers[method_export];
		if (handle_method) {
			if (process.env.SAPPER_EXPORT) {
				const { write, end, setHeader } = res;
				const chunks = [];
				const headers = {};

				// intercept data so that it can be exported
				res.write = function(chunk) {
					chunks.push(Buffer.from(chunk));
					write.apply(res, arguments);
				};

				res.setHeader = function(name, value) {
					headers[name.toLowerCase()] = value;
					setHeader.apply(res, arguments);
				};

				res.end = function(chunk) {
					if (chunk) chunks.push(Buffer.from(chunk));
					end.apply(res, arguments);

					process.send({
						__sapper__: true,
						event: 'file',
						url: req.url,
						method: req.method,
						status: res.statusCode,
						type: headers['content-type'],
						body: Buffer.concat(chunks).toString()
					});
				};
			}

			const handle_next = (err) => {
				if (err) {
					res.statusCode = 500;
					res.end(err.message);
				} else {
					process.nextTick(next);
				}
			};

			try {
				await handle_method(req, res, handle_next);
			} catch (err) {
				console.error(err);
				handle_next(err);
			}
		} else {
			// no matching handler for method
			process.nextTick(next);
		}
	}

	return function find_route(req, res, next) {
		for (const route of routes) {
			if (route.pattern.test(req.path)) {
				handle_route(route, req, res, next);
				return;
			}
		}

		next();
	};
}

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */

var parse_1 = parse;
var serialize_1 = serialize;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var encode = encodeURIComponent;
var pairSplitRegExp = /; */;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim();
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

var cookie = {
	parse: parse_1,
	serialize: serialize_1
};

var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
    '<': '\\u003C',
    '>': '\\u003E',
    '/': '\\u002F',
    '\\': '\\\\',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\0': '\\0',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
function devalue(value) {
    var counts = new Map();
    function walk(thing) {
        if (typeof thing === 'function') {
            throw new Error("Cannot stringify a function");
        }
        if (counts.has(thing)) {
            counts.set(thing, counts.get(thing) + 1);
            return;
        }
        counts.set(thing, 1);
        if (!isPrimitive(thing)) {
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                case 'Date':
                case 'RegExp':
                    return;
                case 'Array':
                    thing.forEach(walk);
                    break;
                case 'Set':
                case 'Map':
                    Array.from(thing).forEach(walk);
                    break;
                default:
                    var proto = Object.getPrototypeOf(thing);
                    if (proto !== Object.prototype &&
                        proto !== null &&
                        Object.getOwnPropertyNames(proto).sort().join('\0') !== objectProtoOwnPropertyNames) {
                        throw new Error("Cannot stringify arbitrary non-POJOs");
                    }
                    if (Object.getOwnPropertySymbols(thing).length > 0) {
                        throw new Error("Cannot stringify POJOs with symbolic keys");
                    }
                    Object.keys(thing).forEach(function (key) { return walk(thing[key]); });
            }
        }
    }
    walk(value);
    var names = new Map();
    Array.from(counts)
        .filter(function (entry) { return entry[1] > 1; })
        .sort(function (a, b) { return b[1] - a[1]; })
        .forEach(function (entry, i) {
        names.set(entry[0], getName(i));
    });
    function stringify(thing) {
        if (names.has(thing)) {
            return names.get(thing);
        }
        if (isPrimitive(thing)) {
            return stringifyPrimitive(thing);
        }
        var type = getType(thing);
        switch (type) {
            case 'Number':
            case 'String':
            case 'Boolean':
                return "Object(" + stringify(thing.valueOf()) + ")";
            case 'RegExp':
                return thing.toString();
            case 'Date':
                return "new Date(" + thing.getTime() + ")";
            case 'Array':
                var members = thing.map(function (v, i) { return i in thing ? stringify(v) : ''; });
                var tail = thing.length === 0 || (thing.length - 1 in thing) ? '' : ',';
                return "[" + members.join(',') + tail + "]";
            case 'Set':
            case 'Map':
                return "new " + type + "([" + Array.from(thing).map(stringify).join(',') + "])";
            default:
                var obj = "{" + Object.keys(thing).map(function (key) { return safeKey(key) + ":" + stringify(thing[key]); }).join(',') + "}";
                var proto = Object.getPrototypeOf(thing);
                if (proto === null) {
                    return Object.keys(thing).length > 0
                        ? "Object.assign(Object.create(null)," + obj + ")"
                        : "Object.create(null)";
                }
                return obj;
        }
    }
    var str = stringify(value);
    if (names.size) {
        var params_1 = [];
        var statements_1 = [];
        var values_1 = [];
        names.forEach(function (name, thing) {
            params_1.push(name);
            if (isPrimitive(thing)) {
                values_1.push(stringifyPrimitive(thing));
                return;
            }
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                    values_1.push("Object(" + stringify(thing.valueOf()) + ")");
                    break;
                case 'RegExp':
                    values_1.push(thing.toString());
                    break;
                case 'Date':
                    values_1.push("new Date(" + thing.getTime() + ")");
                    break;
                case 'Array':
                    values_1.push("Array(" + thing.length + ")");
                    thing.forEach(function (v, i) {
                        statements_1.push(name + "[" + i + "]=" + stringify(v));
                    });
                    break;
                case 'Set':
                    values_1.push("new Set");
                    statements_1.push(name + "." + Array.from(thing).map(function (v) { return "add(" + stringify(v) + ")"; }).join('.'));
                    break;
                case 'Map':
                    values_1.push("new Map");
                    statements_1.push(name + "." + Array.from(thing).map(function (_a) {
                        var k = _a[0], v = _a[1];
                        return "set(" + stringify(k) + ", " + stringify(v) + ")";
                    }).join('.'));
                    break;
                default:
                    values_1.push(Object.getPrototypeOf(thing) === null ? 'Object.create(null)' : '{}');
                    Object.keys(thing).forEach(function (key) {
                        statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
                    });
            }
        });
        statements_1.push("return " + str);
        return "(function(" + params_1.join(',') + "){" + statements_1.join(';') + "}(" + values_1.join(',') + "))";
    }
    else {
        return str;
    }
}
function getName(num) {
    var name = '';
    do {
        name = chars[num % chars.length] + name;
        num = ~~(num / chars.length) - 1;
    } while (num >= 0);
    return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
    return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
    if (typeof thing === 'string')
        return stringifyString(thing);
    if (thing === void 0)
        return 'void 0';
    if (thing === 0 && 1 / thing < 0)
        return '-0';
    var str = String(thing);
    if (typeof thing === 'number')
        return str.replace(/^(-)?0\./, '$1.');
    return str;
}
function getType(thing) {
    return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
    return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
    return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
    var result = '"';
    for (var i = 0; i < str.length; i += 1) {
        var char = str.charAt(i);
        var code = char.charCodeAt(0);
        if (char === '"') {
            result += '\\"';
        }
        else if (char in escaped$1) {
            result += escaped$1[char];
        }
        else if (code >= 0xd800 && code <= 0xdfff) {
            var next = str.charCodeAt(i + 1);
            // If this is the beginning of a [high, low] surrogate pair,
            // add the next two characters, otherwise escape
            if (code <= 0xdbff && (next >= 0xdc00 && next <= 0xdfff)) {
                result += char + str[++i];
            }
            else {
                result += "\\u" + code.toString(16).toUpperCase();
            }
        }
        else {
            result += char;
        }
    }
    result += '"';
    return result;
}

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

function get_page_handler(
	manifest,
	session_getter
) {
	const get_build_info =  (assets => () => assets)(JSON.parse(fs.readFileSync(path.join(build_dir, 'build.json'), 'utf-8')));

	const template =  (str => () => str)(read_template(build_dir));

	const has_service_worker = fs.existsSync(path.join(build_dir, 'service-worker.js'));

	const { server_routes, pages } = manifest;
	const error_route = manifest.error;

	function bail(req, res, err) {
		console.error(err);

		const message =  'Internal server error';

		res.statusCode = 500;
		res.end(`<pre>${message}</pre>`);
	}

	function handle_error(req, res, statusCode, error) {
		handle_page({
			pattern: null,
			parts: [
				{ name: null, component: error_route }
			]
		}, req, res, statusCode, error || new Error('Unknown error in preload function'));
	}

	async function handle_page(page, req, res, status = 200, error = null) {
		const is_service_worker_index = req.path === '/service-worker-index.html';
		const build_info




 = get_build_info();

		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Cache-Control',  'max-age=600');

		// preload main.js and current route
		// TODO detect other stuff we can preload? images, CSS, fonts?
		let preloaded_chunks = Array.isArray(build_info.assets.main) ? build_info.assets.main : [build_info.assets.main];
		if (!error && !is_service_worker_index) {
			page.parts.forEach(part => {
				if (!part) return;

				// using concat because it could be a string or an array. thanks webpack!
				preloaded_chunks = preloaded_chunks.concat(build_info.assets[part.name]);
			});
		}

		if (build_info.bundler === 'rollup') {
			// TODO add dependencies and CSS
			const link = preloaded_chunks
				.filter(file => file && !file.match(/\.map$/))
				.map(file => `<${req.baseUrl}/client/${file}>;rel="modulepreload"`)
				.join(', ');

			res.setHeader('Link', link);
		} else {
			const link = preloaded_chunks
				.filter(file => file && !file.match(/\.map$/))
				.map((file) => {
					const as = /\.css$/.test(file) ? 'style' : 'script';
					return `<${req.baseUrl}/client/${file}>;rel="preload";as="${as}"`;
				})
				.join(', ');

			res.setHeader('Link', link);
		}

		const session = session_getter(req, res);

		let redirect;
		let preload_error;

		const preload_context = {
			redirect: (statusCode, location) => {
				if (redirect && (redirect.statusCode !== statusCode || redirect.location !== location)) {
					throw new Error(`Conflicting redirects`);
				}
				location = location.replace(/^\//g, ''); // leading slash (only)
				redirect = { statusCode, location };
			},
			error: (statusCode, message) => {
				preload_error = { statusCode, message };
			},
			fetch: (url, opts) => {
				const parsed = new Url.URL(url, `http://127.0.0.1:${process.env.PORT}${req.baseUrl ? req.baseUrl + '/' :''}`);

				if (opts) {
					opts = Object.assign({}, opts);

					const include_cookies = (
						opts.credentials === 'include' ||
						opts.credentials === 'same-origin' && parsed.origin === `http://127.0.0.1:${process.env.PORT}`
					);

					if (include_cookies) {
						opts.headers = Object.assign({}, opts.headers);

						const cookies = Object.assign(
							{},
							cookie.parse(req.headers.cookie || ''),
							cookie.parse(opts.headers.cookie || '')
						);

						const set_cookie = res.getHeader('Set-Cookie');
						(Array.isArray(set_cookie) ? set_cookie : [set_cookie]).forEach(str => {
							const match = /([^=]+)=([^;]+)/.exec(str);
							if (match) cookies[match[1]] = match[2];
						});

						const str = Object.keys(cookies)
							.map(key => `${key}=${cookies[key]}`)
							.join('; ');

						opts.headers.cookie = str;
					}
				}

				return fetch(parsed.href, opts);
			}
		};

		let preloaded;
		let match;
		let params;

		try {
			const root_preloaded = manifest.root_preload
				? manifest.root_preload.call(preload_context, {
					host: req.headers.host,
					path: req.path,
					query: req.query,
					params: {}
				}, session)
				: {};

			match = error ? null : page.pattern.exec(req.path);


			let toPreload = [root_preloaded];
			if (!is_service_worker_index) {
				toPreload = toPreload.concat(page.parts.map(part => {
					if (!part) return null;

					// the deepest level is used below, to initialise the store
					params = part.params ? part.params(match) : {};

					return part.preload
						? part.preload.call(preload_context, {
							host: req.headers.host,
							path: req.path,
							query: req.query,
							params
						}, session)
						: {};
				}));
			}

			preloaded = await Promise.all(toPreload);
		} catch (err) {
			if (error) {
				return bail(req, res, err)
			}

			preload_error = { statusCode: 500, message: err };
			preloaded = []; // appease TypeScript
		}

		try {
			if (redirect) {
				const location = Url.resolve((req.baseUrl || '') + '/', redirect.location);

				res.statusCode = redirect.statusCode;
				res.setHeader('Location', location);
				res.end();

				return;
			}

			if (preload_error) {
				handle_error(req, res, preload_error.statusCode, preload_error.message);
				return;
			}

			const segments = req.path.split('/').filter(Boolean);

			// TODO make this less confusing
			const layout_segments = [segments[0]];
			let l = 1;

			page.parts.forEach((part, i) => {
				layout_segments[l] = segments[i + 1];
				if (!part) return null;
				l++;
			});

			const props = {
				stores: {
					page: {
						subscribe: writable({
							host: req.headers.host,
							path: req.path,
							query: req.query,
							params
						}).subscribe
					},
					preloading: {
						subscribe: writable(null).subscribe
					},
					session: writable(session)
				},
				segments: layout_segments,
				status: error ? status : 200,
				error: error ? error instanceof Error ? error : { message: error } : null,
				level0: {
					props: preloaded[0]
				},
				level1: {
					segment: segments[0],
					props: {}
				}
			};

			if (!is_service_worker_index) {
				let l = 1;
				for (let i = 0; i < page.parts.length; i += 1) {
					const part = page.parts[i];
					if (!part) continue;

					props[`level${l++}`] = {
						component: part.component,
						props: preloaded[i + 1] || {},
						segment: segments[i]
					};
				}
			}

			const { html, head, css } = App.render(props);

			const serialized = {
				preloaded: `[${preloaded.map(data => try_serialize(data)).join(',')}]`,
				session: session && try_serialize(session, err => {
					throw new Error(`Failed to serialize session data: ${err.message}`);
				}),
				error: error && try_serialize(props.error)
			};

			let script = `__SAPPER__={${[
				error && `error:${serialized.error},status:${status}`,
				`baseUrl:"${req.baseUrl}"`,
				serialized.preloaded && `preloaded:${serialized.preloaded}`,
				serialized.session && `session:${serialized.session}`
			].filter(Boolean).join(',')}};`;

			if (has_service_worker) {
				script += `if('serviceWorker' in navigator)navigator.serviceWorker.register('${req.baseUrl}/service-worker.js');`;
			}

			const file = [].concat(build_info.assets.main).filter(file => file && /\.js$/.test(file))[0];
			const main = `${req.baseUrl}/client/${file}`;

			if (build_info.bundler === 'rollup') {
				if (build_info.legacy_assets) {
					const legacy_main = `${req.baseUrl}/client/legacy/${build_info.legacy_assets.main}`;
					script += `(function(){try{eval("async function x(){}");var main="${main}"}catch(e){main="${legacy_main}"};var s=document.createElement("script");try{new Function("if(0)import('')")();s.src=main;s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main",main);}document.head.appendChild(s);}());`;
				} else {
					script += `var s=document.createElement("script");try{new Function("if(0)import('')")();s.src="${main}";s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main","${main}")}document.head.appendChild(s)`;
				}
			} else {
				script += `</script><script src="${main}">`;
			}

			let styles;

			// TODO make this consistent across apps
			// TODO embed build_info in placeholder.ts
			if (build_info.css && build_info.css.main) {
				const css_chunks = new Set();
				if (build_info.css.main) css_chunks.add(build_info.css.main);
				page.parts.forEach(part => {
					if (!part) return;
					const css_chunks_for_part = build_info.css.chunks[part.file];

					if (css_chunks_for_part) {
						css_chunks_for_part.forEach(file => {
							css_chunks.add(file);
						});
					}
				});

				styles = Array.from(css_chunks)
					.map(href => `<link rel="stylesheet" href="client/${href}">`)
					.join('');
			} else {
				styles = (css && css.code ? `<style>${css.code}</style>` : '');
			}

			// users can set a CSP nonce using res.locals.nonce
			const nonce_attr = (res.locals && res.locals.nonce) ? ` nonce="${res.locals.nonce}"` : '';

			const body = template()
				.replace('%sapper.base%', () => `<base href="${req.baseUrl}/">`)
				.replace('%sapper.scripts%', () => `<script${nonce_attr}>${script}</script>`)
				.replace('%sapper.html%', () => html)
				.replace('%sapper.head%', () => `<noscript id='sapper-head-start'></noscript>${head}<noscript id='sapper-head-end'></noscript>`)
				.replace('%sapper.styles%', () => styles);

			res.statusCode = status;
			res.end(body);
		} catch(err) {
			if (error) {
				bail(req, res, err);
			} else {
				handle_error(req, res, 500, err);
			}
		}
	}

	return function find_route(req, res, next) {
		if (req.path === '/service-worker-index.html') {
			const homePage = pages.find(page => page.pattern.test('/'));
			handle_page(homePage, req, res);
			return;
		}

		for (const page of pages) {
			if (page.pattern.test(req.path)) {
				handle_page(page, req, res);
				return;
			}
		}

		handle_error(req, res, 404, 'Not found');
	};
}

function read_template(dir = build_dir) {
	return fs.readFileSync(`${dir}/template.html`, 'utf-8');
}

function try_serialize(data, fail) {
	try {
		return devalue(data);
	} catch (err) {
		if (fail) fail(err);
		return null;
	}
}

function middleware(opts


 = {}) {
	const { session, ignore } = opts;

	let emitted_basepath = false;

	return compose_handlers(ignore, [
		(req, res, next) => {
			if (req.baseUrl === undefined) {
				let { originalUrl } = req;
				if (req.url === '/' && originalUrl[originalUrl.length - 1] !== '/') {
					originalUrl += '/';
				}

				req.baseUrl = originalUrl
					? originalUrl.slice(0, -req.url.length)
					: '';
			}

			if (!emitted_basepath && process.send) {
				process.send({
					__sapper__: true,
					event: 'basepath',
					basepath: req.baseUrl
				});

				emitted_basepath = true;
			}

			if (req.path === undefined) {
				req.path = req.url.replace(/\?.*/, '');
			}

			next();
		},

		fs.existsSync(path.join(build_dir, 'service-worker.js')) && serve({
			pathname: '/service-worker.js',
			cache_control: 'no-cache, no-store, must-revalidate'
		}),

		fs.existsSync(path.join(build_dir, 'service-worker.js.map')) && serve({
			pathname: '/service-worker.js.map',
			cache_control: 'no-cache, no-store, must-revalidate'
		}),

		serve({
			prefix: '/client/',
			cache_control:  'max-age=31536000, immutable'
		}),

		get_server_route_handler(manifest.server_routes),

		get_page_handler(manifest, session || noop$1)
	].filter(Boolean));
}

function compose_handlers(ignore, handlers) {
	const total = handlers.length;

	function nth_handler(n, req, res, next) {
		if (n >= total) {
			return next();
		}

		handlers[n](req, res, () => nth_handler(n+1, req, res, next));
	}

	return !ignore
		? (req, res, next) => nth_handler(0, req, res, next)
		: (req, res, next) => {
			if (should_ignore(req.path, ignore)) {
				next();
			} else {
				nth_handler(0, req, res, next);
			}
		};
}

function should_ignore(uri, val) {
	if (Array.isArray(val)) return val.some(x => should_ignore(uri, x));
	if (val instanceof RegExp) return val.test(uri);
	if (typeof val === 'function') return val(uri);
	return uri.startsWith(val.charCodeAt(0) === 47 ? val : `/${val}`);
}

function serve({ prefix, pathname, cache_control }



) {
	const filter = pathname
		? (req) => req.path === pathname
		: (req) => req.path.startsWith(prefix);

	const cache = new Map();

	const read =  (file) => (cache.has(file) ? cache : cache.set(file, fs.readFileSync(path.join(build_dir, file)))).get(file);

	return (req, res, next) => {
		if (filter(req)) {
			const type = lite.getType(req.path);

			try {
				const file = path.posix.normalize(decodeURIComponent(req.path));
				const data = read(file);

				res.setHeader('Content-Type', type);
				res.setHeader('Cache-Control', cache_control);
				res.end(data);
			} catch (err) {
				res.statusCode = 404;
				res.end('not found');
			}
		} else {
			next();
		}
	};
}

function noop$1(){}

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
