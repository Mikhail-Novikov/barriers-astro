<?
const BARRIERS_FORM_ID = 87;
const BARRIERS_FIELD_NAME = 'form_text_1154';
const BARRIERS_FIELD_EMAIL = 'form_email_1155';
const BARRIERS_FIELD_PHONE = 'form_text_1156';
const BARRIERS_FIELD_MESSAGE = 'form_textarea_1157';
const BARRIERS_FIELD_DATE = 'form_date_1160';

require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_GET['pw'] != 'bae42d7d01c78bf32db83aadd036e2ca574203da') {
    http_response_code(403);
    echo 'error: unauthorized';
    exit;
}

// ============================================================
//  Извлечение SMTP-конфига
// ============================================================
function getMailConfig(): array
{
    static $config = null;
    if ($config !== null) return $config;

    $path = __DIR__ . '/mail-config.php';

    if (!is_readable($path)) {
        error_log('MAIL CONFIG ERROR: файл не найден или недоступен: ' . $path);
        return $config = [];
    }

    $config = @include $path;

    if (!is_array($config)) {
        error_log('MAIL CONFIG ERROR: файл не вернул массив');
        $config = [];
    }

    return $config;
}

// Логирование
$logFile = __DIR__ . '/barrier_log.txt';
$safeRequest = $_GET;
unset($safeRequest['pw']);
$logData = date('c') . ' Request: ' . json_encode($safeRequest, JSON_UNESCAPED_UNICODE) . "\n";

$arValues = array(
    BARRIERS_FIELD_NAME => htmlspecialchars($_GET['name'] ?? ''),
    BARRIERS_FIELD_EMAIL => htmlspecialchars($_GET['email'] ?? ''),
    BARRIERS_FIELD_PHONE => htmlspecialchars($_GET['phone'] ?? ''),
    BARRIERS_FIELD_MESSAGE => htmlspecialchars($_GET['message'] ?? ''),
    BARRIERS_FIELD_DATE => date('d.m.Y'),
);

$logData .= 'Values: ' . json_encode($arValues, JSON_UNESCAPED_UNICODE) . "\n";

if (CModule::IncludeModule("form")) {
    $RESULT_ID = CFormResult::Add(BARRIERS_FORM_ID, $arValues);
    $logData .= 'Module included, Result ID: ' . ($RESULT_ID ?: 'false') . "\n";
} else {
    $logData .= 'Module not included' . "\n";
    @file_put_contents($logFile, $logData, FILE_APPEND);
    http_response_code(500);
    echo 'error: module not included';
    exit;
}

if ($RESULT_ID) {
    $logData .= "Result saved in Bitrix, Result ID: $RESULT_ID\n";
} else {
    $formError = $APPLICATION->GetException();
    $formErrorText = $formError ? $formError->GetString() : 'No Bitrix error details';
    $logData .= 'Error: Failed to add result. Bitrix: ' . $formErrorText . "\n";
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
        if (filter_var($_GET['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
            $mail->addReplyTo($_GET['email'], $_GET['name'] ?? '');
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
        $mailBody[] = 'Сообщение: ' . ($messageForEmail ?: '-');
        $mailBody[] = 'Дата: ' . $arValues[BARRIERS_FIELD_DATE];
        $mail->Body = implode("\n", $mailBody);
        $mail->send();
        $smtpSent = true;
        $logData .= "SMTP mail sent\n";
    } catch (\Throwable $error) {
        $smtpDiagnostics = [
            'exception' => $error->getMessage(),
            'phpmailer' => isset($mail) ? $mail->ErrorInfo : '',
            'smtp' => isset($mail) ? $mail->getSMTPInstance()->getError() : [],
            'host' => $smtpHost,
            'port' => $mailConfig['port'] ?? null,
            'encryption' => $mailConfig['secure'] ?? null,
        ];
        $logData .= 'SMTP error: ' . json_encode($smtpDiagnostics, JSON_UNESCAPED_UNICODE) . "\n";
    }
} else {
    $missingMailSettings = [];
    foreach (['host', 'username', 'password', 'to'] as $setting) {
        if (empty($mailConfig[$setting])) {
            $missingMailSettings[] = $setting;
        }
    }
    $logData .= 'SMTP error: missing config values: ' . implode(', ', $missingMailSettings) . "\n";
}

if ($RESULT_ID && $smtpSent) {
    $logData .= "Success: Result ID $RESULT_ID saved and SMTP mail sent\n";
    @file_put_contents($logFile, $logData, FILE_APPEND);
    echo 'ok';
} else {
    @file_put_contents($logFile, $logData, FILE_APPEND);
    http_response_code(500);
    echo !$RESULT_ID ? 'error: failed to add' : 'error: failed to send email';
}

require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/epilog_after.php");
