<?php
	include("./sql.php");
	//getQuery("INSERT INTO Match_Data (Team_Number) VALUES (41)");
	//if ($_COOKIE["logged_in"]){
		$data = array();
		$data['Image'] = file_get_contents($_FILES['Image']["tmp_name"]);
		insertData("Markup",removeNull($data));
	//}
?>