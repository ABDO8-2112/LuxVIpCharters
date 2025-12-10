<?php
header('Content-Type: application/json');

// Include PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

$name = strip_tags(trim($data['name'] ?? ''));
$email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$phone = strip_tags(trim($data['phone'] ?? ''));
$date = strip_tags(trim($data['date'] ?? ''));
$time = strip_tags(trim($data['time'] ?? ''));
$service = strip_tags(trim($data['service'] ?? ''));
$vehicle = strip_tags(trim($data['vehicle'] ?? ''));
$passengers = strip_tags(trim($data['passengers'] ?? ''));
$luggage = strip_tags(trim($data['luggage'] ?? ''));
$returnTrip = !empty($data['return-trip']) ? true : false;
$returnDate = strip_tags(trim($data['return-date'] ?? ''));
$returnTime = strip_tags(trim($data['return-time'] ?? ''));
$message = strip_tags(trim($data['message'] ?? ''));

// Validate required fields
if (!$name || !$email || !$phone || !$date || !$time || !$service || !$vehicle || !$passengers || !$luggage) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
    exit;
}

// Compose email body
$returnInfo = $returnTrip
    ? "Yes\nReturn Date: $returnDate\nReturn Time: $returnTime"
    : "No";

$body = "New Booking Request

Customer Information:
Name: $name
Email: $email
Phone: $phone

Booking Details:
Service Type: $service
Date: $date
Time: $time
Vehicle: $vehicle
Passengers: $passengers
Luggage: $luggage
Return Journey: $returnInfo

Additional Details:
$message
";

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtpout.secureserver.net'; // GoDaddy SMTP server
    $mail->SMTPAuth = true;
    $mail->Username = 'info@cxr.569.mytemp.website'; // Your GoDaddy email
    $mail->Password = 'TTpNo394!!!!'; // GoDaddy email password
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom('info@cxr.569.mytemp.website', 'Lux VIP Charters');
    $mail->addAddress('info@cxr.569.mytemp.website'); // Destination email
    $mail->addReplyTo($email, $name); // Customer reply

    $mail->Subject = "New Booking Request: $service - $name";
    $mail->Body = $body;

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Your booking request has been submitted successfully!']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Mailer Error: {$mail->ErrorInfo}"]);
}
?>