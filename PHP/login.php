<?php
//if we got the data proceed with login
if(isset($_POST['email']) && isset($_POST['pwd'])){
	$email = clean($_POST['email']);
	$pwd = clean($_POST['pwd']);
	$conn = new mysqli("localhost", "root", /*"toor"*/ NULL, "listapp");//connect to database
	$sql = "SELECT pwd, UID FROM Users WHERE email='".$email."'";
	$results = $conn->query($sql);
	if($results){
		$row = $results->fetch_assoc();//get the results in a manner we can work with
		if($row['pwd'] === $pwd){//if the password is right
			session_start();	//start a session
			$_SESSION['UID'] = $row['UID']; //keep the user ID for later
            $results->free();
			$conn->close(); // close the connection
			header("Location:../home.html");	//redirect to the user's homepage
		}	
		else {
			echo "Wrong Email or Password, Please try again.";//echo to the front end for an alert dialog
            $results->free();
            $conn->close();
		}
	}
	else {
		echo "Something went wrong on the server. Please try again later.";
		echo $conn->error;
		echo $php_errormsg;
		$conn->close();
	}
}
//this will only get triggered if the script gets accessed by unauthorized use
else {
	echo "why are you using this script if there's no input?";
}
//function for cleaning input data
function clean($data){
	$data = stripcslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}
?>