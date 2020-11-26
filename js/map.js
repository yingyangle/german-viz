Promise.all([
	d3.json('data/world.geojson'),
	d3.json('data/speakers.json'),
	d3.json('data/learners.json'),
])
.then(data => {
	var world = data[0]
	var speakers = data[1]
	var learners = data[2]
	console.log('map', data)

	var path = d3.geoPath()
	var projection = d3.geoNaturalEarth1()
		.fitExtent([[0, 0], [width, height]], world)

	var map_data = d3.map()
	var colorScale_map = d3.scaleThreshold()
		.domain([100, 1000, 10000, 100000, 500000, 1000000, 10000000, 100000000])
		.range(['transparent'].concat(d3.schemeYlGn[9]))
	
	width = 1000
	height = 540 // use this height to cut off Antarctica

	svg = d3.select('#map')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
	
	function showSpeakers() {
		// clear svg contents
		svg.selectAll('*').remove()

		// draw the map
		svg.append('g')
			.selectAll('path')
			.data(world.features)
			.enter()
			.append('path')
			// draw each country
			.attr('d', d3.geoPath()
				.projection(projection)
			)
			// set the color of each country
			.attr('fill', function (d) {
				var country_data = speakers[d.properties.name] || 0
				if (country_data != 0) {
					d.pop = country_data.Speakers
					d.percent = country_data.Percentage
				} else {
					d.pop = 0
					d.percent = 0
				}
				return colorScale_map(d.pop)
			})
			.style('stroke', 'gray')
			.attr('class', 'Country')
			.style('opacity', .8)
			.on('mouseover', function() {
				d3.select(this)
					.style('opacity', 1)
					.style('stroke', '#4d4b47')
			})
			.on('mouseout', function() {
				d3.select(this)
					.style('opacity', 0.9)
					.style('stroke', 'gray')
			})

		// tooltip on hover
		svg.selectAll('path')
			.on('mouseover.tooltip', function(d) {
				tooltip.transition()
					.duration(200)
					.style('font-family', 'Nunito Sans')
					.style('padding', '10px')
					.style('opacity', .9)
				tooltip.html('Country: ' + d.properties.name +'<br>' + 'Native German Speakers: ' + `${f(d.pop)}` + '<br>' + 'Percentage of Population: ' + `${f(d.percent)}%`)
					.style('left', (d3.event.pageX) + 'px')
					.style('top', (d3.event.pageY + 10) + 'px')
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

		// title
		svg.append('text')
			.attr('x', width / 2)
			.attr('y', 30)
			.attr('text-anchor', 'middle')
			.style('font-size', '36px')
			.style('fill', '#4d4b47')
			.text('Native German Speakers Around the World')
	}
	
	function showLearners() {
		// clear svg contents
		svg.selectAll('*').remove()

		// draw the map
		svg.append('g')
		.selectAll('path')
		.data(world.features)
		.enter()
		.append('path')
		// draw each country
		.attr('d', d3.geoPath()
			.projection(projection)
		)
		// set the color of each country
		.attr('fill', function (d) {
			d.pop = learners[d.properties.name] || 0
			return colorScale_map(d.pop)
		})
		.style('stroke', 'gray')
		.attr('class', 'Country')
		.style('opacity', .8)
		.on('mouseover', function() {
			d3.select(this)
				.style('opacity', 1)
				.style('stroke', '#4d4b47')
		})
		.on('mouseout', function() {
			d3.select(this)
				.style('opacity', 0.9)
				.style('stroke', 'gray')
		})

		// tooltip on hover
		svg.selectAll('path')
			.on('mouseover.tooltip', function(d) {
				tooltip.transition()
					.duration(200)
					.style('font-family', 'Nunito Sans')
					.style('padding', '10px')
					.style('opacity', .9)
				tooltip.html('Country: ' + d.properties.name +'<br>' + 'German Learners: ' + `${f(d.pop)}`)
					.style('left', (d3.event.pageX) + 'px')
					.style('top', (d3.event.pageY + 10) + 'px')
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

		// title
		svg.append('text')
			.attr('x', width / 2)
			.attr('y', 30)
			.attr('text-anchor', 'middle')
			.style('font-size', '36px')
			.style('fill', '#4d4b47')
			.text('German Learners Around the World')
	}

	// show native speaker map
	showSpeakers()

	// event handlers
	$('#map-toggle').on('click', function() {
		if ($('#map-toggle').text() == 'Show Learners') {
			showLearners()
			$('#map-toggle').text('Show Speakers')
		} else {
			showSpeakers()
			$('#map-toggle').text('Show Learners')
		}
	})

	
})
