<?php
	session_start();
	include("./sql.php");
	include("./averages.php");
	//getQuery("INSERT INTO Match_Data (Team_Number) VALUES (41)");
	//if ($_COOKIE["logged_in"]){
	if($_SESSION["logged_in"] == "true"){
		$data = array(
			"Team_Number"=>$_POST["Team_Number"],
			"Low_Goal_Auton"=>$_POST["Low_Goal_Auton"],
			"High_Goal_Auton"=>$_POST["High_Goal_Auton"],
			"Gear_Placed_Auton"=>(isset($_POST["Gear_Placed_Auton"]) ? 1 : 0),
			"Moved_Auton"=>(isset($_POST["Moved_Auton"]) ? 1 : 0),
			"Low_Goal_Teleop"=>$_POST["Low_Goal_Teleop"],
			"High_Goal_Teleop"=>$_POST["High_Goal_Teleop"],
			"Gear_Placed_Teleop"=>$_POST["Gear_Placed_Teleop"],
			"Climb_Teleop"=> ($_POST["Climb_Teleop"] == "NULL") ? null : $_POST["Climb_Teleop"],
			"Speed"=> ($_POST["Speed"] == "NULL") ? null : $_POST["Speed"],
			"Tie"=> ($_POST["Outcome"] == 1) ? 1 : 0,
			"Win"=> ($_POST["Outcome"] == 2) ? 1 : 0,
			"Total_Game_Points"=>$_POST["Total_Game_Points"],
			"40kP"=> isset($_POST["40kP"]),
			"All_Rotors"=> isset($_POST["All_Rotors"]),
			"Foul_Points"=> $_POST["Foul_Points"],
			"Number_Of_Fouls"=> $_POST["Number_Of_Fouls"],
			"Notes"=>$_POST["Notes"]);
		$data["Username"] = $_SESSION["username"];
		insertData("Match_Data",removeNull($data));
		echo '{"logged_in": true}';
		//exec("Rscript /home/peter/avg_brandon.R " . $_POST["Team_Number"]);
		calc_average($_POST["Team_Number"]);
	} else {
		echo '{"logged_in": false}';
	}
?>
