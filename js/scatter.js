function createScatter() {
	nouns = data.nouns
	// get rid words with 0 syllables or 0 gender
	nouns = nouns.filter(word => {
		return word.genus != 0 & word.syllables != 0
	})

	let margin = ({top: 120, right: 90, bottom: 50, left: 60})
	let width = 540 - margin.left - margin.right
	let height = 520 - margin.top - margin.bottom
	
	let svg = d3.select('#scatter')
		.append('svg')
		// .attr('viewBox', [0, 0, width, height])
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

	let xScale = d3
		.scaleLinear()
		.domain(d3.extent(nouns, d => d.syllables))
		.range([0, width])
	
	let yScale = d3
		.scaleLinear()
		.domain(d3.extent(nouns, d => d.letters))
		.range([height, 0])

	let xAxis = d3.axisBottom()
		.scale(xScale)
		.ticks(5, 's')
		.tickSizeOuter(0) // hide end ticks
	
	let yAxis = d3.axisLeft()
		.scale(yScale)
		.ticks(5, 's')
		.tickSizeOuter(0) // hide end ticks

	svg.append('g')
		.attr('class', 'axis x-axis')
		.attr('transform', `translate(0, ${height})`)
		.call(xAxis)
	
	svg.append('g')
		.attr('class', 'axis y-axis')
		.call(yAxis)
	
	// set the color scale
	var colorScale = d3.scaleOrdinal()
		.domain(data.nouns)
		.range(['rgb(171, 198, 155)', 'rgb(247, 200, 200)', 'rgb(186, 211, 205)'])
		// green, pink, blue

	// // circle size
	// let sizeScale = d3.scaleSqrt()
	// 	.domain(d3.extent(nouns, d => d.Population))
	// 	.range([1, 28])

	// scatter plot circles
	svg.selectAll('circle')
		.data(nouns)
		.enter()
		.append('circle')
		.attr('cx', d => xScale(d.syllables))
		.attr('cy', d => yScale(d.letters))
		// .attr('r', d => sizeScale(d.Population))
		.attr('r', 8)
		.attr('fill', d => colorScale(d.genus))
		.attr('fill-opacity', 0.8)
		.on('mouseover.tooltip', function(d) {
			tooltip.transition()
				.duration(200)
				.style('font-family', 'Nunito Sans')
				.style('padding', '10px')
				.style('opacity', 0.9)
			tooltip.html('Word: <b>' + d.lemma + ' (' + d.genus +') </b><br>Letters: <b>' + d.letters + '</b><br>Syllables: <b>' + d.syllables + '</b>')
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
		.attr('y', -80)
		.attr('text-anchor', 'middle')
		.style('font-size', '40px')
		.style('fill', '#4d4b47')
		.text('Scatter Plot')

	// x-axis label
	svg.append("text")
		.attr('x', width / 2)
		.attr('y', height + 40)
		.attr('class', 'nunito')
		.attr('fill', '#4d4b47')
		.text('Syllables')

	// y-axis label
	svg.append('text')
		.attr('x', -1 * height / 2 - 40)
		.attr('y', -40)
		.attr('transform', 'rotate(-90)')
		.attr('class', 'nunito')
		.attr('fill', '#4d4b47')
		.text('Letters')
	
	// legend boxes
	svg.append('g').selectAll('rect')
		.data(['f', 'm', 'n'])
		.enter()
		.append('rect')
		.attr('class', 'box')
		.attr('height', 10) 
		.attr('width', 10) 
		.attr('x', width - 70)
		.attr('y', (d, i) => height + i * 20 - 90)
		.attr('fill', d => colorScale(d))
	
	// legend text
	svg.append('g').selectAll('text')
		.data(['f', 'm', 'n'])
		.enter()
		.append('text')
		.text(d => gender_names_short[d])
		.attr('x', width - 50)
		.attr('y', (d, i) => height + i * 20 - 81)
		.attr('font-size', '10px')
		.attr('class', 'nunito')
		.attr('text-anchor', 'beginning')

}
