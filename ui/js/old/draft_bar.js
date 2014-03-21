var activeTeam;

d3.select('#teamDropdown').on('click', setActiveTeam);

d3.select('#teamDropdown').selectAll('option')
	.data(_.pluck(rosters, 'name'))
	.enter()
	.append('option')
	.attr('class', 'd3_curve-selection_area-drop_down_list')
    .attr('value', function(d) { return d; })
    .text( function(d) { return d; });

d3.select('#draftButton').on('click', draft);

function setActiveTeam() {
	var activeTeam = this.value;
}	

function draft() {
	var teamName = d3.select('#teamDropdown')[0][0].value;
	for(rost=0; rost<rosters.length; rost++){
		if(rosters[rost].name == teamName) {
			rosters[rost].roster.push(activeSteamer);
		}
	}
}
