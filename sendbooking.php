<?php
header('Content-Type: application/json; charset=UTF-8');

set_time_limit(20);
ini_set('default_socket_timeout', '20');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST ?? [];
}

function clean($v): string
{
    return strip_tags(trim((string) $v));
}

$name = clean($data['name'] ?? '');
$email = trim((string) ($data['email'] ?? ''));
$phone = clean($data['phone'] ?? '');
$pickup_location = clean($data['pickup_location'] ?? '');
$dropoff_location = clean($data['dropoff_location'] ?? '');
$return_pickup_location = clean($data['return_pickup_location'] ?? '');
$return_dropoff_location = clean($data['return_dropoff_location'] ?? '');
$date = clean($data['date'] ?? '');
$time = clean($data['time'] ?? '');
$service = clean($data['service'] ?? '');
$vehicle = clean($data['vehicle'] ?? '');
$passengers = clean($data['passengers'] ?? '');
$luggage = clean($data['luggage'] ?? '');
$returnTrip = !empty($data['return-trip']) || !empty($data['returnTrip']) || !empty($data['return_trip']);
$returnDate = clean($data['return-date'] ?? ($data['returnDate'] ?? ($data['return_date'] ?? '')));
$returnTime = clean($data['return-time'] ?? ($data['returnTime'] ?? ($data['return_time'] ?? '')));
$message = clean($data['message'] ?? '');

if ($name === '' || $email === '' || $phone === '' || $pickup_location === '' || $dropoff_location === '' || $date === '' || $time === '' || $service === '' || $vehicle === '' || $passengers === '' || $luggage === '') {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
    exit;
}

$email = filter_var($email, FILTER_SANITIZE_EMAIL);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
    exit;
}

$tsDate = strtotime($date);
$tsTime = strtotime($time);
if (!$tsDate || !$tsTime) {
    echo json_encode(['success' => false, 'message' => 'Invalid date or time']);
    exit;
}
$prettyDate = date("d F Y", $tsDate);
$prettyTime = date("h:i a", $tsTime);

$prettyReturnDate = '';
$prettyReturnTime = '';
if ($returnTrip) {
    if ($returnDate !== '') {
        $tsReturnDate = strtotime($returnDate);
        $prettyReturnDate = $tsReturnDate ? date("d F Y", $tsReturnDate) : $returnDate;
    }
    if ($returnTime !== '') {
        $tsReturnTime = strtotime($returnTime);
        $prettyReturnTime = $tsReturnTime ? date("h:i a", $tsReturnTime) : $returnTime;
    }
}

$returnInfo = $returnTrip
    ? "Yes\nReturn Date: " . ($prettyReturnDate ?: 'N/A') . "\nReturn Time: " . ($prettyReturnTime ?: 'N/A') . "\nReturn Pick Up: " . ($return_pickup_location ?: 'N/A') . "\nReturn Drop Off: " . ($return_dropoff_location ?: 'N/A')
    : "No";


$body = "New Booking Request

Customer Information:
Name: $name
Email: $email
Phone: $phone

Journey Details:
Pick Up Location: $pickup_location
Drop Off Location: $dropoff_location

Booking Details:
Service Type: $service
Date: $prettyDate
Time: $prettyTime
Vehicle: $vehicle
Passengers: $passengers
Luggage: $luggage
Return Journey: $returnInfo

Additional Details:
$message

Submitted on: " . date("d F Y h:i a") . "
";

require_once __DIR__ . '/phpmailer/src/Exception.php';
require_once __DIR__ . '/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$to = 'info@luxvipchartersperth.com.au';
$from = 'no-reply@luxvipchartersperth.com.au';
$subject = "New Booking Request: $service - $name";


try {
    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';

    $mail->isMail();

    $mail->setFrom($from, 'Lux VIP Charters');
    $mail->addAddress($to);
    $mail->addReplyTo($email, $name);

    $mail->Subject = $subject;
    $mail->Body = $body;
    $mail->isHTML(false);

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Your booking request has been submitted successfully!']);
    exit;

} catch (Exception $e) {
    error_log("MAIL send failed: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to send booking request. Please try again later.']);
    exit;
}
