var topAtPosChart;

function playermart() {
	clearNode('canvas');

	playermartControlPanel();
	
	playermartTable([
		{field: 'pos', value: 'C'}
	]);

	/*
	 * DATATABLE
	 */

	function playermartTable(filters) {
		d3.csv('data/steamer_batter.csv', function(csv) {

			try {
				d3.select('#playersTable').remove(); //remove if exists	 	
			} catch(e) {}

			pos = filters[0].value;

			//if pitcher
			if(pos=="P") {
				keys = ['name', 'pos', 'z_w', 'z_sv', 'z_era', 'z_whip', 'z_k', 'value', 'cost'];
				colNames = ['name', 'pos', 'zW', 'zSV', 'zWHIP', 'zERA', 'zK', 'Value', 'Cost'];
			
			//if batter
			} else {
				var arr = pos.split('/');
				var filtered = csv.filter(function(d) {
					return contains(arr, d.pos);
				});	
				var keys = ['name', 'pos', 'z_hr', 'z_r', 'z_rbi', 'z_sb', 'z_avg', 'value', 'cost'];
				var colNames = ['name', 'pos', 'zHR', 'zR', 'zRBI', 'zSB', 'zAVG', 'value', 'Cost'];
			}

			var sorted = filtered.sort(function(a, b) {
				return Number(b.value) - Number(a.value);
			});

			liveData = sorted; //global data

			dataTable({
				surface: '#canvas',
				id: 'playersTable',
				data: liveData,
				keys: keys,
				colNames: colNames,
				nrow: 50,
				row: {
					fontSize: 12,
					onclick: setActivePlayer
				}
			});
		});
	}
}