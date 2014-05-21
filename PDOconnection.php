<?php
   
	$username="root";
	$password="root";
    try {
	  	$pdo = new PDO('mysql:host=localhost;dbname=drawings', $username, $password);
		echo "works";
		}catch(PDOException $e) {
  		echo 'hi' . $e->getMessage();
		exit();
	}
	

?>