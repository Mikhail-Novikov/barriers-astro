<?php

require_once __DIR__ . '/../utils/env.php';
loadEnv();

$recipients = envList('BARRIERS_SMTP_TO');

return [
    'host' => envValue('BARRIERS_SMTP_HOST'),
    'port' => envInt('BARRIERS_SMTP_PORT', 465),
    'secure' => envValue('BARRIERS_SMTP_SECURE', 'ssl'),
    'allow_self_signed' => envBool('BARRIERS_SMTP_ALLOW_SELF_SIGNED', true),
    'username' => envValue('BARRIERS_SMTP_USERNAME'),
    'password' => envValue('BARRIERS_SMTP_PASSWORD'),
    'from' => envValue('BARRIERS_SMTP_FROM'),
    'to' => $recipients,
];