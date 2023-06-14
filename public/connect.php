<?php
$hostname = 'localhost';
$username = 'root';
$password = '';

function testdb_connect($hostname, $username, $password)
{
    $db = new PDO("mysql:host=$hostname;dbname=new-project", $username, $password);
    return $db;
}

try {
    $db = testdb_connect($hostname, $username, $password);
} catch (PDOException $e) {
    echo $e->getMessage();
}
