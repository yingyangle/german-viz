Promise.all([
	d3.json('data/nouns.json'),
]).then(data => {
	data = data[0]

	var width = 500
	var height = 500
	var margin = 40
	var radius = 180
	var color = d3.scaleOrdinal(d3.schemeTableau10)

	// count nouns for each gender
	var gender_count = {
		'f': 0,
		'm': 0,
		'n': 0
	}
	for (var i in data) {
		if (data[i].genus == 0) continue
		gender_count[data[i].genus] += 1
	}
	console.log(gender_count)
	data = gender_count

	var gender_names = {
		'f': 'feminine',
		'm': 'masculine',
		'n': 'neuter'
	}

	var svg = d3.select('#pie')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.append('g')
		.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

	// set the color scale
	var color = d3.scaleOrdinal()
		.domain(data)
		.range(['rgb(255, 157, 167)	', 'rgb(118, 183, 178)', 'rgb(89, 161, 79)'])
		// blue, pink, green

	// compute position of each group on pie chart
	var pie = d3.pie()
		.value(d => d.value)
	var data_ready = pie(d3.entries(data))
	console.log(data_ready)

	// shape helper to build arcs
	var arcGenerator = d3.arc()
		.innerRadius(0)
		.outerRadius(radius)

	// build pie chart
	svg.selectAll('g')
		.data(data_ready)
		.enter()
		.append('path')
		.attr('d', arcGenerator)
		.transition()
		.duration(800)
		// .attr('stroke', 'black') // outline
		// .style('stroke-width', '1px')
		.style('opacity', 0.7)
		.attr('fill', d => color(d.data.key))
		.attr('fill-opacity', 0.8)
	
	// tooltip on hover
	svg.selectAll('path')
		.on('mouseover.tooltip', function(d) {
			tooltip.transition()
				.duration(100)
				.style('font-family', 'Nunito Sans')
				.style('padding', '10px')
				.style('opacity', .8);
			tooltip.html('Gender: -' + d.data.key + '<p/>' + `${f(d.data.value)} words`)
				.style('left', (d3.event.pageX) + 'px')
				.style('top', (d3.event.pageY + 10) + 'px');
		})
		.on('mouseout.tooltip', function() {
			tooltip.transition()
				.duration(100)
				.style('opacity', 0);
		})
		.on('mousemove', function() {
			tooltip.style('left', (d3.event.pageX) + 'px')
				.style('top', (d3.event.pageY + 10) + 'px');
		})
		
	// tooltip
	var tooltip = d3.select('body')
		.append('div')
		.attr('class', 'tooltip')
		.style('opacity', 0)

	// labels
	svg.selectAll('g')
		.data(data_ready)
		.enter()
		.append('text')
		.text(d => gender_names[d.data.key])
		.attr('transform', d => 'translate(' + arcGenerator.centroid(d) + ')')
		.style('text-anchor', 'middle')
		.style('font-size', '30px')
		.style('fill', '#4d4b47')
		.on('mouseover.tooltip', function(d) {
			tooltip.transition()
				.duration(100)
				.style('font-family', 'Nunito Sans')
				.style('padding', '10px')
				.style('opacity', .8);
			tooltip.html('Gender: -' + d.data.key + '<p/>' + `${f(d.data.value)} words`)
				.style('left', (d3.event.pageX) + 'px')
				.style('top', (d3.event.pageY + 10) + 'px');
		})
		.on('mouseout.tooltip', function() {
			tooltip.transition()
				.duration(100)
				.style('opacity', 0);
		})
		.on('mousemove', function() {
			tooltip.style('left', (d3.event.pageX) + 'px')
				.style('top', (d3.event.pageY + 10) + 'px');
		})
	
	// title
	svg.append('text')
		.attr('x', -20)
		.attr('y', -220)
		.attr('text-anchor', 'middle')
		.style('font-size', '30px')
		.style('fill', '#4d4b47')
		.text('Gender Distribution')
	
})


