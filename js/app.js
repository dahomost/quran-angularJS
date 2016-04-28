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
