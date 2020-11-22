let m = 10
let margin = ({ top: m, right: m, bottom: m, left: m })
let width = 700 - margin.left - margin.right
let height = 500 - margin.top - margin.bottom

var count_cutoff = $('#sankey-count').val()
let edgeColor = 'path'

let _sankey = d3.sankey()
	.nodeWidth(15)
	.nodePadding(10)
	.extent([[1, 1], [width - 1, height - 5]])

let sankey = ({nodes, links}) => _sankey({
	nodes: nodes.map(d => Object.assign({}, d)),
	links: links.map(d => Object.assign({}, d))
})

let f = d3.format(',.0f')
let format = d => `${f(d)} words`

let colorScale = d3.scaleOrdinal(d3.schemeCategory10)


Promise.all([ // load multiple files
	d3.json('data/nodes.json'), 
	d3.json('data/links.json')
]).then(data => {
	data = {
		'nodes': data[0],
		'links': data[1]
	}
	const data_orig = _.cloneDeep(data)
	console.log(data)

	let svg = d3.select('#sankey')
		.attr('viewBox', `0 0 ${width} ${height}`)
		.style('width', '100%')
		.style('height', 'auto')

	function getData() {
		data = _.cloneDeep(data_orig)
		// find nodes to remove (filtering)
		var nodes_to_remove = []
		for (var i in data.nodes) {
			n = data.nodes[i]
			if (n.count < count_cutoff) {
				nodes_to_remove.push(n.i)
			} 
		}
		console.log('remove', nodes_to_remove)
		// remove nodes from nodes list (filtering)
		data.nodes = data.nodes.filter(node => {
			return !nodes_to_remove.includes(node.i)
		})

		// get index of singular 'other' category
		var other_singular = data.nodes.findIndex(x => x.name == 'other' & x.type == 'singular')
		var other_plural = data.nodes.findIndex(x => x.name == 'other' & x.type == 'plural')
		console.log('other_singular', other_singular)
		console.log('other_plural', other_plural)

		var other_singular_add = 0, other_plural_add = 0
		var links_to_remove = []

		// remove links from links list (filtering)
		for (var i in data.links) {
			l = data.links[i]
			// source - singular
			if (nodes_to_remove.includes(l.source)) {
				l.source = other_singular
				other_singular_add += 1
			} else {
				l.source = data.nodes.findIndex(x => x.i == l.source)
			}
			// target - plural
			if (nodes_to_remove.includes(l.target)) {
				l.target = other_plural
				other_plural_add += 1
			} else {
				l.target = data.nodes.findIndex(x => x.i == l.target)
			}
		}
		// remove duplicates
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
		console.log('unique', unique_links)
		data.links = unique_links

		// convert data to sankey data
		console.log(sankey(data))
		let {nodes, links} = sankey(data)
		console.log('nodes', nodes)
		console.log('links', links)

		return {nodes, links}
	}

	
	
	// UPDATE FUNCTION
	function update() {
		count_cutoff = $('#sankey-count').val()
		var {nodes, links} = getData()

		console.log('nodes:', nodes.length, 'links:', links.length)
		console.log('count_cutoff', count_cutoff)
		svg.selectAll('*').remove();

		// category nodes
		svg.append('g')
			.attr('stroke', '#000')
			.selectAll('rect')
			.data(nodes)
			.join('rect')
			.attr('x', d => d.x0)
			.attr('y', d => d.y0)
			.attr('height', d => d.y1 - d.y0)
			.attr('width', d => d.x1 - d.x0)
			.attr('fill', d => colorScale(d.name))
			.append('title')
			.text(d => `${d.name}\n${format(d.value)}`)

		// links
		let link = svg.append('g')
			.attr('fill', 'none')
			.attr('stroke-opacity', 0.5)
			.selectAll('g')
			.data(links)
			.join('g')
			.style('mix-blend-mode', 'multiply')

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
				.attr('stop-color', d => colorScale(d.source.name))

			gradient.append('stop')
				.attr('offset', '100%')
				.attr('stop-color', d => colorScale(d.target.name))
		}

		link.append('path')
			.attr('d', d3.sankeyLinkHorizontal())
			.attr('stroke', d => edgeColor === 'path' ? d.uid
				: edgeColor === 'input' ? colorScale(d.source.name)
				: colorScale(d.target.name))
			.attr('stroke-width', d => Math.max(1, d.width))
		
		link.append('title')
			.text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`)

		svg.append('g')
			.style('font', '10px sans-serif')
			.selectAll('text')
			.data(nodes)
			.join('text')
			.attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
			.attr('y', d => (d.y1 + d.y0) / 2)
			.attr('dy', '0.35em')
			.attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
			.text(d => d.name + '\n' + d.value)
		console.log('updated !')
	}
		
	update()
	$('#sankey-reload').on('click', update)


})