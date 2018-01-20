<?php
	session_start();
	include("./sql.php");
	//getQuery("INSERT INTO Match_Data (Team_Number) VALUES (41)");
	//if ($_COOKIE["logged_in"]){
	if($_SESSION["logged_in"] == "true"){
		$data = array(
			"Team_Number"=>$_POST["Team_Number"],
			"Wheel_Base"=>$_POST["Wheel_Base"],
			"Wheel_Type"=>$_POST["Wheel_Type"],
			"Ball_Pickup"=> (isset($_POST["Ball_Pickup"])) ? 1 : 0,
			"Gear_Pickup"=> (isset($_POST["Gear_Pickup"])) ? 1 : 0,
			"Climb"=> (isset($_POST["Climb"])) ? 1 : 0,
			"Notes"=>$_POST["Notes"],
			"Username"=>$_SESSION["username"]);
		if ($_FILES['Image']){
			$data['Image'] = file_get_contents($_FILES['Image']["tmp_name"]);
		}
		insertData("Pit_Data",removeNull($data));
		echo '{"logged_in": true}';
	} else {
		echo '{"logged_in": false}';
	}
?>