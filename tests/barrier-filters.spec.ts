import { expect, test } from '@playwright/test';

const catalogUrl = '/test/barriers/';
const catalog = '#catalog';

const visibleProducts = async (page: import('@playwright/test').Page): Promise<string[]> =>
  page.locator(`${catalog} article img[alt]`).evaluateAll((images) =>
    images.map((image) => image.getAttribute('alt') ?? ''),
  );

const selectFilter = async (
  page: import('@playwright/test').Page,
  group: string,
  value: string,
): Promise<void> => {
  const radio = page.locator(`${catalog} input[name="${group}-desktop"][value="${value}"]`);
  await radio.locator('xpath=..').click();
  await expect(radio).toBeChecked();
};

const expectFilterDisabled = async (
  page: import('@playwright/test').Page,
  group: string,
  value: string,
): Promise<void> => {
  await expect(
    page.locator(`${catalog} input[name="${group}-desktop"][value="${value}"]`),
  ).toBeDisabled();
};

test.beforeEach(async ({ page }) => {
  await page.goto(catalogUrl);
  await page.getByRole('button', { name: 'Принимаю' }).click();
});

test('показывает все товары каталога до применения фильтров', async ({ page }) => {
  await expect(page.locator(`${catalog} article`)).toHaveCount(19);
});

test.describe('ширина проезда', () => {
  test('показывает товары со стрелой 3 м для проезда шириной 2,3–3 м', async ({ page }) => {
    await selectFilter(page, 'roadWidthLimit', '3');
    const products = await visibleProducts(page);

    expect(products).toHaveLength(10);
    expect(products.every((name) => name.endsWith('3 метра'))).toBe(true);
  });

  test('показывает товары со стрелой 4,3 м для проезда шириной 3,1–4 м', async ({ page }) => {
    await selectFilter(page, 'roadWidthLimit', '4');
    const products = await visibleProducts(page);

    expect(products).toHaveLength(7);
    expect(products.every((name) => name.endsWith('4,3 метра'))).toBe(true);
  });

  test('показывает товары со стрелой 6,3 м для проезда шириной 4,1–6 м', async ({ page }) => {
    await selectFilter(page, 'roadWidthLimit', '6');
    expect(await visibleProducts(page)).toEqual([
      'Шлагбаум GS06.1 со стрелой круглого сечения 6,3 метра',
      'Шлагбаум GS16 со стрелой круглого сечения 6,3 метра',
    ]);
  });
});

test.describe('рабочая температура', () => {
  test('показывает только низкотемпературные модели при −60 °C', async ({ page }) => {
    await selectFilter(page, 'temperatures', 'low');
    const products = await visibleProducts(page);

    expect(products).toHaveLength(3);
    expect(products.every((name) => name.includes('GF13N') || name.includes('GS14N'))).toBe(true);
  });

  test('исключает низкотемпературные модели при выборе −40 °C', async ({ page }) => {
    await selectFilter(page, 'temperatures', 'standard');
    const products = await visibleProducts(page);

    expect(products).toHaveLength(16);
    expect(products.some((name) => name.includes('GF13N') || name.includes('GS14N'))).toBe(false);
  });
});

test.describe('время открытия', () => {
  test('показывает скоростные модели при времени открытия менее 1,5 секунды', async ({ page }) => {
    await selectFilter(page, 'openingTimes', 'lessThan1.5');
    const products = await visibleProducts(page);

    expect(products).toHaveLength(3);
    expect(products.every((name) => name.includes('GF'))).toBe(true);
  });

  test('показывает стандартные модели в категории 3–4 секунды', async ({ page }) => {
    await selectFilter(page, 'openingTimes', '3-4');
    const products = await visibleProducts(page);

    expect(products).toHaveLength(14);
    expect(products.every((name) => !name.includes('GF'))).toBe(true);
  });

  test('показывает модели для длинной стрелы в категории 4–6 секунд', async ({ page }) => {
    await selectFilter(page, 'openingTimes', '4-6');
    expect(await visibleProducts(page)).toEqual([
      'Шлагбаум GS06.1 со стрелой круглого сечения 6,3 метра',
      'Шлагбаум GS16 со стрелой круглого сечения 6,3 метра',
    ]);
  });
});

test.describe('тип стрелы', () => {
  test('показывает только товары со стрелой круглого сечения', async ({ page }) => {
    await selectFilter(page, 'booms', 'round');
    const products = await visibleProducts(page);

    expect(products).toHaveLength(11);
    expect(products.every((name) => name.includes('круглого сечения'))).toBe(true);
  });

  test('показывает товары с прямоугольной нераскладной стрелой', async ({ page }) => {
    await selectFilter(page, 'booms', 'square');
    const products = await visibleProducts(page);

    expect(products).toHaveLength(4);
    expect(products.every((name) => name.includes('прямоугольного сечения'))).toBe(true);
  });

  test('показывает товары со складной прямоугольной стрелой', async ({ page }) => {
    await selectFilter(page, 'booms', 'folding');
    const products = await visibleProducts(page);

    expect(products).toHaveLength(4);
    expect(products.every((name) => name.includes('складной стрелой'))).toBe(true);
  });
});

test('совмещает выбранные фильтры', async ({ page }) => {
  await selectFilter(page, 'temperatures', 'low');
  await selectFilter(page, 'openingTimes', '3-4');

  expect(await visibleProducts(page)).toEqual([
    'Шлагбаум GS14N со стрелой круглого сечения 3 метра',
    'Шлагбаум GS14N со стрелой круглого сечения 4,3 метра',
  ]);
});

test('отключает типы стрел, недоступные для проезда шириной 4,1–6 м', async ({ page }) => {
  await selectFilter(page, 'roadWidthLimit', '6');

  await expectFilterDisabled(page, 'booms', 'square');
  await expectFilterDisabled(page, 'booms', 'folding');
});

test.describe('совместимость выбранных фильтров', () => {
  const compatibilityRules: Array<{
    name: string;
    group: string;
    value: string;
    disables: Array<[group: string, value: string]>;
  }> = [
    {
      name: 'прямоугольная нераскладная стрела',
      group: 'booms',
      value: 'square',
      disables: [
        ['openingTimes', 'lessThan1.5'],
        ['openingTimes', '4-6'],
        ['temperatures', 'low'],
        ['roadWidthLimit', '6'],
      ],
    },
    {
      name: 'складная прямоугольная стрела',
      group: 'booms',
      value: 'folding',
      disables: [
        ['openingTimes', 'lessThan1.5'],
        ['openingTimes', '4-6'],
        ['temperatures', 'low'],
        ['roadWidthLimit', '6'],
      ],
    },
    {
      name: 'время открытия менее 1,5 секунды',
      group: 'openingTimes',
      value: 'lessThan1.5',
      disables: [
        ['booms', 'square'],
        ['booms', 'folding'],
        ['roadWidthLimit', '4'],
        ['roadWidthLimit', '6'],
      ],
    },
    {
      name: 'время открытия 4–6 секунд',
      group: 'openingTimes',
      value: '4-6',
      disables: [
        ['temperatures', 'low'],
        ['booms', 'square'],
        ['booms', 'folding'],
        ['roadWidthLimit', '4'],
        ['roadWidthLimit', '3'],
      ],
    },
    {
      name: 'низкая температура',
      group: 'temperatures',
      value: 'low',
      disables: [
        ['booms', 'square'],
        ['booms', 'folding'],
        ['roadWidthLimit', '6'],
        ['openingTimes', '4-6'],
      ],
    },
    {
      name: 'проезд шириной 2,3–3 метра',
      group: 'roadWidthLimit',
      value: '3',
      disables: [['openingTimes', '4-6']],
    },
    {
      name: 'проезд шириной 3,1–4 метра',
      group: 'roadWidthLimit',
      value: '4',
      disables: [
        ['openingTimes', '4-6'],
        ['openingTimes', 'lessThan1.5'],
      ],
    },
    {
      name: 'проезд шириной 4,1–6 метров',
      group: 'roadWidthLimit',
      value: '6',
      disables: [
        ['booms', 'square'],
        ['booms', 'folding'],
        ['openingTimes', 'lessThan1.5'],
        ['openingTimes', '3-4'],
        ['temperatures', 'low'],
      ],
    },
    {
      name: 'время открытия 3–4 секунды',
      group: 'openingTimes',
      value: '3-4',
      disables: [['roadWidthLimit', '6']],
    },
  ];

  for (const rule of compatibilityRules) {
    test(`правило для выбора «${rule.name}» отключает все несовместимые варианты`, async ({ page }) => {
      await selectFilter(page, rule.group, rule.value);

      for (const [group, value] of rule.disables) {
        await expectFilterDisabled(page, group, value);
      }
    });
  }
});

test('сброс возвращает все 19 товаров и снимает выбранные фильтры', async ({ page }) => {
  await selectFilter(page, 'roadWidthLimit', '3');
  await selectFilter(page, 'temperatures', 'standard');
  await selectFilter(page, 'openingTimes', '3-4');
  await selectFilter(page, 'booms', 'round');

  await page.getByRole('button', { name: 'Сбросить все фильтры' }).click();

  await expect(page.locator(`${catalog} article`)).toHaveCount(19);
  await expect(page.locator(`${catalog} input[name$="-desktop"]:checked`)).toHaveCount(0);
});
