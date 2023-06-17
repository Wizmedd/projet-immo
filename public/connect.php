<?php
$hostname = 'nnsgluut5mye50or.cbetxkdyhwsb.us-east-1.rds.amazonaws.com';
$username = 'xhwgw72ww892uevc';
$password = 'k0l2m2nicda5ej5n';

function testdb_connect($hostname, $username, $password)
{
    $db = new PDO("mysql:host=$hostname;port=3306;dbname=b8adq0w5pcfs5c69", $username, $password);
    return $db;
}

try {
    $db = testdb_connect($hostname, $username, $password);
} catch (PDOException $e) {
    echo $e->getMessage();
}
