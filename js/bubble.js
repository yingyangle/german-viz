$( document ).ready(function() {
console.log('ready !')

var count_cutoff = $('#sankey-count').val()
// const center = { x: 0, y: 0 }
const center = { x: width / 2 , y: height / 2 + 900 }

Promise.all([ 
	d3.json('data/nodes.json'), 
	d3.json('data/links.json')
]).then(data => {
	let width = 500
	let height = 500

	console.log('bubble', data)
	let nodes = data[0]
	let links = data[1]
	const nodes_orig = _.cloneDeep(nodes) // save copy of original data

	const svg = d3.select('#bubble').append('svg')
		// .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
		.attr('viewBox',  [-width / 2, -height / 2, width, height])
	
	// filter and format data
	function get_data() {
		// filter nodes to show correct type (plural or singular)
		nodes = nodes.filter(node => {
			return node.type != selected_type // & node.count >= count_cutoff
		})

		if (selected_i != -1) {
			// adjust count according to selected ending
			var nodes_to_remove = []
			for (var i in nodes) {
				var node = nodes[i]
				// find link from selected singular to current node
				if (selected_type == 'singular') {
					var j = links.findIndex(x => x.target == node.i & x.source == selected_i)
				} else { // find link from current node to selected plural
					var j = links.findIndex(x => x.source == node.i & x.target == selected_i)
				}
				// if link not found
				if (j == -1) {
					nodes_to_remove.push(node)
				} else { // set node count as link count 
					node.count = links[j].value
				}
			}
			// remove nodes with 0 count
			nodes = nodes.filter(node => {
				return !nodes_to_remove.includes(node)
			})
		}

		const maxSize = d3.max(nodes, d => +d.count)
		
		// size bubbles based on area
		const radiusScale = d3.scaleSqrt()
			.domain([0, maxSize])
			.range([0, 80])
		
		// format nodes info
		nodes = nodes.map(d => ({
			...d,
			radius: radiusScale(+d.count),
			size: +d.count,
			x: Math.random() * -200,
			y: Math.random() * 100
		}))

		console.log('bubble nodes', nodes)
		return nodes
	}

	// update bubble chart
	function update() {
		nodes = nodes_orig
		selected_i = nodes.findIndex(x => x.name == selected_ending & x.type == selected_type)
		console.log('selected ending', selected_ending, selected_i)

		// clear svg contents
		svg.selectAll('*').remove()

		nodes = get_data()

		// charge is dependent on size of the bubble, so bigger towards the middle
		function charge(d) {
			return Math.pow(d.radius, 2.0) * 0.01
		}

		const force = d3.forceSimulation(nodes)
			.force('charge', d3.forceManyBody().strength(charge))
			.force('center', d3.forceCenter())
			.force('x', d3.forceX().strength(0.07).x(center.x))
			.force('y', d3.forceY().strength(0.07).y(center.y))
			.force('collision', d3.forceCollide().radius(d => d.radius + 1))

		force.stop()

		// drag
		drag = simulation => {

			function dragstarted(d) {
				if (!d3.event.active) simulation.alphaTarget(0.3).restart()
				d.fx = d.x
				d.fy = d.y
			}
			
			function dragged(d) {
				d.fx = d3.event.x
				d.fy = d3.event.y
			}
			
			function dragended(d) {
				if (!d3.event.active) simulation.alphaTarget(0)
				d.fx = null
				d.fy = null
			}
			
			return d3.drag()
				.on('start', dragstarted)
				.on('drag', dragged)
				.on('end', dragended)
		}
		
		// create node as circles
		var node = svg.selectAll('g')
			.data(nodes)
			.enter()
			.append('g')

		let colorScale = d3.scaleOrdinal(d3.schemeTableau10)

		let bubbles = node.append('circle')
			.classed('bubble', true)
			.attr('class', 'node')
			.attr('r', d => d.radius)
			.attr('fill', d => colorScale(d.name))
			.attr('opacity', 0.7)
			.call(drag(force))
			.on('mouseover.tooltip', function(d) {
				tooltip.transition()
					.duration(200)
					.style('font-family', 'Nunito Sans')
					.style('padding', '10px')
					.style('opacity', 0.9)
				tooltip.html('Plural Type: ' + d.name + '<br>' + `${f(d.count)} words`)
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

		// circle labels
		let labels = node.append('text')
			.text(d => d.name)
			.style('font-size', '18px')
			.attr('class', 'nunito')
			.attr('fill', '#4d4b47')
			.attr('x', 0)
			.attr('y', 0)
			.attr('text-anchor', 'middle')
			.call(drag(force))
			.on('mouseover.tooltip', function(d) {
				tooltip.transition()
					.duration(200)
					.style('font-family', 'Nunito Sans')
					.style('padding', '10px')
					.style('opacity', .9)
				tooltip.html('Plural Type: ' + d.name + '<br>' + `${f(d.count)} words`)
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
			.attr('x', 0)
			.attr('y', -200)
			.attr('text-anchor', 'middle')
			.style('font-size', '40px')
			.style('fill', '#4d4b47')
			.text('Plural Types')


		// called each time the simulation ticks
		// each tick, take new x and y values for each link and circle, x y values calculated by d3 and appended to our dataset objects
		force.on('tick', () => {
			bubbles
				.attr('cx', d => d.x)
				.attr('cy', d => d.y)

			labels
				.attr('x', d => d.x)
				.attr('y', d => d.y)
			})
			.restart()

		console.log('UPDATED BUBBLE !')
	}
	
	update()

	$('#sankey-range').on('change', () => {
		$('.sankey-node').on('click', () => {
			update()
			console.log('sankey node click update')
		})
	})

	$('.sankey-node').on('click', () => {
		update()
		console.log('sankey node click update')
	})

	$('#show-all-singulars').on('click', () => {
		selected_ending = ''
		selected_type = 'plural'
		$('#selected-ending').html('All Singulars')
		$('#selected-type').html('')
		update()
	})

	$('#show-all-plurals').on('click', () => {
		selected_ending = ''
		selected_type = 'singular'
		$('#selected-ending').html('All Plurals')
		$('#selected-type').html('')
		update()
	})
})


})
