function contains(list, str) {
	if(list.indexOf(str)>=0) return true;
	else return false;
}

function coordinatePairs(data, col1, col2, name) {
	var out = [];
	for(d in data) {
		out.push(
			{x: Number(data[d][col1]), y: Number(data[d][col2]), name: data[d][name]}
		);
	}
	return out;
}

function firstN(d, n){
	i = 0;
	out = [];
	while(i < n) {
		out.push(d[i]);
		i += 1;
	}
	return out;
}

function groupReduce(d, metricName, groupBy, reduceType) {
	var out = [];
	var groups = _.groupBy(d, groupBy);
	var metric;
	var groupName;
	for(g in groups) {
		var metricReduc = [];
		var metric = _.pluck(groups[g], metricName);
		var groupName = _.pluck(groups[g], groupBy)[0]; 
		if(reduceType=='sum') {
			metricReduc = sum(metric);
		} else if(reduceType=='avg') {
			metricReduc = avg(metric);
		}
		var o = {};
		o[groupBy] = groupName;
		o[metricName] = Number(metricReduc);
		out.push(o);
	}
	return out;
}

function groupReduce2(args) {
	var metrics = args.metrics,
		data = args.data, 
		metric1 = metrics[0].metric,
		metric2 = metrics[1].metric,
		reduceType1 = metrics[0].reduceType,
		reduceType2 = metrics[1].reduceType,
		groupBy = args.groupBy,
		out = [], 
		o;
	var g1 = groupReduce(data, metric1, groupBy, reduceType1);
	var g2 = groupReduce(data, metric2, groupBy, reduceType2);
	for(i in g1) { 
		var o = {};
		o[groupBy] = g1[i][groupBy];
		o[metric1] = g1[i][metric1];
		o[metric2] = g2[i][metric2];
		out.push(o);
	}
	return out;
}

function unique(d) {
	 d = d.reduce(function(p, c) {
			if (p.indexOf(c) < 0) p.push(c);
			return p;
		}, []);
	return d;
}

function uniqueValues(data, col) {
	return _.uniq(_.pluck(data, col));
}

function sum(d) {
	try {
		d = $.grep(d,function(n){ return(n) });
		d = d.reduce(function(a, b) {
			return Number(a) + Number(b);
		});
	} catch (e) {
		d = null;
	}
	return d;
}

function avg(d) {
	try {
		d= $.grep(d, function(n){ return(n) });
		d = d.reduce(function(a, b) {
			return Number(a) + Number(b);
		}, 0) / d.length;
	} catch(e) {
		return d = null;
	}
	return d;
}

function variance(d) {
	var v = 0;
	for(i in d) {
		v += Math.pow((d[i] - avg(d)), 2);
	}
	v /= (d.length - 1);
	return v;
}

function sd(d) {
	var sd = Math.sqrt(variance(d));
	return sd;
}

function z(x, d) {
	var z = (x - avg(d)) / sd(d);
	return z;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function appendDiscountRev(data, nonremCol, remCol, totalCol) {
	for(d in data) {
		data[d][totalCol] = Number(data[d][nonremCol]) + ((1 - perDiscount) * Number(data[d][remCol]));
	}
	return data;
}

function numArray(arr) {
	for(i in arr) {
		arr[i] = Number(arr[i]);
	}
	return arr;
}

function sortDates(arr) {
	var sorted = arr.sort(function(a, b) {
		a = new Date(a);
		b = new Date(b);
		if(a > b) { return -1; }
		else if(a < b) { return 1; }
		return 0;
	});
}