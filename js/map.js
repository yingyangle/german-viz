Promise.all([
	d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'),
	d3.json('data/speakers.json')
])
.then(data => {
	var topo = data[0]
	var population = data[1]
	console.log(data)

	var path = d3.geoPath()
	var projection = d3.geoNaturalEarth1()
		.fitExtent([[0, 0], [width, height]], topo)

	var map_data = d3.map()
	colorScale = d3.scaleThreshold()
		.domain([1000, 10000, 100000, 1000000])
		.range(d3.schemeBlues[7])
	
	width = 1000
	height = 540

	svg = d3.select('#map')
		.append('svg')
		.attr('width', width)
		.attr('height', height)

	let mouseOver = function(d) {
		// d3.selectAll('.Country')
		// 	// .transition()
		// 	// .duration(100)
		// 	.style('opacity', .5)
		d3.select(this)
			// .transition()
			// .duration(100)
			.style('opacity', 1)
			.style('stroke', '#4d4b47')
	}

	let mouseLeave = function(d) {
		// d3.selectAll('.Country')
		// 	// .transition()
		// 	// .duration(100)
		// 	.style('opacity', .9)
		d3.select(this)
			// .transition()
			// .duration(100)
			.style('opacity', 0.9)
			.style('stroke', 'gray')
	}

	// draw the map
	svg.append('g')
		.selectAll('path')
		.data(topo.features)
		.enter()
		.append('path')
		// draw each country
		.attr('d', d3.geoPath()
			.projection(projection)
		)
		// set the color of each country
		.attr('fill', function (d) {
			console.log(population[d.properties.name] || 0)
			d.pop = population[d.properties.name] || 0
			if (d.pop != 0) d.pop = d.pop.Speakers
			return colorScale(d.pop)
		})
		.style('stroke', 'gray')
		.attr('class', 'Country')
		.style('opacity', .8)
		.on('mouseover', mouseOver)
		.on('mouseout', mouseLeave)

	// tooltip on hover
	svg.selectAll('path')
		.on('mouseover.tooltip', function(d) {
			tooltip.transition()
				.duration(200)
				.style('font-family', 'Nunito Sans')
				.style('padding', '10px')
				.style('opacity', .9)
			tooltip.html('Country: ' + d.properties.name +'<br>' + 'Native German Speakers: ' + `${f(d.pop)}`)
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
})
