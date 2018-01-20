<?php
$servername = "localhost";
$serveruser = "root";
$password = "team41";
$dbname = "scoutDB";

function newConn(){
	global $servername, $serveruser, $password, $dbname;
	$conn = new mysqli($servername, $serveruser, $password, $dbname);
	if ($conn->connect_error){
		die("Connection failed: " . $conn->connect_error . "\n");
	}
	return $conn;
}

//createDB ( String $name )
function createDB($name){
	$conn = newConn();
	$sql = "CREATE DATABASE " . $name;
	/*if ($conn->query($sql) === TRUE){
		printf("Successfully created database $name\n");
	} else {
		printf("Error creating database $name: " . $conn->error . "\n");
	}*/
	$conn->close();
}

//createTeable ( String $name, Indexed_Array $columns
function createTable($name, $columns){
	$conn = newConn();
	$sql = "CREATE TABLE $name ( " . implode(", ", $columns) . " )";
	/*if ($conn->query($sql) === TRUE){
		printf("Successfully created table $name\n");
	} else {
		printf("Error creating table $name: " . $conn->error . "\n");
	}*/
	$conn->close();
}
function escapeString($d){
	return mysqli::real_escape_string($newConn(),$d);
}
function stringify($v){
	if (is_string($v)) return '"' . $v . '"';
	else return $v;
}
//insertData ( String $tbName, Associative_Array $data
function insertData($tbName, $data){
	$conn = newConn();
	$columns = implode(", ",array_keys($data));
	//$escaped_values = array_map('mysqli::real_escape_string', array_values($data));
	$connection = newConn();
	$escaped_values = array_map(function($value) use ($connection) {
            return mysqli_real_escape_string($connection, $value);
        }, array_values($data));
	$escaped_values = array_map("stringify", $escaped_values);
	$values = implode(", ", $escaped_values);
	//$values = implode(", ", array_values($data));
	$sql = "INSERT INTO $tbName ($columns) VALUES ($values)";
	$conn->query($sql);
	$conn->close();
}

//selectData ( String $tbName, Indexed_Array $columns )
function selectData($tbName, $columns){
	$conn = newConn();
	$sql = "SELECT " . implode(", ",$columns) . " FROM $tbName";
	$result = $conn->query($sql);
	$results = [];
	if ($result->num_rows > 0) {
		// output data of each row
		while($row = $result->fetch_assoc()) {
			array_push($results, $row);
		}
	}/* else {
		printf("0 results");
	}*/
	$conn->close();
}

//getRow ( String $tbName, String $id ["Team_Number"], $value [41] )
function getRow($tbName, $id, $value){
	$conn = newConn();
	$sql = "SELECT * FROM $tbName WHERE $id=$value";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		// output data of each row
		while($row = $result->fetch_assoc()) {
			echo "id: " . $row["id"]. " - Name: " . $row["firstname"]. " " . $row["lastname"]. "<br>";
		}
	}/* else {
		echo "0 results";
	}*/
	$conn->close();
}

function getQuery($query){
	$conn = newConn();
	$sql = $query;
	$result = $conn->query($sql);
	$results = [];
	if ($result){
		if ($result->num_rows > 0) {
			// output data of each row
			while($row = $result->fetch_assoc()) {
				array_push($results, $row);
			}
		}
	}/* else {
		echo "0 results";
	}*/
	$conn->close();
	return $results;
}

function removeNull($array){
	$newArray = array();
	foreach ($array as $key => $value){
		if ($value && $value != "") $newArray[$key] = $value;
	}
	return $newArray;
}
