<?php
	session_start();
?>
<html>

<head>
	<link href="https://fonts.googleapis.com/css?family=Raleway|Coda" rel="stylesheet" />
	<link href="./style.css" rel="stylesheet" />
	<meta name="viewport" content="width=device-width" />
	<title>Scoutron Raw Match Data</title>
	<style>
		.table th, .table td {
			padding: 5px;
		}
	</style>
</head>

<body>
	<a href="./index.html" class="back">Back</a>
	<h1>Scoutron<sup>&copy;</sup> Raw Match Data 2017</h1>
	<?php
		if ($_SESSION["logged_in"] == "true" && $_SESSION["admin"] == "true") $access = true;
		if (!$access) echo "You must be an administrator to access the raw data<!--";
	?>
	<table class="table" id="table">
		<thead>
			<tr>
			<?php
				if ($access){
					include("./form/sql.php");
					$rows = getQuery("SELECT * FROM Match_Data");
					//Create table headers
					foreach($rows[0] as $key=>$value){
						echo "<th>" . str_replace("_"," ",$key) . "</th>";
					}
				}
			?>
			</tr>
		</thead>
		<tbody>
			<?php
				if ($access){
					foreach($rows as $row){
						echo "<tr>";
						foreach($row as $value){
							echo "<td>" . $value . "</td>";
						}
						echo "</tr>";
					}
				}
			?>
		</tbody>
	</table>
	<?php if (!$access) echo "-->"; ?>
</body>

</html>
