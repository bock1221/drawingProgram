<?php header('Access-Control-Allow-Origin:*');
function getJson(){
	if($_SERVER['REQUEST_METHOD']=="POST"){
		//$new=$_POST["new"];
		$drawingName =$_POST["drawingName"];	
		$data = $_POST["data"];
	    pdoConnection($drawingName,$data);
	}else{
		getDataDB();	
	}
};
getJson();

function pdoConnection($drawingName,$data) {
	$username="root";
	$password="root";
    try {
  $pdo = new PDO('mysql:host=localhost;dbname=drawings', $$username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
 
  $stmt = $pdo->prepare('START TRANSACTION; INSERT INTO drawings VALUES(:name)');
  $stmt->execute(array(
    ':name' => $name,
    ));
	$drawing_id =$pdo->lastInsertId();
	$stmt2 = $pdo->prepare(' INSERT INTO items VALUES(:order_id,:data);INSERT INTO items values(:drawing_id,:data)');
	$stmt2->execute(array(':drawing_id'=>$drawing_id,':data'=>$data));
 
  # Affected Rows?
  echo $stmt->rowCount(); // 
} catch(PDOException $e) {
  echo 'Error: ' . $e->getMessage();
}
};

function getDataDB(){
	$mainArray=array();
	$username="root";
	$password="root";
    try {
  		$pdo = new PDO('mysql:host=localhost;dbname=snake_scores', $username, $password);
  		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
 
  		$data = $pdo->query('SELECT * FROM scores');
 		foreach($data as $row) {
 		$dataArray=array();	
        array_push($dataArray,$row[0],$row[1]);
        array_push($mainArray,$dataArray); 
		}
		echo json_encode($mainArray);
    } catch(PDOException $e) {
	  echo 'Error: ' . $e->getMessage();
	}	
	};

?>