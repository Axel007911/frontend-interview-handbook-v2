# Професійний досвід

Поведінкові (behavioral) питання та питання про твій досвід. Англійські відповіді тут — шаблони: у квадратних дужках `[...]` стоять місця, куди треба підставити власні факти (проєкт, модуль, цифри, терміни). Не вигадуй досягнень і цифр: інтерв'юер майже завжди просить деталей, і вигадана історія розсипається вже на другому уточненні. Для поведінкових питань («Tell me about a time when…») тримайся структури STAR: **Situation** — короткий контекст, **Task** — твоя роль і задача, **Action** — що зробив саме ти (найбільша частина відповіді), **Result** — результат, бажано вимірюваний, і висновок. Оптимальна довжина усної відповіді — 1–2 хвилини; далі інтерв'юер сам спитає, що його цікавить.

## 10.1. Why did you transition from QA to frontend development?

<a id="q-10-1"></a>

Чому ти вирішив перейти з QA у розробку?

### Пояснення

#### Interview answer (EN)

I worked as a QA engineer for [number] years, and over time I became more interested in how the product is built than only in how it is tested. I started by [first step, for example writing automated tests in JavaScript], then studied React and TypeScript in depth and moved into a frontend role on [project]. Since then, I have been building features with React, TypeScript, and Redux Toolkit. It was a deliberate career move, and my QA background still helps me every day, because I think about edge cases and testability from the very beginning.

**Що оцінюють.** Мотивацію та усвідомленість кроку: це професійний розвиток, а не втеча з QA чи випадковість. Друге приховане питання — чи не повернешся ти назад у тестування через пів року.

**Як побудувати.** Причина (інтерес до того, як будується продукт, бажання впливати на рішення) → конкретні кроки переходу (навчання, перші задачі, внутрішній перехід чи нова компанія) → що робиш зараз → як досвід QA допомагає. Закінчуй на теперішньому, а не на минулому.

**Червоні прапорці.** Негатив про QA («тестувати нудно», «QA менше платять»), «так вийшло», довга історія навчання без реальних задач.

**Як адаптувати.** Підстав реальну тривалість роботи в QA, реальний перший крок (автотести, pet-проєкт, курс, задачі з frontend-беклогу) і реальний проєкт, на якому ти вже пишеш код.

#### Можливі уточнення

- **Do you miss anything about QA?** — чесно й позитивно: мислення про якість лишилося з тобою, але створювати функціональність цікавіше.
- **What was the hardest part of the transition?** — назви реальну складність (архітектура, state management, швидкість delivery) і як ти її подолав.
- **Would you consider an SDET or test automation role?** — ввічливо поясни, що твій фокус зараз — розробка продукту.

#### Пов’язані питання

- [How does your QA experience help you as a developer?](#q-10-2)
- [Tell me about yourself](#q-10-11)

## 10.2. How does your QA experience help you as a developer?

<a id="q-10-2"></a>

Як твій досвід у QA допомагає тобі як розробнику?

### Пояснення

#### Interview answer (EN)

QA taught me to look beyond the happy path. When I pick up a feature, I think about empty, loading, and error states, invalid input, and accessibility before I write the code, not after a bug report. It also makes my tests more meaningful, because I test behavior the way a user sees it rather than implementation details. And it helps me work with QA engineers: I write clear reproduction steps and realistic acceptance criteria. For example, on [project] I [specific example, such as finding an edge case during code review before it reached testing].

**Що оцінюють.** Чи вмієш ти перетворити нетиповий шлях на конкурентну перевагу, і чи підкріплюєш це прикладом, а не загальними словами.

**Як побудувати.** 2–3 конкретні навички (edge cases, тестування поведінки, локалізація та відтворення багів, спільна мова з QA) → один реальний приклад із твоєї роботи.

**Червоні прапорці.** «Я пишу код без багів» без доказів; зверхність до QA; думка, що тестування — це лише робота QA, а не всієї команди.

**Як адаптувати.** Згадай, які тести ти реально пишеш (unit на Vitest або Jest, React Testing Library, MSW, E2E) і де твій QA-досвід щось змінив: знайдений edge case, спрощений процес відтворення, краще покриття критичного флоу.

#### Можливі уточнення

- **How do you decide what to cover with unit tests and what with E2E tests?** — піраміда або «трофей» тестів, критичні user flows — в E2E, логіка й компоненти — в unit та integration.
- **Who is responsible for quality in a team?** — уся команда; розробник відповідає за тести свого коду, QA — за стратегію й дослідницьке тестування.

#### Пов’язані питання

- [Чим відрізняються Unit, Integration та E2E tests?](../07-testing/README.md#q-7-1)
- [Чому краще тестувати поведінку компонента, а не деталі його реалізації?](../07-testing/README.md#q-7-9)

## 10.3. Tell me about a challenging technical task you worked on.

<a id="q-10-3"></a>

Розкажи про складну технічну задачу, яку ти вирішив.

### Пояснення

#### Interview answer (EN)

On [project], our API layer was built with async thunks, and every feature handled loading flags, errors, and refetching manually. My task was to migrate [module, for example the notifications module] to RTK Query without breaking existing behavior. I started by mapping every request and every place its data was used, then moved the endpoints into an API slice, replaced the manual flags with the generated hooks, and set up cache tags so that mutations refreshed the right data. The hardest part was [specific difficulty, such as endpoints with different parameters and error formats], so I covered it with tests before switching over. As a result, [result, for example we removed most of the manual loading logic and duplicate requests disappeared].

**Що оцінюють.** Глибину технічного розуміння, твою особисту роль, як ти знижуєш ризики, і чи вмієш пояснити складне просто.

**Як побудувати (STAR).** Situation — що було не так у коді. Task — що саме доручили тобі. Action — кроки: аналіз, план, поступова міграція, тести. Result — що змінилося (менше коду, менше дубльованих запитів, простіше додавати endpoints) і що ти виніс для себе.

**Червоні прапорці.** Говорити лише «we» — інтерв'юер не зрозуміє твого внеску; задача, складна тільки тому, що технологія була нова для тебе; відсутність результату; вигадані цифри.

**Як адаптувати.** Будь готовий до деталей саме твоєї міграції: як мігрував endpoints по одному, як працював із параметрами запиту, `transformResponse` і `transformErrorResponse`, як налаштував `providesTags`/`invalidatesTags`, як тестував (наприклад, через MSW), що робив із логікою, яка не стосувалася запитів.

#### Можливі уточнення

- **How did you make sure nothing broke?** — тести до й після, міграція по одному модулю, перевірка в staging, порівняння поведінки.
- **What would you do differently today?** — чесний висновок показує зрілість: наприклад, раніше домовитися про структуру тегів або писати тести на рівні поведінки від початку.
- **How did you test components that use RTK Query hooks?** — справжній store з API slice і MSW для мережі, а не мок хуків.

#### Пов’язані питання

- [Why did you migrate from Redux Thunks to RTK Query?](#q-10-4)
- [Як працюють `providesTags` та `invalidatesTags`?](../04-redux-toolkit/README.md#q-4-8)
- [Як тестувати компонент, який виконує API-запит?](../07-testing/README.md#q-7-5)

## 10.4. Why did you migrate from Redux Thunks to RTK Query?

<a id="q-10-4"></a>

Чому ви мігрували з Redux Thunks на RTK Query? Які переваги отримали?

### Пояснення

#### Interview answer (EN)

Our thunks were mostly fetching data and putting it into Redux, so we kept writing the same loading, error, and caching logic for every endpoint. RTK Query gives us that out of the box: request deduplication, a cache keyed by the endpoint and its arguments, automatic cleanup of unused data, and tag-based invalidation after mutations. That made the API layer more consistent and removed a lot of reducer code. We still kept thunks for logic that isn't really server state, such as [example, for example a multi-step workflow], because RTK Query is designed for fetching and caching, not for every async side effect.

**Що оцінюють.** Чи розумієш ти, *чому* інструмент кращий для цієї задачі, а не просто «так вирішив тімлід». Ключова ідея — розділення server state і client state.

**Що варто знати.** RTK Query зберігає кеш у Redux store, дедуплікує однакові запити, тримає дані, доки є підписники (плюс `keepUnusedDataFor`, за замовчуванням 60 секунд), підтримує polling, `refetchOnFocus`/`refetchOnReconnect`, optimistic updates, а в RTK 2.x — ще й `infiniteQuery`. Компроміси: кеш не нормалізований (той самий об'єкт у двох запитах зберігається двічі), є крива навчання, а складні клієнтські сценарії все одно краще робити через thunks або listener middleware.

**Червоні прапорці.** «Thunks застаріли» — це неправда: `createAsyncThunk` є частиною RTK і підходить для логіки, яка не є кешуванням серверних даних. Також погано не знати жодного недоліку RTK Query.

**Як адаптувати.** Назви реальну причину у твоєму проєкті (boilerplate, дублікати запитів, неузгоджені loading-стани, складна інвалідація) і реальний приклад того, що лишилося на thunks.

#### Можливі уточнення

- **Why not TanStack Query?** — обидва інструменти добрі; RTK Query логічний вибір, коли Redux уже є в проєкті: одна екосистема, одні DevTools, доступ до кешу з reducers і middleware.
- **What is not a good fit for RTK Query?** — суто клієнтський state, складні багатокрокові процеси, логіка без HTTP-запитів.
- **How does cache invalidation work?** — `providesTags` на query, `invalidatesTags` на mutation; збіг тегу запускає refetch активних запитів.

#### Пов’язані питання

- [У чому різниця між `createAsyncThunk` та RTK Query?](../04-redux-toolkit/README.md#q-4-6)
- [Як працює кешування в RTK Query?](../04-redux-toolkit/README.md#q-4-7)
- [Чим відрізняється server state від client state?](../04-redux-toolkit/README.md#q-4-13)

#### Документація

- [Redux Toolkit — RTK Query Overview](https://redux.js.org/toolkit/rtk-query/overview)
- [Redux Toolkit — Comparison with Other Tools](https://redux.js.org/toolkit/rtk-query/comparison)

## 10.5. Tell me about an architectural decision you proposed.

<a id="q-10-5"></a>

Розкажи про архітектурне рішення, яке ти запропонував самостійно.

### Пояснення

#### Interview answer (EN)

On [project], I noticed that [problem, for example several features defined the same API types and error handling separately], which led to [consequence, for example inconsistent error messages and the same bug being fixed twice]. I proposed [solution, for example shared TypeScript types for API responses and a single error-handling layer]. Before suggesting it, I compared it with [alternative] and wrote a short proposal with the pros, the cons, and a migration plan. Once the team agreed, we rolled it out step by step, starting with [first module]. As a result, [outcome, for example adding a new endpoint became faster and more predictable].

**Що оцінюють.** Ініціативу, вміння знайти проблему самостійно, аргументувати рішення, порівняти альтернативи й домовитися з командою.

**Як побудувати (STAR).** Проблема та її наслідки → твоя пропозиція → які альтернативи розглянув і чому відкинув → як переконав команду → як впроваджували → результат.

**Червоні прапорці.** «Я сам переписав усе без обговорення»; рішення без зрозумілої проблеми, «бо так модно»; приписування собі рішення, яке ухвалила команда.

**Як адаптувати.** Для Middle рішення не мусить бути масштабним. Підійде реальний приклад: структура папок за фічами, спільний хук або компонент, централізована обробка помилок, error boundary, правило ESLint, тестова інфраструктура з MSW, типізація API-контрактів.

#### Можливі уточнення

- **What alternatives did you consider?** — назви хоча б одну й чесно поясни її плюси.
- **Was there any pushback, and how did you handle it?** — аргументи, прототип, поступове впровадження замість «все й одразу».
- **How did you know it worked?** — менше дублювання, менше схожих багів, швидше додавання нових фіч, відгуки команди.

#### Пов’язані питання

- [Як би ти організував структуру великого React-проєкту?](../08-architecture/README.md#q-8-1)
- [Як би ти організував централізовану обробку помилок?](../08-architecture/README.md#q-8-11)
- [Describe a disagreement with a teammate, designer, or PM](#q-10-13)

## 10.6. How do you work with legacy code?

<a id="q-10-6"></a>

Як ти працюєш із legacy-кодом?

### Пояснення

#### Interview answer (EN)

First, I try to understand what the code actually does and why: I read it, check the Git history and related tickets, and run the feature myself. Before changing anything risky, I add tests around the current behavior, so I have a safety net. Then I make small, reviewable changes and keep refactoring separate from feature work, which makes regressions easier to spot and to roll back. I avoid big rewrites unless the team agrees the benefit is worth the cost. For example, on [project] I [specific example, such as covering a legacy component with tests before refactoring it].

**Що оцінюють.** Прагматизм, повагу до чужого коду й уміння керувати ризиком. Для Middle важливо показати, що ти покращуєш систему поступово, а не прагнеш переписати все з нуля.

**Що варто згадати.** Characterization tests (тести, що фіксують поточну поведінку), правило «залиш код трохи чистішим, ніж він був», поступова заміна частин системи замість великого переписування, окремі PR для рефакторингу.

**Червоні прапорці.** «Legacy — це жах, я б переписав»; критика попередніх розробників; великий рефакторинг «заодно» в задачі про інше.

**Як адаптувати.** Згадай реальний legacy-модуль, з яким працював, і що саме зробив: покрив тестами, мігрував з thunks на RTK Query, перевів файл на TypeScript, розбив великий компонент.

#### Можливі уточнення

- **When is a rewrite justified?** — коли вартість підтримки стабільно вища за вартість переписування, і є тести та план поступового переходу.
- **How do you test code that is hard to test?** — починати з тестів вищого рівня (integration або E2E), потім виділяти чисті функції.
- **How do you get time for refactoring from the PM?** — пояснити бізнес-вплив: швидкість delivery, кількість багів, ризики.

#### Пов’язані питання

- [Як визначити, що компонент необхідно розділити на декілька?](../08-architecture/README.md#q-8-2)
- [Чому краще тестувати поведінку компонента, а не деталі його реалізації?](../07-testing/README.md#q-7-9)

## 10.7. How do you approach code reviews?

<a id="q-10-7"></a>

Як ти проводиш code review і як сприймаєш коментарі до свого коду?

### Пояснення

#### Interview answer (EN)

When I review, I first check that the change does what the ticket asks and handles edge cases and errors, and then I look at readability, consistency with our architecture, and tests. I try to separate real problems from personal preferences, so I mark minor comments as nits, and the author knows what is blocking. When I ask for a change, I explain why it matters and suggest an alternative. When I receive comments, I don't take them personally: I either address them or explain my reasoning. I also keep my own pull requests small, so they are easy to review.

**Що оцінюють.** Як ти дбаєш про якість і водночас як взаємодієш із людьми: тон, аргументація, вміння приймати критику.

**Чекліст рецензента.** Коректність і edge cases, обробка помилок і loading-станів, типи (без зайвого `any` та небезпечних `as`), accessibility, безпека (наприклад, `dangerouslySetInnerHTML` з неочищеними даними), продуктивність там, де вона реально важлива, наявність і якість тестів. Стиль коду має перевіряти ESLint і Prettier, а не людина.

**Червоні прапорці.** «Апрувлю, якщо тести зелені»; або навпаки — блокувати PR через дрібниці смаку; різкий тон у коментарях; образа на коментарі до свого коду.

**Як адаптувати.** Розкажи, як review влаштоване у твоїй команді: скільки апрувів, чи є шаблон PR, що автоматизовано в CI, який корисний коментар ти нещодавно отримав або залишив.

#### Можливі уточнення

- **What do you do if the author disagrees with your comment?** — обговорити аргументи, за потреби коротко поговорити голосом; якщо це не блокер — відпустити.
- **How big should a pull request be?** — настільки малий, щоб його можна було уважно переглянути за один підхід; великі зміни — серією PR.
- **What do you automate in code review?** — лінтери, форматування, type check, тести, перевірки в CI.

#### Пов’язані питання

- [How does your QA experience help you as a developer?](#q-10-2)

## 10.8. What do you do when you don't know how to implement something?

<a id="q-10-8"></a>

Що ти робиш, коли не знаєш, як реалізувати задачу?

### Пояснення

#### Interview answer (EN)

I start by breaking the task into smaller parts and identifying exactly what I don't know. Then I check the official documentation and look at how similar problems are already solved in our codebase, and if the risk is high, I build a small proof of concept. I usually time-box this research, for example to [time box, such as half a day]. If I'm still stuck after that, I ask a colleague a focused question and explain what I've already tried, so we don't waste each other's time. I also tell the team early if it affects the estimate.

**Що оцінюють.** Баланс між самостійністю та вмінням вчасно попросити допомогу. Обидві крайнощі погані: і «одразу питаю тімліда», і «тиждень сиджу сам».

**Як побудувати.** Декомпозиція → дослідження (документація, код проєкту, прототип) → обмеження часу → точне питання колегам → комунікація, якщо змінюється оцінка.

**Червоні прапорці.** Відсутність обмеження за часом; «шукаю на Stack Overflow і копіюю»; «прошу AI написати код» без перевірки.

**Як адаптувати.** Якщо використовуєш AI-асистентів, скажи про це чесно, але підкресли, що перевіряєш результат за документацією й тестами та розумієш кожен рядок, який комітиш.

#### Можливі уточнення

- **How long do you try on your own before asking for help?** — залежить від терміновості; назви свій реальний орієнтир.
- **Do you use AI tools? How do you check their output?** — документація, тести, review, розуміння коду перед комітом.

#### Пов’язані питання

- [Що сказати англійською, коли не знаєш або забув відповідь](../11-english/README.md#q-11-5)

## 10.9. Tell me about a technical mistake you made.

<a id="q-10-9"></a>

Розкажи про технічну помилку, яку ти допустив, та як її виправив.

### Пояснення

#### Interview answer (EN)

On [project], I [what you changed, for example updated a shared selector] and tested only the main scenario. After the release, [how the problem showed up, for example a user reported that a list was not updating after an edit]. I took ownership of it, reproduced the issue, and found that the root cause was [root cause]. I shipped a fix within [time], added a regression test, and [process change, for example added this case to our review checklist]. Since then, I always check the other places that use the same data before I change it.

**Що оцінюють.** Відповідальність (ownership), чесність і здатність робити висновки. Помилки роблять усі; інтерв'юер хоче побачити, що ти не ховаєш їх і не перекладаєш провину.

**Як побудувати (STAR).** Що сталося → як виявилося → що ти зробив одразу (виправлення, комунікація) → що змінив у процесі, щоб це не повторилося.

**Червоні прапорці.** «Я не роблю помилок»; звинувачення колег чи QA; помилка-«хвастощі» на кшталт «я занадто перфекціоніст»; катастрофа без жодних висновків.

**Як адаптувати.** Обери справжню, але не руйнівну помилку: неправильні dependencies в `useEffect`, пропущена інвалідація кешу, неправильні параметри запиту, edge case у формі. Підготуй точні деталі: що саме зламалось і як ти це знайшов.

#### Можливі уточнення

- **How did you communicate it to the team?** — швидко, з фактами й планом виправлення.
- **What did you change in your process?** — тест, пункт у чеклисті, перевірка в CI, ширше ручне тестування суміжних сценаріїв.

#### Пов’язані питання

- [Як працюють `providesTags` та `invalidatesTags`?](../04-redux-toolkit/README.md#q-4-8)

## 10.10. How do you estimate task complexity?

<a id="q-10-10"></a>

Як ти оцінюєш складність задачі перед її реалізацією?

### Пояснення

#### Interview answer (EN)

First, I make sure I understand the acceptance criteria, and I ask about anything that is unclear. Then I break the task into parts, such as UI, state and API changes, edge cases, tests, and time for review and QA, because writing code is only part of the work. I compare it with similar tasks we've done and add a buffer for risky areas. If there's a big unknown, like an API that doesn't exist yet, I suggest a short spike first or split the task, and I give a range rather than a single number. If the estimate changes, I tell the team as early as possible.

**Що оцінюють.** Чи бачиш ти весь цикл delivery, а не лише час на написання коду, і чи чесно комунікуєш невизначеність.

**Що варто згадати.** Декомпозицію, порівняння з подібними задачами, story points як відносну складність, а не години, spike для невідомого, оцінку діапазоном, оновлення оцінки під час роботи.

**Червоні прапорці.** Миттєва цифра без уточнювальних питань; «скільки займе, стільки займе»; мовчки зірваний термін.

**Як адаптувати.** Опиши, як оцінюють у твоїй команді (planning poker, story points, T-shirt sizes) і реальний випадок, коли оцінка змінилася й ти про це повідомив.

#### Можливі уточнення

- **What do you do when your estimate turns out to be wrong?** — повідомити рано, пояснити причину, запропонувати варіанти (скоротити scope, перенести частину).
- **Story points or hours?** — story points — відносна складність і ризик, години — для короткострокового планування; поясни, як прийнято у вас.

#### Пов’язані питання

- [How do you handle tight deadlines and scope pressure?](#q-10-14)
- [Як ставити уточнювальні питання до задачі англійською](../11-english/README.md#q-11-3)

## 10.11. Tell me about yourself.

<a id="q-10-11"></a>

Розкажи про себе. Зазвичай це перше питання співбесіди, і від нього залежить перше враження.

### Пояснення

#### Interview answer (EN)

I'm a frontend developer with [number] years of experience in IT, and my path is a bit unusual: I started as a QA engineer and then moved into development. For the last [number] years, I've been working mostly with React, TypeScript, and Redux Toolkit on [type of product, for example a B2B web platform]. Recently, I [one strong achievement, for example migrated our data fetching from thunks to RTK Query], which [result]. Because of my QA background, I care a lot about testing and edge cases. Now I'm looking for a Middle frontend role where I can [your goal, for example work on a larger product and grow in frontend architecture], and that's why this position caught my attention.

**Що оцінюють.** Чи вмієш ти коротко й структуровано подати себе, наскільки впевнено говориш англійською, і чи відповідає твій профіль вакансії.

**Як побудувати: Present → Past → Future.** Хто ти зараз (роль, стек, тип продукту) → як ти до цього прийшов (QA → frontend, одне сильне досягнення) → чого шукаєш і чому ця вакансія. Підготуй дві версії: на 30 секунд (для рекрутера) і на 1,5–2 хвилини (для технічного етапу, приблизно 200–280 слів: додай 1–2 приклади задач і технологій).

**Червоні прапорці.** Переказ резюме по роках; вік, сімейний стан та хобі на півхвилини; читання тексту з екрана; занадто скромно («I'm just a junior-ish developer»).

**Як адаптувати.** Закінчи «гачком» — темою, про яку ти хочеш, щоб тебе спитали далі (наприклад, міграція на RTK Query). Під кожну компанію змінюй останнє речення: що саме тебе привабило в цій вакансії.

#### Можливі уточнення

- **Can you tell me more about [project you mentioned]?** — саме тому згадуй тільки те, про що готовий говорити детально.
- **What are you looking for in your next role?** — конкретно: тип продукту, задачі, культура розробки.

#### Пов’язані питання

- [Why did you transition from QA to frontend development?](#q-10-1)
- [Self-introduction: структура й фрази англійською](../11-english/README.md#q-11-1)

## 10.12. Why are you looking for a new job, and why our company?

<a id="q-10-12"></a>

Чому ти шукаєш нову роботу і чому саме наша компанія?

### Пояснення

#### Interview answer (EN)

I've learned a lot in my current role, especially [what you learned], but I feel my growth there has slowed down, because [neutral reason, for example the project is moving into maintenance mode]. I'm looking for a team where I can work on [what you want, for example a product with real users at scale and more complex frontend architecture]. Your company stands out to me because of [specific reason from your research, for example your product, your tech stack, or an engineering blog post]. I also like that [another specific detail, for example the team owns features end to end], which matches how I want to work.

**Що оцінюють.** Мотивацію, лояльність (чи не підеш ти через пів року) і чи ти справді щось дізнався про компанію.

**Як побудувати.** Позитив про поточне місце → чого бракує, нейтрально → чого шукаєш → чому саме ця компанія, з однією-двома конкретними деталями з сайту, вакансії, інженерного блогу чи продукту.

**Червоні прапорці.** Негатив про роботодавця, керівника чи колег; «тільки через гроші»; «мені все одно, де працювати»; загальні слова на кшталт «great company, great culture».

**Як адаптувати.** Якщо тебе скоротили, скажи коротко й нейтрально: «My position was affected by a reorganization», і переходь до того, чого шукаєш. Якщо не працюєш зараз — поясни, чим займався (навчання, проєкти).

#### Можливі уточнення

- **What do you know about our product?** — підготуй 2–3 факти й спробуй продукт сам, якщо це можливо.
- **Are you interviewing with other companies?** — чесно й без деталей: «Yes, I'm in a few other processes, but this role is a priority for me because…».
- **What would make you stay at a company for a long time?** — розвиток, цікаві задачі, сильна команда; уникай відповіді лише про гроші.

## 10.13. Describe a disagreement with a teammate, designer, or PM.

<a id="q-10-13"></a>

Опиши ситуацію, коли ти не погодився з колегою, дизайнером чи PM. Як ви це вирішили?

### Пояснення

#### Interview answer (EN)

On [project], a designer proposed [design decision, for example a fully custom dropdown], and I was concerned about [your concern, for example accessibility and the time it would take]. Instead of arguing in comments, I asked for a short call to understand the goal behind the design. I showed [evidence, for example a quick prototype and how it worked with a keyboard and a screen reader], and we agreed on [compromise, for example keeping the visual style but building it on an accessible component]. The feature shipped on time, and since then we discuss technical constraints earlier. I learned that most disagreements come from different goals, not from someone being wrong.

**Що оцінюють.** Emotional maturity: чи вмієш ти слухати, аргументувати фактами, шукати компроміс і підтримати рішення команди, навіть якщо воно не твоє («disagree and commit»).

**Як побудувати (STAR).** Суть розбіжності без емоцій → як ти з'ясував мету іншої сторони → які аргументи чи дані навів → чим закінчилося → що виніс для себе.

**Червоні прапорці.** Історія, де ти «переміг», а інша людина виглядає некомпетентною; «у мене ніколи не було конфліктів»; конфлікт про особистості, а не про рішення.

**Як адаптувати.** Підійде будь-яка реальна розбіжність: щодо дизайну, підходу в code review, оцінки задачі, вибору бібліотеки. Історія, де рішення ухвалили не на твою користь і ти його підтримав, теж добра — якщо покажеш, як професійно це прийняв.

#### Можливі уточнення

- **What if you hadn't been able to agree?** — винести питання з фактами до тімліда чи PM і прийняти їхнє рішення.
- **Tell me about a time you were wrong in a discussion.** — чесний приклад, де аргументи іншої сторони виявилися кращими.

#### Пов’язані питання

- [Як пояснювати trade-offs і висловлювати думку англійською](../11-english/README.md#q-11-6)

## 10.14. How do you handle tight deadlines and scope pressure?

<a id="q-10-14"></a>

Як ти працюєш у ситуації жорсткого дедлайну та тиску на обсяг робіт?

### Пояснення

#### Interview answer (EN)

When a deadline is tight, I first clarify what really has to be delivered by that date and what can wait. If I see a risk, I tell the team or the PM early and suggest options, for example shipping a smaller first version, moving [lower-priority part] to a follow-up task, or getting help with [part of the work]. What I try not to do is silently cut tests or quality, because that usually costs more later. For example, on [project] we had [situation], so we [what you did, for example agreed on a smaller scope for the first release], and we delivered [result] on time.

**Що оцінюють.** Пріоритизацію, чесну комунікацію ризиків і розуміння компромісу між обсягом, часом і якістю.

**Як побудувати.** Уточнити, що є must-have → рано повідомити про ризик → запропонувати варіанти, а не лише проблему → домовитися → приклад із твого досвіду.

**Червоні прапорці.** «Просто працюю понаднормово» як основна стратегія; мовчки зірваний термін; «пропускаю тести, щоб встигнути». Готовність інколи допомогти команді в критичний момент — нормальна, але не як система.

**Як адаптувати.** Згадай реальний випадок: реліз із зменшеним scope, перенесення частини задачі, допомога колеги, feature flag, щоб випустити незавершену частину прихованою.

#### Можливі уточнення

- **What if the PM insists on the full scope?** — показати факти й ризики, запропонувати варіанти; рішення ухвалює той, хто відповідає за продукт.
- **Have you ever missed a deadline?** — чесно, з акцентом на ранню комунікацію та висновки.
- **What do you do with the technical debt created under pressure?** — фіксувати окремими задачами й домовлятися, коли їх зробити.

#### Пов’язані питання

- [How do you estimate task complexity?](#q-10-10)

## 10.15. Tell me about a time you improved performance or quality.

<a id="q-10-15"></a>

Розкажи про випадок, коли ти покращив продуктивність або якість застосунку.

### Пояснення

#### Interview answer (EN)

On [project], [page or feature] felt slow: [metric, for example INP on the search filter] was around [value before]. My task was to find the cause and fix it without a redesign. I profiled it with the React DevTools Profiler and the Performance panel in Chrome, and I found that [root cause, for example the whole list re-rendered on every keystroke]. Then I [action, for example moved the state closer to the input and virtualized the long list]. As a result, [metric] improved from [value before] to [value after], and I added [safeguard, for example a test or a performance check in CI] so that it wouldn't regress.

**Що оцінюють.** Методичність: виміряти → знайти справжню причину → змінити → виміряти знову. Оптимізація «на око» або memo всюди — слабка відповідь.

**Як побудувати (STAR).** Проблема з метрикою → твоя задача → інструменти діагностики (React DevTools Profiler, вкладка Performance у Chrome DevTools, Lighthouse, field data з Core Web Vitals) → конкретна зміна → результат у тих самих одиницях.

**Червоні прапорці.** Вигадані чи неправдоподібні цифри; «додав `useMemo` скрізь»; немає вимірювання до й після.

**Як адаптувати.** Якщо точних цифр немає — так і скажи, і назви відносний чи якісний результат («the page became noticeably faster», «we stopped getting bug reports about it»). Якість теж підходить: покриття критичного флоу тестами, MSW для стабільних тестів, перевірки в CI, суворіші типи API, менше регресій після релізів.

#### Можливі уточнення

- **How did you know that was the bottleneck?** — профайлер показав, що саме займає час; гіпотезу перевірив вимірюванням.
- **What would you have done if memoization hadn't helped?** — змінити структуру state, віртуалізація, debounce, перенесення обчислень, code splitting.
- **What is INP?** — Interaction to Next Paint, метрика відгуку на взаємодії; хорошим вважається значення до 200 мс.

#### Пов’язані питання

- [Як знайти причину повільної роботи React-застосунку?](../08-architecture/README.md#q-8-9)
- [Що таке Core Web Vitals — LCP, INP та CLS?](../08-architecture/README.md#q-8-10)
- [Як говорити про результати й цифри англійською](../11-english/README.md#q-11-7)

#### Документація

- [web.dev — Interaction to Next Paint (INP)](https://web.dev/articles/inp)
- [React — React Developer Tools](https://react.dev/learn/react-developer-tools)

## 10.16. How do you keep your skills up to date?

<a id="q-10-16"></a>

Як ти підтримуєш свої знання актуальними?

### Пояснення

#### Interview answer (EN)

I try to keep it practical and focused on the tools I actually use. I follow primary sources, like the React blog and the Redux Toolkit release notes, and I read the documentation when a new major version comes out. When something looks useful, I try it in a side project or a small spike before suggesting it to the team; for example, recently I [example, for example tried the React Compiler on a pet project]. I also learn a lot from code reviews and from colleagues. Right now, I'm improving my knowledge of [topic you are really learning].

**Що оцінюють.** Чи вчишся ти системно, чи вмієш відрізнити корисне від хайпу і чи можеш застосувати нове в роботі.

**Як побудувати.** 1–2 реальні джерела → як ти перевіряєш нове на практиці → один свіжий приклад → що вивчаєш зараз.

**Червоні прапорці.** «Дивлюся YouTube» без конкретики; список із двадцяти джерел; згадка технології, про яку ти не можеш відповісти на два уточнення.

**Як адаптувати.** Назви те, що справді читаєш або пробував. Наприклад, у 2026 році доречно знати про React 19 (Actions, `useActionState`, `useOptimistic`, React Compiler) і RTK 2.x, але згадуй лише те, про що готовий говорити.

#### Можливі уточнення

- **What's the last thing you learned that you used at work?** — конкретний приклад з результатом.
- **What do you think about [new technology]?** — зважена думка: де корисно, які обмеження, чи пробував сам.

#### Документація

- [React — Blog](https://react.dev/blog)

## 10.17. What questions do you have for us?

<a id="q-10-17"></a>

Які питання ти хочеш поставити нам? Звучить наприкінці майже кожної співбесіди.

### Пояснення

#### Interview answer (EN)

Yes, I have a few questions. What would success look like for this role in the first three to six months? How does the team work day to day, for example how are tasks planned, and how does code review work? What is the biggest technical challenge the frontend team is facing right now? And finally, what are the next steps in the process?

**Що оцінюють.** Твою зацікавленість і те, що для тебе важливо. «No, I don't have any questions» звучить як байдужість.

**Добрі питання за категоріями:**

| Категорія | Приклад питання |
| --- | --- |
| Роль і очікування | What would success look like in the first three months? What will my first tasks be? |
| Команда й процеси | How big is the team? How do you plan work and do code reviews? How do frontend developers work with designers and QA? |
| Технічні | What does the frontend stack look like? How do you handle testing and releases? Is there any technical debt you're planning to address? |
| Розвиток | How do you support growth from Middle to Senior? Is there mentoring or a learning budget? |
| Процес найму | What are the next steps? When can I expect to hear back? |

**Червоні прапорці.** Питання, відповідь на які є на сайті чи у вакансії; питання про зарплату, відпустки й лікарняні на технічному етапі — їх краще обговорити з рекрутером; десять питань поспіль.

**Як адаптувати.** Підготуй 4–5 питань, а постав 2–3 залежно від інтерв'юера: рекрутеру — про процес і умови, tech lead — про стек і технічні виклики, hiring manager — про очікування від ролі. Якщо про щось уже розповіли — скажи: «You've already answered most of my questions, but I'd like to ask about…».

#### Пов’язані питання

- [Small talk на початку і ввічливе завершення співбесіди](../11-english/README.md#q-11-11)

## 10.18. What are your salary expectations, and what is your notice period?

<a id="q-10-18"></a>

Які твої зарплатні очікування і коли ти зможеш почати працювати?

### Пояснення

#### Interview answer (EN)

If you have a budget range for this position, I'd be happy to hear it first. In general, based on my research for similar Middle frontend roles, I'm looking for [your range] [gross or net, per month or per year], and I'm flexible depending on the full package, such as [benefits that matter to you]. As for availability, my notice period is [notice period], so I could start around [date].

**Що оцінюють.** Чи вписуєшся ти в бюджет, чи розумієш ринок і чи говориш про гроші спокійно й професійно.

**Як підготуватися.** Дослідити ринок: відкриті зарплатні опитування, вакансії з вказаною вилкою, знайомі в індустрії. Назвати діапазон, нижня межа якого — сума, на яку ти справді погодишся. Уточнити формат: gross чи net, валюта, на місяць чи на рік, трудовий договір чи контракт (для ФОП податки зазвичай на тобі), що входить у пакет (відпустка, лікарняні, медстрахування, бюджет на навчання, обладнання).

**Notice period.** Назви реальний строк за твоїм договором і чесну дату старту. Для трудового договору в Україні при звільненні за власним бажанням загальне правило — попередження за два тижні; для контракту чи ФОП — як записано в договорі.

**Червоні прапорці.** Одна цифра без формату (gross чи net? на місяць чи на рік?); «скільки дасте»; занижена цифра через хвилювання; агресивний торг на першому етапі.

**Як адаптувати.** Якщо питають про поточну зарплату, можна ввічливо не називати: «I'd prefer to focus on my expectations for this role». Якщо маєш інший офер — можна сказати про це чесно, без тиску.

#### Можливі уточнення

- **What is your current salary?** — див. вище: перевести розмову на очікування для нової ролі.
- **Is your range negotiable?** — «There's some flexibility, depending on the full package and the scope of the role».
- **Could you start earlier?** — лише якщо це реально; не обіцяй того, що порушить домовленості з поточним роботодавцем.
