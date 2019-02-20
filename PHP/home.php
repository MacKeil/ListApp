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
	if($request['table'] == "Users" && $request["action"] == 'get'){
		//homepage requested to see the user's information
		$result = $conn->query("SELECT username, fName, mName, lName FROM Users WHERE UID='".$_SESSION['UID']."'");
		$row = $result->fetch_assoc();//turn the result into a use-able form
		$json = json_encode($row);//convert to json
		$result->free();//free up the connection
		echo $json;//send all the data we have the js will parse it for usefulness 
        $conn->close();
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

	if($request['table'] == "Tasks" && $request['action'] == "get"){
		//home page requested to see all tasks for a list
		$result = $conn->query("SELECT TID, TaskName, Complete, Details FROM Tasks WHERE LID=".$request["LID"]);
		while($row = $result->fetch_assoc()){//get a associative array to turn into json
			$output[] = $row;
		}
		$json = json_encode($output);//convert to json
		$result->free();//free up the database connection
        	$conn->close();
		echo $json;//send the data back up to the front end
	}
	if($request['table'] == "Lists" && $request['action'] == 'create'){
		//home page requested to make a new list
		$sql = "INSERT INTO Lists(ListName, Details, UID) Values('".$request['ListName']."', '".$request['Details']."', '".$_SESSION['UID']."')";
		if($conn->query($sql)){
			//if the query worked send an alert up to the front end
			echo "success";
		}
		else{
			//if the query failed send an alert to the front end
			echo "Sorry try again.";	
            echo $conn->error;
		}
		$conn->close();//free up the connection to the database
	}
	if($request['table'] == "Tasks" && $request['action'] == 'create'){
		//home page requested to make a new task inside a list
		$sql = "INSERT INTO Tasks(TaskName, Details, Complete, LID) Values('".$request['TaskName']."', '";
		$sql .= $request['Details']."', '0', '". $request['LID']."')"; //couldn't stand the long line
		if($conn->query($sql)){
			//if the query worked send an alert up to the front end
			echo "success";
		}
		else{
			//if the query didn't work send an alert up to the front end
			echo "Sorry try again.";
		}
		$conn->close();//free up the connection to the database
	}
	if($request['table'] == "Users" && $request['action'] == 'update'){
		if($request['target'] == 'username'){
			$sql = "UPDATE Users SET username=".$request["username"]." WHERE UID=".$_SESSION["UID"];
			if($conn->query($sql)){
				$conn->close();
				echo "success";
			}
			else {
				$conn->close();
				echo "sorry try again.";
			}
		}
		if($request['target'] == 'fName'){
			$sql = "UPDATE Users SET fName=".$request["fName"]." WHERE UID=".$_SESSION["UID"];
			if($conn->query($sql)){
				$conn->close();
				echo "success";
			}
			else {
				$conn->close();
				echo "sorry try again.";
			}
		}
		if($request['target'] == 'mName'){
			$sql = "UPDATE Users SET mName=".$request["mName"]." WHERE UID=".$_SESSION["UID"];
			if($conn->query($sql)){
				$conn->close();
				echo "success";
			}
			else {
				$conn->close();
				echo "sorry try again.";
			}
		}
		if($request['target'] == 'lName'){
			$sql = "UPDATE Users SET lName=".$request["lName"]." WHERE UID=".$_SESSION["UID"];
			if($conn->query($sql)){
				$conn->close();
				echo "success";
			}
			else {
				$conn->close();
				echo "sorry try again.";
			}
		}
		
	}
	if($request['table'] == "Lists" && $request['action'] == 'update'){
		//home page requested to update a list
		if($request['target'] == 'ListName'){
			$sql = "UPDATE Lists SET ListName=".$request['ListName']." WHERE LID=".$request['LID'];
			if($conn->query($sql)){
				//if the query is successful alert the front end
				$conn->close();
				echo "success";
			}
			else{
				//if the query fails alert the front end
				$conn->close();
				echo "Sorry try again.";
			}
		}
		if($request['target'] == 'Details'){
			$sql = "UPDATE Lists SET Details=".$request['Details']." WHERE LID=".$request['LID'];
			if($conn->query($sql)){
				//if the query worked alert the front end
				$conn->close(); //free up the database connection
				echo "success";
			}
			else{
				//if the query failed alert the frond end
				$conn->close(); //free up the database connection
				echo "Sorry try again.";
			}
		}
	}
	if($request['table'] == "Tasks" && $request['action'] == 'update'){
		//home page requested to update a task
		//this one's a bit more tricky as there are a few things that the user may want to update
		$sql = "UPDATE Tasks SET ";
		if($request['target'] === 'TaskName'){
		//user want's to update the TaskName
			$sql .= "TaskName='".$request['TaskName']."' WHERE TID='".$request['TID']."'";
			if($conn->query($sql)){
				//if it worked update the front end
				echo "success";
			}
			else{
				//if it failed update the front end
				echo "Sorry try again.";
			}
		}
		if($request['target'] === 'Details'){
			//user want's to update the task details
			$sql .= "Details='".$request['Details']."' WHERE TID='".$request['TID']."'";
			if($conn->query($sql)){
				//if it worked update the front end
				echo "success";
			}
			else{
				//if it failed update the front end
				echo "Sorry try again.";
			}
		}
		if($request['target'] === 'Complete'){
			//user want's to update the task's completion status
			$sql .= "Complete='".$request['Complete']."' WHERE TID='".$request['TID']."'";
			if($conn->query($sql)){
				//if it worked update the front end
				echo "success";
			}
			else{
				echo "Sorry try again.";
			}
		}
		$conn->close();//free up the connection to the database
	}
	if($request['table'] == "Lists" && $request['action'] == 'delete'){
		//home page requests to delete a list
		$worked = delete_list_tasks($conn, $LID);//call function for deleting all the tasks in a list
		$sql = "DELETE FROM Lists WHERE LID=".$request['LID'];
		if($conn->query($sql) && $worked){
			//if they both worked alert the front end
			echo "success";
		}
		else{
			//if either of them failed
			echo "Sorry try again.";
		}
		$conn->close();//free up the connection
	}
	if($request['table'] == "Tasks" && $request['action'] == 'delete'){
		//home page requests to delete a task
		//this one's a lot easier
		$sql = "DELETE FROM Tasks WHERE TID=".$request['TID'];
		if($conn->query($sql)){
			//if it worked alert the front end
			echo "success";	
		}
		else{
			//if it failed alert the front end
			echo "Sorry try again.";
		}
		$conn->close();//free up the connection
	}
	if($request['table'] == "Users" && $request['action'] == 'delete'){
		//home page requests to delete the user
		//hardest one
		delete_user_lists($conn, $_SESSION["UID"]);//delete all user data
		$sql = "DELETE FROM Users WHERE UID=".$_SESSION['UID'];
		if($conn->query($sql)){
			//if the user is deleted and data isn't...we're keeping it...I guess
			$conn->close();//the user won't be needing this anymore
			session_destroy();//AUTHORIZATION REVOKED...YEET
			header("Location:../index.html"); //not sure that's gonna work
		}
		else{
			//it failed better let the user know their attempt to leave didn't work
			echo "Something went wrong try leaving us again later.\n <small><sub>You Brute!</sub></small>";
			$conn->close();//free up the database connection
		}
	}
}
?>
