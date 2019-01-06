<?php
$conn = new mysqli('localhost', 'root', 'toor');
$sql = "CREATE DATABASE IF NOT EXISTS listapp";
$conn->query($sql);
$conn->free();
$sql = "USE listapp";
$conn->query($sql);
$conn->free();
$sql = "CREATE TABLE IF NOT EXISTS Users(UID INT(10) AUTO_INCREMENT NOT NULL PRIMARY KEY, username VARCHAR(30) NOT NULL, email VARCHAR(30) NOT NULL, fName CHAR(30), lName CHAR(30), mName CHAR(30), pwd VARCHAR(30) NOT NULL)";
$conn->query($sql);
$conn->free();
$sql = "CREATE TABLE IF NOT EXISTS Lists(LID INT(14) AUTO_INCREMENT NOT NULL PRIMARY KEY, ListName VARCHAR(30) NOT NULL, Details TEXT, UID INT(10), FOREIGN KEY (UID) REFERENCES Users(UID))";
$conn->query($sql);
$conn->free();
$sql = "CREATE TABLE IF NOT EXISTS Tasks(TID INT(18) AUTO_INCREMENT NOT NULL PRIMARY KEY, TaskName VARCHAR(30) NOT NULL, Complete BOOL DEFAULT FALSE, Details TEXT, LID INT(14), FOREIGN KEY (LID) REFERENCES Lists(LID))";
?>