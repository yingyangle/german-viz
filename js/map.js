
// load .json files
Promise.all([
	d3.json('data/world.geojson'),
	d3.json('data/speakers.json'),
	d3.json('data/learners.json'),
]).then(data => {
	createMap(data)
})

function createMap(data) {
	var world = data[0]
	var speakers = data[1]
	var learners = data[2]
	console.log('map', data)

	var width = 1000
	var height = 720

	// var path = d3.geoPath()
	var projection = d3.geoNaturalEarth1()
		.fitExtent([[0, 0], [width, height]], world)

	// var map_data = d3.map()
	var colorScale_map = d3.scaleThreshold()
		.domain([100, 1000, 10000, 100000, 500000, 1000000, 10000000, 100000000])
		.range(['transparent', 'transparent', '#ddf4f1', '#a4d1cc', '#86bdbc', '#45988d', '#24716b', '#146263', '#187183'])
	
	width = 1000
	height = 540 // use this height to cut off Antarctica

	var svg = d3.select('#map')
		.append('svg')
		// .attr('width', width)
		// .attr('height', height)
		.attr('viewBox', [0, 0, width, height])
	
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
					.style('opacity', .9)
				tooltip.html('Country: <b>' + d.properties.name +'</b><br>' + 'Native Speakers: <b>' + `${f(d.pop)}` + '</b><br>' + 'Percentage of Population: <b>' + `${f(d.percent)}%` + '</b>')
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
			
		// // tooltip
		// var tooltip = d3.select('body')
		// 	.append('div')
		// 	.attr('class', 'tooltip')
		// 	.style('opacity', 0)

		// title
		svg.append('text')
			.attr('x', width / 2)
			.attr('y', 34)
			.attr('text-anchor', 'middle')
			.style('font-size', '44px')
			.style('fill', '#4d4b47')
			.text('Native German Speakers')
		
		// total
		svg.append('circle')
			.attr('cx', 130)
			.attr('cy', 420)
			.attr('r', 90)
			.style('fill', '#a4d1cc')
			.attr('opacity', 0.8)
		svg.append('text')
			.attr('x', 130)
			.attr('y', 400)
			.attr('class', 'nunito')
			.attr('text-anchor', 'middle')
			.style('font-size', '24px')
			.style('fill', '#4d4b47')
			.text('Total:')
		svg.append('text')
			.attr('x', 130)
			.attr('y', 430)
			.attr('class', 'nunito')
			.attr('text-anchor', 'middle')
			.style('font-size', '18px')
			.style('fill', '#4d4b47')
			.text('85,222,201')
		svg.append('text')
			.attr('x', 130)
			.attr('y', 456)
			.attr('class', 'nunito')
			.attr('text-anchor', 'middle')
			.style('font-size', '18px')
			.style('fill', '#4d4b47')
			.text('native speakers')

		// LEGEND
		// append a defs (for definition) element to your SVG
		var defs = svg.append('defs')

		// append a linearGradient element to the defs and give it a unique id
		var linearGradient = defs.append('linearGradient')
			.attr('id', 'linear-gradient')
			
		// horizontal gradient
		linearGradient
			.attr('x1', '0%')
			.attr('y1', '0%')
			.attr('x2', '100%')
			.attr('y2', '0%')

		// set the color for the start (0%)
		linearGradient.append('stop')
			.attr('offset', '0%')
			.attr('stop-color', '#ddf4f1'); // light blue

		// set the color for the end (100%)
		linearGradient.append('stop')
			.attr('offset', '100%')
			.attr('stop-color', '#187183'); // dark blue

		// draw the rectangle and fill with gradient
		svg.append('rect')
			.attr('width', 200)
			.attr('height', 20)
			.attr('x', 400)
			.attr('y', 530)
			.style('fill', 'url(#linear-gradient)')
			
		// legend text (left end)
		svg.append('text')
			.attr('x', 400)
			.attr('y', 520)
			.attr('class', 'nunito')
			.style('font-size', '14px')
			.style('fill', '#4d4b47')
			.text('100')

		// legend text (right end)
		svg.append('text')
			.attr('x', 600)
			.attr('y', 520)
			.attr('class', 'nunito')
			.style('font-size', '14px')
			.style('fill', '#4d4b47')
			.text('7,115,780')
		
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
					.style('opacity', .9)
				var pop = d.pop
				if (d.pop == -1) pop = 'N/A'
				else pop = `${f(pop)}`
				tooltip.html('Country: <b>' + d.properties.name +'</b><br>' + 'Learners: <b>' + pop + '</b>')
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
			
		// // tooltip
		// var tooltip = d3.select('body')
		// 	.append('div')
		// 	.attr('class', 'tooltip')
		// 	.style('opacity', 0)

		// title
		svg.append('text')
			.attr('x', width / 2)
			.attr('y', 34)
			.attr('text-anchor', 'middle')
			.style('font-size', '44px')
			.style('fill', '#4d4b47')
			.text('German Language Learners')
		
		// total circle
		svg.append('circle')
			.attr('cx', 130)
			.attr('cy', 420)
			.attr('r', 90)
			.style('fill', '#a4d1cc')
			.attr('opacity', 0.8)
		svg.append('text')
			.attr('x', 130)
			.attr('y', 400)
			.attr('class', 'nunito')
			.attr('text-anchor', 'middle')
			.style('font-size', '24px')
			.style('fill', '#4d4b47')
			.text('Total:')
		svg.append('text')
			.attr('x', 130)
			.attr('y', 430)
			.attr('class', 'nunito')
			.attr('text-anchor', 'middle')
			.style('font-size', '18px')
			.style('fill', '#4d4b47')
			.text(`${f(learners.total)}`)
		svg.append('text')
			.attr('x', 130)
			.attr('y', 456)
			.attr('class', 'nunito')
			.attr('text-anchor', 'middle')
			.style('font-size', '18px')
			.style('fill', '#4d4b47')
			.text('learners')

		// LEGEND
		// append a defs (for definition) element to your SVG
		var defs = svg.append('defs')

		// append a linearGradient element to the defs and give it a unique id
		var linearGradient = defs.append('linearGradient')
			.attr('id', 'linear-gradient')
			
		// horizontal gradient
		linearGradient
			.attr('x1', '0%')
			.attr('y1', '0%')
			.attr('x2', '100%')
			.attr('y2', '0%')

		// set the color for the start (0%)
		linearGradient.append('stop')
			.attr('offset', '0%')
			.attr('stop-color', '#ddf4f1'); // light blue

		// set the color for the end (100%)
		linearGradient.append('stop')
			.attr('offset', '100%')
			.attr('stop-color', '#187183'); // dark blue

		// draw the rectangle and fill with gradient
		svg.append('rect')
			.attr('width', 200)
			.attr('height', 20)
			.attr('x', 400)
			.attr('y', 530)
			.style('fill', 'url(#linear-gradient)')
			
		// legend text (left end)
		svg.append('text')
			.attr('x', 400)
			.attr('y', 520)
			.attr('class', 'nunito')
			.style('font-size', '14px')
			.style('fill', '#4d4b47')
			.text('1')

		// legend text (right end)
		svg.append('text')
			.attr('x', 600)
			.attr('y', 520)
			.attr('class', 'nunito')
			.style('font-size', '14px')
			.style('fill', '#4d4b47')
			.text('1,953,014')
	}

		
	// show native speaker map
	showSpeakers()

	// event handlers
	$('#map-toggle').on('click', function() {
		if ($('#map-toggle').text() == 'Show Learners') {
			showLearners()
			$('#map-toggle').text('Show Native Speakers')
		} else {
			showSpeakers()
			$('#map-toggle').text('Show Learners')
		}
	})

}