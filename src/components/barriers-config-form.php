<?
const BARRIERS_FORM_ID = 87;
const BARRIERS_FIELD_NAME = 'form_text_1154';
const BARRIERS_FIELD_EMAIL = 'form_email_1155';
const BARRIERS_FIELD_PHONE = 'form_text_1156';
const BARRIERS_FIELD_MESSAGE = 'form_textarea_1157';
const BARRIERS_FIELD_ITEM = 'form_textarea_1158';
const BARRIERS_FIELD_OPTIONS = 'form_textarea_1159';
const BARRIERS_FIELD_QUERY_STRING = 'form_textarea_1166';
const BARRIERS_FIELD_DATE = 'form_date_1160';

header('Content-Type: text/plain; charset=UTF-8');
header('Cache-Control: no-store');
header('Access-Control-Allow-Headers: Content-Type');
header('Vary: Origin');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = array_values(array_filter(array_map(
    'trim',
    explode(',', getenv('BARRIERS_ALLOWED_ORIGINS') ?: '')
)));

if ($origin === '' || !in_array($origin, $allowedOrigins, true)) {
    http_response_code(403);
    echo 'error: origin not allowed';
    exit;
}

header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST, OPTIONS');
    http_response_code(405);
    echo 'error: method not allowed';
    exit;
}

if (empty($_POST) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    http_response_code(400);
    echo 'error: invalid form data';
    exit;
}

$request = $_POST;
$email = $request['email'] ?? '';
$message = $request['message'] ?? '';

if (
    !is_string($email)
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || !is_string($message)
    || trim($message) === ''
) {
    http_response_code(400);
    echo 'error: invalid form data';
    exit;
}

require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php');

// ============================================================
//  Извлечение SMTP-конфига
// ============================================================
function getMailConfig(): array
{
    $getEnv = static function (string $name, string $default = ''): string {
        $value = getenv($name);
        return $value === false ? $default : trim($value);
    };

    return [
        'host' => $getEnv('BARRIERS_SMTP_HOST'),
        'port' => (int) $getEnv('BARRIERS_SMTP_PORT', '587'),
        'secure' => strtolower($getEnv('BARRIERS_SMTP_SECURE', 'tls')),
        'username' => $getEnv('BARRIERS_SMTP_USERNAME'),
        'password' => $getEnv('BARRIERS_SMTP_PASSWORD'),
        'from' => $getEnv('BARRIERS_SMTP_FROM'),
        'to' => array_values(array_filter(array_map(
            'trim',
            explode(',', $getEnv('BARRIERS_SMTP_TO'))
        ))),
        'allow_self_signed' => strtolower($getEnv('BARRIERS_SMTP_ALLOW_SELF_SIGNED')) === 'true',
    ];
}

$getPlainText = static function ($value): string {
    if (!is_scalar($value)) {
        return '';
    }

    $decoded = html_entity_decode((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return trim(strip_tags($decoded));
};

$arValues = array(
    BARRIERS_FIELD_NAME => $getPlainText($request['name'] ?? ''),
    BARRIERS_FIELD_EMAIL => $getPlainText($request['email'] ?? ''),
    BARRIERS_FIELD_PHONE => $getPlainText($request['phone'] ?? ''),
    BARRIERS_FIELD_MESSAGE => $getPlainText($request['message'] ?? ''),
    BARRIERS_FIELD_ITEM => $getPlainText(
        $request[BARRIERS_FIELD_ITEM] ?? $request['barriers'] ?? ''
    ),
    BARRIERS_FIELD_OPTIONS => $getPlainText($request[BARRIERS_FIELD_OPTIONS] ?? $request['options'] ?? ''),
    BARRIERS_FIELD_QUERY_STRING => $getPlainText($request[BARRIERS_FIELD_QUERY_STRING] ?? ''),
    BARRIERS_FIELD_DATE => date('d.m.Y'),
);

if (CModule::IncludeModule("form")) {
    $RESULT_ID = CFormResult::Add(BARRIERS_FORM_ID, $arValues);
} else {
    error_log('Barrier form submission failed: Bitrix form module is unavailable.');
    http_response_code(500);
    echo 'error: module not included';
    exit;
}

$smtpSent = false;
$mailConfig = getMailConfig();
$smtpHost = $mailConfig['host'] ?? '';
$smtpUsername = $mailConfig['username'] ?? '';
$smtpPassword = $mailConfig['password'] ?? '';
$smtpRecipients = (array) ($mailConfig['to'] ?? []);

if ($smtpHost && $smtpUsername && $smtpPassword && $smtpRecipients) {
    $phpMailerPath = $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/vendor/phpmailer/phpmailer/src/';

    foreach (['Exception.php', 'PHPMailer.php', 'SMTP.php'] as $phpMailerFile) {
        require_once $phpMailerPath . $phpMailerFile;
    }

    if (!class_exists('\PHPMailer\PHPMailer\PHPMailer')) {
        error_log('SMTP ERROR: PHPMailer is not loaded');
        throw new RuntimeException('PHPMailer is not loaded');
    }

    try {
        require_once $phpMailerPath . 'Exception.php';
        require_once $phpMailerPath . 'PHPMailer.php';
        require_once $phpMailerPath . 'SMTP.php';

        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUsername;
        $mail->Password = $smtpPassword;
        $mail->CharSet = 'UTF-8';

        $smtpEncryption = strtolower($mailConfig['secure'] ?? 'tls');
        $mail->SMTPSecure = $smtpEncryption === 'ssl'
            ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
            : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = (int) ($mailConfig['port'] ?? ($smtpEncryption === 'ssl' ? 465 : 587));
        if (!empty($mailConfig['allow_self_signed'])) {
            $mail->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true,
                ],
            ];
        }

        $mail->setFrom($mailConfig['from'] ?? $smtpUsername, 'PERCo');
        foreach ($smtpRecipients as $smtpRecipient) {
            $mail->addAddress($smtpRecipient);
        }
        if (filter_var($request['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
            $mail->addReplyTo(
                $arValues[BARRIERS_FIELD_EMAIL],
                $arValues[BARRIERS_FIELD_NAME]
            );
        }

        $mail->Subject = 'Новая заявка с сайта';
        $messageForEmail = html_entity_decode($arValues[BARRIERS_FIELD_MESSAGE], ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $messageForEmail = preg_replace('~<br\s*/?>~i', "\n", $messageForEmail);
        $messageForEmail = preg_replace('~</(?:p|div|li|h[1-6])\s*>~i', "\n", $messageForEmail);
        $messageForEmail = trim(strip_tags($messageForEmail));
        $mailBody = array(
            'Имя: ' . ($arValues[BARRIERS_FIELD_NAME] ?: '-'),
            'E-mail: ' . ($arValues[BARRIERS_FIELD_EMAIL] ?: '-'),
        );
        if (!empty($arValues[BARRIERS_FIELD_PHONE])) {
            $mailBody[] = 'Телефон: ' . $arValues[BARRIERS_FIELD_PHONE];
        }
        if (!empty($arValues[BARRIERS_FIELD_ITEM])) {
            $mailBody[] = 'Интересует: ' . $arValues[BARRIERS_FIELD_ITEM];
        }
        $mailBody[] = 'Сообщение: ' . ($messageForEmail ?: '-');
        $mailBody[] = 'Дата: ' . $arValues[BARRIERS_FIELD_DATE];
        $mail->Body = implode("\n", $mailBody);
        $mail->send();
        $smtpSent = true;
    } catch (\Throwable $error) {
        error_log('Barrier form SMTP delivery failed; see PHP mail-server logs for details.');
    }
} else {
    $missingMailSettings = [];
    foreach (['host', 'username', 'password', 'to'] as $setting) {
        if (empty($mailConfig[$setting])) {
            $missingMailSettings[] = $setting;
        }
    }
    error_log('Barrier form SMTP configuration is missing: ' . implode(', ', $missingMailSettings));
}

if ($RESULT_ID && $smtpSent) {
    echo 'ok';
} else {
    if (!$RESULT_ID) {
        error_log('Barrier form submission failed: Bitrix did not save the form result.');
    }
    http_response_code(500);
    echo !$RESULT_ID ? 'error: failed to add' : 'error: failed to send email';
}

require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/epilog_after.php");
