var posOptions = ['C', '1B', '2B', '3B', 'SS', 'OF', 'DH', 'P'];
var availableOptions = ['Available', 'Unavailable', 'All'];

var controlPanel = d3.select('#control_panel');

/*
var searchDiv = fieldset.append('div')
	.style('display', 'inline-block')
	.style('vertical-align', 'top');

searchDiv.append('input');

searchDiv.append('button')
	.attr('class', 'btn btn-success')
	.style('margin-left', '10px')
	.text('Go!');
*/

var filterDiv = controlPanel.append('div')
	.style('display', 'inline-block')
	.style('float', 'right');

/*
var availableSelect = filterDiv.append('select')
	.style('display', 'inline-block')
	.style('margin-left', '60px');

availableSelect.selectAll('option')
	.data(availableOptions).enter()
	.append('option')
	.text(function(d) { return d; });
*/

var posLabel = filterDiv.append('label')
	.text('Position')
	.style('margin-left', '10px');

var posSelect = filterDiv.append('select')
	.style('display', 'inline-block')
	.style('margin-left', '10px')
	.on('change', function() {
		playermartTable([
			{field: 'pos', value: this.value}
		]);
	});

posSelect.selectAll('option')
	.data(posOptions).enter()
	.append('option')
	.text(function(d) { return d; });
