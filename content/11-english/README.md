# Англійська на співбесіді

Практична допомога для рівня B1–B2: готові фрази для типових ситуацій на технічній співбесіді, типові помилки українськомовних розробників і вимова частих технічних слів. Фрази в англійських блоках — це заготовки: прочитай уголос, підстав свої дані замість `[...]` і повтори кілька разів, доки вони не звучатимуть природно. Мета — не ідеальна граматика, а зрозуміла, спокійна й структурована мова.

## 11.1. Self-introduction: структура й корисні фрази

<a id="q-11-1"></a>

Як коротко й упевнено представитися англійською на початку співбесіди.

### Пояснення

#### Interview answer (EN)

I'm a frontend developer with [number] years of experience in IT.\
I started my career as a QA engineer and moved into frontend development [number] years ago.\
For the past [number] years, I've been working mainly with React, TypeScript, and Redux Toolkit.\
Currently, I'm working on [product], where I'm responsible for [area].\
One thing I'm especially proud of is [achievement].\
Now I'm looking for a role where I can [your goal].

**Коли використовувати.** Відповідь на «Tell me about yourself» або «Could you briefly introduce yourself?». Структура: хто ти зараз → як прийшов до цього → чим пишаєшся → чого шукаєш. Детальний шаблон відповіді — у розділі «Професійний досвід».

**Часи.** Для того, що триває досі, — present perfect continuous з `for` чи `since`: «I've been working with React for two years». Для поточного проєкту — present continuous: «I'm working on a booking platform». Для завершених робіт і минулих місць роботи — past simple: «I worked as a QA engineer for three years».

**Типові помилки.**

- «I have 3 years experience» → «I have three years of experience».
- «I work with React since 2023» → «I've been working with React since 2023».
- «My name is Alex, I'm 28 years old, I'm from…» — вік і біографію на співбесіді не розповідають; ім'я інтерв'юер уже знає.

#### Пов’язані питання

- [Tell me about yourself](../10-professional-experience/README.md#q-10-11)
- [Як говорити про результати, цифри та вплив](#q-11-7)

## 11.2. Як перепитати, якщо не зрозумів або не розчув питання

<a id="q-11-2"></a>

Що сказати, коли питання прозвучало незрозуміло, надто швидко або зв'язок перервався.

### Пояснення

#### Interview answer (EN)

Sorry, could you repeat the question, please?\
Could you rephrase that? I'm not sure I understood it correctly.\
Just to make sure I understand: you're asking about [topic], right?\
Do you mean [option A] or [option B]?\
Sorry, I didn't catch the last part.\
Sorry, you cut out for a second. Could you say that again?

**Коли використовувати.** Завжди, коли є сумнів. Перепитати — нормально й професійно; відповісти впевнено, але не на те питання, — значно гірше.

**Найсильніший прийом — перефразувати питання своїми словами:** «Just to make sure I understand: you're asking how RTK Query decides when to refetch, right?». Так ти перевіряєш розуміння і заодно отримуєш кілька секунд на роздуми.

**Нюанси.** «I didn't catch that» означає «я не розчув», а «I'm not sure I understood» — «я не зрозумів зміст». Якщо незнайоме одне слово, перепитай саме його: «Sorry, what was the word after "cache"?».

**Типові помилки.** «What?» і «Repeat, please» звучать різко — додавай «Sorry» і «could you». Не вибачайся постійно за свою англійську: одного разу на початку більш ніж досить, а краще взагалі ні.

#### Пов’язані питання

- [Як ставити уточнювальні питання до задачі](#q-11-3)
- [Small talk на початку і ввічливе завершення співбесіди](#q-11-11)

## 11.3. Як ставити уточнювальні питання до задачі

<a id="q-11-3"></a>

Фрази для live coding, take-home завдання чи system design, коли умова неповна.

### Пояснення

#### Interview answer (EN)

Before I start, I'd like to clarify a few things.\
What should happen if the input is empty?\
Can I assume that the data is already sorted?\
Should I handle API errors, or can I assume the request always succeeds?\
Is it more important to optimize for readability or for performance here?\
Can I use a library for this, or would you like me to implement it from scratch?\
I'll assume that [assumption]. Please let me know if that's not the case.

**Коли використовувати.** На самому початку задачі: 2–4 питання про вхідні дані, edge cases, обмеження та очікуваний результат. Інтерв'юери часто навмисно дають неповну умову й перевіряють, чи ти це помітиш. Якщо відповіді немає, вголос зафіксуй припущення («I'll assume…») і рухайся далі.

**Граматика.** У прямому питанні — інверсія: «What is the expected output?». У непрямому, після «Could you tell me» чи «Do you know», — прямий порядок слів: «Could you tell me what the expected output is?», а не «…what is the expected output?».

**Типові помилки.** Десять питань поспіль замість того, щоб почати; питання, відповідь на які вже є в умові; «Can I to use…?» замість «Can I use…?».

#### Пов’язані питання

- [Як думати вголос під час live coding](#q-11-4)
- [How do you estimate task complexity?](../10-professional-experience/README.md#q-10-10)

## 11.4. Як думати вголос під час live coding

<a id="q-11-4"></a>

Фрази, щоб коментувати свої кроки, виграти час на роздуми, озвучувати припущення та складність алгоритму.

### Пояснення

#### Interview answer (EN)

Let me think about this for a moment.\
First, I'll write a simple solution that works, and then I'll see if I can optimize it.\
I'm going to start with the function signature and a couple of test cases.\
Here I'm using a map, so each lookup takes constant time.\
This loop goes through the array once, so the time complexity is O of n.\
Let me walk through this example to check the logic.\
I think there's a bug here. Let me fix it.\
If I had more time, I would add input validation and more tests.

**Навіщо.** Інтерв'юер оцінює хід думок, а не лише результат. Коли ти мовчиш, він не може ні оцінити міркування, ні підказати. Навіть неправильна ідея, озвучена вголос, дає шанс отримати підказку.

**Що коментувати.** Намір і рішення, а не кожне натискання клавіші: «I'm adding an early return for the empty case», а не «now I write const, now I write equals».

**Як вимовляти складність.** O(n) — «O of n» або «big O of n»; O(n²) — «O of n squared»; O(log n) — «O of log n»; O(1) — «constant time». Корисні слова: linear time, quadratic, extra space, in place, edge case, brute force.

**Щоб виграти час,** замість мовчання чи «ееее» скажи: «Let me think about it for a second» або «Give me a moment to think about the edge cases». Пауза в 5–10 секунд після такої фрази цілком нормальна.

#### Пов’язані питання

- [Як ставити уточнювальні питання до задачі](#q-11-3)
- [Реалізуй debounce](../09-live-coding/README.md#q-9-7)

## 11.5. Що сказати, коли не знаєш або забув відповідь

<a id="q-11-5"></a>

Як чесно визнати прогалину й при цьому показати хід думок.

### Пояснення

#### Interview answer (EN)

I haven't worked with that directly, but I know it's used for [purpose].\
I'm not completely sure, but I think it works like this: [your reasoning].\
I don't remember the exact name of the method, but the idea is [concept]. I would check it in the documentation.\
Let me reason about it from what I know about [related concept].\
I haven't had a chance to use it in production, but I'd be happy to learn more about it.\
Actually, I'd like to correct what I said earlier: [correction].

**Принцип.** Ніколи не вигадуй — досвідчений інтерв'юер помітить це за одне уточнення, і довіра до решти відповідей зникне. Чесне «не знаю» плюс міркування вголос сприймається значно краще, ніж впевнена неправда.

**Як відновитися.** Сказати, що знаєш поруч із темою, → поміркувати логічно → запропонувати, як би ти це перевірив. Якщо під час розмови зрозумів, що помилився раніше, виправ себе сам: «Actually, let me correct myself» — це показує зрілість.

**Нюанси.** «I don't remember the exact API» звучить краще, ніж «I forgot». «Actually» означає «насправді» або «взагалі-то», а не «актуально». Голе «I don't know» з паузою — найгірший варіант: додай хоча б одне речення про те, як би ти шукав відповідь.

#### Пов’язані питання

- [What do you do when you don't know how to implement something?](../10-professional-experience/README.md#q-10-8)

## 11.6. Як пояснювати trade-offs і висловлювати думку

<a id="q-11-6"></a>

Фрази для порівняння підходів, аргументації вибору й ввічливої незгоди.

### Пояснення

#### Interview answer (EN)

It depends on the use case.\
If the data changes often, I would choose [option A]. Otherwise, [option B] is simpler.\
The main trade-off here is between simplicity and flexibility.\
The downside of this approach is that [drawback].\
In my experience, [option A] works better for [situation], because [reason].\
I would lean towards [option A], but I'm open to other options.\
I see your point, but I'm a bit concerned about [risk].

**Коли використовувати.** На питання «What would you choose and why?», «Context or Redux?», «SSR or CSR?» і в обговореннях з командою.

**Структура.** Варіанти → критерії (розмір команди, частота змін, продуктивність, складність) → твоя рекомендація з причиною. «It depends» без продовження — червоний прапорець: одразу кажи, *від чого* залежить.

**Як м'яко висловлювати думку.** «I'd lean towards…», «I tend to prefer…», «I'm not sure that's the best fit for…», «I see your point, but…». Замість «X is bad» — «X is less suitable for this case because…».

**Типові помилки.** «It depends of» або «depends from» → «It depends on». «On my opinion» → «In my opinion». «I am agree» → «I agree».

#### Пов’язані питання

- [Коли варто використовувати локальний state, Context API або Redux?](../04-redux-toolkit/README.md#q-4-1)
- [Describe a disagreement with a teammate, designer, or PM](../10-professional-experience/README.md#q-10-13)

## 11.7. Як говорити про результати, цифри та вплив

<a id="q-11-7"></a>

Дієслова, прийменники й часи для розповіді про досягнення.

### Пояснення

#### Interview answer (EN)

I reduced the bundle size by [percentage] by lazy-loading [routes].\
We cut the number of duplicate requests on [page].\
I improved test coverage for [critical flow] from [value before] to [value after].\
I shipped [feature] to [number] users in [timeframe].\
This saved the team about [amount of time] per [sprint or release].\
As a result, we received noticeably fewer bug reports about [area].

**Сильні дієслова.** reduced, cut, improved, increased, sped up, shipped, launched, introduced, automated, migrated, simplified, eliminated, replaced, set up, led. Вони звучать конкретніше, ніж «did», «made» чи «worked on».

**Прийменники.** «by 30 percent» — на скільки змінилося; «from 4 seconds to 2 seconds» — з якого до якого значення; «to 2 seconds» — до якого значення. «Reduced by 2 seconds» і «reduced to 2 seconds» — різні речі.

**Часи.** Past simple — для завершеного з конкретним часом чи на минулій роботі: «Last year I migrated the API layer». Present perfect — для результату на поточній роботі без конкретного часу: «I've migrated three modules so far». З маркерами минулого часу (yesterday, last month, in 2024) present perfect не вживають.

**«I» чи «we».** Говори «we» про командний результат і «I» про свій внесок: «We migrated the app to RTK Query; I was responsible for the notifications and settings modules».

**Якщо точних цифр немає** — не вигадуй. Кажи «roughly», «about», «around», порівнюй відносно («twice as fast», «noticeably fewer») або описуй якісний ефект.

#### Пов’язані питання

- [Tell me about a time you improved performance or quality](../10-professional-experience/README.md#q-10-15)

#### Документація

- [British Council LearnEnglish — Present perfect](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/present-perfect)
- [Cambridge Grammar — Past simple or present perfect?](https://dictionary.cambridge.org/grammar/british-grammar/present-perfect-or-past-simple)

## 11.8. Типові помилки українськомовних у технічній англійській

<a id="q-11-8"></a>

Граматичні помилки й «фальшиві друзі перекладача», які найчастіше чути на співбесідах.

### Пояснення

#### Interview answer (EN)

I have three years of experience with React.\
I've been working at this company since 2023.\
I finished the migration last month.\
We made a decision to use RTK Query.\
I implemented a factory function for API clients.\
This is a relevant problem for our team.

**Граматика.**

| Неправильно | Правильно | Чому |
| --- | --- | --- |
| I have 3 years experience in React. | I have three years of experience with React. | Потрібне «of»; з інструментами природніше «experience with», з галуззю — «experience in frontend development» |
| I work in this company since 2023. | I've been working at this company since 2023. | Дія триває досі → present perfect continuous; компанія — «at» |
| I have finished the migration last month. | I finished the migration last month. | Є маркер минулого часу → past simple |
| I did a decision / I did a mistake. | I made a decision / I made a mistake. | Сталі колокації з «make» |
| I created component for form. | I created a component for the form. | Злічуваний іменник в однині потребує артикля |
| How it works? | How does it work? | Пряме питання потребує допоміжного дієслова |
| Explain me how it works. | Could you explain to me how it works? | «Explain» вживають з «to» |
| We discussed about it. | We discussed it. | «Discuss» без прийменника |
| I'm responsible of the frontend. | I'm responsible for the frontend. | «Responsible for» |
| I suggest to use memo here. | I suggest using memo here. | Після «suggest» — форма -ing або «that we use» |
| Thanks for the feedbacks and informations. | Thanks for the feedback and information. | Незлічувані іменники: feedback, information, advice |
| I am agree. | I agree. | «Agree» — дієслово, «am» не потрібне |
| It's possible to say that it's faster. | It's faster. / It's probably faster. | Калька з «можна сказати»; кажи прямо або з «probably», «usually» |

**Фальшиві друзі перекладача.**

| Неправильно | Правильно | Чому |
| --- | --- | --- |
| This is an actual problem. | This is a relevant problem. / This is a current issue. | «Actual» означає «справжній, фактичний», а не «актуальний» |
| I'm an accurate developer. | I'm a careful developer. / I pay attention to detail. | «Accurate» — «точний» (про дані, розрахунки), а не «акуратний» |
| a fabric function | a factory function | «Fabric» — «тканина», патерн називається factory |
| I realized this feature. | I implemented this feature. | «Realize» — «усвідомити», а «реалізувати» — implement або build |
| Eventually we can try Zustand. | We could possibly try Zustand. | «Eventually» — «зрештою, врешті-решт», а не «можливо» |
| I control the code quality. | I check the code quality. / I'm responsible for code quality. | «Control» — «керувати», для перевірки краще check, review, monitor |

**Артиклі коротко.** «A» — коли згадуєш щось уперше або одне з багатьох: «I fixed a bug». «The» — коли зрозуміло, про що саме йдеться: «The bug was in the selector». Без артикля — множина й незлічувані в загальному значенні: «I write tests», «Performance matters».

#### Документація

- [Cambridge Grammar — A/an and the](https://dictionary.cambridge.org/grammar/british-grammar/a-an-and-the)
- [Cambridge Grammar — Past simple or present perfect?](https://dictionary.cambridge.org/grammar/british-grammar/present-perfect-or-past-simple)
- [Cambridge Dictionary — actual](https://dictionary.cambridge.org/dictionary/english/actual)

## 11.9. Вимова частих технічних слів

<a id="q-11-9"></a>

Слова, які українськомовні розробники найчастіше вимовляють неправильно.

### Пояснення

#### Interview answer (EN)

The response is stored in the cache, so the next request is much faster.\
Each task waits in a queue until the worker is free.\
We set the width and the height of the image to avoid layout shifts.\
This value can be null, so we need to check it first.\
We run the whole test suite on every pull request.\
The router matches the route and renders the right page.\
We fetch the data asynchronously.

**Таблиця вимови.** IPA взято з Cambridge Dictionary (британський і американський варіанти), якщо не вказано інше. Наголос позначено знаком ˈ перед наголошеним складом.

| Слово | UK | US | Підказка |
| --- | --- | --- | --- |
| cache | /kæʃ/ | /kæʃ/ | Звучить так само, як cash; не «кеш-е» і не «кейш» |
| queue | /kjuː/ | /kjuː/ | Один склад, як назва літери Q |
| height | /haɪt/ | /haɪt/ | «Хайт», як у high; не «хейт» |
| width | /wɪtθ/ | /wɪtθ/, /wɪdθ/ | Наприкінці звук θ, як у think |
| null | /nʌl/ | /nʌl/ | «Нал», голосна як у bus; не «нуль» |
| suite | /swiːt/ | /swiːt/ | Як sweet; не плутати з suit /suːt/ |
| Linux | /ˈlɪn.əks/ | /ˈlɪn.əks/ | «Лінекс», наголос на першому складі; Cambridge Business English також подає /ˈlaɪnəks/ |
| GUI | /ˈɡuː.i/ | /ˈɡuː.i/ | «Ґу-і», одним словом |
| char | /tʃɑː(r)/ | /tʃɑːr/ | Словникова вимова слова char; у програмуванні вимовляють по-різному, тому найнадійніше сказати character /ˈkær.ək.tə(r)/ |
| SQL | /ˌes.kjuːˈel/ | /ˌes.kjuːˈel/ | По літерах S-Q-L або як слово sequel /ˈsiː.kw(ə)l/; обидва варіанти поширені |
| Vite | /viːt/ | /viːt/ | За документацією vite.dev: французьке слово «швидкий», «віт»; не «вайт» |
| async | /ˈeɪ.sɪŋk/ | /ˈeɪ.sɪŋk/ | Окремого запису в словнику немає; вимова складається з a- як в asynchronous /eɪˈsɪŋ.krə.nəs/ і sync /sɪŋk/ |
| route | /ruːt/ | /ruːt/, /raʊt/ | «Рут»; в американській англійській також «раут» |
| data | /ˈdeɪ.tə/ | /ˈdeɪ.t̬ə/ | «Дейта»; в американській також трапляються /ˈdæt̬·ə/ і /ˈdɑt̬·ə/ |
| deque | /dek/ | /dek/ | Зазвичай вимовляють як deck (за Wikipedia), а не «декью» |
| component | /kəmˈpəʊ.nənt/ | /kəmˈpoʊ.nənt/ | Наголос на другому складі |
| parameter | /pəˈræm.ɪ.tə(r)/ | /pəˈræm.ə.t̬ɚ/ | Наголос на другому складі, не «пара-метр» |
| integer | /ˈɪn.tɪ.dʒə(r)/ | /ˈɪn.tə.dʒɚ/ | Літера g тут звучить як /dʒ/: «інтіджер» |
| variable | /ˈveə.ri.ə.b(ə)l/ | /ˈver.i.ə.b(ə)l/ | Наголос на першому складі |
| hierarchy | /ˈhaɪə.rɑː.ki/ | /ˈhaɪ.rɑːr.ki/ | Наголос на першому складі |
| determine | /dɪˈtɜː.mɪn/ | /dɪˈtɝː.mɪn/ | Закінчення «-мін», а не «-майн» |
| method | /ˈmeθ.əd/ | /ˈmeθ.əd/ | Звук θ, а не «т» |
| tuple | /ˈtjuːp(ə)l/ | /ˈtuːp(ə)l/ | «Тюпл» (UK) або «тупл» (US) |

**Як тренуватися.** Відкрий слово в Cambridge Dictionary, послухай обидва аудіо й повтори вголос у реченні з англійського блоку вище. Зверни увагу: синтезатор мовлення в браузері не завжди правильно вимовляє назви інструментів (наприклад, Vite), тому для них орієнтуйся на таблицю та офіційну документацію.

#### Документація

- [Cambridge Dictionary — cache](https://dictionary.cambridge.org/dictionary/english/cache)
- [Vite — Getting Started](https://vite.dev/guide/)
- [Wikipedia — Double-ended queue](https://en.wikipedia.org/wiki/Double-ended_queue)

## 11.10. Глосарій frontend-дієслів і колокацій

<a id="q-11-10"></a>

Сталі словосполучення, якими англомовні розробники описують щоденну роботу.

### Пояснення

#### Interview answer (EN)

I opened a pull request and addressed the review comments.\
The component re-renders when its state changes or when its parent re-renders.\
We fetch the data with RTK Query and invalidate the cache after a mutation.\
After we shipped the feature, we noticed a regression, so we rolled back the release.\
I reproduced the bug locally and covered the fix with a test.\
I flagged the risk to the PM early, so we could reduce the scope.

| Колокація | Значення й приклад |
| --- | --- |
| render a component / re-render | Відрендерити компонент: «The list re-renders on every keystroke» |
| fetch data from an API | Отримати дані: «We fetch the user profile on mount» |
| ship a feature / ship to production | Випустити фічу: «We shipped the new checkout last sprint» |
| roll out / roll back a release | Поступово випустити або відкотити реліз: «We rolled back the release within ten minutes» |
| deploy to staging / to production | Задеплоїти: «The change is deployed to staging» |
| open (raise) a pull request | Створити PR; «raise» частіше кажуть у британській англійській, у GitLab це merge request |
| address review comments | Опрацювати коментарі рев'ю: «I've addressed all the comments» |
| approve / request changes | Погодити PR або попросити зміни |
| reproduce / fix a bug | Відтворити / виправити баг: «I can't reproduce it locally» |
| file a bug / open a ticket | Завести баг або тикет |
| introduce / catch a regression | Внести / помітити регресію |
| handle an edge case / handle errors | Обробити граничний випадок або помилки |
| cover something with tests | Покрити тестами: «The hook is covered with unit tests» |
| invalidate the cache | Інвалідувати кеш |
| lazy-load a route | Завантажувати маршрут ліниво |
| bump / upgrade a dependency | Оновити залежність: «I bumped React to 19.2» |
| deprecate an API | Позначити API застарілим |
| break down a task / estimate a task | Декомпозувати / оцінити задачу |
| be blocked by / unblock someone | Бути заблокованим / розблокувати когось: «I'm blocked by the backend» |
| flag a risk / raise a concern | Повідомити про ризик / висловити занепокоєння |
| take ownership of something | Взяти відповідальність: «I took ownership of the migration» |
| pair with someone | Працювати в парі: «I paired with a backend developer on the API contract» |
| hand over a task | Передати задачу іншій людині |

**Нюанси.** «Make a review» — калька; кажи «review the code» або «do a code review». «Push to production» розмовно означає деплой, але в Git «push» — це лише відправити коміти в віддалений репозиторій. «Merge» — злити гілку; не плутай із «deploy».

#### Пов’язані питання

- [Як говорити про результати, цифри та вплив](#q-11-7)

## 11.11. Small talk на початку і ввічливе завершення співбесіди

<a id="q-11-11"></a>

Що сказати в перші й останні хвилини розмови, щоб справити спокійне, впевнене враження.

### Пояснення

#### Interview answer (EN)

Hi, nice to meet you. Thanks for having me.\
I'm doing well, thanks. How about you?\
Yes, I can hear you clearly.\
Sorry, my connection seems unstable. Is it better now?\
Thank you for your time today. I really enjoyed our conversation.\
It was great to learn more about the team and the product.\
What are the next steps in the process?\
I look forward to hearing from you. Have a great rest of your day.

**Початок.** «How are you?» — це привітання, а не запит на детальну відповідь: коротко відповідай і повертай питання. Типові теми: як справи, звідки ти й у якому часовому поясі, чи добре чути. Одне-два речення — досить; інтерв'юер сам переведе розмову до справи. Якщо говорите з іншим часовим поясом, безпечніше привітатися «Hi» або «Hello», ніж «Good morning».

**Технічні проблеми.** «Sorry, you froze for a moment», «I think I lost you for a second», «Let me turn off my camera to improve the connection». Підготуй запасний варіант (мобільний інтернет, навушники) заздалегідь.

**Завершення.** Подякуй, коротко скажи, що тобі сподобалося в розмові, і спитай про наступні кроки, якщо цього ще не сказали. Короткий лист подяки рекрутеру після співбесіди — поширена практика, але не обов'язкова.

**Типові помилки.** «I'm fine, thank you, and you?» граматично правильно, але звучить як із підручника — «I'm doing well, thanks. How about you?» природніше. «Nice to meet you too» — лише як відповідь, а не першим. Не завершуй словами «That's all» — краще «Thank you, that's all from my side».

#### Пов’язані питання

- [What questions do you have for us?](../10-professional-experience/README.md#q-10-17)
- [Як перепитати, якщо не зрозумів або не розчув питання](#q-11-2)
