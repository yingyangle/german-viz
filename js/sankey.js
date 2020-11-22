const m = 10
const margin = ({ top: m, right: m, bottom: m, left: m })
const width = 900 - margin.left - margin.right
const height = 2200 - margin.top - margin.bottom

let edgeColor = 'path'

const _sankey = d3.sankey()
	.nodeWidth(15)
	.nodePadding(10)
	.extent([[1, 1], [width - 1, height - 5]])

const sankey = ({nodes, links}) => _sankey({
	nodes: nodes.map(d => Object.assign({}, d)),
	links: links.map(d => Object.assign({}, d))
})

const f = d3.format(',.0f')
const format = d => `${f(d)} words`

const colorScale = d3.scaleOrdinal(d3.schemeCategory10)


Promise.all([ // load multiple files
	d3.json('data/nodes.json'), 
	d3.json('data/links.json')
]).then(data => {
	data = {
		'nodes': data[0],
		'links': data[1]
	}
	console.log(data)
	// convert data to sankey data
	let {nodes, links} = sankey(data)
	console.log('nodes', nodes)
	console.log('links', links)

	const svg = d3.select('#sankey')
		.attr('viewBox', `0 0 ${width} ${height}`)
		.style('width', '100%')
		.style('height', 'auto')

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

	const link = svg.append('g')
		.attr('fill', 'none')
		.attr('stroke-opacity', 0.5)
		.selectAll('g')
		.data(links)
		.join('g')
		.style('mix-blend-mode', 'multiply')
	
	// UPDATE FUNCTION
	function update() {
		if (edgeColor === 'path') {
		const gradient = link.append('linearGradient')
			.attr('id', (d,i) => {
			//  (d.uid = DOM.uid('link')).id
			const id = `link-${i}`
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
	}
		
	update()

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
		.text(d => d.name)

})