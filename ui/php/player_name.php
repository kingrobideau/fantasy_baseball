
<?php

require_once('mysqli_connect.php'); 

$sql = 
"
		SELECT name FROM(
			SELECT DISTINCT name FROM projected_batter_value
			UNION
			SELECT DISTINCT name FROM projected_pitcher_value
		) t
		ORDER BY name;
";

require_once('mysqli_query.php');

?>