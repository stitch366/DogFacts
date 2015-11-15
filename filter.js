var file = jQuery.get('breeds.txt');
var listString1 = "<li><a href='";
var listString2 = "'>";
var listSrting3 = "</a></li>";
var typesCheckBoxes =["herding", "hound", "sporting", "terrier", "toy", "working", "non-sporting"];
var sizeCheckBoxes = ["s", "m", "l"];
var errorMessageS ="Please Input The <br>Desired Dog Size!";
var errorMessageT ="Please Input The <br>Desired Dog Type!";
var sTurnOff="Turn Size Filter Off";
var sTurnOn="Turn Size Filter On ";
var tTurnOff="Turn Type Filter Off";
var tTurnOn="Turn Type Filter On ";

//function that fires on form submission to vaildate the form and 
//get a list of dog breeds that match the user's input
function validateAndFilter()
{
	var valid = validate();
	var descending = document.forms["filter"]["sort"].value
	var sizeFilter = [];
	var typeFilter = [];
	var results = [];
	
	//Applies uses filter to get links the links to display should the form be valid
	if (valid)
		{
		  sizeFilter = getFilterS();
		  typeFilter = getFilterT();
		  results = getResults(sizeFilter, typeFilter);
		  alphabetize(results, descending);
		  createLists(results);

		}
	
	//function will always return false
	//this is because otherwise the page will refresh on submission
	//Which results in the results not being displayed long enough
	//for the user to see them and click the links.
	return false;
}
//function that when fired that "toggles" the Type and Size on and off by
//checking all the check boxes and disabling them for the filter being toggled
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
//gets the new text for the filter on/off toggle button
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
//called by toggle(buttonId, toToggle) to toggle the filters back on
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
//called by toggle(buttonId, toToggle) to toggle the filters off
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
//gets the array that contains check box names for the corresponding filter
// for the toggle functions
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
//generates an array containing the values of the size check boxes selected by the user 
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
//generates an array containing the values of the type check boxes selected by the user 
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
// function that makes sure that the user checked 
//at least one dog type and one dog size
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
//generates an array containing li tags for the breeds that match the user's input 
function getResults(sFilter, tFilter)
{
	var lines = file.responseText.split("\n");
	var numEntries = lines.length;
	var results = []
	var list = "";
	for(var x = 0; x < numEntries; x++)
		{
            lines[x] = lines[x].replace("\r", "");
		}
	for(var x = 0; x < numEntries; x++)
	{	
		makeLi(lines[x], sFilter, tFilter, results); 
	}
	return results;
}
//makes the Li tag for a breed and puts it into the array if it matches the users input
function makeLi(line, sFilter, tFilter, results)
{
	var values = line.split("|");
	var breed = values[0];
	var url = values[1];
	var isRightSize = compare(values[2], sFilter);
    var isRightType = compare(values[3], tFilter);
	var line = listString1 + url + listString2 + breed + listSrting3;
    if(isRightSize && isRightType)
    	{
    		results.push(line);
    	}
	
}
//compares the size or type value for a breed with the user's input
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
//sorts the Results from A-Z or Z-A based on user input
function alphabetize(results, sortDescending) {
	  var array = results
	  // Sort it A-Z
	  array.sort();

	  // Reverses order
	  if(sortDescending)
		  array.reverse();
	  
	  return array;
	}
//splits the number of results in half (as evenly as possible) and puts the li tags
//in ul tags on the page
function createLists(results)
{
	var numLi = results.length;
	var numInFristUl = Math.ceil(numLi / 2);
	var numInSecondUL = numLi - numInFristUl;
	var first = [];
	var second = [];
	for (x = 0; x < numInFristUl; x++)
		{
			first.push(results[x]);
		}
	for (y = numInFristUl; y < numLi; y++)
		{
			second.push(results[y]);
		}
	document.getElementById("results").innerHTML = arrayToString(first);
	document.getElementById("results2").innerHTML = arrayToString(second);
	
}
//converts array in to a string
function arrayToString(array)
{
	var length = array.length;
	var string = "";
	
	for(var x = 0; x < length; x++)
		{
			string = string + array[x]+ "\n";
		}
	return string;
}