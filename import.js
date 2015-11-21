function importHTML(parentElmId, filePath ) 
{
		  var xmlhttp;
		  //checks brower support
		  if (window.XMLHttpRequest) {
		    xmlhttp = new XMLHttpRequest();
		  } else {
		    // code for older browsers
		    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		  }
		  xmlhttp.onreadystatechange = function() {
			//triggers when the request is finished and response is ready
		    if (xmlhttp.readyState == 4) {
		    	document.getElementById(parentElmId).innerHTML = xmlhttp.responseText;
		    }
		  };
		  xmlhttp.open("GET", filePath, true);
		  xmlhttp.send();
		  
}