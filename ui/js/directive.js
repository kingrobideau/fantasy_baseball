/*
* DIRECTIVES
*/

fantasy.directive('scatterplot', function ($parse) {
 var directiveDefinitionObject = {
     restrict: 'E',
     replace: false,
     scope: {batterProject: '=batterProject', pitcherProject: '=pitcherProject', pos: '=pos'},
     link: function(scope, element, attrs) {

       	//Scatterplot Highcharts code
       	var chart = d3.select(element[0]);

       	chart.append('div')
			.attr('id', 'scatterplot')
			.style('opacity', '1');

       	scope.$watch('batterProject', function() {
       		update();
       	});
       	scope.$watch('pitcherProject', function() {
       		update();
       	});
       	scope.$watch('pos', function() {
       		update();
       	});

       	function update() {
	       	//Filter to selected position
			if(scope.pos == 'SP' | scope.pos == 'RP') { //TO DO: Check to make sure all pitcher's have "P" as their pos
				var filtered = scope.pitcherProject.filter(function(d) {
					var arr = d.pos.split('/');
					return contains(arr, scope.pos)
						& d.mean_value > 0;
				});
			} else {
				var filtered = scope.batterProject.filter(function(d) {
					var arr = d.pos.split('/');
					return contains(arr, scope.pos)
						& d.mean_value > 0;
				});
			}
			
			//Assign Rank
			for(f in filtered) {
				filtered[f].rank = f + 1;
			}

			$('#scatterplot').highcharts({

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
	            	data: coordinatePairs(filtered, 'rank', 'mean_value', 'name'),
	            	color: '#62c462'
	            }]
	        });
		}
     } 
  };
  return directiveDefinitionObject;
});

fantasy.directive('categorybubbles', function ($parse) {
 	var directiveDefinitionObject = {
	     restrict: 'E',
	     replace: false,
	     scope: {player: '=player'},
	     link: function(scope, element, attrs) {

	 		//Update chart when data changes
	     	scope.$watch('player', function() {
				update();
	 		});
	 	
	 		var chart = d3.select(element[0]);
	 		
	 		chart.append('div')
				.attr('id', 'category-bubbles');
				
	 		function update() {
	 			clearNode('category-bubbles');
	 			
	 			d3.select('#category-bubbles').append('circle')
	 				.attr('cx', 0)
	 				.attr('cy', 0)
	 				.attr('r', 10)
	 				.attr('color', 'green');
	 		}
		}
	};
	return directiveDefinitionObject;
});

fantasy.directive('auctionmeter', function($parse) {
 var directiveDefinitionObject = {
     restrict: 'E',
     replace: false,
     scope: {data: '=data', name:'=name', cost: '=cost', value: '=value'},
     link: function(scope, element, attrs) {
     	var chart = d3.select(element[0]);

     	chart.append('div')
			.attr('id', scope.name);

		scope.$watch('cost', function() {
			update();
		});
		scope.$watch('value', function() {
			update();
		});

		function update() {
			var value = Number(scope.value).toFixed(2);
			var costPerV = Number((scope.cost/scope.value).toFixed(2));

		    $('#' + scope.name).highcharts({
	
			    chart: {
			        type: 'gauge',
			        plotBackgroundColor: null,
			        plotBackgroundImage: null,
			        plotBorderWidth: 0,
			        plotShadow: false,
			        height: 250
			    },
			    
			    title: {
			        text: scope.name
			    },
			    subtitle: {
			    	text: "V = " + value
			    },
			    pane: {
			        startAngle: -150,
			        endAngle: 150,
			        background: [{
			            backgroundColor: {
			                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			                stops: [
			                    [0, '#FFF'],
			                    [1, '#333']
			                ]
			            },
			            borderWidth: 0,
			            outerRadius: '109%'
			        }, {
			            backgroundColor: {
			                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			                stops: [
			                    [0, '#333'],
			                    [1, '#FFF']
			                ]
			            },
			            borderWidth: 1,
			            outerRadius: '107%'
			        }, {
			            // default background
			        }, {
			            backgroundColor: '#DDD',
			            borderWidth: 0,
			            outerRadius: '105%',
			            innerRadius: '103%'
			        }]
			    },
			       
			    // the value axis
			    yAxis: {
			        min: 0,
			        max: 10,

			        minorTickInterval: 'auto',
			        minorTickWidth: 1,
			        minorTickLength: 10,
			        minorTickPosition: 'inside',
			        minorTickColor: '#666',
			
			        tickPixelInterval: 30,
			        tickWidth: 1,
			        tickPosition: 'inside',
			        tickLength: 10,
			        tickColor: '#666',
			        labels: {
			            step: 2,
			            rotation: 'auto'
			        },
			        title: {
			            text: '$/V	'
			        },
			        plotBands: [{
			            from: 0,
			            to: 3.33,
			            color: '#55BF3B' // green
			        }, {
			            from: 3.33,
			            to: 6.67,
			            color: '#DDDF0D' // yellow
			        }, {
			            from: 6.67,
			            to: 10,
			            color: '#DF5353' // red
			        }]        
			    },
			    series: [{
			        name: 'Cost Per Value',
			        data: [costPerV],
			        tooltip: {
			            valueSuffix: ' $/Value'
			        }
			    }],
			    credits: {
			    	enabled: false
			    }
			});
		}
     } 
  };
  return directiveDefinitionObject;
});


fantasy.directive('rosterbreakdown', function($parse) {
 var directiveDefinitionObject = {
     restrict: 'E',
     replace: false,
     scope: {data: '=data', categories: "=categories", id: "=id", title: "=title"},
     link: function(scope, element, attrs) {
     	var chart = d3.select(element[0]).style('display', 'inline-block');

     	chart.append('div')
				.attr('id', scope.id);

		scope.$watch('data', function() {
			update();
		});

		function update() {
		    $('#' + scope.id).highcharts({
		        chart: {
		            type: 'column'
		        },
		        title: {
		            text: scope.title
		        },
		        xAxis: {
		            categories: scope.categories
		        },
		        credits: {
		            enabled: false
		        },
		        series: scope.data
		    });
		}
     } 
  };
  return directiveDefinitionObject;
});


