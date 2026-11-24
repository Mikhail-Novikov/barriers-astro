<?
$allowedOrigin = 'https://barrier.perco.ru';
if (($_SERVER['HTTP_ORIGIN'] ?? '') === $allowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

define('BARRIERS_FORM_ID', 89);
define('BARRIERS_FORM_PASSWORD', 'bae42d7d01c78bf32db83aadd036e2ca574203da');
define('BARRIERS_FIELD_NAME', 'form_text_1199');
define('BARRIERS_FIELD_EMAIL', 'form_email_1200');
define('BARRIERS_FIELD_PHONE', 'form_text_1246');
define('BARRIERS_FIELD_MESSAGE', 'form_textarea_1202');
define('BARRIERS_FIELD_ITEM', 'form_textarea_1210');
define('BARRIERS_FIELD_OPTIONS', 'form_textarea_1211');
define('BARRIERS_FIELD_QUERY_STRING', 'form_textarea_1213');
define('BARRIERS_FIELD_DATE', 'form_date_1212');

require_once $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

register_shutdown_function(static function (): void {
    require_once $_SERVER['DOCUMENT_ROOT']
        . '/bitrix/modules/main/include/epilog_after.php';
});

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$formPassword = BARRIERS_FORM_PASSWORD;
$providedPassword = (string) ($_GET['pw'] ?? '');

if ($providedPassword === '' || !hash_equals($formPassword, $providedPassword)) {
    http_response_code(403);
    echo 'error: unauthorized';
    exit;
}

// Логирование
$logFile = __DIR__ . '/barrier_log.txt';
$safeRequest = $_GET;
unset($safeRequest['pw']);
$logData = date('c') . ' Request: ' . json_encode($safeRequest, JSON_UNESCAPED_UNICODE) . "\n";

$getPlainText = static function ($value): string {
    if (!is_scalar($value)) {
        return '';
    }

    $decoded = html_entity_decode((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return trim(strip_tags($decoded));
};

$arValues = array(
    BARRIERS_FIELD_NAME => $getPlainText($_GET['name'] ?? ''),
    BARRIERS_FIELD_EMAIL => $getPlainText($_GET['email'] ?? ''),
    BARRIERS_FIELD_PHONE => $getPlainText($_GET['phone'] ?? ''),
    BARRIERS_FIELD_MESSAGE => $getPlainText($_GET['message'] ?? ''),
    BARRIERS_FIELD_ITEM => $getPlainText(
        $_GET[BARRIERS_FIELD_ITEM] ?? $_GET['barriers'] ?? ''
    ),
    BARRIERS_FIELD_OPTIONS => $getPlainText($_GET[BARRIERS_FIELD_OPTIONS] ?? ''),
    BARRIERS_FIELD_QUERY_STRING => $getPlainText($_GET[BARRIERS_FIELD_QUERY_STRING] ?? ''),
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

$mailEventProcessed = false;
if ($RESULT_ID) {
    try {
        CFormResult::SetEvent($RESULT_ID);

        $formResult = CForm::GetByID(BARRIERS_FORM_ID);
        $form = $formResult->Fetch();
        $formSites = (array) CForm::GetSiteArray(BARRIERS_FORM_ID);
        $formTemplateIds = (array) CForm::GetMailTemplateArray(BARRIERS_FORM_ID);
        $hasActiveMailTemplate = false;

        if (
            $form
            && !empty($form['MAIL_EVENT_TYPE'])
            && defined('SITE_ID')
            && in_array(SITE_ID, $formSites, true)
            && $formTemplateIds
        ) {
            $eventMessages = CEventMessage::GetList('id', 'asc', [
                'ACTIVE' => 'Y',
                'SITE_ID' => SITE_ID,
                'EVENT_NAME' => $form['MAIL_EVENT_TYPE'],
            ]);

            while ($eventMessage = $eventMessages->Fetch()) {
                if (in_array($eventMessage['ID'], $formTemplateIds)) {
                    $hasActiveMailTemplate = true;
                    break;
                }
            }
        }

        if ($hasActiveMailTemplate) {
            $mailEventProcessed = CFormResult::Mail($RESULT_ID);
            $logData .= 'Bitrix form mail event processed: '
                . ($mailEventProcessed ? 'true' : 'false')
                . "\n";
        } else {
            $logData .= "Bitrix mail event skipped: no active template assigned to the form/site\n";
        }
    } catch (\Throwable $error) {
        $logData .= 'Bitrix mail event error: ' . $error->getMessage() . "\n";
    }
}

if ($RESULT_ID && $mailEventProcessed) {
    $logData .= "Success: Result ID $RESULT_ID saved and Bitrix mail event processed\n";
    @file_put_contents($logFile, $logData, FILE_APPEND);
    echo 'ok';
} else {
    @file_put_contents($logFile, $logData, FILE_APPEND);
    http_response_code(500);
    echo !$RESULT_ID ? 'error: failed to add' : 'error: failed to send email';
}
