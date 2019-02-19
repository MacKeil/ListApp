<?php
//require at least the username, password, and email
if(isset($_POST['email']) && isset($_POST['username']) && isset($_POST['pwd'])){
	$conn = new mysqli('localhost', 'root', /*'toor'*/ NULL, 'listapp'); //connect to the database
	$email = /*clean(*/$_POST['email'];//);
	$results = $conn->query('SELECT UID FROM Users WHERE email="'.$email.'"');//check if the email already exists
	//if the email isn't in the database create new user
	if(!$results){
		//turn the other two into variables
		$username = clean($_POST['username']);
		$pwd = clean($_POST['pwd']);
		//start the query
		$sql = "INSERT INTO Users(username, email";
		//see if the user gave us the optional data
		if(isset($_POST['fName']) && $_POST['fName'] !== ""){
			$fName = clean($_POST['fName']);
			$sql .= ", fName";
		}
		if(isset($_POST['lName']) && $_POST['lName'] !== ""){
			$lName = clean($_POST['lName']);
			$sql .= ", lName";		
		}
		if(isset($_POST['mName']) && $_POST['mName'] !== ""){
			$mName = clean($_POST['mName']);
			$sql .= ", mName";		
		}
		$sql .= ", pwd) Values('".$username."', '".$email;
		if(isset($fName)){
			$sql .= "', '".$fName;
		}
		if(isset($lName)){
			$sql .= "', '".$lName;
		}
		if(isset($mName)){
			$sql .= "', '".$mName;
		}
		$sql .= "', '".$pwd."')";
        $conn->close();
        $conn = new mysqli("localhost", "root", NULL, "listapp");
		//create the user in the database
		if($conn->query($sql) === TRUE){
			session_start();
			$_SESSION['UID'] = $conn->insert_id;
			$conn->close();
			header("Location:../home.html");
		}
		//if the insert failed for whatever reason
		else{
			echo "Insertion Error. Please try signing up later.\n Sorry :'(";
            echo $conn->connect_error;
            $conn->close();
		}
	}
	//if the email is in the database tell use to log in, or recover password
	else{
		echo "Account already exists. Please log in. \n Having trouble? try recovering your password."; 
        $conn->close();
	}
}
//sanitize user input data
function clean($data){
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}
?>