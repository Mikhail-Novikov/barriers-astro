# Barriers — лендинг для шлагбаумов и систем контроля доступа

Это Astro-проект для современного лендинга, посвящённого решениям для школ, объектов и учреждений: шлагбаумы, турникеты, системы контроля доступа и сопутствующие услуги.

## Что в проекте

- одностраничный лендинг с адаптивной структурой;
- блоки с преимуществами, оборудованием, историей и обратной связью;
- интеграция с React-компонентами и Tailwind CSS;
- сборка под статический сайт для публикации на сервере.

## Структура проекта

```text
/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
├── package.json
└── README.md
```

## Команды

Все команды запускаются из корня проекта:

| Команда | Действие |
| :------ | :------- |
| `npm install` | Установка зависимостей |
| `npm run dev` | Запуск локального dev-сервера на `http://localhost:4321` |
| `npm run build` | Сборка production-версии в `dist/` |
| `npm run preview` | Предпросмотр собранного сайта локально |

## Быстрый старт

```bash
npm install
npm run dev
```

## Развёртывание

Проект собирается как статический сайт. После выполнения:

```bash
npm run build
```

готовые файлы можно публиковать из папки `dist/` или из настроенной директории, если сайт размещается в подкаталоге.

### Серверные настройки формы

PHP-обработчик формы использует переменные окружения PHP-хостинга. Настройте их в конфигурации PHP-FPM/Apache, не добавляя значения в репозиторий:

- `BARRIERS_ALLOWED_ORIGINS` — разрешённые origins через запятую, без путей (например, `https://example.com`);
- `BARRIERS_SMTP_HOST`, `BARRIERS_SMTP_PORT`, `BARRIERS_SMTP_SECURE`;
- `BARRIERS_SMTP_USERNAME`, `BARRIERS_SMTP_PASSWORD`;
- `BARRIERS_SMTP_FROM`, `BARRIERS_SMTP_TO` (адреса через запятую);
- `BARRIERS_SMTP_ALLOW_SELF_SIGNED` — `true` только если SMTP-сервер требует самоподписанный сертификат.

#### PHP-FPM

На сервере с PHP-FPM добавьте переменные в конфигурацию пула, обычно `/etc/php/<версия>/fpm/pool.d/www.conf`, в секцию `[www]`:

```ini
env[BARRIERS_ALLOWED_ORIGINS] = "https://example.com"
env[BARRIERS_SMTP_HOST] = "smtp.example.net"
env[BARRIERS_SMTP_PORT] = "465"
env[BARRIERS_SMTP_SECURE] = "ssl"
env[BARRIERS_SMTP_USERNAME] = "user@example.net"
env[BARRIERS_SMTP_PASSWORD] = "установите-новый-пароль"
env[BARRIERS_SMTP_FROM] = "user@example.net"
env[BARRIERS_SMTP_TO] = "recipient@example.net"
env[BARRIERS_SMTP_ALLOW_SELF_SIGNED] = "false"
```

Замените примеры на реальные значения. `BARRIERS_ALLOWED_ORIGINS` должен совпадать с origin сайта в браузере: схема и домен, без пути и завершающего слеша. Несколько origin можно перечислить через запятую, например `https://example.com,http://localhost:4321`.

Сохраните файл, проверьте конфигурацию и перезапустите службу (название команды проверки зависит от дистрибутива и установленной версии PHP):

```bash
sudo php-fpm8.2 -t
sudo systemctl restart php8.2-fpm
```

Подставьте свою версию PHP вместо `8.2`. На некоторых системах команда проверки называется `php-fpm8.2 --test`.

#### Apache

Если PHP работает через Apache `mod_php`, задайте переменные в конфигурации виртуального хоста:

```apache
SetEnv BARRIERS_ALLOWED_ORIGINS "https://example.com"
SetEnv BARRIERS_SMTP_HOST "smtp.example.net"
SetEnv BARRIERS_SMTP_PORT "465"
SetEnv BARRIERS_SMTP_SECURE "ssl"
SetEnv BARRIERS_SMTP_USERNAME "user@example.net"
SetEnv BARRIERS_SMTP_PASSWORD "установите-новый-пароль"
SetEnv BARRIERS_SMTP_FROM "user@example.net"
SetEnv BARRIERS_SMTP_TO "recipient@example.net"
SetEnv BARRIERS_SMTP_ALLOW_SELF_SIGNED "false"
```

После изменений проверьте конфигурацию (`sudo apachectl configtest`) и перезагрузите Apache (`sudo systemctl reload apache2`; на некоторых системах служба называется `httpd`). Если Apache передаёт PHP-запросы в PHP-FPM через `proxy_fcgi`, задавайте переменные в конфигурации пула PHP-FPM, а не через `SetEnv`.

На управляемом хостинге ищите раздел переменных окружения PHP или уточните у поддержки, как передать переменные в PHP-FPM. Не публикуйте `phpinfo()` и диагностические страницы с секретами.

Форма отправляет данные обработчику методом POST. После обновления PHP-обработчика удалите старый `mail-config.php` и смените прежний пароль формы: он был встроен в клиентский код и сохранён в истории Git. Переменные окружения должны быть доступны PHP-процессу; значения секретов нельзя передавать браузеру или хранить в Git.

## Технологии

- Astro
- React
- TypeScript
- Tailwind CSS
- SCSS
