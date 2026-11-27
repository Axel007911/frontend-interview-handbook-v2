import {test, expect, type Page} from '@playwright/test';

type Item = {id: string; number: string; title: string; chapter: string; task: boolean};
type Data = {storageKey: string; legacyStorageKeys: string[]; items: Item[]; chapters: {dir: string; title: string}[]};

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1200) <= 900;
async function data(page: Page): Promise<Data> {
  return page.evaluate('handbook') as Promise<Data>;
}
async function openToc(page: Page) {
  if (!isMobile(page)) return;
  await page.getByRole('button', {name: 'Зміст'}).click();
  await expect(page.locator('#sidebar')).toBeInViewport({ratio: 0.9});
}
async function setMode(page: Page, name: 'Навчання' | 'Співбесіда' | 'Повторення') {
  await openToc(page);
  await page.getByRole('radio', {name}).check({force: true});
  if (isMobile(page)) await page.keyboard.press('Escape');
}

let errors: string[];
test.beforeEach(async ({page}) => {
  errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
});
test.afterEach(() => { expect(errors, 'no console errors').toEqual([]); });

test('home shows progress, chapters and starts studying', async ({page}) => {
  await page.goto('./');
  const {items, chapters} = await data(page);
  await expect(page.getByRole('heading', {level: 1})).toBeVisible();
  await expect(page.locator('.chapter-card')).toHaveCount(chapters.length);
  await expect(page.locator('#stat-done')).toHaveText('0');
  await page.locator('#start-link').click();
  await expect(page).toHaveURL(new RegExp(`#${items[0].id}$`));
  await expect(page.locator(`#${items[0].id} h2`)).toBeVisible();
});

test('every card opens by direct link', async ({page}) => {
  await page.goto('./');
  const {items} = await data(page);
  for (const item of items) {
    await page.evaluate(id => { location.hash = id; }, item.id);
    await expect(page.locator(`#${item.id}`)).toBeVisible();
    await expect(page.locator(`#${item.id} .en-answer`)).toHaveCount(1);
  }
});

test('search narrows the list and Enter opens the first match', async ({page}) => {
  await page.goto('./');
  const {items} = await data(page);
  const target = items[Math.min(5, items.length - 1)];
  const query = target.title.split(/\s+/).filter(w => w.length > 4).slice(0, 2).join(' ') || target.title;
  await page.locator('#search').fill(query);
  await expect(page.locator('#results')).toContainText('У добірці');
  await expect(page.locator(`#toc li[data-id="${target.id}"]`)).toBeVisible();
  await page.locator('#search').fill('zzzz-not-found-zzzz');
  await expect(page.locator('#results')).toHaveText('Нічого не знайдено.');
  await page.locator('#search').fill(query);
  await page.locator('#search').press('Enter');
  await expect(page.locator('#reader')).toBeVisible();
});

test('interview mode hides answers and grading saves progress', async ({page}) => {
  await page.goto('./');
  const {items} = await data(page);
  const [first, second] = items.filter(item => !item.task);
  await page.goto(`./#${first.id}`);
  await expect(page.locator(`#${first.id} .answer`)).toHaveAttribute('open', '');
  await setMode(page, 'Співбесіда');
  await expect(page.locator(`#${first.id} .answer`)).not.toHaveAttribute('open', '');
  await expect(page.locator('#grade')).toBeHidden();
  await page.locator(`#${first.id} .answer > summary`).click();
  await page.getByRole('button', {name: 'Знаю, далі'}).click();
  await expect(page).toHaveURL(new RegExp(`#${second.id}$`));
  await page.reload();
  await expect(page.locator(`#toc li[data-id="${first.id}"]`)).toHaveAttribute('data-status', 'done');
  await page.goto('./#home');
  await expect(page.locator('#stat-done')).toHaveText('1');
  await expect(page.locator('#continue-link')).toBeVisible();
});

test('bookmarks and review status feed revision mode', async ({page}) => {
  await page.goto('./');
  const {items} = await data(page);
  const [a, b] = [items[1], items[items.length - 1]];
  await page.goto(`./#${a.id}`);
  await page.locator('#bookmark').click();
  await expect(page.locator('#bookmark')).toHaveAttribute('aria-pressed', 'true');
  await page.goto(`./#${b.id}`);
  await page.locator('.status-switch label', {hasText: 'Повторити'}).click();
  await setMode(page, 'Повторення');
  await expect(page.locator('#results')).toHaveText('У добірці: 2');
  await expect(page.locator('#toc li[data-id]:not([hidden])')).toHaveCount(2);
});

test('keyboard shortcuts navigate and toggle the answer', async ({page, isMobile: mobile}) => {
  test.skip(mobile, 'keyboard shortcuts are a desktop feature');
  await page.goto('./');
  const {items} = await data(page);
  await page.goto(`./#${items[0].id}`);
  await page.locator('body').press('j');
  await expect(page).toHaveURL(new RegExp(`#${items[1].id}$`));
  await page.locator('body').press('k');
  await expect(page).toHaveURL(new RegExp(`#${items[0].id}$`));
  const answer = page.locator(`#${items[0].id} .answer`);
  const wasOpen = await answer.evaluate(el => (el as HTMLDetailsElement).open);
  await page.locator('body').press('a');
  await expect.poll(() => answer.evaluate(el => (el as HTMLDetailsElement).open)).toBe(!wasOpen);
  await page.locator('body').press('3');
  await expect(page.locator(`#toc li[data-id="${items[0].id}"]`)).toHaveAttribute('data-status', 'done');
  await page.locator('body').press('?');
  await expect(page.getByRole('dialog', {name: 'Гарячі клавіші'})).toBeVisible();
});

test('runnable examples print console output', async ({page}) => {
  await page.goto('./');
  const id = await page.evaluate(() => document.querySelector('[data-run-code]')?.closest('article')?.id);
  test.skip(!id, 'no runnable examples');
  await page.goto(`./#${id}`);
  const figure = page.locator(`#${id} figure.runnable`).first();
  await figure.locator('[data-run-code]').click({force: true});
  await expect(figure.locator('.run-output .log').first()).toBeVisible();
  await expect(figure.locator('.run-output .log-error')).toHaveCount(0);
  await figure.getByRole('button', {name: 'Редагувати'}).click();
  await figure.locator('.code-editor').fill('console.log([1, 2], {a: "x"}, new Map([["k", 1]]));\nthrow new Error("boom");');
  await figure.locator('[data-run-code]').click();
  await expect(figure.locator('.run-output')).toContainText("[ 1, 2 ] { a: 'x' } Map(1) { 'k' => 1 }");
  await expect(figure.locator('.run-output .log-error')).toContainText('boom');
});

test('progress can be exported and imported', async ({page}, testInfo) => {
  await page.goto('./');
  const {items} = await data(page);
  await page.goto(`./#${items[2].id}`);
  await page.locator('#bookmark').click();
  await page.goto('./#home');
  const download = page.waitForEvent('download');
  await page.getByRole('button', {name: 'Зберегти прогрес у файл'}).click();
  const file = testInfo.outputPath('progress.json');
  await (await download).saveAs(file);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', {name: 'Скинути прогрес'}).click();
  await expect(page.locator('#stat-bookmarks')).toHaveText('0');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#import').setInputFiles(file);
  await expect(page.locator('#stat-bookmarks')).toHaveText('1');
});

test('progress from the previous storage key is migrated', async ({page}) => {
  await page.goto('./');
  const {legacyStorageKeys, items} = await data(page);
  test.skip(!legacyStorageKeys.length, 'no legacy storage');
  await page.evaluate(([key, id]) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({questions: {[id]: {status: 'done', bookmark: true}}, checks: {}}));
  }, [legacyStorageKeys[0], items[0].id]);
  await page.reload();
  await expect(page.locator('#stat-done')).toHaveText('1');
  await expect(page.locator('#stat-bookmarks')).toHaveText('1');
});

test('checklist state persists', async ({page}) => {
  await page.goto('./#checklist');
  const box = page.locator('[data-check]').first();
  await box.check();
  await page.reload();
  await expect(page.locator('[data-check]').first()).toBeChecked();
  await expect(page.locator('#check-progress')).toContainText('Відмічено 1');
});

test('interactive demos respond to input', async ({page}) => {
  await page.goto('./');
  const demos: Record<string, string> = await page.evaluate(() => Object.fromEntries(
    [...document.querySelectorAll<HTMLElement>('[data-demo]')].map(el => [el.dataset.demo!, el.closest('article')!.id])));
  const open = async (name: string) => {
    await page.goto(`./#${demos[name]}`);
    const answer = page.locator(`#${demos[name]} .answer`);
    if (!(await answer.evaluate(el => (el as HTMLDetailsElement).open))) await answer.locator('> summary').click();
    return page.locator(`#${demos[name]} [data-demo="${name}"]`).first();
  };
  if (demos['event-loop']) {
    const demo = await open('event-loop');
    await demo.getByRole('button', {name: 'Крок →'}).click();
    await expect(demo.locator('[data-el-counter]')).toHaveText(/Крок 2/);
  }
  if (demos['box-model']) {
    const demo = await open('box-model');
    await demo.getByRole('slider', {name: 'Padding'}).fill('40');
    await expect(demo.locator('[data-box-model="content"] [data-outer]')).toHaveText('290 px');
  }
  if (demos.specificity) {
    const demo = await open('specificity');
    await demo.locator('[data-spec-a]').fill('#a');
    await demo.locator('[data-spec-b]').fill('.a.b.c.d');
    await expect(demo.locator('[data-spec-result]')).toContainText('Перемагає A');
  }
  if (demos.batching) {
    const demo = await open('batching');
    await demo.locator('[data-step="value"]').click();
    await demo.locator('[data-step="function"]').click();
    await expect(demo.locator('[data-count="value"]')).toHaveText('1');
    await expect(demo.locator('[data-count="function"]')).toHaveText('3');
  }
  if (demos.bva) {
    const demo = await open('bva');
    await demo.locator('[data-bva-check]').fill('66');
    await expect(demo.locator('[data-bva-verdict]')).toContainText('Більше за максимум');
  }
  if (demos.pairwise) {
    const demo = await open('pairwise');
    await expect(demo.locator('[data-pw-summary]')).toContainText('покривають усі');
  }
  if (demos.flaky) {
    const demo = await open('flaky');
    await expect(demo.locator('[data-fl-green0]')).not.toBeEmpty();
  }
  if (demos['sql-joins']) {
    const demo = await open('sql-joins');
    await demo.getByRole('button', {name: 'LEFT', exact: true}).click();
    await expect(demo.locator('[data-sql-result] caption')).toContainText('4');
  }
  if (demos['debounce-throttle']) {
    const demo = await open('debounce-throttle');
    await demo.getByRole('button', {name: 'Серія подій'}).click();
    await expect(demo.locator('[data-row="debounce"] output')).not.toHaveText('0', {timeout: 5000});
  }
});

test('mobile menu opens and closes', async ({page, isMobile: mobile}) => {
  test.skip(!mobile, 'mobile only');
  await page.goto('./');
  const {items} = await data(page);
  await page.getByRole('button', {name: 'Зміст'}).click();
  await expect(page.locator('#sidebar')).toBeInViewport();
  await page.locator('#toc summary').first().click();
  await page.locator(`#toc a[href="#${items[0].id}"]`).click();
  await expect(page.locator('#sidebar')).not.toBeInViewport();
  await expect(page.locator(`#${items[0].id} h2`)).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
