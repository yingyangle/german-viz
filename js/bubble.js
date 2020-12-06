var bubble_type = 'Plural'
var bubble_nodes
var plurals_total
	
function bubble_mouseover(d) {
	var pct = Math.round(1000 * d.count / plurals_total) / 10

	// show tooltip
	tooltip.transition()
		.duration(200)
		.style('opacity', 0.9)
	tooltip.html(bubble_type + ' Ending: <b>' + d.name + '</b><br>Percentage: <b>' + pct + '%</b>')
		.style('left', (d3.event.pageX) + 'px')
		.style('top', (d3.event.pageY + 10) + 'px')

	// highlight sankey links
	link.selectAll('path').attr('opacity', 0.2)
	if (selected_type == 'plural') {
		if (selected_ending == '') {
			d3.selectAll('g[data-singular="' + d.name + '"]')
				.selectAll('path').attr('opacity', 1)
		} else {
			d3.select('g[data-singular="' + d.name + '"][data-plural="' + selected_ending + '"]')
				.selectAll('path').attr('opacity', 1)
		}
	} else {
		if (selected_ending == '') {
			d3.select('g[data-plural="' + d.name + '"]')
				.selectAll('path').attr('opacity', 1)
		} else {
			d3.selectAll('g[data-plural="' + d.name + '"][data-singular="' + selected_ending + '"]')
				.selectAll('path').attr('opacity', 1)
		}
	}
}

function bubble_mouseout() {
	tooltip.transition()
		.duration(200)
		.style('opacity', 0)

	// highlight links 
	if (selected_ending == '') {
		link.selectAll('path').attr('opacity', 1)
	} else {
		link.selectAll('path').attr('opacity', 0.2)
		d3.selectAll('g[data-' + selected_type + '="' + selected_ending + '"]')
			.selectAll('path').attr('opacity', 1)
	}
}

function createBubble() {

	let width = 400
	let height = 320
	var center = { x: 0 , y: 30 }

	// create svg
	const svg = d3.select('#bubble').append('svg')
		.attr('viewBox', [-width / 2, -height / 2, width, height])
	
	// filter and format data
	function get_data() {
		// set data to original full data
		data = _.cloneDeep(data_orig)
		// remove nodes with count < count_cutoff_plural
		data.nodes = data.nodes.filter(node => {
			return node.count > count_cutoff_plural
		})
		if (selected_ending == '') {
			bubble_nodes = data.nodes
			bubble_links = data.links
			// filter nodes to show correct type (plural or singular)
			bubble_nodes = bubble_nodes.filter(node => {
				return node.type != selected_type // & node.count >= count_cutoff_plural
			})
		} else {
			bubble_nodes = nodes
			bubble_links = links
		}
		// console.log('bubble', bubble_nodes, bubble_links)

		// filter nodes according to selected ending
		var nodes_to_remove = []
		var j
		if (selected_i != -1) {
			// adjust count according to selected ending
			for (var i in bubble_nodes) {
				var node = bubble_nodes[i]
				// find link from selected singular to current plural node
				if (selected_type == 'singular') {
					j = bubble_links.findIndex(x => x.source == selected_i & x.target == i)
				} else { // find link from current singular node to selected plural
					j = bubble_links.findIndex(x => x.source == i & x.target == selected_i)
				}
				// if link not found
				if (j == -1) {
					nodes_to_remove.push(node)
				} else { // set node count as link count 
					node.count = bubble_links[j].value
				}
			}
			// remove nodes with 0 count
			bubble_nodes = bubble_nodes.filter(node => {
				return !nodes_to_remove.includes(node)
			})
		} 
		plurals_total = d3.sum(bubble_nodes, d => +d.count)

		var maxSize = d3.max(bubble_nodes, d => +d.count)
		var minSize = d3.min(bubble_nodes, d => +d.count)
		
		// size bubbles based on area
		var radiusScale = d3.scaleSqrt()
			.domain([minSize, maxSize])
			.range([0, 50])
		
		// format nodes info
		bubble_nodes = bubble_nodes.map(d => ({
			...d,
			radius: radiusScale(+d.count),
			size: +d.count,
			x: Math.random() * -200,
			y: Math.random() * 100
		}))

		// console.log('bubble nodes', bubble_nodes)
		return bubble_nodes
	}

	// update bubble chart
	function update() {
		bubble_nodes = get_data()

		// clear svg contents
		svg.selectAll('*').remove()

		// charge is dependent on size of the bubble, so bigger towards the middle
		function charge(d) {
			return Math.pow(d.radius, 2.0) * 0.01
		}

		const force = d3.forceSimulation(bubble_nodes)
			.force('charge', d3.forceManyBody().strength(charge))
			.force('center', d3.forceCenter(center.x, center.y))
			.force('x', d3.forceX().strength(0.07).x(center.x))
			.force('y', d3.forceY().strength(0.07).y(center.y))
			.force('collision', d3.forceCollide().radius(d => d.radius + 1))

		force.stop()
		
		// create node as circles
		var node = svg.selectAll('g')
			.data(bubble_nodes)
			.enter()
			.append('g')

		let bubbles = node.append('circle')
			.classed('bubble', true)
			.attr('class', 'node')
			.attr('r', d => d.radius)
			.attr('fill', d => colorScale_plurals(d.name))
			.attr('opacity', 0.6)
			.call(drag(force))
			.on('mouseover.tooltip', bubble_mouseover)
			.on('mouseout.tooltip', bubble_mouseout)
			.on('mousemove', function() {
				tooltip.style('left', (d3.event.pageX) + 'px')
					.style('top', (d3.event.pageY + 10) + 'px')
			})

		// circle labels
		let labels = node.append('text')
			.text(d => d.name)
			.style('font-size', '14px')
			.attr('class', 'nunito')
			.attr('fill', '#4d4b47')
			.attr('x', 0)
			.attr('dy', '.2em')
			.attr('text-anchor', 'middle')
			.call(drag(force))
			.on('mouseover.tooltip', bubble_mouseover)
			.on('mouseout.tooltip', bubble_mouseout)
			.on('mousemove', function() {
				tooltip.style('left', (d3.event.pageX) + 'px')
					.style('top', (d3.event.pageY + 10) + 'px')
			})

		var tooltip = d3.select('.tooltip')

		// title
		svg.append('text')
			.attr('x', 0)
			.attr('y', -120)
			.attr('text-anchor', 'middle')
			.style('font-size', '24px')
			.style('fill', '#4d4b47')
			.text(() => {
				if (selected_type == 'plural') {
					if (selected_ending == '') return 'Singular Endings'
					return 'Singular Endings For Nouns'
				} else {
					if (selected_ending == '') return 'Plural Endings'
					return 'Plural Endings For Nouns'
				}
			})
		svg.append('text')
			.attr('x', 0)
			.attr('y', -120 + 24)
			.attr('text-anchor', 'middle')
			.style('font-size', '24px')
			.style('fill', '#4d4b47')
			.text(() => {
				if (selected_ending == '') return 'For All Nouns'
				if (selected_type == 'plural') {
					if (selected_ending == 'no change') return 'With No Change in the Plural'
					if (selected_ending == 'other') return 'With Other Plural Type Not Listed'
					return 'With Plurals Ending In "' + selected_ending + '"'
				} else {
					return 'With Singulars Ending In "' + selected_ending + '"'
				}
			})


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

		// console.log('UPDATED BUBBLE !')
	}
	
	update()

	$('#sankey-range').on('change', () => {
		$('.sankey-node').on('click', () => {
			update()
		})
		update()
		// d3.select('rect[data-' + selected_type + '="' + d.name + '"]')
			
	})

	$('.sankey-node').on('click', () => {
		update()
	})

	$('#show-all-singulars').on('click', () => {
		selected_ending = ''
		selected_type = 'plural'
		selected_i = -1
		bubble_type = 'Singular'
		$('#selected-ending').html('All Singulars')
		$('#selected-type').html('')
		update()
	})

	$('#show-all-plurals').on('click', () => {
		selected_ending = ''
		selected_type = 'singular'
		selected_i = -1
		bubble_type = 'Plural'
		$('#selected-ending').html('All Plurals')
		$('#selected-type').html('')
		update()
	})
}