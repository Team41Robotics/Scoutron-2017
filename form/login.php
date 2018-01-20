<?php
	session_start();
	include("./sql.php");

	if (isset($_POST["Username"]) && isset($_POST["Password"])){
		$query = 'SELECT Password FROM Login WHERE Username="' . $_POST["Username"] . '"';
		$result = getQuery($query)[0];
		if ($_POST["Password"] == $result["Password"]){
			$logged_in = "true";
			$username = $_POST["Username"];
			$adminStat = getQuery('SELECT Admin_Status FROM Login WHERE Username="' . $_POST["Username"] . '"')[0]["Admin_Status"];
			if ($adminStat == 1){
				$admin = "true";
			} else {
				$admin = "false";
			}
		} else {
			$logged_in = "false";
			$username = "false";
			$admin = "false";
		}
		$_SESSION["logged_in"] = $logged_in;
		$_SESSION["username"] = $username;
		$_SESSION["admin"] = $admin;
	}
	//if ($_COOKIE["logged_in"] == "true"){
		echo '{"logged_in": ' . $logged_in . ', "username": "' . $username . '", "admin": ' . $admin . '}';
	//} else {
	//	echo "{'logged_in': false}";
	//}
?>