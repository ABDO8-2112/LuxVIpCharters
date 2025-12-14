<?php
header('Content-Type: application/json');

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

Submitted on: " . date("Y-m-d H:i:s") . "
";

// GoDaddy email settings
$to = 'luxchartersperth@outlook.com'; // Destination email (matching request)
$from = 'no-reply@luxvipchartersperth.com.au'; // Verified GoDaddy email
$subject = "New Booking Request: $service - $name";

// Headers
$headers = "From: Lux VIP Charters <$from>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email (removed -f parameter which often causes failure on shared hosting if not authorized)
if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Your booking request has been submitted successfully!']);
} else {
    error_log("Booking email failed to send.");
    echo json_encode(['success' => false, 'message' => 'Failed to send booking request. Please try again later.']);
}
?>