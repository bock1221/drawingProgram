<?php header('Access-Control-Allow-Origin:*');
 include_once("PDOconnection.php");   

 
    $drawingName= $_POST[drawingName];
 try{
 	$stmt = $pdo->prepare('SELECT id FROM drawings WHERE :drawingName = drawing_name');
	$stmt->bindValue(':drawingName',$drawingName);
 	$stmt->execute();
	$result= $stmt->fetchAll(PDO::FETCH_ASSOC);
	echo $result;
 }catch(exception $e){
 	
 }






?>