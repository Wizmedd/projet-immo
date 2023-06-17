<?php
$hostname = 'pxukqohrckdfo4ty.cbetxkdyhwsb.us-east-1.rds.amazonaws.com';
$username = 'fl2gfuwgznxnrhaz';
$password = 'f6clacui03l9lti6';

function testdb_connect($hostname, $username, $password)
{
    $db = new PDO("mysql:host=$hostname;port=3306;dbname=h3kza5sfzo2108lm", $username, $password);
    return $db;
}

try {
    $db = testdb_connect($hostname, $username, $password);
} catch (PDOException $e) {
    echo $e->getMessage();
}
