var userSelect,
	filters = [];

/*
 * UPDATE
 */

function addFilter(args){
	var exists = false;
	filters.forEach(function(f) {
		if(f.field == args.field) {
			f.selectedValue = args.selectedValue;
			exists = true;
		}
	});
	if(!exists) { filters.push(args); }	
}

function clearFilters(args) {
	filters = [];
}

function updateHeader(text) {
	d3.select('#tabHeader').text(text);
}

function updateTabSubheader(text) {
	d3.select('#tabSubheader').text(text);
}

function updateUserSelect(newSelection) {
	userSelect = newSelection;
}


/*
 * DOM elements
 */

function clearNode(id) {
	try {
		var node = document.getElementById(id);
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	} catch (e) {
	}
}


/*
 * STRING CLEANING
 */

//clean string
function cleanStr(str, options) {
	for(o in options) {
		if(options[o] == 'cap first letter') str = str.replace(str.charAt(0), str.charAt(0).toUpperCase());
		else if(options[o] == "cap all letters") str = str.toUpperCase();
		else if(options[o] == "_ to space") str = str.replace(/_/g, ' ');
		else if(options[o] == "- to space") str = str.replace(/-/g, ' ');
	}
	return str;
}

function cleanAll(dirty, options) {
	var clean = [];
	for(d in dirty) {
		clean.push(cleanStr(dirty[d], options));
	}
	return clean;
}

//abbreviate string
function abbrev(str, numChars) {
	if(str.length > numChars) {
		return str.substring(0, numChars) + '...';
	} else {
		return str;
	}
}

function abbrevAll(arr, numChars) {
	for(i in arr) {
		arr[i] = abbrev(arr[i], numChars);
	}
	return arr;
}

