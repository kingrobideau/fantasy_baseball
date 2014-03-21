var projections = [
		{name: 'Steamer1', needleId: 'steamerNeedle1', path:'data/steamer_batter.csv'},
		{name: 'Steamer2', needleId: 'steamerNeedle2', path:'data/steamer_batter.csv'},
		{name: 'Steamer3', needleId: 'steamerNeedle3', path:'data/steamer_batter.csv'},
		{name: 'Steamer4', needleId: 'steamerNeedle4', path:'data/steamer_batter.csv'},
		{name: 'Steamer5', needleId: 'steamerNeedle5', path:'data/steamer_batter.csv'}
	];

var activeId;

setActivePlayer(10155);

//set active player from search
$('#playerSearch').keyup(function() {
	var name = this.value;
	d3.csv('data/steamer_batter.csv', function(csv) {
		var filtered = csv.filter(function(d) {
			return d.name == name;
		})[0];
		try {
			setActivePlayer(filtered.player_id);	
		} catch (e) {}
	});
});	

function setActivePlayer(playerId) {
	activeId = playerId;
	updatePlayerImg(playerId);
	updatePlayerAttributes(playerId);
}

function updatePlayerImg(playerId) {
	d3.csv('/img/headshots/headshot_files.csv', function(csv) {
		var select = csv.filter(function(d) {
			return d.id == playerId;
		})[0];
		var path = "/img/headshots/img/" + select.file;
		d3.select('#playerImg').attr('src', path);
	});
}

function updatePlayerAttributes(playerId) {
	d3.csv('data/steamer_batter.csv', function(csv) {
		var filtered = csv.filter(function(d) {
			return d.player_id == playerId;
		})[0];
		d3.select('#playerName')
			.text(filtered.name);	
		d3.select('#playerPos')
			.text(filtered.pos);
		/*
		d3.select('#playerTeam')
			.text(filtered.team);
		d3.select('#playerDob')
			.text("Born " + filtered.dob);
		*/
	});
}

