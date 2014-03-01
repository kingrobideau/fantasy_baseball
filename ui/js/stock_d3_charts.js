function barChart(args) { 
	var 
		data = args.data,
		m = {t: args.format.margin.top, l: args.format.margin.left, b: args.format.margin.bottom, r: args.format.margin.right, val:3},
		labelW = args.xAxis.label.width,
		valueW = args.values.width,
		svgW = args.format.width,
		svgH = args.format.height,
		surface = args.surface,
		w = svgW - (m.l + labelW + valueW + m.r), 
		h = svgH - (m.t + m.b),
		label = args.xAxis.field,
		x = args.yAxis.field,
		desc = args.xAxis.sortDescending,
		dec = args.format.decimalPlaces,
		title = args.title.text,
		barH = args.format.barHeight,
		color = args.format.barColor,
		unit = args.format.unit,
		id = args.id;

	var xMax = d3.max(data, function(d) { return Number(d[x]); });

	//sort descending
	if(desc == true) {
		data = _.sortBy(data, function(d) { return Number(d[x])*-1; });
	}
	
	var xScale = d3.scale.linear()
		.domain([0, xMax])
		.range([1, w]);

	svg = d3.select(surface)
		.append("svg")
		.attr("width", svgW)
		.attr("height", svgH)
		.attr("id", id)
		.style('display', 'inline')
		.attr('transform', 'translate(0, 30)');
	//x axis line
	svg.append("line")
		.attr("x1", m.l + labelW)
		.attr("x2", m.l + labelW + xScale(xMax))
		.attr("y1", function() {
			return m.t + data.length*barH + 5;
		})
		.attr("y2", function() {
			return m.t + data.length*barH + 5;
		})
		.attr('fill', 'none')
		.style("stroke", "#ccc");
		
	//grid lines
	if(args.yAxis.gridlines.enabled) {
		svg.selectAll("line.verticalGrid")
			.data(xScale.ticks(5))
			.enter().append("line")
				.attr({
					"class":"verticalGrid",
					"x1" : function(d){ return m.l + labelW + xScale(d); },
					"x2" : function(d){ return m.l + labelW + xScale(d); },
					"y1" : m.t,
					"y2" : function() { return m.t + barH*data.length + 15; },
					"fill" : "none",
					"shape-rendering" : "crispEdges",
					"stroke": "#ccc",
					"stroke-width" : "1px"
				});	
	}

	 svg.selectAll(".rule")
		.data(xScale.ticks(5))
		.enter().append("text")
		.attr("class", "rule")
		.attr("x", function(d) { return m.l + labelW + xScale(d); })
		.attr("y", function() { return m.t + barH*data.length + 30; })
		.attr("dy", -3)
		.attr("text-anchor", "middle")
		.attr("font-size", "10px")
		.text(String);

	svg.append('text')
			.attr('x', svgW/2)
			.attr('y', m.t/2)
			.attr('font-family', 'arial')
			.attr('text-anchor', 'middle')
			.attr('font-weight', 'bold')
			.text(title);

	svg.selectAll('text.labels')
		.data(data)
		.enter()
		.append('text')
		.text(function(d) {
			var clean = cleanStr(d[label], ["cap first letter", "- to space", "_ to space"]);
			if(clean.length > 25) return abbrev(clean, 25);
			else return clean;
		})
		.attr('x', m.l)
		.attr('y', function(d, i) {
			return m.t + i*barH + barH/2;
		})
		.style('font-family', 'arial')
		.style('font-weight', 'bold')
		.style('fill', 'black')
		.style('font-size', '12px');

	svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('x', m.l + labelW)
		.attr('y', function(d, i) {
			return m.t + i*barH;
		})
		.attr('width', 0)	
		.attr('height', barH)
		.attr('fill', color)
		.style('stroke', 'white')
		.transition()
		.attr('width', function(d) {
			return xScale(Number(d[x]));
		})
		.duration(1000);
	
	svg.selectAll('text.values')
		.data(data)
		.enter()
		.append('text')
		.text(function(d) { 
			return unit + Number(d[x]).toFixed(dec); 
		})
		.attr('x', function(d) {
			return m.l + labelW + xScale(d[x]) + m.val;
		})
		.attr('y', function(d, i) {
			return m.t + i*barH + barH/2;
		})
		.style('font-family', 'arial')
		.style('font-weight', 'bold')
		.style('fill', 'black')
		.style('font-size', '10px')
		.style('opacity', 0)
		.transition()
		.style('opacity', 1)
		.duration(1000);
	
}

function dataTable(args) {
	d3.select('#' + args.id).remove();

	var tbl = d3.select(args.surface).append('table')
		.attr('class', 'table table-striped table-hover')
		.attr('id', args.id);
	
	//filter nrows
	//args.data = firstN(args.data, args.nrow);

	//header
	var colNames = [];
	if(args.hasOwnProperty('colNames')) { //if colnames explicitly declared
		colNames = args.colNames;
	} else if(args.hasOwnProperty('keys')) { //if subset of keys declared
		colNames = args.keys;
	} else { //else use all keys in data
		firstRow = args.data[0];
		for(key in firstRow) {
			colNames.push(key);
		}
	}

	var head = tbl.append('thead');
	var headerRow = head.append('tr');
	
	headerRow.selectAll('th')
		.data(colNames).enter()
		.append('th')
		.text(function(d) { return d; })	
		.on('mouseover', function(d) {
			d3.select(this)
				.style('font-size', '18px');
		})
		.on('mouseout', function(d) {
			d3.select(this)
				.style('font-size', '16px');
		});
		//.on('click', update);

	//Table data
	var tbody = tbl.append('tbody');
	
	args.data.forEach(function(rowData) {
		var tr = tbody.append('tr')
			.on('click', function() {
				d3.selectAll('tr').attr('class', 'none');
				d3.select(this).attr('class', 'success');
				args.row.onclick(rowData.player_id);
			});
		for(key in rowData) {
			if(args.hasOwnProperty('keys')) { //if subset of keys declared in args
				if(contains(args.keys, key)) { //if key is one of keys declared
					tr.append('td') //display data
						.style('font-size', args.row.fontSize)
						.text(rowData[key]);
				}
			} else {
				tr.append('td') //display all data
					.style('font-size', args.row.fontSize)
					.text(rowData[key]);
			}
		}
	});

	function update() {
		var sortKey = this.textContent;
		args.data = _.sortBy(args.data, function(d) {
			return -1*d[sortKey];
		})
		dataTable(args);
	}
}