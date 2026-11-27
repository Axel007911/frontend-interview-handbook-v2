# TypeScript

## 2.1. У чому різниця між `type` та `interface`?

<a id="q-2-1"></a>

### Пояснення

#### Interview answer (EN)

Both can describe object shapes, and for most props and DTOs either one works. Interfaces support declaration merging, and their extends clause reports an error when a member is incompatible, so many teams prefer them for public object contracts. Type aliases are more general: they can name unions, primitives, tuples, mapped and conditional types. The main gotcha is that intersecting conflicting types with an ampersand doesn't fail; it quietly turns that property into never.

Обидва дозволяють описувати структуру даних.

```typescript
// Два альтернативні способи — в одному файлі вони конфліктували б
interface User {
  name: string;
  age: number;
}

type User = {
  name: string;
  age: number;
};
```

| Можливість | interface | type |
| --- | --- | --- |
| Опис об'єктів | Так | Так |
| Generics | Так | Так |
| Union types | Ні | Так |
| Розширення | `extends` — конфлікт полів дає помилку | `&` — конфлікт полів дає `never` |
| Declaration merging | Так | Ні |
| Опис примітивів, tuples | Ні | Так |
| Mapped і conditional types | Ні | Так |

Наприклад, `interface` можна доповнювати:

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// User містить name та age
```

Declaration merging використовують для розширення чужих типів, наприклад `Window` або типів бібліотеки через module augmentation.

А `type` дозволяє описувати union:

```typescript
type Status = "loading" | "success" | "error";
```

Різниця в обробці конфліктів:

```typescript
interface A { id: string }
interface B extends A { id: number }
// Error: Interface 'B' incorrectly extends interface 'A'

type C = { id: string } & { id: number };
// Помилки немає, але C["id"] — never: створити значення цього типу неможливо
```

У більшості React-проєктів для опису об'єктів можна використовувати обидва варіанти, дотримуючись єдиного стилю команди. Документація TypeScript пропонує евристику: використовувати `interface`, доки не знадобляться можливості `type`.

#### Можливі уточнення

- **Коли без `type` не обійтися?** — union, tuple, mapped і conditional types, аліас для примітива чи функції.
- **Що таке declaration merging і де він корисний?** — кілька оголошень `interface` з одним іменем об'єднуються; так розширюють глобальні типи й типи бібліотек.

#### Пов’язані питання

- [Що таке Union та Intersection types?](#q-2-5)

#### Документація

- [TypeScript — Differences Between Type Aliases and Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)
- [TypeScript — Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)

## 2.2. Чим відрізняються `any`, `unknown`, `never` та `void`?

<a id="q-2-2"></a>

### Пояснення

#### Interview answer (EN)

Any switches type checking off and spreads silently through the code, whereas unknown is its safe counterpart: anything can be assigned to it, but you must narrow it before use. Never is the empty type, used for functions that never return and for exhaustive checks, where the compiler proves that no case is left unhandled. Void means that a function's return value isn't meant to be used, which is why a callback typed as returning void may still return something.

| Тип | Призначення |
| --- | --- |
| `any` | Вимикає більшість перевірок типів |
| `unknown` | Невідомий тип, який необхідно перевірити |
| `never` | Значення, яке не може існувати |
| `void` | Результат функції, значення якого не використовується |

```typescript
let a: any = 10;
a.toUpperCase(); // TS дозволить, runtime error
```

```typescript
let b: unknown = 10;

if (typeof b === "string") {
  b.toUpperCase();
}
```

```typescript
function throwError(): never {
  throw new Error("Error");
}

function logMessage(): void {
  console.log("Hello");
}
```

`unknown` безпечніший за `any`, тому що змушує розробника перевірити тип перед використанням. Це правильний тип для `JSON.parse`, відповідей API до валідації та помилки в `catch` (у `strict` режимі `catch (error)` має тип `unknown`).

`never` також з'являється, коли TypeScript вичерпав усі варіанти union. На цьому побудована exhaustive check у [discriminated union](#q-2-8).

`void` для callbacks не забороняє повертати значення — його просто ігнорують:

```typescript
const result: number[] = [];

[1, 2].forEach((n) => result.push(n)); // OK: push повертає number, forEach очікує void
```

#### Можливі уточнення

- **Чому `any` «заразний»?** — усе, що отримано з `any` (властивості, результати викликів), теж стає `any`, і помилки поширюються непомітно.
- **Чим `void` відрізняється від `undefined`?** — `void` означає «результат не використовується», а `undefined` — конкретне значення, яке функція має повернути.

#### Пов’язані питання

- [Що таке discriminated union?](#q-2-8)
- [Як працюють Type Guards?](#q-2-7)

#### Документація

- [TypeScript — More on Functions: unknown](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)
- [TypeScript — More on Functions: never](https://www.typescriptlang.org/docs/handbook/2/functions.html#never)
- [TypeScript — Narrowing: Exhaustiveness checking](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking)

## 2.3. Що таке generics? Наведи практичний приклад.

<a id="q-2-3"></a>

### Пояснення

#### Interview answer (EN)

Generics are type parameters: they let one function, component or type work with many types while keeping the relationship between input and output. TypeScript usually infers them from the arguments, and constraints written with extends limit what can be passed, for example requiring a key of a given object. Unlike any, a generic keeps the exact type, so a typed API wrapper or a reusable list component stays fully checked.

Generics дозволяють створювати універсальний код, зберігаючи інформацію про конкретний тип.

```typescript
function identity<T>(value: T): T {
  return value;
}

let a = identity("Hello"); // string
let b = identity(123);     // number
const c = identity("Hi");  // "Hi" — у const літеральний тип зберігається
```

Практичний приклад для API:

```typescript
type ApiResponse<T> = {
  data: T;
  status: number;
};

type UsersResponse = ApiResponse<User[]>;
type ProductResponse = ApiResponse<Product>;
```

Constraint через `extends` обмежує допустимі типи:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Alex" };

getProperty(user, "name");  // string
getProperty(user, "email"); // Error: "email" не є ключем user
```

Параметр типу може мати значення за замовчуванням: `type ApiResponse<T = unknown>`.

На відміну від `any`, generics зберігають зв'язок між вхідними та вихідними типами. Якщо параметр типу використовується лише в одному місці, він, найімовірніше, не потрібен — це одна з порад документації TypeScript.

#### Можливі уточнення

- **Що таке generic constraint?** — `T extends Something` обмежує T типами, що мають потрібну структуру, і дає доступ до її членів.
- **Як зробити generic React-компонент?** — оголосити параметр типу у функції компонента: `function List<T>(props: ListProps<T>)`.

#### Пов’язані питання

- [Як працюють `keyof` та `typeof` у TypeScript?](#q-2-10)
- [TypeScript Generics](../09-live-coding/README.md#q-9-6)
- [Як типізувати React-компоненти?](#q-2-15)

#### Документація

- [TypeScript — Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript — Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)

## 2.4. Як працюють `Partial`, `Required`, `Pick`, `Omit`, `Record`?

<a id="q-2-4"></a>

### Пояснення

#### Interview answer (EN)

Utility types are built-in generic helpers that derive new types from existing ones instead of duplicating them. Partial and Required change optionality, Pick and Omit select or exclude keys, Readonly marks properties as non-writable at compile time, and Record builds an object type from a key type and a value type. A good example is deriving a create payload with Omit and an update payload with Partial from a single entity type.

```typescript
type User = {
  id: number;
  name: string;
  email: string;
};
```

| Utility Type | Результат |
| --- | --- |
| `Partial<User>` | Усі поля необов'язкові |
| `Required<User>` | Усі поля обов'язкові |
| `Pick<User, "id">` | Лише поле id |
| `Omit<User, "id">` | Усі поля, крім id |
| `Readonly<User>` | Забороняє переприсвоєння полів на рівні TS |
| `Record<string, User>` | Об'єкт із рядковими ключами та значеннями User |

Практичний приклад:

```typescript
type CreateUser = Omit<User, "id">;

type UpdateUser = Partial<CreateUser>;
```

Це дозволяє не дублювати типи для створення та редагування сутностей.

Інші корисні utility types: `ReturnType<typeof fn>`, `Parameters<typeof fn>`, `Awaited<T>`, `NonNullable<T>`, `Exclude<Union, Member>`, `Extract<Union, Member>`.

Нюанси:

- `Partial` і `Readonly` поверхневі: вкладені об'єкти не змінюються.
- `Omit` не перевіряє, що ключ існує: `Omit<User, "emial">` скомпілюється без помилки.
- `Record<string, User>` обіцяє значення для будь-якого ключа; щоб читання давало `User | undefined`, вмикають `noUncheckedIndexedAccess`.

#### Пов’язані питання

- [Що таке mapped types і template literal types?](#q-2-14)
- [Які опції `tsconfig` для суворої перевірки важливі й чому?](#q-2-16)

#### Документація

- [TypeScript — Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## 2.5. Що таке Union та Intersection types?

<a id="q-2-5"></a>

### Пояснення

#### Interview answer (EN)

A union type means a value is one of several types, so until you narrow it, you can only use what all the variants have in common. An intersection combines several types into one that must satisfy all of them at once, which is a common way to compose props or add fields to an existing type. If the combined types disagree on a property, that property becomes never, and an intersection of incompatible primitives like string and number is never altogether.

Union (`|`) означає один із можливих типів.

```typescript
type ID = string | number;

function printId(id: ID) {
  id.toUpperCase(); // Error: у number немає toUpperCase
  console.log(String(id)); // OK — працює для обох варіантів
}
```

Intersection (`&`) означає поєднання вимог декількох типів.

```typescript
type User = {
  name: string;
};

type Employee = {
  salary: number;
};

type Worker = User & Employee;

const worker: Worker = {
  name: "Alex",
  salary: 5000
};
```

Несумісні intersection types можуть призводити до `never`:

```typescript
type Impossible = string & number; // never
```

#### Пов’язані питання

- [Що таке Type Narrowing?](#q-2-6)
- [У чому різниця між `type` та `interface`?](#q-2-1)

#### Документація

- [TypeScript — Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [TypeScript — Intersection Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types)

## 2.6. Що таке Type Narrowing?

<a id="q-2-6"></a>

### Пояснення

#### Interview answer (EN)

Narrowing is how TypeScript refines a broad type into a more specific one inside a branch, based on control-flow analysis of ordinary runtime checks. It understands typeof, instanceof, the in operator, equality and truthiness checks, early returns, assignments and discriminant properties. Truthiness checks deserve extra care, because they exclude zero and empty strings along with null and undefined, which can quietly route valid values into the wrong branch.

Type Narrowing — звуження загального типу до конкретнішого за допомогою перевірок.

```typescript
function print(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
```

TypeScript аналізує виконані перевірки та визначає, який тип доступний у конкретній гілці коду.

| Перевірка | Приклад |
| --- | --- |
| `typeof` | `typeof value === "string"` |
| `instanceof` | `error instanceof Error` |
| `in` | `"data" in response` |
| Рівність | `value === null`, `state.status === "success"` |
| Truthiness | `if (user)` |
| `Array.isArray` | `Array.isArray(value)` |
| Early return | `if (!user) return;` — далі `user` вже не `null` |

Пастка truthiness:

```typescript
function format(count: number | null) {
  if (!count) return "—"; // 0 теж потрапить сюди
  return count.toFixed(0);
}
// Точніше: if (count === null) return "—";
```

З TypeScript 5.5 компілятор сам виводить type predicate для простих функцій, тому `[1, null, 2].filter((x) => x !== null)` має тип `number[]`.

#### Пов’язані питання

- [Як працюють Type Guards?](#q-2-7)
- [Що таке discriminated union?](#q-2-8)

#### Документація

- [TypeScript — Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript 5.5 — Inferred Type Predicates](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#inferred-type-predicates)

## 2.7. Як працюють Type Guards?

<a id="q-2-7"></a>

### Пояснення

#### Interview answer (EN)

A type guard is a runtime check that the compiler understands, so after it the value has a narrower type. Built-in guards like typeof, instanceof and in cover most cases, and for custom checks you write a function whose return type is a predicate such as value is User. The compiler trusts that predicate blindly, so a sloppy implementation creates false confidence. Assertion functions with asserts are a related tool: they throw instead of returning a boolean.

Type Guard — перевірка, яка дозволяє TypeScript звузити тип значення.

Вбудовані перевірки: `typeof`, `instanceof`, `in`, перевірка на рівність.

Також можна створювати власні:

```typescript
type User = {
  name: string;
};

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string"
  );
}
```

```typescript
if (isUser(data)) {
  console.log(data.name);
}
```

Важливо, що TypeScript довіряє результату custom type guard, тому його реалізація має справді перевіряти необхідні властивості.

**Assertion function** не повертає boolean, а кидає помилку, якщо умова не виконується. Після виклику тип звужується до кінця області видимості:

```typescript
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value == null) {
    throw new Error("Value is missing");
  }
}

assertIsDefined(user);
user.name; // user уже не null і не undefined
```

Для складних даних з API ручні guards швидко розростаються — тоді краще схема валідації (Zod, Valibot).

#### Пов’язані питання

- [Що таке Type Narrowing?](#q-2-6)
- [Чи перевіряє TypeScript типи даних, отриманих від API?](#q-2-12)

#### Документація

- [TypeScript — Using type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- [TypeScript 3.7 — Assertion Functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)

## 2.8. Що таке discriminated union?

<a id="q-2-8"></a>

### Пояснення

#### Interview answer (EN)

A discriminated union is a union of object types that share a literal property, such as status or type, with a different value in each variant. Checking that property narrows the value to one variant, so only its fields are available, and impossible states, like having data and an error at the same time, become unrepresentable. Adding a never-typed exhaustive check in the default branch turns a forgotten case into a compile error as soon as someone adds a new variant.

Union об'єктів, які мають спільне поле-дискримінатор для визначення конкретного типу.

```typescript
type State =
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; error: string };
```

```typescript
function render(state: State) {
  switch (state.status) {
    case "loading":
      return "Loading";

    case "success":
      return state.data;

    case "error":
      return state.error;

    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}
```

Exhaustive check: у гілці `default` усі варіанти вже вичерпано, тому `state` має тип `never`. Якщо додати в `State` новий варіант, наприклад `{ status: "idle" }`, і забути `case`, присвоєння в `never` дасть помилку компіляції.

Порівняйте з «мішком optional-полів», який дозволяє неможливі комбінації:

```typescript
type BadState = {
  isLoading: boolean;
  data?: User[];
  error?: string;
}; // можна isLoading: true разом з error і data
```

Особливо корисний для API responses, Redux state, UI states та state machines. Redux actions теж є discriminated union за полем `type`.

#### Можливі уточнення

- **Як змусити компілятор нагадати про новий варіант union?** — exhaustive check через `never` у `default`.
- **Чим це краще за кілька boolean-прапорців?** — n прапорців дають 2ⁿ комбінацій, більшість з яких неможливі; union описує лише допустимі стани.

#### Пов’язані питання

- [Чим відрізняються `any`, `unknown`, `never` та `void`?](#q-2-2)
- [Що таке Type Narrowing?](#q-2-6)

#### Документація

- [TypeScript — Discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [TypeScript — Exhaustiveness checking](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking)

## 2.9. У чому різниця між `as` та `satisfies`?

<a id="q-2-9"></a>

### Пояснення

#### Interview answer (EN)

A type assertion with as overrides what the compiler believes about a value; it's allowed whenever the types overlap enough, so it can hide real mistakes. Satisfies checks that an expression matches a type but keeps the expression's own, more precise inferred type, so you get validation and autocompletion without widening. Combined with as const, it produces readonly literal types that are still checked against the contract. Neither of them validates anything at runtime.

`as` — type assertion. Дозволяє повідомити TypeScript, що значення потрібно розглядати як певний тип.

`satisfies` перевіряє відповідність типу, зберігаючи точнішу інформацію про тип самого виразу.

```typescript
type Config = {
  theme: "dark" | "light";
};

const config = {
  theme: "dark"
} satisfies Config;
```

Тут TypeScript знає, що `config.theme` має конкретний тип `"dark"`, а не просто `"dark" | "light"`.

| Запис | Тип `config.theme` | Перевірка |
| --- | --- | --- |
| `const config: Config = { theme: "dark" }` | `"dark" \| "light"` | Так |
| `const config = { theme: "dark" } satisfies Config` | `"dark"` | Так |
| `const config = {} as Config` | `"dark" \| "light"` | Ні — компілюється, хоча `theme` відсутній |

`as` може приховати помилки типізації, тоді як `satisfies` допомагає їх виявити. Жоден із них не виконує runtime validation.

**`as const satisfies`** — популярна комбінація для конфігів і словників: значення стають readonly-літералами, а форма перевіряється:

```typescript
const routes = {
  home: "/",
  profile: "/profile"
} as const satisfies Record<string, `/${string}`>;

type RoutePath = (typeof routes)[keyof typeof routes]; // "/" | "/profile"
```

Подвійне приведення `value as unknown as Something` і non-null assertion `value!` — сигнали, що типи розходяться з реальністю; на code review їх варто ставити під питання.

#### Пов’язані питання

- [Як працюють `keyof` та `typeof` у TypeScript?](#q-2-10)
- [Чим відрізняються `enum`, union рядкових літералів та об'єкт `as const`?](#q-2-13)

#### Документація

- [TypeScript 4.9 — The satisfies Operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator)
- [TypeScript — Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

## 2.10. Як працюють `keyof` та `typeof` у TypeScript?

<a id="q-2-10"></a>

### Пояснення

#### Interview answer (EN)

Keyof takes an object type and produces a union of its property names as literal types. Typeof in a type position goes in the other direction: it reads the static type of an existing JavaScript value. Together, keyof typeof turns a runtime object, such as a config or a lookup map, into a union of its keys, so the values and the types stay in sync automatically from a single source of truth.

`keyof` отримує union ключів типу.

```typescript
type User = {
  name: string;
  age: number;
};

type UserKey = keyof User;
// "name" | "age"
```

`typeof` у контексті типізації отримує тип існуючого значення. Це не те саме, що JavaScript-оператор `typeof` у runtime, який повертає рядок на кшталт `"object"`.

```typescript
const config = {
  timeout: 1000,
  enabled: true
};

type Config = typeof config;
```

Їх можна комбінувати:

```typescript
type ConfigKey = keyof typeof config;
// "timeout" | "enabled"
```

Indexed access type `T[K]` дає тип значень:

```typescript
const STATUS = {
  idle: "Очікування",
  loading: "Завантаження"
} as const;

type StatusKey = keyof typeof STATUS;                 // "idle" | "loading"
type StatusLabel = (typeof STATUS)[keyof typeof STATUS]; // "Очікування" | "Завантаження"
```

Для типу з index signature `{ [key: string]: number }` результат `keyof` — `string | number`, бо числові ключі в JavaScript перетворюються на рядки.

#### Пов’язані питання

- [Що таке generics?](#q-2-3)
- [Що таке mapped types і template literal types?](#q-2-14)

#### Документація

- [TypeScript — Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
- [TypeScript — Typeof Type Operator](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)
- [TypeScript — Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

## 2.11. Що таке conditional types?

<a id="q-2-11"></a>

### Пояснення

#### Interview answer (EN)

A conditional type works like a ternary operator at the type level: if one type is assignable to another, it resolves to the first branch, otherwise to the second. Inside the condition, infer lets you extract part of a type, such as an array element or the value a promise resolves to. When the checked type is a bare type parameter, the condition distributes over each member of a union, which is how built-ins like Exclude, Extract and NonNullable work.

Типи, результат яких залежить від виконання певної умови на рівні типізації.

```typescript
type IsString<T> =
  T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

Практичний приклад із `infer`:

```typescript
type ArrayItem<T> =
  T extends (infer U)[] ? U : never;

type Item = ArrayItem<string[]>;
// string

type MyReturnType<T> =
  T extends (...args: any[]) => infer R ? R : never;
```

**Distributive conditional types:** якщо `T` — «голий» параметр типу, умова застосовується до кожного члена union окремо. Обгортка в tuple вимикає це:

```typescript
type ToArray<T> = T extends unknown ? T[] : never;
type A = ToArray<string | number>; // string[] | number[]

type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;
type B = ToArrayNonDist<string | number>; // (string | number)[]
```

Багато вбудованих utility types реалізовано за допомогою conditional types: `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Awaited`. У прикладному коді вони потрібні рідше, ніж у бібліотеках, і складні умовні типи варто пояснювати назвою або коментарем.

#### Документація

- [TypeScript — Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [TypeScript — Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)

## 2.12. Чи перевіряє TypeScript типи даних, отриманих від API, під час виконання програми?

<a id="q-2-12"></a>

### Пояснення

#### Interview answer (EN)

No. TypeScript types are erased during compilation, so annotating the result of response.json() as User is only a promise to the compiler, not a check. Anything that crosses a trust boundary, like API responses, local storage or URL parameters, should be validated at runtime with a schema library such as Zod or Valibot, or with hand-written guards. With Zod, I define the schema once, derive the static type with z.infer and use safeParse to handle invalid data without exceptions.

Ні. TypeScript працює на етапі статичного аналізу. Після компіляції інформація про типи видаляється.

```typescript
const user: User = await response.json();
```

Цей запис не гарантує, що сервер справді повернув `User`. Він компілюється лише тому, що `response.json()` повертає `Promise<any>`.

Для runtime validation можна використовувати Zod, Valibot або власні перевірки.

```typescript
import * as z from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email() // Zod 4; у Zod 3 — z.string().email()
});

type User = z.infer<typeof UserSchema>; // тип виводиться зі схеми, без дублювання

const result = UserSchema.safeParse(await response.json());

if (!result.success) {
  console.error(result.error.issues);
} else {
  const user: User = result.data;
}
```

- `parse()` кидає `ZodError`, якщо дані не відповідають схемі.
- `safeParse()` не кидає, а повертає discriminated union `{ success: true, data } | { success: false, error }`.

Свіжі версії RTK Query 2.x підтримують валідацію через Standard Schema-сумісні схеми (Zod, Valibot) в опції endpoint `responseSchema`.

Це важливе питання для Middle: типізація API не дорівнює валідації API.

#### Можливі уточнення

- **Де саме валідувати дані?** — на межі довіри: у шарі API-клієнта, щоб решта застосунку працювала з уже перевіреними типами.
- **Чим `parse` відрізняється від `safeParse`?** — перший кидає виняток, другий повертає результат з полем `success`.

#### Пов’язані питання

- [Як працюють Type Guards?](#q-2-7)
- [Що таке discriminated union?](#q-2-8)

#### Документація

- [Zod — Basic usage](https://zod.dev/basics)
- [Redux Toolkit — RTK Query: Usage With TypeScript](https://redux-toolkit.js.org/rtk-query/usage-with-typescript)

## 2.13. Чим відрізняються `enum`, union рядкових літералів та об'єкт `as const`?

<a id="q-2-13"></a>

### Пояснення

#### Interview answer (EN)

An enum is one of the few TypeScript features that generates runtime code: it creates a real object, and numeric enums also get a reverse mapping and accept any number variable. A union of string literals has zero runtime cost and works naturally with narrowing, while an as const object gives you runtime values to iterate over plus a derived union type. Since Node's built-in type stripping and the erasableSyntaxOnly flag reject enums, many teams now prefer literal unions or as const objects.

```typescript
// enum — компілюється в JavaScript-об'єкт
enum Status {
  Idle = "idle",
  Loading = "loading"
}

// union літералів — існує лише на рівні типів
type StatusUnion = "idle" | "loading" | "success";

// об'єкт as const — значення в runtime + тип з нього
const STATUS = {
  Idle: "idle",
  Loading: "loading",
  Success: "success"
} as const;

type StatusValue = (typeof STATUS)[keyof typeof STATUS]; // "idle" | "loading" | "success"
```

| | `enum` | Union літералів | Об'єкт `as const` |
| --- | --- | --- | --- |
| Runtime-код | Є | Немає | Звичайний JS-об'єкт |
| Перелік значень у runtime | Так | Ні | `Object.values(STATUS)` |
| Можна передати рядок `"idle"` | Ні для string enum (номінальна поведінка) | Так | Так |
| Сумісність із type stripping | Ні | Так | Так |

Пастки enum:

- Numeric enum має reverse mapping (`Direction[0] === "Up"`) і приймає будь-яку змінну типу `number`.
- String enum номінальний: значення з API (`"idle"`) не можна просто присвоїти змінній типу `Status`.
- `const enum` вбудовується в код, але погано поєднується з `isolatedModules`, тобто з Vite, esbuild і Babel, які транспілюють кожен файл окремо.

Опція `erasableSyntaxOnly` (TypeScript 5.8) забороняє синтаксис, який не можна просто «стерти»: `enum`, `namespace` з runtime-кодом, parameter properties у класах. Саме такий код не запускається через вбудований type stripping у Node.js, який замінює типи пробілами й не генерує новий JavaScript.

#### Можливі уточнення

- **Як отримати масив усіх значень для `<select>`?** — `Object.values(STATUS)` з об'єкта `as const`; з union літералів значень у runtime немає.
- **Коли enum все ще прийнятний?** — у наявному коді або коли команда свідомо його використовує й збирає проєкт повноцінним компілятором.

#### Пов’язані питання

- [У чому різниця між `as` та `satisfies`?](#q-2-9)
- [Як працюють `keyof` та `typeof` у TypeScript?](#q-2-10)

#### Документація

- [TypeScript — Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
- [TypeScript — TSConfig: erasableSyntaxOnly](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly)
- [Node.js — Modules: TypeScript](https://nodejs.org/api/typescript.html)

## 2.14. Що таке mapped types і template literal types?

<a id="q-2-14"></a>

### Пояснення

#### Interview answer (EN)

A mapped type builds a new object type by iterating over a union of keys, usually keyof an existing type, and transforming each property. You can add or remove the readonly and optional modifiers, including stripping them with a minus prefix, and rename keys with an as clause. Template literal types do for string literal types what template strings do for values, so together they can generate names like onChange or getUser from an existing type.

Mapped type проходить по ключах і будує новий тип. Так влаштовані `Partial`, `Required`, `Readonly`, `Record`.

```typescript
type User = { id: number; name: string; email?: string };

type MyPartial<T> = { [K in keyof T]?: T[K] };
type Mutable<T> = { -readonly [K in keyof T]: T[K] };   // прибрати readonly
type Concrete<T> = { [K in keyof T]-?: T[K] };          // прибрати optional
```

**Key remapping через `as`** перейменовує або відфільтровує ключі:

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getId: () => number; getName: () => string; getEmail?: () => string | undefined }

type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
```

**Template literal types** будують рядкові літерали:

```typescript
type EventName = `on${Capitalize<"click" | "focus">}`; // "onClick" | "onFocus"
type CssPx = `${number}px`;

const width: CssPx = "120px"; // OK
const height: CssPx = "120";  // Error
```

Для union у шаблоні TypeScript будує всі комбінації, тому дуже великі union можуть сповільнити перевірку типів.

#### Пов’язані питання

- [Як працюють `Partial`, `Required`, `Pick`, `Omit`, `Record`?](#q-2-4)
- [Як працюють `keyof` та `typeof` у TypeScript?](#q-2-10)

#### Документація

- [TypeScript — Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [TypeScript — Key Remapping via as](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as)
- [TypeScript — Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

## 2.15. Як типізувати React-компоненти: props, children, події та generic-компоненти?

<a id="q-2-15"></a>

### Пояснення

#### Interview answer (EN)

I describe props with a type or an interface and annotate the destructured parameter, instead of reaching for React.FC, which adds little nowadays. Children are typed as React.ReactNode, event handlers use React's event types such as ChangeEvent of HTMLInputElement, and wrappers around native elements extend ComponentProps of 'button', so every native attribute is accepted. For reusable lists or selects, a generic component keeps the item type connected to its render and change callbacks.

```tsx
import { useState, type ChangeEvent, type ComponentProps, type ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

Обгортка над нативним елементом успадковує всі його атрибути:

```tsx
type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
};

function Button({ variant = "primary", ...rest }: ButtonProps) {
  return <button data-variant={variant} {...rest} />;
}
```

Події:

```tsx
function SearchInput() {
  const [query, setQuery] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return <input value={query} onChange={handleChange} />;
}
```

Якщо обробник написаний inline (`onChange={(e) => ...}`), тип події виводиться автоматично.

Generic-компонент:

```tsx
type ListProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
};

function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// T виводиться з items: renderItem знає, що user — це User
<List items={users} getKey={(user) => user.id} renderItem={(user) => user.name} />;
```

Інші типові випадки:

- `useState<User | null>(null)` — коли початкове значення не описує всіх можливих станів.
- `useRef<HTMLInputElement>(null)` — ref на DOM-елемент.
- У React 19 `ref` — звичайний prop функціонального компонента, тож для нових компонентів `forwardRef` не потрібен.
- Стрілковий generic-компонент у `.tsx` пишуть як `<T,>(props: ListProps<T>) => ...`, щоб `<T>` не сприймався як JSX.

#### Можливі уточнення

- **Чому не `React.FC`?** — він нічого не додає до звичайної анотації props, а до React 18 ще й неявно додавав `children`.
- **Чим `ReactNode` відрізняється від `ReactElement`?** — `ReactNode` — усе, що можна відрендерити (рядки, числа, `null`, масиви, елементи); `ReactElement` — лише результат JSX.

#### Пов’язані питання

- [Що таке generics?](#q-2-3)
- [Що таке controlled та uncontrolled components?](../03-react/README.md#q-3-15)

#### Документація

- [React — Using TypeScript](https://react.dev/learn/typescript)
- [React — Typing DOM events](https://react.dev/learn/typescript#typing-dom-events)
- [React — Typing children](https://react.dev/learn/typescript#typing-children)

## 2.16. Які опції `tsconfig` для суворої перевірки важливі й чому?

<a id="q-2-16"></a>

### Пояснення

#### Interview answer (EN)

The strict flag enables a whole family of checks, the most important being strictNullChecks, which makes null and undefined separate types, and noImplicitAny, which forbids silently untyped parameters. On top of strict, I like noUncheckedIndexedAccess, because reading an array element or a record key then includes undefined, which matches runtime reality. ExactOptionalPropertyTypes goes further: an optional property may be missing, but it can't be explicitly set to undefined. In an existing codebase, these flags are usually enabled gradually.

| Опція | Що дає | У `strict`? |
| --- | --- | --- |
| `strictNullChecks` | `null` і `undefined` — окремі типи; треба перевіряти перед використанням | Так |
| `noImplicitAny` | Помилка, якщо тип не вказано й не виведено (неявний `any`) | Так |
| `strictFunctionTypes` | Сувора (контраваріантна) перевірка параметрів функціональних типів, крім методів | Так |
| `useUnknownInCatchVariables` | `catch (error)` має тип `unknown` | Так |
| `strictPropertyInitialization` | Поля класу мають бути ініціалізовані | Так |
| `noUncheckedIndexedAccess` | `arr[i]` і `record[key]` повертають `T \| undefined` | Ні |
| `exactOptionalPropertyTypes` | `prop?: T` не можна явно присвоїти `undefined` | Ні |

```typescript
const users: User[] = [];
const first = users[0];
// без noUncheckedIndexedAccess: User — і runtime-помилка на first.name
// з опцією: User | undefined — компілятор змусить перевірити

type Settings = { theme?: "dark" | "light" };
const settings: Settings = { theme: undefined };
// помилка лише з exactOptionalPropertyTypes
```

Починаючи з TypeScript 6.0, `strict` увімкнено за замовчуванням, а `module` за замовчуванням — `esnext`. Ще одна зміна 6.0, яка ламає старі конфіги: `types` за замовчуванням `[]`, тож глобальні типи на кшталт `@types/node` чи типів тест-раннера треба перелічити явно. TypeScript 7 — це той самий мовний рівень, але компілятор переписано нативно (на Go), тому перевірка типів значно швидша. У legacy-коді, де стояв `strict: false`, опції вмикають поступово: спочатку `noImplicitAny` і `strictNullChecks`, виправляючи помилки модуль за модулем.

Для проєктів, де TypeScript транспілюють окремі інструменти (Vite, esbuild, SWC, Oxc), також важливі `isolatedModules` (кожен файл має транспілюватися окремо) і `verbatimModuleSyntax` (явне `import type` для типів).

#### Можливі уточнення

- **Чому `noUncheckedIndexedAccess` не входить у `strict`?** — він додає багато перевірок у наявний код, тому його вмикають свідомо.
- **Що таке `skipLibCheck`?** — пропуск перевірки `.d.ts` бібліотек; пришвидшує збірку, але може приховати конфлікти типів у залежностях.
- **Що змінилося в TypeScript 6.0?** — нові значення за замовчуванням (`strict: true`, `module: esnext`, `types: []`) і видалення застарілих опцій; при оновленні проєкту читай release notes.

#### Пов’язані питання

- [Як працюють async/await і як обробляти в них помилки?](../01-javascript/README.md#q-1-18)
- [Як працюють `Partial`, `Required`, `Pick`, `Omit`, `Record`?](#q-2-4)

#### Документація

- [TypeScript — TSConfig: strict](https://www.typescriptlang.org/tsconfig/#strict)
- [TypeScript — TSConfig: noUncheckedIndexedAccess](https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess)
- [TypeScript — TSConfig: exactOptionalPropertyTypes](https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes)
- [TypeScript 6.0 — Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)

## 2.17. Що таке структурна типізація та excess property checks?

<a id="q-2-17"></a>

### Пояснення

#### Interview answer (EN)

TypeScript uses structural typing: a value is compatible with a type if it has all the required members, no matter what the type is called or where the value came from. That's convenient, because any object with the right shape can be passed, but it also means extra properties are normally accepted. The exception is excess property checking, which applies only to fresh object literals assigned directly and catches typos; the same object passed through a variable is accepted.

```typescript
type Point = { x: number; y: number };

function draw(point: Point) {}

const point3d = { x: 1, y: 2, z: 3 };

draw(point3d);              // OK — структура сумісна, зайве поле не заважає
draw({ x: 1, y: 2, z: 3 }); // Error: Object literal may only specify known properties
```

Наслідки:

- Два типи з різними іменами, але однаковою структурою, взаємозамінні.
- Класи теж порівнюються структурно (крім `private` і `protected` полів).
- Excess property check ловить помилки на кшталт `{ colour: "red" }` замість `color`, але тільки для літерала, переданого напряму.

Коли потрібна «номінальність» (щоб `UserId` не можна було переплутати з `OrderId`), використовують branded types:

```typescript
type UserId = string & { readonly __brand: "UserId" };

function toUserId(value: string): UserId {
  return value as UserId;
}
```

#### Можливі уточнення

- **Чому зайве поле в змінній не дає помилки?** — excess property check працює лише для «свіжих» об'єктних літералів; в інших випадках діє звичайна структурна сумісність.
- **Як відрізнити два id однакового типу `string`?** — branded types.

#### Документація

- [TypeScript — Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
- [TypeScript — Excess Property Checks](https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks)

## 2.18. Коли використовувати function overloads, union-параметри або generics?

<a id="q-2-18"></a>

### Пояснення

#### Interview answer (EN)

I start with the simplest signature that describes the function honestly. If the return type doesn't depend on the input, a union parameter is enough; if the output follows the input type, a generic captures that link. Overloads are for cases where specific input shapes map to different return types that a single generic can't express neatly. They carry a maintenance cost, though: callers can't use the implementation signature, so a value typed as the full union matches no overload.

```typescript
// union: результат не залежить від типу аргументу
function formatId(id: string | number): string {
  return String(id);
}

// generic: результат повторює тип аргументу
function first<T>(items: T[]): T | undefined {
  return items[0];
}

// overloads: різні вхідні дані → різні типи результату
function parse(value: string): number;
function parse(value: string[]): number[];
function parse(value: string | string[]): number | number[] {
  return Array.isArray(value) ? value.map(Number) : Number(value);
}

const a = parse("1");        // number
const b = parse(["1", "2"]); // number[]

declare const input: string | string[];
parse(input); // Error: No overload matches this call
```

Порада з документації TypeScript: якщо можна, обирайте union-параметри замість overloads. Overloads доречні для API бібліотек і функцій, чий результат справді залежить від форми аргументів.

#### Пов’язані питання

- [Що таке generics?](#q-2-3)

#### Документація

- [TypeScript — Function Overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)
