# Frontend Interview Handbook

Посібник для підготовки до співбесіди **Middle Frontend Developer** (React + TypeScript + Redux Toolkit). 181 питання та 21 практичне завдання в 11 розділах. Пояснення українською, відповіді англійською для тренування вголос, типові уточнення інтерв’юера, посилання на офіційну документацію, інтерактивні демо та приклади коду, які можна запустити просто на сторінці.

Відкрий [index.html](index.html) у браузері — це один автономний файл, який працює й офлайн. Його ж публікує GitHub Pages.

## Зміст

1. [JavaScript](content/01-javascript/README.md)
2. [TypeScript](content/02-typescript/README.md)
3. [React](content/03-react/README.md)
4. [Redux Toolkit та RTK Query](content/04-redux-toolkit/README.md)
5. [HTML та CSS](content/05-html-css/README.md)
6. [Браузер, мережа та веббезпека](content/06-browser-network/README.md)
7. [Тестування](content/07-testing/README.md)
8. [Архітектура та продуктивність](content/08-architecture/README.md)
9. [Практичні завдання](content/09-live-coding/README.md)
10. [Професійний досвід](content/10-professional-experience/README.md)
11. [Англійська на співбесіді](content/11-english/README.md)

[Чекліст](content/checklist.md) · [План підготовки](content/preparation.md) · [Як писати картки](CONTENT_GUIDE.md) · [Історія змін](CHANGELOG.md)

## Можливості

- Три режими: **Навчання** (пояснення відкриті), **Співбесіда** (відповідь прихована, самооцінка «Знаю / Повторити» з переходом до наступної картки), **Повторення** (лише закладки й картки «Повторити»).
- Англомовна відповідь у кожній картці з кнопкою **«Озвучити»** (синтез мовлення браузера) і копіюванням.
- **«Можливі уточнення»** — питання, якими інтерв’юер перевіряє глибину.
- Ненав’язливий блок **«Документація»** з посиланнями на MDN, react.dev, typescriptlang.org, redux.js.org, web.dev та інші першоджерела.
- Інтерактивні демо: Event Loop крок за кроком, debounce і throttle наживо, калькулятор specificity, CSS Box Model, батчинг оновлень стану. Приклади з позначкою «можна запустити» виконуються й редагуються на сторінці.
- Пошук, гарячі клавіші (`?`), світла й темна тема, адаптивний інтерфейс, прогрес у `localStorage` з експортом та імпортом у файл. Прогрес з першого видання переноситься автоматично.

## Розробка

Потрібен Node.js 20 або новіший.

```sh
npm ci
npm run build        # content/ → index.html
npm test             # контракт контенту, посилання, детермінованість збірки, запуск прикладів
npx playwright install chromium
npm run test:e2e     # браузерні тести інтерфейсу (desktop і mobile)
npm run check:links  # перевірка зовнішніх посилань (потрібна мережа)
node scripts/serve.mjs  # локальний перегляд на http://localhost:4173/
```

Картки редагуються в `content/`, формат описано в [CONTENT_GUIDE.md](CONTENT_GUIDE.md). Після змін перезбери `index.html` і запусти тести — CI на GitHub перевіряє, що закомічений `index.html` актуальний.

## Публікація на GitHub Pages

1. Публічний репозиторій, гілка `main` разом зі згенерованим `index.html`.
2. **Settings → Pages → Build and deployment → Deploy from a branch**, гілка `main`, папка `/ (root)`.
3. Файл `.nojekyll` вимикає обробку Jekyll, тож сайт віддається як є.

Для публічного репозиторію GitHub Pages доступний на безкоштовному плані. [Документація GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Ліцензія

[MIT](LICENSE). Вміст — навчальні матеріали; перевіряй актуальність версій інструментів за посиланнями на документацію.
