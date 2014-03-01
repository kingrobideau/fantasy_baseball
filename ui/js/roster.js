/*
 * Roster Table
 */

function rosterTable(data) {
	dataTable({
		surface: '#rosterInnerDiv',
		id: 'rosterTable',
		data: data,
		keys: ['name', 'pos'],
		colNames: ['Name', 'Pos'],
		row: {
			fontSize: 10
		}
	});
}

/*
 * Roster Breakdown
 */

 function rosterBreakdownChart(data) {
  	 var rbi = _.pluck(data, 'z_rbi');
 	 for(x in rbi) {rbi[x] = Number(rbi[x]);}
 	 var run = _.pluck(data, 'z_r');
 	 for(x in run) {run[x] = Number(run[x]);}
 	 var bavg = _.pluck(data, 'z_avg');
 	 for(x in bavg) {avg[x] = Number(bavg[x]);}
 	 var hr = _.pluck(data, 'z_hr');
 	 for(x in hr) {hr[x] = Number(hr[x]);}
 	 var sb = _.pluck(data, 'z_sb');
 	 for(x in sb) {sb[x] = Number(sb[x]);}

 	 var rosterBreakdown = [
 		{category: 'RBI', value: sum(rbi)},
 		{category: 'RUN', value: sum(run)},
 		{category: 'AVG', value: sum(bavg)},
 		{category: 'HR', value: sum(hr)},
 		{category: 'SB', value: sum(sb)}		
	]

 	barChart({
		chart: rosterBreakdownChart,
		title: {
			text: 'Value Breakdown',
		},
		id: 'rosterBreakdownChart',
		surface: '#rosterInnerDiv',
		data: rosterBreakdown,
		xAxis: {
			field: 'category',
			gridlines: {
				enabled: true
			},
			sortDescending: true, 
			label: {
				width: 50
			}
		},
		yAxis: {
			field: 'value',
			gridlines: {
				enabled: false
			}
		},
		values: {
			width: 50
		},
		format: {
			height: 500,
			width: 300,
			barColor:'orange',
			barHeight: 20,
			unit: '',
			decimalPlaces: 2,
			margin: {
				top: 20,
				right: 10,
				bottom: 10,
				left: 10
			}
		}
	});
 }	

