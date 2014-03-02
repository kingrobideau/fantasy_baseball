var fantasy = angular.module('fantasy', [])
   
/*
* DIRECTIVES
*/

fantasy.directive('scatterplot', function ($parse) {
 var directiveDefinitionObject = {
     restrict: 'E',
     replace: false,
     scope: {data: '=chartData'},
     link: function(scope, element, attrs) {

       //Scatterplot Highcharts code
       var chart = d3.select(element[0]);

       	chart.append('div')
			.attr('id', 'highchartsDiv')
			.style('opacity', '1');

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
	            series: [{
	            	name: 'Available',
	            	data: scope.data,
	            	color: '#62c462'
	            }]
	        });
     } 
  };
  return directiveDefinitionObject;
});

fantasy.directive('auctionmeter', function($parse) {
 var directiveDefinitionObject = {
     restrict: 'E',
     replace: false,
     scope: {data: '=chartData'},
     link: function(scope, element, attrs) {
     	
       //D3 Code
       var chart = d3.select(element[0]);

       //graphical params
		var 
			needle = {w: 4, h: 60, x: 40, y: 40},
			svg = {w: needle.h*2, h: needle.h*2, mr: 40, ml: 40},
			rotation = 0,
			prevRotation = 0;

		var arcData = [
		    	{start:1, size: 2, fill: "red"},
		    	{start:-1, size: 2, fill: "yellow"},
		    	{start:-3, size: 2, fill: "green"},
		    ];

		//Needle scales
		var costScale = d3.scale.linear()
			.domain([0, 2])
			.range([-172, 172]) //arc range
			.clamp(true); //prevents the needle from traveling outside of the range

		var colorScale = d3.scale.linear()
			.domain([0, 1, 2])
			.range(['green', 'yellow', 'red']);

		var title = chart.append('div')
			.text('Test')
			.attr({
				'text-anchor': 'middle',
			})
			.style({
				'font-size': 26,
				'color': 'black',
				'font-style': 'italic',
				'text-align': 'center',
				'margin-bottom': '10px'
			});

		var meter = chart.append('svg')
			.attr({
				'width': needle.h*2,
				'height': needle.h*3
			})
			.style({
				'margin-right': svg.mr,
				'margin-left': svg.ml
			});

		var needle = meter.append('rect')
			.attr({
				'id': 'test', //TO DO: CHANGE
				'height': needle.h,	
				'width': needle.w,
				'y': 0,
				'x': meter.attr('width')/2,
				'fill': 'black'
			});

		/*
		var needleButt = meter.append('circle')
			.attr({
				'cx': (Number(svg.w)/2) + (Number(needle.w)/2),
				'cy': needle.h,
				'r': 10
			})
			.style({
				//'opacity': 0.5
			});
		*/

		//Arc
		var arc = d3.svg.arc()
			.innerRadius(40)
			.outerRadius(60)
		    .startAngle(function(d, i){return d.start;})
		    .endAngle(function(d, i){return d.start + d.size;});

		var arcG = meter.append('g')
			.attr('transform', 'translate(' + svg.w/2 + ', ' + svg.h/2 + ')');

		arcG.selectAll('path')
			.data(arcData).enter()
			.append('svg:path')
			.style({
				'fill': function(d) { 
					return d.fill;
				},
				'opacity': .5
			})
			.attr('d', arc);
		
		/*
		//Value
		meter.append('text')
			.text('test')
			.attr({
				'y': needle.h + 30,
				'x': svg.w/2,
				'text-anchor': 'middle',
				'font-size': 14
			})
			.style({
				'color': 'white'
			});
		});*/
		
     } 
  };
  return directiveDefinitionObject;
});

/*
 * FACTORIES
 */ 

fantasy.factory('projections', function($http) {
	var factory = {};
	factory.getData = function() {
		var steamerJo = {};
		$.ajax({
			type: 'GET',
			dataType: "json",
			url: "../php/steamer.php",
			success: function(result) {
				console.log(result);
			},
			error: function(request, error) {
				console.log("Error message: " + error);
			}
		});
		steamerJo = data;
		return steamerJo;
	}
	return factory;
});

$.ajax({
	type: 'GET',
	url: "php/mysqli_connect.php",
	success: function(data) {
		console.log("Success!");
		console.log(data);
	},
    error: function (jqXHR, textStatus, errorThrown) {
        console.log("jqXHR: " + jqXHR.status + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown);
    }
});

/*
 * CONTROLLERS
 */
var controllers = {};

controllers.PlayerController = function($scope, projections) {
	init();
	function init() {
		//$scope.projections = projections.getData();
		$scope.positions = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'P', 'RP'];
		$scope.available = ['Available', 'Drafted', 'All'];
		$scope.players = [{name: 'Chipper Jones', value: 10}, {name: 'Derek Jeter', value: 7}];
	}
}

controllers.RosterController = function($scope) {
	init();
	function init() {
		$scope.rosters = ['Das Ryne', 'Ploofers', 'KCMonarchs', 'Rohit-Hit'];
		$scope.slots = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'SP1', 'SP2', 'SP3', 'RP1', 'RP2', 'P1', 'P2', 'BN1', 'BN2', 'NA'];
	}
}

controllers.ScatterplotController = function($scope, projections) {
    
    $scope.myData = [[1,1], [2,2], [4,3], [1,2]];
    //$scope.pro = projections.getData();
}

controllers.MeterController = function($scope, projections) {
	$scope.myData = [1,2,3];
}

fantasy.controller(controllers);
