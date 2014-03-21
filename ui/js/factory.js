/*
 * FACTORIES
 */ 

fantasy.factory('projections', function($http) {
	var factory = {}
	factory.getBatterData = function($scope) {
		$http.get('php/projected_batter_value.php').success(function (result) {
		    $scope.batterProject = result;
		});	
	}
	factory.getPitcherData = function($scope) {
		$http.get('php/projected_pitcher_value.php').success(function (result) {
		    $scope.pitcherProject = result;
		});	
	}
	factory.getPlayerNames = function($scope) {
		$http.get('php/player_name.php').success(function (result) {
		    $scope.playerNames = _.pluck(result, 'name');
		});	
	}
	return factory;
});

