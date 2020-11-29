Promise.all([
	d3.json('data/gender_pct.json')
]).then(gender_pct => {

	var f = d3.format(',.0f') // format number strings

	var plot = {
		dataset: []
	}

	var opt = {
		width: 900,
		height: 900,
		side: 400,
		margin: {top: 70,left: 150,bottom: 150,right: 150},
		axis_labels:['Feminine', 'Masculine', 'Neuter'],
		axis_ticks:d3.range(0, 101, 20),
		minor_axis_ticks: d3.range(0, 101, 5),
		tickLabelMargin: 10,
		axisLabelMargin: 40 }

	var svg = d3.select('#plot')
		.append('svg')
		.attr('width', opt.width)
		.attr('height', opt.height)

		var axes = svg.append('g')
		.attr('class', 'axes')

	var w = opt.side
	var h = Math.sqrt(opt.side * opt.side - (opt.side/2)*(opt.side/2))

	var corners = [
		[opt.margin.left, h + opt.margin.top], // a
		[ w + opt.margin.left, h + opt.margin.top], //b 
		[(w/2) + opt.margin.left, opt.margin.top] //c
	]

	// axis names
	axes.selectAll('.axis-title')
		.data(opt.axis_labels)
		.enter()
		.append('g')
		.attr('class', 'axis-title')
		.attr('transform', function(d,i) {
			return 'translate(' + corners[i][0] + ',' + corners[i][1] + ')'
		})
		.append('text')
		.text(d => d)
		.attr('text-anchor', function(d,i) {
			if (i === 0) return 'end'
			if (i === 2) return 'middle'
			return 'start'
			
		})
		.attr('transform', function(d,i) {
			var theta = 0
			if (i === 0) theta = 120
			if (i === 1) theta = 60
			if (i === 2) theta = -90

			var x = opt.axisLabelMargin * Math.cos(theta * 0.0174532925),
				y = opt.axisLabelMargin * Math.sin(theta * 0.0174532925)
			return 'translate('+x+','+y+')'
		})


	// ticks
	var n = opt.axis_ticks.length
	if (opt.minor_axis_ticks){
		opt.minor_axis_ticks.forEach(function(v) {	
			var coord1 = coord([v, 0, 100-v])
			var coord2 = coord([v, 100-v, 0])
			var coord3 = coord([0, 100-v, v])
			var coord4 = coord([100-v, 0, v])
			
			axes.append('line')
				// .attr(lineAttributes(coord1, coord2))
				.attr('x1', coord1[0])
				.attr('x2', coord2[0])
				.attr('y1', coord1[1])
				.attr('y2', coord2[1])
				.classed('a-axis minor-tick', true)

			axes.append('line')
				// .attr(lineAttributes(coord2, coord3))
				.attr('x1', coord2[0])
				.attr('x2', coord3[0])
				.attr('y1', coord2[1])
				.attr('y2', coord3[1])
				.classed('b-axis minor-tick', true)

			axes.append('line')
				// .attr(lineAttributes(coord3, coord4))
				.attr('x1', coord3[0])
				.attr('x2', coord4[0])
				.attr('y1', coord3[1])
				.attr('y2', coord4[1])
				.classed('c-axis minor-tick', true);		
		})
	}

	opt.axis_ticks.forEach(function(v) {	
		var coord1 = coord([v, 0, 100-v])
		var coord2 = coord([v, 100-v, 0])
		var coord3 = coord([0, 100-v, v])
		var coord4 = coord([100-v, 0, v])

		axes.append('line')
			.attr('x1', coord1[0])
			.attr('x2', coord2[0])
			.attr('y1', coord1[1])
			.attr('y2', coord2[1])
			.classed('a-axis tick', true)

		axes.append('line')
			.attr('x1', coord2[0])
			.attr('x2', coord3[0])
			.attr('y1', coord2[1])
			.attr('y2', coord3[1])
			.classed('b-axis tick', true)

		axes.append('line')
			.attr('x1', coord3[0])
			.attr('x2', coord4[0])
			.attr('y1', coord3[1])
			.attr('y2', coord4[1])
			.classed('c-axis tick', true)


		// tick labels
		axes.append('g')
			.attr('transform',function(d){
				return 'translate(' + coord1[0] + ',' + coord1[1] + ')'
			})
			.append('text')
				.attr('transform','rotate(60)')
				.attr('text-anchor','end')
				.attr('x',-opt.tickLabelMargin)
				.text(function (d) { return v; })
				.classed('a-axis tick-text', true)

		axes.append('g')
			.attr('transform',function(d){
				return 'translate(' + coord2[0] + ',' + coord2[1] + ')'
			})
			.append('text')
				.attr('transform','rotate(-60)')
				.attr('text-anchor','end')
				.attr('x',-opt.tickLabelMargin)
				.text(function (d) { return (100- v); })
				.classed('b-axis tick-text', true)

		axes.append('g')
			.attr('transform',function(d){
				return 'translate(' + coord3[0] + ',' + coord3[1] + ')'
			})
			.append('text')
				.text(function (d) { return v; })
				.attr('x',opt.tickLabelMargin)
				.classed('c-axis tick-text', true)

	})


	function coord(arr) {
		var a = arr[0], b = arr[1], c = arr[2]
		var sum, pos = [0, 0]
		sum = a + b + c
		if(sum !== 0) {
			a /= sum
			b /= sum
			c /= sum
			pos[0] = corners[0][0] * a + corners[1][0] * b + corners[2][0] * c
			pos[1] = corners[0][1] * a + corners[1][1] * b + corners[2][1] * c
		}
		return pos
	}


	function getData(data, accessor) {
		console.log('THIS', this)
		console.log('PLOT', plot)
		// bind by is the dataset property used as an id for the join
		plot.dataset = data

		console.log('ddd', data)
		console.log(data.length)

		circle_data = data.map(d => coord(accessor(d))), function(d,i) {
			// console.log(i)
			// console.log(plot.dataset[i])
			// if (!plot.dataset[i]) {
			// 	console.log(i)
			// 	return
			// }
			// if (bindBy) {
				return plot.dataset[i]['label']
			// }
			// return i
		}

		console.log('DDD', data)
		console.log(data.length)

		var circles = svg.selectAll('circle')
			.data(circle_data)

		circles.enter()
			.append('circle')

		circles.transition()
			.attr('cx', d => d[0])
			.attr('cy', d => d[1])
			.attr('r', 6)
		
		// tooltip on link hover
		circles
		.data(data)
		.on('mouseover.tooltip', function(d) {
			tooltip.transition()
				.duration(200)
				.style('font-family', 'Nunito Sans')
				.style('padding', '10px')
				.style('opacity', .9);
			tooltip.html('Singular Ending: <b>' + d.name + '</b></br>Count: <b>' + `${f(d.total)} words` + '</b>')
		})
		.on('mouseout.tooltip', function() {
			tooltip.transition()
				.duration(200)
				.style('opacity', 0)
		})
		.on('mousemove', function() {
			tooltip.style('left', (d3.event.pageX) + 'px')
				.style('top', (d3.event.pageY + 10) + 'px')
		})
			
		// tooltip
		var tooltip = d3.select('body')
			.append('div')
			.attr('class', 'tooltip')
			.style('opacity', 0)
	
			return plot
	}

	var d = []
	var i = 0
	for (let item in gender_pct[0]) {
		d.push({
			f: gender_pct[0][item].f,
			m: gender_pct[0][item].m,
			n: gender_pct[0][item].n,
			name: gender_pct[0][item].name,
			total: gender_pct[0][item].total,
			label: 'point' + i
		})
		i++
	}
	console.log('d',d)

	// var tp = ternaryPlot()
	plot = getData(d, function(d) { return [d.f, d.m, d.n]})

	var count_cutoff_gender = $('#gender-range').val()

	function next() {
		console.log('NEXT')
		count_cutoff_gender = $('#gender-range').val()
		console.log('cutoff', count_cutoff_gender)

		var d = []
		var i = 0
		for (let item in gender_pct[0]) {
			if (gender_pct[0][item].total < count_cutoff_gender) {
				continue
			}
			d.push({
				f: gender_pct[0][item].f,
				m: gender_pct[0][item].m,
				n: gender_pct[0][item].n,
				name: gender_pct[0][item].name,
				total: gender_pct[0][item].total,
				label: 'point' + i
			})
			i++
		}
		console.log('d', d)
		plot = getData(d, function(d) { return [d.f, d.m, d.n]})
	}

	next()

	$('#gender-range').on('change', function() {
		// count_cutoff_gender = $('#gender-range').val()

		// svg.selectAll('circle').remove()
		next()
	})

})

