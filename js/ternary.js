function createTernary(gender_pct) {

	var f = d3.format(',.0f') // format number strings

	var dataset

	var opt = {
		width: 700,
		height: 500,
		side: 400,
		margin: {top: 70, left: 150, bottom: 150, right: 150},
		axis_labels: ['Feminine', 'Masculine', 'Neuter'],
		axis_ticks: d3.range(0, 101, 20),
		minor_axis_ticks: d3.range(0, 101, 5),
		tickLabelMargin: 10,
		axisLabelMargin: 40
	}

	var svg = d3.select('#ternary')
		.append('svg')
		// .attr('width', opt.width)
		// .attr('height', opt.height)
		.attr('viewBox', [0, 0, opt.width, opt.height])

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
		.attr('fill', '#4d4b47')
		.attr('class', 'axis-title')
		.attr('transform', function(d,i) {
			return 'translate(' + corners[i][0] + ',' + corners[i][1] + ')'
		})
		.append('text')
		.text(d => d)
		.attr('class', 'nunito')
		.style('font-weight', 'bold')
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
				.attr('x1', coord1[0])
				.attr('x2', coord2[0])
				.attr('y1', coord1[1])
				.attr('y2', coord2[1])
				.classed('a-axis minor-tick', true)

			axes.append('line')
				.attr('x1', coord2[0])
				.attr('x2', coord3[0])
				.attr('y1', coord2[1])
				.attr('y2', coord3[1])
				.classed('b-axis minor-tick', true)

			axes.append('line')
				.attr('x1', coord3[0])
				.attr('x2', coord4[0])
				.attr('y1', coord3[1])
				.attr('y2', coord4[1])
				.classed('c-axis minor-tick', true)
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
			.attr('transform',function(d) {
				return 'translate(' + coord1[0] + ',' + coord1[1] + ')'
			})
			.append('text')
			.attr('transform','rotate(60)')
			.attr('text-anchor','end')
			.attr('fill', '#4d4b47')
			.attr('x',-opt.tickLabelMargin)
			.text(function (d) { return v })
			.attr('class', 'nunito')
			.classed('a-axis tick-text', true)

		axes.append('g')
			.attr('transform',function(d){
				return 'translate(' + coord2[0] + ',' + coord2[1] + ')'
			})
			.append('text')
			.attr('transform','rotate(-60)')
			.attr('text-anchor','end')
			.attr('fill', '#4d4b47')
			.attr('x',-opt.tickLabelMargin)
			.text(function (d) { return (100- v) })
			.attr('class', 'nunito')
			.classed('b-axis tick-text', true)

		axes.append('g')
			.attr('transform',function(d){
				return 'translate(' + coord3[0] + ',' + coord3[1] + ')'
			})
			.append('text')
			.attr('fill', '#4d4b47')
			.text(function (d) { return v })
			.attr('x',opt.tickLabelMargin)
			.attr('class', 'nunito')
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

	function drawCircles(data, accessor) {
		dataset = data
		circle_data = data.map(d => coord(accessor(d))), function(d,i) {
				return dataset[i]['label']
		}

		// clear current circles
		svg.selectAll('circle').remove()

		var circles = svg.selectAll('circle')
			.data(circle_data)
			.enter()
			.append('circle')
			.attr('cx', d => d[0])
			.attr('cy', d => d[1])
			.attr('r', 2)

		circles.transition()
			.attr('r', 8)
		
		// tooltip on link hover
		circles.data(data)
			.on('mouseover.tooltip', function(d) {
				tooltip.transition()
					.duration(200)
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
	}

	// UPDATE TERNARY PLOT
	function update() {
		var d = []
		var i = 0
		for (let item in gender_pct) {
			// don't include if below count_cutoff_gender
			if ( gender_pct[item].total < count_cutoff_gender) {
				continue
			}
			// filter for selected ending
			if (selected_ending_gender != '' & item != selected_ending_gender) {
				continue
			}
			d.push({
				f: gender_pct[item].f,
				m: gender_pct[item].m,
				n: gender_pct[item].n,
				name: gender_pct[item].name,
				total: gender_pct[item].total,
				label: 'point' + i
			})
			i++
		}
		console.log('ternary', d)
		drawCircles(d, d => [d.f, d.m, d.n])
	}

	// INITIALIZE
	var d = []
	var i = 0
	for (let item in gender_pct) {
		// don't include if below count_cutoff_gender
		if (gender_pct[item].total < count_cutoff_gender) {
			continue
		}
		d.push({
			f: gender_pct[item].f,
			m: gender_pct[item].m,
			n: gender_pct[item].n,
			name: gender_pct[item].name,
			total: gender_pct[item].total,
			label: 'point' + i
		})
		i++
	}
	console.log('ternary', d)
	drawCircles(d, d => [d.f, d.m, d.n])

	$('#gender-range').on('change', function() {
		count_cutoff_gender = $('#gender-range').val()
		selected_ending_gender = ''
		createGenderlist(gender_pct) // update genderlist
		update() // update ternary plot

		$('.gender-row').on('click', function() {
			selected_ending_gender = $(this).text()
			update()
			console.log('select gender ending', selected_ending_gender)
		})
	})

	$('#ternary-reset').on('click', function() {
		selected_ending_gender = ''
		update()
	})

	$('.gender-row').on('click', function() {
		selected_ending_gender = $(this).text()
		update()
		console.log('select gender ending', selected_ending_gender)
	})

}

