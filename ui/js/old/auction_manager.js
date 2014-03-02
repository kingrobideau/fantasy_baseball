//graphical params
var 
	needle = {w: 4, h: 60, x: 40, y:40}
	svg = {w: needle.h*2, h: needle.h*2, mr: 40, ml:40}
	rotation = 0,
	prevRotation = 0;

var arcData = [
    	{start:1, size: 2, fill: "red"},
    	{start:-1, size: 2, fill: "yellow"},
    	{start:-3, size: 2, fill: "green"},
    ];

d3.select('#costInput')
	.on('keyup', function() {
		turnNeedle(projections)
	});

//Needle scales
var costScale = d3.scale.linear()
	.domain([0, 2])
	.range([-172, 172]) //arc range
	.clamp(true); //prevents the needle from traveling outside of the range

var colorScale = d3.scale.linear()
	.domain([0, 1, 2])
	.range(['green', 'yellow', 'red']);

function auctionManager() {
	clearNode('allMetersDiv');
	
	playerId = activeId;
	console.log(playerId);

	projections.forEach(function(pro) {
		d3.csv(pro.path, function(csv) {
			activePlayer = csv.filter(function(d) {
				return d.player_id == playerId;
			})[0];

			//Meter div
			var div = d3.select('#allMetersDiv').append('div')
				.style({
					'display': 'inline-block',
					'margin': '0 auto'
				});

			//Title
			div.append('div')
				.text(pro.name)
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

			//Meter SVG
			var meter = div.append('svg')
				.attr({
					'width': needle.h*2,
					'height': needle.h*3
				})
				.style({
					'margin-right': svg.mr,
					'margin-left': svg.ml
				});

			//Needle
			meter.append('rect')
				.attr({
					'id': pro.needleId,
					'height': needle.h,	
					'width': needle.w,
					'y': 0,
					'x': meter.attr('width')/2,
					'fill': 'black'
				});

			var needleButt = meter.append('circle')
				.attr({
					'cx': svg.w/2 + needle.w/2,
					'cy': needle.h,
					'r': 10
				})
				.style({
					//'opacity': 0.5
				});

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

			//Value
			meter.append('text')
				.text('$' + Number(activePlayer.cost).toFixed(2))
				.attr({
					'y': needle.h + 30,
					'x': svg.w/2,
					'text-anchor': 'middle',
					'font-size': 14
				})
				.style({
					'color': 'white'
				});
			});
		});
}

function turnNeedle(projections) {
	playerId = activeId;
	projections.forEach(function(pro) {
		d3.csv(pro.path, function(csv) {
			activePlayer = csv.filter(function(d) {
				return d.player_id == playerId;
			})[0];
			var cost = Number(activePlayer.cost);
			var in_cost = d3.select('#costInput')[0][0].value;
			var costRatio = in_cost/cost;
			var angle = costScale(costRatio);

			//TO DO:  Fix, looks like this is getting caught every time
			try {
				var prevAngle = d3.select(pro.needle).selectAll('rect')[0].parentNode.transform.animVal[0].angle;
			} catch(e) {
				"Caught exception getting prev angle";
				var prevAngle = 0;
			}

			d3.select('#' + pro.needleId).transition()
				.duration(1000)
				.attrTween('transform', tween)
				.attr('fill', 'black');
					
			function tween(d, i, a) {
				return d3.interpolateString('rotate(' + prevAngle + ', ' + needle.h + ', ' + needle.h + '	)', 
					'rotate(' + angle + ', ' + needle.h + ', ' + needle.h + '	)');
			}
		});
	});
}


