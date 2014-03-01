<?php

$stmt -> execute();
$result = $stmt -> get_result();
$data = array();
while($row = $result -> fetch_array(MYSQL_ASSOC)) {
	$data[] = $row;
}

echo json_encode($data); 

mysqli_close($con);

?>