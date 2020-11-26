
// /drag = f(simulation)

Promise.all([
	d3.json('data/genders.json')
	// d3.json('data/genders_more.json')
])
.then(data => {
	const sizeScale = d3.scaleLinear().range([7,43])

	var visType = 'Force'

	width = 1000
	height = 700

	// creat svg
	let svg = d3.select('#force')
		.append('svg')
		// .attr('width', width + margin.left + margin.right)
		// .attr('height', height + margin.top + margin.bottom)
		.attr('viewBox',  [-width / 2, -height / 2, width, height])


	var dataset = data[0]
	console.log('force',dataset.nodes)
	sizeScale.domain([0, d3.max(dataset.nodes, d => (d.freq))])

	const simulation = d3.forceSimulation(dataset.nodes)
		.force('link', d3.forceLink(dataset.links).id(d => d.i).distance(300))
		.force('charge', d3.forceManyBody().strength(-5))
		.force('center', d3.forceCenter())
		.force('collide', d3.forceCollide().radius(d => sizeScale(d.freq) + 20))

	let lines = svg.append('g')
		.style('stroke', '#999')
		.attr('stroke-opacity', 0.6)
		.selectAll('line')
		.data(dataset.links)
		.join('line')

	console.log('force', dataset.nodes)

	// var nodes = svg.selectAll('g')
	// .data(dataset.nodes).enter()
	// .append('g')

	// let circle = nodes.append('circle')
	// 	.attr('class', 'nodes')
	// 	.attr('r', d => sizeScale(d.freq))
	// 	.attr('fill', d => colorScale(d.gender))
	// 	.attr('opacity', 0.8)
	// 	.call(drag(simulation))

	// let nodes = svg.append('g')
	// 	.attr('stroke', '#fff')
	// 	.attr('stroke-width', 1.5)
	// 	.selectAll('circle')
	// 	.data(dataset.nodes)
	// 	.join('circle')
	// 	.attr('r', d => sizeScale(d.freq))
	// 	.style('fill', d => colorScale(d.gender))
	// 	.call(drag(simulation))

	var colorScale = d3.scaleOrdinal()
		.range(['rgb(89, 161, 79)', 'rgb(255, 157, 167)', 'rgb(118, 183, 178)'])
		// green, blue, pink

	var node = svg.selectAll('g')
		.data(dataset.nodes).enter()
		.append('g')

	let circle = node.append('circle')
		.attr('class', 'node')
		.attr('r', d => sizeScale(d.freq))
		.attr('fill', d => colorScale(d.gender))
		.attr('opacity', 0.8)
		.call(drag(simulation))
	
	let text = node.append('text')
		.text(d => d.name)
		.style('font-size', '18px')
		.attr('class', 'nunito')
		.attr('fill', '#4d4b47')
		.attr('x', 5)
		.attr('y', 5)
		.attr('text-anchor', 'middle')
		.call(drag(simulation))
		// .on('mouseover.forcetooltip', function(d) {
		// 	tooltip.transition()
		// 		.duration(200)
		// 		.style('opacity', .8)
		// 		tooltip.html(d.name + '<p/>Frequency: ' + d.freq+'<p/> Gender: ' + d.gender)
		// 		.style('left', (d3.event.pageX) + 'px')
		// 		.style('top', (d3.event.pageY + 10) + 'px')
		// })
		// .on('mouseout.forcetooltip', function() {
		// 	tooltip.transition()
		// 		.duration(200)
		// 		.style('opacity', 0)
		// })
		// .on('mousemove', function() {
		// 	tooltip.style('left', (d3.event.pageX) + 'px')
		// 		.style('top', (d3.event.pageY + 10) + 'px')
		// })

	simulation.on('tick', () => {

		circle.attr('cx', d => d.x)
			.attr('cy', d => d.y)
		
		lines.attr('x1', d => d.source.x)
			.attr('y1', d => d.source.y)
			.attr('x2', d => d.target.x)
			.attr('y2', d => d.target.y)
	
		text.attr('x', d => d.x)
			.attr('y', d => d.y)
	})
})
