var file = jQuery.get('breeds.txt');
var listString1 = "<li><a href='";
var listString2 = "'>";
var listSrting3 = "</a></li>";
var typesCheckBoxes =["herding", "hound", "sporting", "terrier", "toy", "working", "non-sporting"];
var sizeCheckBoxes = ["s", "m", "l"];
var errorMessageS ="Please Input The Desired Dog Size!";
var errorMessageT ="Please Input The Desired Dog Type!";
var sTurnOff="Turn Size Filter Off";
var sTurnOn="Turn Size Filter On ";
var tTurnOff="Turn Type Filter Off";
var tTurnOn="Turn Type Filter On ";
function validateAndFilter()
{
	var valid = validate();
	var descending = document.forms["filter"]["sort"].value
	var sizeFilter = [];
	var typeFilter = [];
	
	if (valid)
		{
		  sizeFilter = getFilterS();
		  typeFilter = getFilterT();
		  getResults(sizeFilter, typeFilter);
		  alphabetize("results", descending);
		}
}
function toggle(buttonId, toToggle)
{
	var button = document.getElementById(buttonId);
	var buttonValue = button.value;
	var checkboxes = getCheckboxNames(toToggle);
	var newText = getNewButtonTxt(buttonValue, toToggle);
	if (buttonValue == "on")
		{
			toggleOff(checkboxes);
			button.value = "off";
		}
	else
	{
		toggleOn(checkboxes);
		button.value = "on";
	}
	button.innerHTML = newText;
}
function getNewButtonTxt(buttonVal, toToggle)
{
	if (buttonVal == "on")
		{
			if(toToggle == "size")
			{
				return sTurnOn;
			}
			else
			{
				return tTurnOn;
			}
		}
	else
		{
			if(toToggle == "size")
			{
				return sTurnOff;
			}
			else
			{
				return tTurnOff;
			}
		}
}
function toggleOn(checkboxes)
{
	var numBoxes = checkboxes.length;
	var find ="";
	for (var x = 0; x < numBoxes; x++)
	{
		find = '[name= "'+ checkboxes[x] + '" ]'
		document.forms["filter"][checkboxes[x]].checked = "";
		document.forms["filter"][checkboxes[x]].disabled = "";
	}
}
function toggleOff(checkboxes)
{
	var numBoxes = checkboxes.length;
	
	for (var x = 0; x < numBoxes; x++)
		{
			find = '[name= "'+ checkboxes[x] + '" ]'
			document.forms["filter"][checkboxes[x]].checked = "checked";
			document.forms["filter"][checkboxes[x]].disabled = "disabled";
		}
}
function getCheckboxNames(toToggle)
{
	if(toToggle =="size")
		{
			return sizeCheckBoxes;
		}
	else
		{
			return typesCheckBoxes;
		}
}
function getFilterS()
{
	var filter =[];
	
	for (var x = 0; x< 3; x++)
		{
			if(document.forms["filter"][sizeCheckBoxes[x]].checked)
				{
					filter.push(document.forms["filter"][sizeCheckBoxes[x]].value);
				}
		}
	return filter;
}
function getFilterT()
{
	var filter =[];
	
	for (var x = 0; x< 7; x++)
		{
			if(document.forms["filter"][typesCheckBoxes[x]].checked)
				{
					filter.push(document.forms["filter"][typesCheckBoxes[x]].value);
				}
		}
	return filter;
}
function validate()
{
	var valid = false;
	var isSizeInput = false;
	var isTypeInput = false;
	for (var x =0; x < 3; x++)
		{
			if (document.forms["filter"][sizeCheckBoxes[x]].checked)
				{
				   isSizeInput = true;
				   break;
				}
		}
	for (var y = 0; y < 7; y++)
		{
			if (document.forms["filter"][typesCheckBoxes[y]].checked)
			{
			   isTypeInput = true;
			   break;
			}
		}
	if (!isSizeInput)
		{
			document.getElementById("size-error").innerHTML = "<strong>" + errorMessageS + "</strong>"
		}
	else
		{
			document.getElementById("size-error").innerHTML="";
		}
	if(!isTypeInput)
		{
		 	document.getElementById("type-error").innerHTML = "<strong>" + errorMessageT + "</strong>"
		}
	else
		{
			document.getElementById("type-error").innerHTML="";
		}
	if (isSizeInput && isTypeInput )
		{
			valid = true;
		}
	return valid;
}
function getResults(sFilter, tFilter)
{
	var lines = file.responseText.split("\n");
	var numEntries = lines.length;
	var list = "";
	for(var x = 0; x < numEntries; x++)
		{
            lines[x] = lines[x].replace("\r", "");
		}
	for(var x = 0; x < numEntries; x++)
	{	
		var values = lines[x].split("|");
		list = list + makeLi(lines[x], sFilter, tFilter); 
	}
	document.getElementById("results").innerHTML = list;
}
function makeLi(line, sFilter, tFilter)
{
	var values = line.split("|");
	var breed = values[0];
	var url = values[1];
	var isRightSize = compare(values[2], sFilter);
    var isRightType = compare(values[3], tFilter);
	
    if(isRightSize && isRightType)
    	{
    		return listString1 + url + listString2 + breed + listSrting3 +"\n";
    	}
    else
    {
    	return "";
    }
	
}
function compare(value, Filter)
{
	var include = false;
	var numItems = Filter.length;
	for (var x = 0; x < numItems; x++)
	{
		if (Filter[x] == value)
			{
			  include= true;
			  break;
			}
	}
	return include;
}
function alphabetize(ul, sortDescending) {
	  if(typeof ul == "string")
	    ul = document.getElementById(ul);


	  // Get the list items and setup an array for sorting
	  var lis = ul.getElementsByTagName("LI");
	  var vals = [];

	  // Populate the array
	  for(var i = 0, l = lis.length; i < l; i++)
	    vals.push(lis[i].innerHTML);

	  // Sort it A-Z
	  vals.sort();

	  // Reverses order
	  if(sortDescending)
	    vals.reverse();

	  // Change the list on the page
	  for(var i = 0, l = lis.length; i < l; i++)
	    lis[i].innerHTML = vals[i];
	}
