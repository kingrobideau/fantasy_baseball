
function dropoff() {
	clearNode('canvas');
	
	dropoffControlPanel();

	dropoffChart([{field: 'pos', value: 'C'}]);
}

function dropoffChart(filters) {
	
	pos = filters[0].value;
	if(pos=="P") {
		var filtered = steamer_pitcher;
	} else {
		var filtered = steamer_batter.filter(function(d) {
			var arr = d.pos.split('/');
			return contains(arr, pos)
				& d.value > 0;
		});
	}

	//assign rank, split into drafted and available
	drafted = []
	available = []
	for(i in filtered) {
		filtered[i]['rank'] = i + 1;
		if(filtered[i]['drafted']==1) {
			drafted.push(filtered[i]);
		} else {
			available.push(filtered[i]);
		}
	}

	d3.select('#canvas').append('div')
			.attr('id', 'highchartsDiv');

	$('#highchartsDiv').highcharts({
            chart: {
                type: 'scatter'
            },
            title: {
                text: 'Positional Dropoff'
            },
            xAxis: {
                title: {
                    text: 'Rank'
                }
            },
            yAxis: {
                title: {
                    text: 'Value'
                }
            },
            tooltip: {
            	formatter: function() {
            		return this.point.name + '<br><b>' + this.y;
            	}
            },
            series: [{
            	name: 'Available',
            	data: coordinatePairs(available, 'rank', 'value', 'name'),
            	color: '#62c462'
            }]
        });
}

