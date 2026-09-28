<? require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_GET['pw'] != 'bae42d7d01c78bf32db83aadd036e2ca574203da') {
    exit;
}

// Логирование
$logFile = __DIR__ . '/barrier_log.txt';
$logData = date('c') . ' Request: ' . json_encode($_GET, JSON_UNESCAPED_UNICODE) . "\n";

$arValues = array(
    'form_text_1154' => htmlspecialchars($_GET['name'] ?? ''),
    'form_email_1155' => htmlspecialchars($_GET['email'] ?? ''),
    'form_text_1156' => htmlspecialchars($_GET['phone'] ?? ''),
    'form_textarea_1157' => htmlspecialchars($_GET['message'] ?? ''),
    'form_textarea_1158' => htmlspecialchars($_GET['barriers'] ?? ''),
    'form_textarea_1159' => htmlspecialchars($_GET['options'] ?? ''),
    'form_textarea_1166' => htmlspecialchars($_GET['query_string'] ?? ''),
    'form_date_1160' => date('d.m.Y'),
);

$logData .= 'Values: ' . json_encode($arValues, JSON_UNESCAPED_UNICODE) . "\n";
$FORM_ID = 87;

if (CModule::IncludeModule("form")) {
    $RESULT_ID = CFormResult::Add($FORM_ID, $arValues);
    $logData .= 'Module included, Result ID: ' . ($RESULT_ID ?: 'false') . "\n";
} else {
    $logData .= 'Module not included' . "\n";
    echo 'error: module not included';
    exit;
}

if ($RESULT_ID) {
    $logData .= "Success: Result ID $RESULT_ID\n";
    @file_put_contents($logFile, $logData, FILE_APPEND);
    echo 'ok';
} else {
    $logData .= "Error: Failed to add result\n";
    @file_put_contents($logFile, $logData, FILE_APPEND);
    echo 'error: failed to add';
}

require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/epilog_after.php");
