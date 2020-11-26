var count_cutoff = $('#sankey-count').val()
var other_flag = 0 // whether or not to show singular "other" category

var selected_ending = ''
var selected_type = 'singular'
var selected_i = -1 // index of selected_ending in nodes list

var data, nodes, links
var data_orig, nodes_orig, links_orig

var f = d3.format(',.0f') // format number strings
var colorScale_plurals = d3.scaleOrdinal(d3.schemeTableau10)

// RANGE SLIDER FOR MINIMUM COUNT (count_cutoff)
const range = document.getElementById('sankey-range')
const rangeV = document.getElementById('sankey-range-value')
const setValue = () => {
		const newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) )
		const newPosition = 10 - (newValue * 0.2)
		rangeV.innerHTML = `<span>${range.value}</span>`
		rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`
	}
document.addEventListener('DOMContentLoaded', setValue)
range.addEventListener('input', setValue)

// load .json files
Promise.all([ 
	d3.json('data/nodes.json'), 
	d3.json('data/links.json')
]).then(data => {
	data = {
		'nodes': data[0],
		'links': data[1]
	}
	// move singular "other" to end of nodes list
	var removed = data.nodes.splice(data.nodes.findIndex(x => x.name == 'other' & x.type == 'singular'), 1)
	data.nodes = data.nodes.concat(removed)

	// create copy or original untouched data
	data_orig = _.cloneDeep(data)

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

	createSankey()
	createBubble()

})