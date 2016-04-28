# Quran AmgularJS 
      is an SPA (single Page Application) to display Quran Chapers/Verses ith nice effects and interaction. 
      Licensed under GPL license. You may Fork this repo and create a new branch for your patch.
         * ee demo ithout audio at : 
         * ee demo ith audio at: 

It was built using :
    * AngularJS 
    * HTML
    * Jquery
    * CSS3
    * Ajax
    * JSON
    * MySQL
    * PHP

## Code Source

### JS code:
``` Javasript
// Define Module 
var app = angular.module('myApp', []);

//---------------------------------------------
// Controller to get chapters & verses content

app.controller('contentCtrl', function($scope, $http) {
            var xVar1={};
            $http({
                   method : 'GET',
                   url :  'api/rest_sce.php?c=suraName'
                }).then( function(response) {
                   xVar1 = response.data.chapters;
                   $scope.achapters = xVar1;
				   //console.log(xVar1);
                });
				
            $scope.sel1 = '';
            $scope.sel2 = '';
			$scope.searchMe = '';
			$scope.selectedSura='001'; 
			$scope.selectedReceiter='alafasi';
			
            $scope.gotoAyat = function(aya){
               $('span[id^="aya"]').removeClass("verseClicked");
               $("#aya"+aya).addClass("verseClicked");
              // $('html,body').animate({scrollTop: $("#aya"+aya).offset().top-170},'slow');
            };
			
			$scope.readAudio = function(selectedReceiter) {
				$scope.selectedReceiter = selectedReceiter;
			    $('.audioDiv').html('<audio controls><source src="audio/'+selectedReceiter+'/'+('000'+$scope.selectedSura).slice(-3)+'.mp3" type="audio/mpeg"></audio>');
				
			};
			
			$scope.searchWords = function(searchMe) {
        var i, j, ayateStr='', ayateStrAray;
				if (searchMe.length<2) { 
					$('#loader').html('<p align="center"style="color:red;">ادخل كلمة للبحث</p>');
					return;
				}

				$('#loader').html('<p align="center"><img src="images/loader.gif" width="50"><br />Searching - بحث</p>');
				$http({
				    method: 'GET',
                    url :  'api/rest_sce.php?c=search&searchMe=' + searchMe
                }).then( function(response) {
                   xVar1 = response.data.searchMe;
				   $('#loader').html('');
				   $scope.asura = {};
				   $scope.showSuraTitle = false;
           $scope.showBismiDiv = false;
				   $('#serchedVerses').html(' <p align="center" style="padding:0; color: #fff; background-color:#3189A3; border-radius: .7rem; width: 80%; margin:0 auto;">  نتائج البحث: ('+xVar1.length+') آية</p>');
				   for ( i=0; i<xVar1.length; i++ ) {
					    ayateStr = '<div class="searchAyates">';
              ayateStrAray = xVar1[i].text.split(' ');  
              for ( j=0; j<ayateStrAray.length; j++ ) {
                if ( ayateStrAray[j].indexOf(searchMe)!=-1 ) ayateStrAray[j] = '<span class="ayaFound">'+ayateStrAray[j]+'</span>';
                ayateStr += ayateStrAray[j] + ' ';
              }
              ayateStr += ' <span class="vn">﴿&#xFEFF;'+xVar1[i].sura+':'+xVar1[i].aya+'&#xFEFF;﴾</span>';'</div>';
			   	   $('#serchedVerses').append(ayateStr);
            }
				});
			};

            $scope.getSura = function(sura, suraName) {
                $scope.asura = '';
                $scope.suraName = '';
			         	$scope.showSuraTitle = true;
                $scope.showBismiDiv = true;
                $scope.showBismi = false;
                $scope.firstAyatNbr = false;
				        $scope.selectedSura = sura;
                $('#loader').html('<p align="center"><img src="images/loader.gif" width="50"><br />تحميل</p>');
                $('#serchedVerses').html('');
                $http({
                      method : 'GET',
                      url :  'api/rest_sce.php?c=SuraText&sura=' + sura
                }).then( function(response) {

                    var i, fatiha, suraLen=0, ayatTab = [];
                    xVar1 = response.data.quranKarim;
					
                    suraLen = xVar1.length;
                    fatiha = (sura==1)?1:0; 
					 
                    for (i=0; i<suraLen; i++) ayatTab[i] = i+1+fatiha;
					
                    if ( xVar1.length>1 ) $scope.ayatCount = ayatTab;
                    
                    $scope.asura = xVar1;
                    $scope.suraName = suraName;
                    $scope.suraNbr = sura;
                    $scope.showBismi = (sura == 9)?false:true; 
                    $scope.firstAyatNbr = ( sura == 1 )?true:false; 
                    $scope.sel1 = 1;
                    $scope.sel2 = ( sura == 1 )?7:xVar1.length;
                    $('#loader').html('');
                    $scope.leftPanel = false;
					//$('.audioDiv').html('<audio controls><source src="audio/'+$scope.selectedReceiter+'/'+('000'+sura).slice(-3)+'.mp3" type="audio/mpeg"></audio>');
					//console.log(xVar1);
                });
            }
});

//---------------------------------------------
//get utube video list

app.controller('youtube', function($scope, $http) {
      $http({
        method: 'Get',
        url: 'https://www.googleapis.com/youtube/v3/channels',
        params: {
                 part:        'snippet',
                 key:         'AIzaSyAjgI25fF2QszNUHvprRpH2BvjR6hz-Flo'
               }
        }).then( function(response) {
             $scope.list = response;
             console.log(response);
        });
});

//---------------------------------------------
// Filter to replace numbers 0-9 by .-٩

app.filter('nbrFilter', function(){
	return function(x) {
		var i, txt='', arabicNumber = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
		for (i=0; i<x.length; i++) {
			c = x[i];
			txt += arabicNumber[c];
		}
		return txt;
	}
});

//---------------------------------------------
// change user-nav height/width when resizing browser viewport 

$(document).ready(function(){

  var openned = false, barWidth='';

  deviceHeight = $(window).height() + 'px';
  $('.user-nav').css({'height' : deviceHeight});

  $(window).resize(function(){
      deviceHeight = $(window).height() + 'px';
      $('.user-nav').css({'height' : deviceHeight});
  });

});

//---------------------------------------------
// Select all div content for copy/paste purpose


function SelectAll(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection()) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}

//-------------------------------------------------------------

```

### HTML Header:
``` header
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
	<title>Quran | Chapters & Verses</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<meta name="description" content="">
    <meta name="author" content="">
	
	<link rel="apple-touch-icon" href="images/apple-touch-icon.png" />
	<link rel="apple-touch-startup-image" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" href="apple-touch-startup-image-640x1096.png">
	<link rel="stylesheet" href="myStyle.css">

	<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.0.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.min.js" type="text/javascript" ></script>
	<script src="js/app.js" type="text/javascript" ></script>
	
</head>
``` 

### HTML body:
``` body

<body id="mobile_wrap" ng-app="myApp" ng-controller="contentCtrl">

<!-- --------------------------------------------------- Sura List -->

<div class="user-nav" ng-show="leftPanel">
بحث
<br /><input id="searchStr" ng-model="searchStr" type="text" placeholder="اسم أو رقم السورة">
	<ul id="ul1">
		<li ng-repeat=" y in achapters | filter : searchStr " ng-click="leftPanel=!leftPanel">
			<a ng-click="getSura(y.index, y.name)">
			<span class="sn left">{{ y.index }}</span> {{ y.name }}
			</a>
		</li>
	</ul>
</div>
    
<!-- --------------------------------------------------- Top Panel & Sura text -->

<div class='container' ng-init="$scope.toggle = false; sel1=0; getSura(1, 'الفاتحة');">

	<div id="topBar"><div class="menuWrapper">
	  
		<div class="inlineDiv">
			<table><tr>
			<td>  من الآية </td>
			<td><select ng-model="sel1" ng-options="z for z in ayatCount"  ng-selected="sel1"></select></td>
			<td>الى الآية </td><td><select ng-model="sel2" ng-options="z for z in ayatCount"  ng-selected="sel2"></select></td>
			</tr></table>
		</div>
		
		<div class="inlineDiv">
			<table><tr>
			<td><button id="searchButton" ng-click="searchWords(searchMe);"><img src="images/search.png" width="20"></button></td>
			<td><input id="searchQuran" ng-model="searchMe" type="text" placeholder="بحث في القرءان"></td>
			</tr></table>
		</div>	
		
	   	<div class="inlineDiv" ng-click="leftPanel=!leftPanel">
			<a><span style="color: #ff0;">السور</span><img src="images/menu.png" alt="Chapters List - قائمة السور" title="Chapters List - قائمة السور" align="left"/></a>
		</div>
		
	</div></div>
	
	<div id="suratText" class="suratText" ng-click="leftPanel=false">

	    <div id="loader"></div>

	    <div style="float: right; position: absolute; top: 0;" onclick="SelectAll('selectAll')"><img src="images/copy.png"></div>
      	<div id="serchedVerses"></div>
		
        <div id="selectAll">
		<div class="suraTitle" ng-show="showSuraTitle">سورة {{suraName}}</div>
		<div class="bismiDiv" ng-show="showBismiDiv"><img ng-show="showBismi" src="images/bismi2.png" ng-if="((1*suraNbr==1 && 1*sel1==2) || (sel1==1)) ">
            <span ng-show="firstAyatNbr" ng-if=" 1*suraNbr==1 && 1*sel1<=2 ">
            <span class="vn1">﴿&#xFEFF;١&#xFEFF;﴾</span>
            </span>
        </div>
			
		<span ng-click="toggle = !toggle" ng-class="{verseClicked : toggle}" ng-repeat="x in asura" ng-if="1*x.aya>=1*sel1 && 1*x.aya<=1*sel2" id="aya{{ x.aya }}">
			{{ x.text }} <span class="vn">﴿&#xFEFF;{{ x.aya | nbrFilter }}&#xFEFF;﴾</span>
	    </span>
        </div>
    </div>		
</div>  

<div class="footerDiv" style="text-align=center; direction:ltr; ">
	 
	<a href="http://trueislamfromquran.com/"><img src="http://trueislamfromquran.com/sites/default/files/True%20Islam%20Logo.png" height="100" border="0">
	<br />حقيقة الإسلام من القرءان
	<br />True Islam from Quran </a>
	<br /><span style="font-size:1rem; color: black; font-weight: bold;">
	© 2016, All rights reserved. 
	</span> 
</div>	
	
</body>
</html>
``` 

### CSS Styling

``` CSS
@font-face {
  font-family: myFont;
  font-style: normal;
  src: url(font/DroidNaskh-Regular.eot);
  src: url(font/DroidNaskh-Regular.eot?#iefix) format('embedded-opentype'),
       url(font/DroidNaskh-Regular.woff2) format('woff2'),
       url(font/DroidNaskh-Regular.woff) format('woff'),
       url(font/DroidNaskh-Regular.ttf) format('truetype');
}

body {
  font-family: myFont, sans-serif;
  background: white url(images/bg.jpg);
  background-position: center;
  direction: rtl;
  font-size: 1.5rem;
  color: white;
  margin: 0;
  padding:0;
  text-align: justify;
}

#mobile_wrap {
  width: 100%
}

.container {
  margin: 0;
  padding:0;
}

#topBar {
  margin: 0;
  padding: .1rem 0 0 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(27,151,187,.7);
  z-index:5;
  text-align: center;
  transition: all linear 1s;
}

.menuWrapper{
  display: inline-block;
  text-align: center;
  white-space: nowrap;
  margin: 0 auto;
}

#topBar2 {
  margin: 0;
  padding: .1rem 0 0 0;
  overflow: hidden;
  position: relative;
  top: 3.7rem;
  width: 100%;
  background-color: rgba(0,0,0,.5);
  text-align: center;
  display: inline-block;
  transition: all linear 1s;
  height: 6.1rem;
}

.inlineDiv {
  float: right;
  margin:3px;
  padding: 0 3px;
  white-space: nowrap;
  display: inline-block;
  font-size: 1.2rem;
  height: 37px;
  background-color: rgba(0,0,0,.3);
  padding-bottom: .3rem;
}

.leftHeader {
  float: left;
  margin:0 5px;
  padding: 0 3px;
  white-space: nowrap;
  display: inline-block;
  font-size: 1.2rem;
}

.rightHeader {
  float: right;
  margin:0 5px;
  padding: 0 3px;
  white-space: nowrap;
  display: inline-block;
  font-size: 1.2rem;
}

.leftHeader img {
  width: 52px;
}

.audioDiv {
  display: inline-block;
  vertical-align: middle;
  padding: .5rem 0 0 0;
}

.ayaFound {
	color:#a00; 
	background-color:#ffa; 
}

select {
  font-size: 1rem;
  height: 2.1rem;
  width: 4rem;
  text-align: center;
  margin: 0 0 0 1rem;
  border-radius: 7px;
}

.receiter {
  font-size: .8rem;
  width: 12rem;
  height:1.9rem;
  font-family: myFont, sans-serif;
  margin-top:.5rem;
  border-radius: 7px;
}

table td{
  padding: 2px;
}

.border {
  border: 1px solid blue;
}

.left {
  float: left;
}

.right {
  float: right;
}

.user-nav {
   background-color: rgba(22,139,140,1);
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  z-index:10;
  text-align: center;
}

.user-nav  ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.user-nav  ul li {
    border-bottom: 1px dotted #03D4F3;
    text-align: right;
    margin: 0;
    padding: 0;
}

.user-nav  ul li a {
    display: block;
    color: #fff;
    font-size: 1.2rem;
    padding: 1rem .5rem;
    text-decoration: none;
}

.user-nav ul li a:hover {
    background-color: #028396;
    color: #ff0;
}

.sn {
  font-size: 1.5rem;
  color: #7EEDFE;
  font-weight: bold;
  padding-left: 0 auto;
}

.vn {
   font-family: arial;
  /* background-color: #FFFFAA; */
   border-radius: 50%;
   font-size: 1.6rem;
   color: #5060A6;
   padding:0;
}

.vn1 {
   font-family: arial;
   border-radius: 50%;
   font-size: 1.6rem;
   color: #5060A6;
   padding:0;
}

.bismiDiv {
  text-align: center;
}

.suraTitle {
    margin: 0;
    padding: 0;
    text-align: center;
    color: #000;
	font-size: 1.3rem
}

.suratText span:hover {
   background-color: #ffa;
}

.verseClicked {
    background-color: #ffa;
}

/* -------------------------------------------- */

.suratText {
    color: black;
    background-color: rgba(255,255,255,.7);
    line-height: 230%;
    padding: .5rem 1rem 2rem 1rem;
    margin: 6.5rem auto;
    border: 2.7rem solid transparent;
    box-shadow: 0 0 5px 4px rgba(0,0,0,.2);
    font-size: 1.5rem;
    max-width: 1100px;
    -webkit-border-image: url(images/bg3.jpg) 62 round; /* Safari 3.1-5 */
    -o-border-image: url(images/bg3.jpg) 62 round; /* Opera 11-12.1 */
    border-image: url(images/bg3.jpg) 62 round;
    position: relative;
}
 .inlineDiv a > img {
	  height: 2.2rem;
  }
  
/* --------------------- Responssive layout ----------------------- */
@media screen and (max-width: 635px) {

   #topBar {
      padding: 0;
	  margin:0;
    }
  
  #topBar2 {
	padding: 0;
	margin: 0;
	top: 6.3rem; 
  }
  
  .menuWrapper{ 
    width : 100%;
  }
}

@media screen and (max-width: 767px) {
 
.inlineDiv a > img {
	  height: 1.8rem;
  }
  
  .suratText {
        border: 1rem solid transparent;
        -webkit-border-image: url(images/bg3.jpg) 65 round; /* Safari 3.1-5 */
        -o-border-image: url(images/bg3.jpg) 65 round; /* Opera 11-12.1 */
        border-image: url(images/bg3.jpg) 65 round;
        font-size: 1.1rem;
        max-width: 94%;
        padding: padding: .5rem .2rem 1rem .2rem;
        margin: 8.5rem auto;
  }

  .vn {
      font-size: .8rem;
   }

   .bismiDiv img {
       width: 60%;
   }

  .leftHeader, .rightHeader {
    margin:0 2px;
    padding: 0 2px;
    font-size: .9rem;
  }

  select {
    font-size: .8rem;
    height: 1.5rem;
    width: 2.8rem;
    margin: 0 0 0 0rem;
  }

  #searchَQuran {
    font-size: .8rem;
    height: 1rem;	  
    border-radius: 5px;
    margin: 0;
  }
  
	 .receiter {
		font-size: .8rem;
	  }
	  
	  .leftHeader img {
		width: 42px;
	  }

	.user-nav  ul li a {
		font-size: 1rem;
	}

	.audioDiv {
	  clear: both;
	}

	.searchAyates {
	   font-size: .9rem;
	}
}

input[id="searchStr"] {
  width:92%; 
  height:28px; 
  font-size: 1rem;
  font-weight: bold;
  color: #2F6DC2;
  font-family: myFont, sans-serif;
  padding: 1px;
}

#searchQuran {
  max-width: 20rem; 
  height: 1.5rem; 
  font-size: 1rem;
  font-weight: bold;
  color: #2F6DC2;
  font-family: sans-serif;
  border-radius: 5px;
}

 #searchButton {
  font-size: 1rem;
  font-weight: bold;
  color: #2F6DC2;
  font-family: sans-serif;
  border-radius: 5px;
  margin-top:.47rem;
}

.searchAyates {
   background-color: rgba(255,255,200,.2);
   margin: 1rem;
   padding: .6rem;
   border-radius: 1.2rem;
   font-size: 1.2rem;
   line-height: 170%;
   border: 1px dotted #aaa;
   box-shadow: 1px 1px 1px rgba(0,0,0,.2);
}

.bi {
	font-size: 2.1rem;  
	font-family: times;
}

.footerDiv {
	text-align: center;
	font-family: sans-serif;
	font-size: 1.3rem;
	background-color: rgba(255,255,255,.5);
	padding:.3rem;
}

.footerDiv a {
   color: #00a;
   text-decoration: none;
}

/* ---------------------Print layout ----------------------- */

@media print  {
  .navbarpages, topBar2 {
    display: none;
  }

  .suratText {
    margin: 0 1rem; 
    border: 2rem solid transparent;
    -webkit-border-image: url(images/bg3.jpg) 62 round; /* Safari 3.1-5 */
    -o-border-image: url(images/bg3.jpg) 62 round; /* Opera 11-12.1 */
    border-image: url(images/bg3.jpg) 62 round;
    padding: 1.5rem;
    font-size: 2rem;
  }

}


``` 
## PHP api
``` php code
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
```
