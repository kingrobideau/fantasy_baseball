<?php

$database_server = "localhost";
$database_user = "root";
$database_pass = NULL;
$database_name = "fantasy_commander";
	
$con = mysqli_connect($database_server, $database_user, $database_pass, $database_name);

if ( ! $con ) {
	echo("Problem connecting to the MySQL database");
    echo mysql_error();
    die;
} 

?>