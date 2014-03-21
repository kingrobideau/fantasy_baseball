<?php

require_once('mysqli_connect.php');

$sql = "
			SELECT 
				name,
				year,
				team,
				hr,
				war
			FROM fangraphs_batter_standard 
			WHERE team = 'steamer'
	";

require_once('mysqli_query.php');

?>