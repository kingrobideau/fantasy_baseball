<?php

$query = mysqli_query($con, $sql);

if ( ! $sql ) {
    echo mysql_error();
    die;
}

$data = array();
for ($x = 0; $x < mysqli_num_rows($query); $x++) {
    $data[] = mysqli_fetch_assoc($query);
}

echo json_encode($data);     
 
mysqli_close($con);

?>