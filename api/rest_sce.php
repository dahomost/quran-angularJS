<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// REST API to get data using HTTP request
  
	$sura = (isset($_REQUEST['sura']))? trim($_REQUEST['sura']) : '';
    $c = (isset($_REQUEST['c']))? $_REQUEST['c'] : '';
	$searchMe = (isset($_REQUEST['searchMe']))? $_REQUEST['searchMe'] : '';
	$searchIndex = (isset($_REQUEST['searchIndex']))? $_REQUEST['searchIndex'] : 0;
	$conn = mysqli_connect("localhost","root","","full_quran",3306);
	if (mysqli_connect_errno()) exit("Connect failed: %s\n".mysqli_connect_error());
	if (!mysqli_set_charset($conn, "utf8")) exit("Error loading character set utf8: %s\n". mysqli_error($conn));

    switch ($c) {
    	case 'SuraText':
    		exit(getSuraTextJSON($sura));
    		break;
 
     	case 'suraName':
    		exit(getSuraNameJSON());
    		break;

     	case 'search':
    		exit(searchWordsJSON($searchMe, $searchIndex));
    		break;

    	default:
    		# code...
    		break;
    }

//----------------------------------------------------------------------------------

function getSuraTextJSON($sura){
    global $conn;
	$sql  = "SELECT  `aya`, `text` FROM `quran_text` where sura=".$sura;
    $result = mysqli_query($conn, $sql);
	$data = '{"quranKarim":[';
	 
	while ($row=mysqli_fetch_array($result))
		$data .= '{"aya":"'.$row['aya'].'","text":"'.$row['text'].'"},';
		
		return chop($data,"\,").']}' ;
}

//----------------------------------------------------------------------------------

function searchWordsJSON($searchMe, $searchIndex) {
  global $conn;
  $sql = "SELECT chapters.name as sura, qs.aya, qs.text FROM `quran_search` qs INNER JOIN `quran_text` qt on qs.sura=qt.sura and qs.aya=qt.aya INNER JOIN chapters on qs.sura=chapters.index WHERE qs.text LIKE '%".$searchMe."%'";
  $result = mysqli_query($conn, $sql);
  $data = '{"searchMe":[';
	 
	while ($row=mysqli_fetch_array($result)) {
		
		$data .= '{"sura":"'.$row['sura'].'","aya":"'.$row['aya'].'","text":"'.$row['text'].'"},';
	}
		return chop($data,"\,").']}' ;
}

//----------------------------------------------------------------------------------

function getSuraNameJSON(){
    global $conn;
	$sql  = "SELECT  `index`, `name` FROM `chapters`";
    $result = mysqli_query($conn, $sql);
	$data = '{"chapters":[';
	 
	while ($row=mysqli_fetch_array($result))
		$data .= '{"index":"'.$row['index'].'","name":"'.$row['name'].'"},';
		
		return chop($data,"\,").']}' ;
}


?>