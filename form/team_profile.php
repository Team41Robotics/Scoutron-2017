<?php
	session_start();
	include("./sql.php");

	if($_SESSION["logged_in"] == "true" && $_SESSION["admin"] == "true"){
		$N = $_POST["Team_Number"];
		exec("Rscript '/home/peter/avg_brandon.R' $N");

		$match_datas = getQuery('SELECT * FROM Match_Averages WHERE Team_Number=' . $_POST["Team_Number"])[0];
		$match_datas["Notes"] = "";
		$match_notes = getQuery('SELECT Notes FROM Match_Data WHERE Team_Number=' . $_POST["Team_Number"]);
		for($i = 0; $i < count($match_notes); $i++){
			$match_datas["Notes"] .= $match_notes[$i]["Notes"] . "<br/>";
		}
		$pit_datas = getQuery('SELECT * FROM Pit_Data WHERE Team_Number=' . $_POST["Team_Number"]);

		$all_entries = array("Match_Data"=>$match_datas);
			//"Pit_Data"=>$pit_datas);
		if ($pit_datas[0]){
			$all_entries["Pit_Data"] = $pit_datas[0];
		}
		$all_entries["admin"] = true;
		echo json_encode($all_entries);
	} else {
		echo '{"admin": false}';
	}
?>
