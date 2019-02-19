<?php
//20190105 update - now Lists support details
require_once 'cascade.php';//require the cascade library...that I made
session_start();
//check if user is logged in
if(!isset($_SESSION["UID"])){
	//if they're not logged in return them to the landing page
	header("Location:../index.html");
}
//if they're logged in begin home page procedures
else{
	//Be good web citizens...I suppose
	header("Content-Type: application/json; charset=UTF-8");
	//interpret the json encoded request string
	$request = json_decode($_GET['q'], true);
	//start database connection
	$conn = new mysqli("localhost", "root", /*"toor"*/ NULL, "listapp");
	//sort by action requested
	if(isset($_POST["pwd"])){
		$sql = "UPDATE Users SET pwd=".$_POST['pwd']." WHERE UID=".$_SESSION["UID"];
		if($conn->query($sql)){
			$conn->close();
			echo "success";
		}
		else{
			$conn->close();
			echo "Sorry try again.";
		}
	}
	if($request['table'] == 'Lists' && $request['action'] == 'get'){
		$results = $conn->query("SELECT * FROM Lists WHERE UID='".$_SESSION['UID']."'");
		while($row = $results->fetch_assoc()){
			$output[] = $row;
		}
		echo json_encode($output);
		$results->free();
		$conn->close();
	}
	else{
		echo $request['table']." ".$request['action'];
	}
}
