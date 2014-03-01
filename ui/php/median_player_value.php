<?php

require_once('config.php');
require_once('mysqli_connect.php');

$query = "
			select name, pos, value, cost
			from median_player_value
	";

$stmt = $con -> prepare($sql);

require_once('mysqli_query.php');

?>