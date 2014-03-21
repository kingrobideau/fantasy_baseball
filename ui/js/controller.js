/*
 * CONTROLLERS
 */
var controllers = {};

controllers.DraftController = function($scope, projections) {
	
	function init() {

		//Global UI Values
		projections.getBatterData($scope);
		projections.getPitcherData($scope);
		projections.getPlayerNames($scope);
		$scope.positions = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'SP', 'RP'];
		$scope.available = ['Available', 'Drafted', 'All'];
		$scope.rosterNames = ['Das Ryne', 'Ploofers', 'KCMonarchs', 'Rohit-Hit'];
		$scope.rosters = initRosters($scope.rosterNames);
		$scope.slots = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'SP1', 'SP2', 'SP3', 'RP1', 'RP2', 'P1', 'P2', 'BN1', 'BN2', 'NA'];
		$scope.selectedCost = 0;

		//Chart show/hide
		$scope.showDropoffChart = true; //default
		$scope.showRosterBreakdown = false;

		//Roster Breakdown Chart
		$scope.batterCategories=['R', 'RBI', 'HR', 'AVG', 'SB'];
		$scope.pitcherCategories=['W', 'SV', 'K', 'ERA', 'WHIP'];
		$scope.batterBreakdownId="batter-breakdown-chart";
		$scope.pitcherBreakdownId="pitcher-breakdown-chart";
		$scope.batterBreakdownTitle="Roster Breakdown: Offense";
		$scope.pitcherBreakdownTitle="Roster Breakdown: Pitching"

		//Onion Charts
		$scope.selectedRValue = 10;
		$scope.maxRValue = 15;
		$scope.selectedRbiValue = 10;
		$scope.maxRbiValue = 15;
		$scope.selectedHrValue = 10;
		$scope.maxHrValue = 15;
		$scope.selectedAvgValue = 10;
		$scope.maxAvgValue = 15;
		$scope.selectedSbValue = 10;
		$scope.maxSbValue = 15;
		$scope.rOnionName = 'R';
		$scope.rbiOnionName = 'RBI';
		$scope.hrOnionName = 'HR';
		$scope.avgOnionName = 'AVG';
		$scope.sbOnionName = 'SB';

		//Auction Meter Charts
		$scope.steamerName = 'Steamer';
		$scope.steamerData = [];
		$scope.zipsName = 'Zips'
		$scope.zipsData = [];
		$scope.fansName = 'Fans'
		$scope.fansData = [];
	}

	function initRosters(names) {	
		var rosters = [];
		for(n in names) {
			rosters.push({name: names[n], batters: [], pitchers: []});
		}
		return rosters;
	}

	$scope.updateSelectedPlayer = function() {
		for( p in $scope.batterProject) {
			if($scope.batterProject[p].name == $scope.selectedPlayerName) {
				$scope.selectedPlayer = $scope.batterProject[p];
				$scope.selectedCategoryValue = updateSelectedCategoryValue('batter');
				console.log("Selected category value:");
				console.log($scope.selectedcategoryValue);
				return;
			} 
		}
		for( p in $scope.pitcherProject) {
			if($scope.pitcherProject[p].name == $scope.selectedPlayerName) {
				$scope.selectedPlayer = $scope.pitcherProject[p];
				$scope.selectedCategoryValue = updateSelectedCategoryValue('pitcher');
				return;
			} 
		}
		//Else do not update selected player
	}

	function updateSelectedCategoryValue(type) {
		if(type=='batter') {
			categories = ['mean_vR', 'mean_vRbi', 'mean_vHr', 'mean_vAvg', 'mean_vSb'];
		} else {
			categories = ['mean_vW', 'mean_vSv', 'mean_vK', 'mean_vEra', 'mean_vWhip'];
		}
		selectedCategoryValue = [];
		for(c in categories) {
			ctgry = categories[c];
			selectedCategoryValue.push({name: categories[c], value: $scope.selectedPlayer[ctgry]});
		}
		return selectedCategoryValue;
	}

	//TO DO: REFACTOR
	$scope.updateShowHideCharts = function() {
		$scope.showDropoffChart = false;
		$scope.showRosterBreakdown = false;
		if($scope.selectedChart == "Dropoff") {
			$scope.showDropoffChart = true;
		} else if ($scope.selectedChart == "Breakdown") {
			$scope.showRosterBreakdown = true;
		}
	}

	$scope.draft = function() {
		//Check that neither selected player or selected roster are blank
		if($scope.selectedPlayer.name==null) { alert("Please enter a player name."); return; }
		if($scope.selectedRosterNameDraft==null) { alert("Please select a roster."); return; }

		//Find roster, find player, and draft
		for(r in $scope.rosters) {
			if($scope.rosters[r].name==$scope.selectedRosterNameDraft) {
				//Look for player in batters
				for(p in $scope.batterProject) {
					if($scope.batterProject[p].name == $scope.selectedPlayer.name) {
						//check that player is available
						if($scope.batterProject[p].available==false) { alert("That player is no longer available."); return; } 
						//draft
						$scope.rosters[r].batters.push($scope.batterProject[p]);	
						$scope.batterProject[p].available = false;
						$scope.rosterBreakdownDataBat = $scope.getRosterBreakdownDataBat(); //update roster breakdown data
						return;
					}
				}//Then look for player in pitchers
				for(p in $scope.pitcherProject) {
					if($scope.pitcherProject[p].name == $scope.selectedPlayer.name) {
						if($scope.pitcherProject[p].available==false) { alert("That player is no longer available."); return; } 
						//draft
						$scope.rosters[r].pitchers.push($scope.pitcherProject[p]);	
						$scope.pitcherProject[p].available = false;
						$scope.rosterBreakdownDataPitch = $scope.getRosterBreakdownDataPitch(); //update roster breakdown data
						return;
					}
				}
				alert("That is not a valid player name."); //if selected player not found
			}
		}
	}

	$scope.updateSelectedRosterAnalysis = function() {	
		for(r in $scope.rosters) {
			if($scope.rosters[r].name==$scope.selectedRosterNameAnalysis) {
				$scope.selectedRosterAnalysis = $scope.rosters[r];
			}
		}
	}

	$scope.getRosterBreakdownDataBat = function() {
		//Note:  The Roster Breakdown chart's labels depend on the order of the array named data
		data = [];
		for(r in $scope.rosters) {
			//coerce average to 0 if NaN to prevent highchart from breaking
			run = avg(_.pluck($scope.rosters[r].batters, 'mean_vR')) || 0;
			rbi = avg(_.pluck($scope.rosters[r].batters, 'mean_vRbi')) || 0;
			hr = avg(_.pluck($scope.rosters[r].batters, 'mean_vHr')) || 0;
			ba = avg(_.pluck($scope.rosters[r].batters, 'mean_vAvg')) || 0;
			sb = avg(_.pluck($scope.rosters[r].batters, 'mean_vSb')) || 0;

			data.push({
				name: $scope.rosters[r].name,
				data: [run, rbi, hr, ba, sb]
			});
		}
		return data;
	}

	$scope.getRosterBreakdownDataPitch = function() {
		//Note:  The Roster Breakdown chart's labels depend on the order of the array named data
		data = [];
		for(r in $scope.rosters) {
			//coerce average to 0 if NaN to prevent highchart from breaking
			w = avg(_.pluck($scope.rosters[r].pitchers, 'mean_vW')) || 0;
			sv = avg(_.pluck($scope.rosters[r].pitchers, 'mean_vSv')) || 0;
			k = avg(_.pluck($scope.rosters[r].pitchers, 'mean_vK')) || 0;
			era = avg(_.pluck($scope.rosters[r].pitchers, 'mean_vEra')) || 0;
			whip = avg(_.pluck($scope.rosters[r].pitchers, 'mean_vWhip')) || 0;

			data.push({
				name: $scope.rosters[r].name,
				data: [w, sv, k, era, whip]
			});
		}
		return data;
	}

	init(); //initialize controller scope
}

fantasy.controller(controllers);