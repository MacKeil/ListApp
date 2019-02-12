<?php
	/**
	 * cascade.php 
	 * ---------------------------
	 * File for include that deals with cascading deletions, and insertions
	 */
	 
	 //delete_list_tasks
	 //@param $DBConnection - a mysqli connection
	 //@param $ListID - the id for the list that we're deleting 
	 //@return - boolean value indicating success or failure
	 function delete_list_tasks($DBConnection, $ListID){
	 	//craft query to delete all tasks associated with this list
	 	$sql = "DELETE FROM Tasks WHERE LID=".$ListID;
	 	if($DBConnection->query($sql)){
	 		 
	 		//if the query worked return true
	 		return TRUE;
	 	}
	 	$DBConnection->free();//free the connection
	 	//otherwise return false
	 	return FALSE;
	 }
	 
	 //delete_user_lists
	 //@param $DBConnection - a mysqli connection
	 //@param $UserID - the user's ID that we're deleting lists for
	 //@return - boolean value indicating success of failure
	 function delete_user_lists($DBConnection, $UserID){
	 	//first find all List ID's associated with the user
	 	$sql = "SELECT Lists.LID FROM Lists WHERE UID=".$UserID;
	 	$results = $DBConnection->query($sql);
	 	$row = $results->fetch_row();//we only need the one row for the one dataset
	 	$RCount = count($row);//get the length of the dataset
	 	//run through the dataset and remove the tasks within the lists
	 	for($i = 0; $i < $RCount; $i++){
	 		delete_list_tasks($DBConnection, $row[$i]);//use what we already built
	 	}
        $results->free();
	 	//Now delete the lists themselves
	 	$sql = "DELETE FROM Lists WHERE UID=".$UserID;
	 	if($DBConnection->query($sql)){
	 		return TRUE;
	 	}
	 	return FALSE;
	 }
?>