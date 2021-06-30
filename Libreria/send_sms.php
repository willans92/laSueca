<?php
require __DIR__ . '/vendor/autoload.php';
use Twilio\Rest\Client;

$account_sid = 'ACbf62bab7fb86194573a43fd413985bb9';
$auth_token = 'd23faf563cba596f174dccd926d42d03';
$twilio_number = "+19547154120";

$client = new Client($account_sid, $auth_token);
$client->messages->create(
    '+59175685675',
    array(
        'from' => $twilio_number,
        'body' => 'Ingresa este código EKX para terminar de realizar tu pedido:'
    )
);