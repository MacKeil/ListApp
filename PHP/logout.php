<?php
//logout.php
//used to log the user out
session_start();//make sure we're attached to a current session
session_destroy();//DESTROY IT!
header("Location:../index.html");//send the user back to the index page
?>