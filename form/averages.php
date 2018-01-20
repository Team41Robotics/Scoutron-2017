<?php
	//include("./sql.php");
	function calc_average($teamNum){
		getQuery("DELETE FROM Match_Averages WHERE Team_Number=$teamNum");
		$data = getQuery("SELECT * FROM Match_Data WHERE Team_Number=$teamNum");
		$new_data = array();
		$data_count = array();
		for($i = 0; $i < count($data); $i++){
			foreach($data[$i] as $key=>$value){
				if ($i == 0){
					$new_data[$key] = $value;
					$data_count[$key] = 1;
				} else {
					$new_data[$key] += $value;
					$data_count[$key]++;
				}
			}
		}
		foreach($new_data as $key=>$value){
			$new_data[$key] /= $data_count[$key];
		}
		insertData("Match_Averages", removeNull($new_data));
	}
?>
