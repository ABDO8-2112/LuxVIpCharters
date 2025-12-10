<?php
header('Content-Type: application/json');

// Include PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Only allow POST requests
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
$returnTrip = !empty($data['return-trip']);
$returnDate = strip_tags(trim($data['return-date'] ?? ''));
$returnTime = strip_tags(trim($data['return-time'] ?? ''));
$message = strip_tags(trim($data['message'] ?? ''));

// Validate required fields
if (!$name || !$email || !$phone || !$date || !$time || !$service || !$vehicle || !$passengers || !$luggage) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
    exit;
}

// Compose email body (HTML)
$returnInfo = $returnTrip
    ? "Yes<br>Return Date: $returnDate<br>Return Time: $returnTime"
    : "No";

$body = "
<h2>New Booking Request</h2>
<h3>Customer Information</h3>
<p><strong>Name:</strong> {$name}</p>
<p><strong>Email:</strong> {$email}</p>
<p><strong>Phone:</strong> {$phone}</p>

<h3>Booking Details</h3>
<p><strong>Service Type:</strong> {$service}</p>
<p><strong>Date:</strong> {$date}</p>
<p><strong>Time:</strong> {$time}</p>
<p><strong>Vehicle:</strong> {$vehicle}</p>
<p><strong>Passengers:</strong> {$passengers}</p>
<p><strong>Luggage:</strong> {$luggage}</p>
<p><strong>Return Journey:</strong> {$returnInfo}</p>

" . ($message ? "<h3>Additional Details</h3><p>{$message}</p>" : "") . "
<hr>
<p><em>This booking request was submitted from the Lux VIP Charters booking form.</em></p>
<p><em>Submitted on: " . date("Y-m-d H:i:s") . "</em></p>
";

try {
    $mail = new PHPMailer(true);

    // SMTP configuration
    $mail->isSMTP();
    $mail->Host = 'smtpout.secureserver.net';
    $mail->SMTPAuth = true;
    $mail->Username = 'info@cxr.569.mytemp.website'; // Your GoDaddy email
    $mail->Password = 'YOUR_GODADDY_EMAIL_PASSWORD';  // Use correct password
    $mail->SMTPSecure = 'tls'; // 'ssl' for port 465
    $mail->Port = 587;

    // Debugging (logs to PHP error log)
    $mail->SMTPDebug = 0; // Set 2 for testing
    $mail->Debugoutput = 'error_log';

    // Email addresses
    $mail->setFrom('info@cxr.569.mytemp.website', 'Lux VIP Charters'); // Must match GoDaddy domain email
    $mail->addAddress('aamirbhattid08@gmail.com'); // Destination email
    $mail->addReplyTo($email, $name); // Customer reply

    // Email content
    $mail->isHTML(true);
    $mail->Subject = "New Booking Request: $service - $name";
    $mail->Body = $body;

    // Send email
    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Your booking request has been submitted successfully!']);
} catch (Exception $e) {
    error_log("PHPMailer Error: {$mail->ErrorInfo}");
    echo json_encode(['success' => false, 'message' => "Failed to send email. Please try again later."]);
}
?>