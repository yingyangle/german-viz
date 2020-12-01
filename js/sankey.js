function createSankey() {
	let m = 90
	let margin = ({ top: 50, right: m, bottom: 10, left: m })
	let width = 700
	let height = 900

	var edgeColor = 'path' // color of links

	// create svg
	let svg = d3.select('#sankey')
		.attr('viewBox', [0,0, width, height])
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

	width = width - margin.left - margin.right
	height = height - margin.top - margin.bottom

	let _sankey = d3.sankey()
		.nodeWidth(15)
		.nodePadding(10)
		.extent([[1, 1], [width - 1, height - 5]])

	let sankey = ({nodes, links}) => _sankey({
		nodes: nodes.map(d => Object.assign({}, d)),
		links: links.map(d => Object.assign({}, d))
	})
	
	// get original data, filter data, convert to sankey data
	function getData() {
		// set data to original full data
		data = _.cloneDeep(data_orig)
		// nodes_orig = _.cloneDeep(data.nodes)
		// links_orig = _.cloneDeep(data.links)
		// console.log('orig', data_orig, nodes_orig, links_orig)

		// find nodes to remove
		var nodes_to_remove = []
		for (var i in data.nodes) {
			n = data.nodes[i]
			if (n.count < count_cutoff_plural) {
				nodes_to_remove.push(n.i)
			} 
		}
		// console.log('remove', nodes_to_remove)
		// remove nodes with count < count_cutoff_plural
		data.nodes = data.nodes.filter(node => {
			return node.count > count_cutoff_plural
		})

		// get index of singular 'other' type and plural 'other' type
		var other_singular = data.nodes.findIndex(x => x.name == 'other' & x.type == 'singular')
		var other_plural = data.nodes.findIndex(x => x.name == 'other' & x.type == 'plural')
		// console.log('other_singular', other_singular)
		// console.log('other_plural', other_plural)

		var other_singular_add = 0, other_plural_add = 0

		// update source and target indices for links
		for (var i in data.links) {
			l = data.links[i]
			// source (singular)
			if (nodes_to_remove.includes(l.source)) {
				l.source = other_singular
				other_singular_add += 1
			} else {
				l.source = data.nodes.findIndex(x => x.i == l.source)
			}
			// target (plural)
			if (nodes_to_remove.includes(l.target)) {
				l.target = other_plural
				other_plural_add += 1
			} else {
				l.target = data.nodes.findIndex(x => x.i == l.target)
			}
		}
		// remove duplicate links
		var unique_links = []
		$.each(data.links, function(i, link){
			var i = unique_links.findIndex(x => x.source == link.source & x.target == link.target)
			// add new unique link
			if (i == -1) {
				unique_links.push(link)
			} else { // increment value on existing link
				unique_links[i].value += link.value
			}
		})
		// console.log('unique', unique_links)
		data.links = unique_links

		// remove singular "other" type if other_flag == 0
		if (other_flag == 0) {
			// remove singular "other" type from nodes
			data.nodes = data.nodes.filter(node => {
				return !(node.name == 'other' & node.type == 'singular')
			})
			// remove singular "other" type from links
			data.links = data.links.filter(node => {
				return node.source != other_singular
			})
		}
		nodes = data.nodes
		links = data.links
		
		// convert data to sankey data
		var sankey_data = sankey(data)
		var sankey_nodes = sankey_data.nodes 
		var sankey_links = sankey_data.links
		console.log('sankey nodes', sankey_nodes)
		console.log('sankey links', sankey_links)

		return {sankey_nodes, sankey_links}
	}
	
	// UPDATE FUNCTION
	// re-filter data, clear svg contents, draw new svg contents
	function update() {
		// get new count_cutoff_plural
		count_cutoff_plural = parseInt($('#sankey-range').val())
		// get new filtered data
		var sankey_data = getData()
		var sankey_nodes = sankey_data.sankey_nodes 
		var sankey_links = sankey_data.sankey_links
		// console.log(sankey_nodes, sankey_links)
		// console.log('nodes:', sankey_nodes.length, 'links:', sankey_links.length)
		// console.log('count_cutoff_plural', count_cutoff_plural)

		// clear svg contents
		svg.selectAll('*').remove()

		// nodes
		svg.append('g')
			// .attr('stroke', 'black') // outline
			.attr('opacity', 0.7)
			.selectAll('rect')
			.data(sankey_nodes)
			.join('rect')
			.attr('class', 'sankey-node')
			.attr('x', d => d.x0)
			.attr('y', d => d.y0)
			.attr('height', d => d.y1 - d.y0)
			.attr('width', d => d.x1 - d.x0)
			.attr('fill', d => colorScale_plurals(d.name))
			.attr('opacity', 0.8)
			.on('click', function(d) {
				selected_ending = d.name
				selected_type = d.type
				$('#selected-ending').html(selected_ending)
				$('#selected-type').html('('+selected_type+' ending)')
				selected_i = sankey_nodes.findIndex(x => x.name == selected_ending & x.type == selected_type)
				plurals_total = sankey_nodes[selected_i].count
				console.log('selected ending', selected_ending, selected_i)
			})
			.on('mouseover', function(d) {
				d3.select(this)
					// .attr('fill', 'black')
					.attr('opacity', 1)
			})
			.on('mouseout', function(d) {
				d3.select(this)
					.attr('fill', d => colorScale_plurals(d.name))
					.attr('opacity', 0.8)
			})
			.append('title')
			.text(d => `${d.name}\n${f(d.value)} words`)
			

		// links
		let link = svg.append('g')
			.attr('fill', 'none')
			.attr('stroke-opacity', 0.4)
			.selectAll('g')
			.data(sankey_links)
			.join('g')
			.style('mix-blend-mode', 'multiply')

		// link colors
		if (edgeColor === 'path') {
			let gradient = link.append('linearGradient')
				.attr('id', (d,i) => {
					//  (d.uid = DOM.uid('link')).id
					let id = `link-${i}`
					d.uid = `url(#${id})`
					return id
				})
				.attr('gradientUnits', 'userSpaceOnUse')
				.attr('x1', d => d.source.x1)
				.attr('x2', d => d.target.x0)

			gradient.append('stop')
				.attr('offset', '0%')
				.attr('stop-color', d => colorScale_plurals(d.source.name))

			gradient.append('stop')
				.attr('offset', '100%')
				.attr('stop-color', d => colorScale_plurals(d.target.name))
		}

		link.append('path')
			.attr('d', d3.sankeyLinkHorizontal())
			.attr('stroke', d => edgeColor === 'path' ? d.uid
				: edgeColor === 'input' ? colorScale_plurals(d.source.name)
				: colorScale_plurals(d.target.name))
			.attr('stroke-width', d => Math.max(1, d.width))

		// tooltip on link hover
		link.on('mouseover.tooltip', function(d) {
				tooltip.transition()
					.duration(200)
					.style('opacity', .9)
				tooltip.html('<b>' + d.source.name + ' → ' + d.target.name + '</b><br>' + `${f(d.value)} words`)
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

		// node name labels
		svg.append('g')
			.selectAll('text')
			.data(sankey_nodes)
			.join('text')
			.attr('class', 'nunito')
			.attr('font-size', '16px')
			.attr('x', d => d.x0 < width / 2 ? d.x1 - 20 : d.x0 + 20)
			.attr('y', d => (d.y1 + d.y0) / 2)
			.attr('dy', '0.35em')
			.attr('text-anchor', d => d.x0 < width / 2 ? 'end' : 'start')
			.text(d => d.name)
		// node count labels
		svg.append('g')
			.selectAll('text')
			.data(sankey_nodes)
			.join('text')
			.attr('class', 'nunito')
			.attr('font-size', '16px')
			.attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
			.attr('y', d => (d.y1 + d.y0) / 2)
			.attr('dy', '0.35em')
			.attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
			.text(d => `${f(d.value)}`)
		// singular axis label
		svg.append('text')
			.attr('x', 4)
			.attr('y', -20)
			.attr('text-anchor', 'middle')
			.style('font-size', '26px')
			.style('fill', '#4d4b47')
			.text('Singular Ending')
		// plural axis label
		svg.append('text')
			.attr('x', width - 40)
			.attr('y', -20)
			.attr('text-anchor', 'middle')
			.style('font-size', '26px')
			.style('fill', '#4d4b47')
			.text('Plural Ending')
		
		console.log('UPDATED SANKEY !')
	}
		
	update()

	// event listeners
	$('#sankey-range').on('change', update)
	$('#sankey-other-button').on('click', function() {
		if (other_flag) {
			other_flag = 0
			$('#sankey-other-button').html('Show "Other"')
			update()
		} else {
			other_flag = 1
			$('#sankey-other-button').html('Hide "Other"')
			update()
		}
	})
}

// instructional tooltip for "Minimum Count" slider
d3.selectAll('#sankey-range-wrap')
	.on('mouseover.tooltip', function() {
		tooltip.transition()
			.duration(200)
			.style('opacity', .9)
		tooltip.html('Use this slider to filter out the less frequent endings')
			.style('left', (d3.event.pageX) + 'px')
			.style('top', (d3.event.pageY + 20) + 'px')
		d3.select(this)
			.style('text-decoration', 'underline')
			.style('text-decoration-thickness', '1px')
	})
	.on('mouseout.tooltip', function() {
		tooltip.transition()
			.duration(200)
			.style('opacity', 0)
		d3.select(this)
			.style('text-decoration', 'none')
	})
	.on('mousemove', function() {
		tooltip.style('left', (d3.event.pageX) + 'px')
			.style('top', (d3.event.pageY + 20) + 'px')
	})
