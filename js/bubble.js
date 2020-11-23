var selected_ending = ''
var selected_type = 'plural'
var selected_i // index of selected_ending in nodes list

var count_cutoff = $('#sankey-count').val()

// bubbleChart creation function; instantiate new bubble chart given a DOM element to display it in and a dataset to visualise
function bubbleChart() {
	const width = 600
	const height = 500

	// location to center the bubbles
	const center = { x: width/2, y: height/2 }

	// strength to apply to the position forces
	const forceStrength = 0.03

	// these will be set in createNodes and chart functions
	let svg = null
	let bubbles = null
	let labels = null
	let nodes = []
	
	// charge is dependent on size of the bubble, so bigger towards the middle
	function charge(d) {
		return Math.pow(d.radius, 2.0) * 0.01
	}

	// create a force simulation and add forces to it
	const simulation = d3.forceSimulation()
		.force('charge', d3.forceManyBody().strength(charge))
		// .force('center', d3.forceCenter(center.x, center.y))
		.force('x', d3.forceX().strength(forceStrength).x(center.x))
		.force('y', d3.forceY().strength(forceStrength).y(center.y))
		.force('collision', d3.forceCollide().radius(d => d.radius + 1))

	// force simulation starts up automatically, which we don't want as there aren't any nodes yet
	simulation.stop()

	// set up color scale
	// const fillcolor = d3.scaleOrdinal()
	// 	.domain(['1', '2', '3', '5', '99'])
	// 	.range(['#0074D9', '#7FDBFF', '#39CCCC', '#3D9970', '#AAAAAA'])

	// data manipulation function takes raw data from csv and converts it into an array of node objects
	// each node will store data and visualisation values to draw a bubble
	// rawData is expected to be an array of data objects, read in d3.csv
	// function returns the new node array, with a node for each element in the rawData input
	function createNodes(rawData) {
		// use max size in the data as the max in the scale's domain
		// note we have to ensure that size is a number
		const maxSize = d3.max(rawData, d => +d.count)

		// size bubbles based on area
		const radiusScale = d3.scaleSqrt()
			.domain([0, maxSize])
			.range([0, 80])

		// use map() to convert raw data into node data
		const myNodes = rawData.map(d => ({
			...d,
			radius: radiusScale(+d.count),
			size: +d.count,
			x: Math.random() * 900,
			y: Math.random() * 800
		}))

		return myNodes
	}

	// main entry point to bubble chart, returned by parent closure
	// prepares rawData for visualisation and adds an svg element to the provided selector and starts the visualisation process
	let chart = function chart(selector, rawData) {
		// convert raw data into nodes data
		nodes = createNodes(rawData)

		// create svg element inside provided selector
		svg = d3.select(selector)
			.append('svg')
			.attr('width', width)
			.attr('height', height)

		// bind nodes data to circle elements
		const elements = svg.selectAll('.bubble')
			.data(nodes, d => d.name)
			.enter()
			.append('g')

		bubbles = elements
			.append('circle')
			.classed('bubble', true)
			.attr('r', d => d.radius)
			.attr('fill', d => colorScale(d.name))
			.attr('fill-opacity', 0.7)

		// labels
		labels = elements
			.append('text')
			.attr('dy', '.3em')
			.style('text-anchor', 'middle')
			.style('font-size', 10)
			.text(d => d.name)
		
		svg.append('g')
			.style('font', '14px sans-serif')
			.selectAll('text')
			.data(nodes)
			.join('text')
			.attr('x', d => width / 2)
			.attr('y', d => 30)
			.attr('dy', '0.35em')
			.attr('text-anchor', 'center')
			.text('Plural Types')

		// set simulation's nodes to our newly created nodes array
		// simulation starts running automatically once nodes are set
		simulation.nodes(nodes)
			.on('tick', ticked)
			.restart()
	}

	// callback function called after every tick of the force simulation
	// here we do the actual repositioning of the circles based on current x and y value of their bound node data
	// x and y values are modified by the force simulation
	function ticked() {
		bubbles
			.attr('cx', d => d.x)
			.attr('cy', d => d.y)

		labels
			.attr('x', d => d.x)
			.attr('y', d => d.y)
	}

	// return chart function from closure
	return chart
}

// new bubble chart instance
let myBubbleChart = bubbleChart()

// function called once promise is resolved and data is loaded from csv
// calls bubble chart function to display inside #vis div
function display(data) {
	console.log(data)
	nodes = data[0]
	links = data[1]

	selected_i = nodes.findIndex(x => x.name == selected_ending & x.type == selected_type)

	// filter nodes to show correct type (plural or singular)
	nodes = nodes.filter(node => {
		return node.type != selected_type & node.count >= count_cutoff
	})

	if (selected_i == -1) {
		// create bubble chart
		myBubbleChart('#bubble', nodes)
		return
	}

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

	// create bubble chart
	myBubbleChart('#bubble', nodes)
}

// load data
Promise.all([ 
	d3.json('data/nodes.json'), 
	d3.json('data/links.json')
]).then(display)

// $('#sankey-range').on('change', function() {
// 	console.log('sankey bubble')
// 	d3.select('#bubble').selectAll('*').remove()
// 	// load data
// 	Promise.all([ 
// 		d3.json('data/nodes.json'), 
// 		d3.json('data/links.json')
// 	]).then(display)
// })