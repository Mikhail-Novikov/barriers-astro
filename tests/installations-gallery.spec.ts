import { expect, test } from '@playwright/test';

const galleryUrl = '/test/barriers/';

const galleryItems = [
  ['1', 'Шлагбаумы GS04, бизнес-центр Capital Tower, Москва', '01-01.webp'],
  ['1-video', 'Установки шлагбаумов', '01-02.webp'],
  ['2', 'Шлагбаум GS04, отель «Репинский курорт», Санкт-Петербург', '01-03.webp'],
  ['3', 'Шлагбаум GS04, ЖК «Урбанист», Мурино, Ленинградская область', '01-04.webp'],
  ['5', 'Шлагбаум GS04, гостиница «Левитанъ», Владимир', '02-01.webp'],
  ['6', 'Шлагбаумы GS04, фитнес-клуб Opera Fitness, Тюмень', '02-02.webp'],
  ['7', 'Шлагбаум GS14, парковка у бизнес-центра, Санкт-Петербург', '02-03.webp'],
  ['8', 'Шлагбаумы GS04, Российский научно-исследовательский нейрохирургический институт им. А.Л. Поленова, Санкт-Петербург', '02-04.webp'],
  ['9', 'Шлагбаум GS04, городская усадьба Демидовых, Москва', '03-01.webp'],
  ['10', 'Шлагбаумы GS14, парковка на Сенной площади, Великий Новгород', '03-02.webp'],
  ['11', 'Шлагбаум GS04, аквапарк, Суздаль', '03-03.webp'],
  ['12', 'Шлагбаум GS04, ЖК «Лахта», Санкт-Петербург', '03-04.webp'],
  ['13', 'Шлагбаумы GS04 в составе парковочной системы PERCo.Паркинг, деловой центр Sun City, Красное Село', '04-01.webp'],
  ['14', 'Шлагбаум GS04, музей-парк «Россия — Моя история», Тверь', '04-02.webp'],
  ['15', 'Шлагбаум GS04, завод PERCo, Псков', '04-03.webp'],
  ['16', 'Шлагбаум GS04, ЖК «Город солнца», Санкт-Петербург', '04-04.webp'],
  ['17', 'Шлагбаум GS14, парковка у офиса компании, Санкт-Петербург', '05-01.webp'],
  ['18', 'Шлагбаумы GS04, гостиница «Кранекс», Иваново', '05-02.webp'],
  ['19', 'Шлагбаум GS04, жилой комплекс, Москва', '05-03.webp'],
  ['20', 'Шлагбаум GS04, жилой комплекс, ул. Кедрова, Москва', '05-04.webp'],
  ['21', 'Шлагбаум GS14, подземный паркинг компании, Санкт-Петербург', '06-01.webp'],
  ['22', 'Шлагбаум GS14, офис компании, Санкт-Петербург', '06-02.webp'],
  ['23', 'Шлагбаумы GS04, база отдыха Opushka house, Ленинградская область', '06-03.webp'],
  ['24', 'Шлагбаум GS04, Сокольнический Вал, Москва', '06-04.webp'],
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto(galleryUrl);
  await page.evaluate(() => localStorage.clear());
  await page.goto(galleryUrl);
  await page.getByRole('button', { name: 'Принимаю' }).click();
});

test('подписи галереи установок соответствуют данным карточек и превью', async ({ page }) => {
  const gallery = page.locator('.gallery-equipment');
  await expect(gallery).toBeVisible();

  for (const [id, description, previewFile] of galleryItems) {
    if (id === '1-video') {
      const video = gallery.locator('video').first();
      await expect(video).toBeAttached();
      await expect(video).toHaveAttribute('src', /\/video\/examples-installations\/installations\.mp4$/);
      await expect(video).toHaveAttribute('poster', new RegExp(`/${previewFile}$`));
      continue;
    }

    const card = gallery.locator(`a[data-id="${id}"]`);
    await expect(card).toBeAttached();

    const image = card.locator('img');
    await expect(image).toHaveAttribute('alt', description);
    await expect(image).toHaveAttribute('src', new RegExp(`/${previewFile}$`));
  }
});
