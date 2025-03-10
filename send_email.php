<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $phone = htmlspecialchars($_POST['phone']);
    $expertise = htmlspecialchars($_POST['expertise']);
    $message = htmlspecialchars($_POST['message']);

    $to = "worldtextilehubconsulting@gmail.com";
    $subject = "New Consultant Application or Message";
    $headers = "From: " . $email;

    $body = "Name: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message\n\nExpertise:\n$expertise";

    if (mail($to, $subject, $body, $headers)) {
        echo "Message successfully sent!";
    } else {
        echo "Message delivery failed.";
    }
}
?>
