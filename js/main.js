// SHOW LOADING SCREEN
document.body.classList.toggle('noscroll', true)
$('#loading').css('visibility', 'visible')

var count_cutoff = $('#sankey-range').val()
var other_flag = 0 // whether or not to show singular "other" category

var selected_ending = ''
var selected_type = 'singular'
var selected_i = -1 // index of selected_ending in nodes list

var data, nodes, links, nouns
var data_orig

var f = d3.format(',.0f') // format number strings
var colorScale_plurals = d3.scaleOrdinal(d3.schemeTableau10)

const gender_names = {
	'f': 'feminine',
	'm': 'masculine',
	'n': 'neuter'
}
const gender_names_short = {
	'f': 'fem.',
	'm': 'masc.',
	'n': 'neut.'
}

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
	d3.json('data/links.json'),
	d3.json('data/nouns.json'),
	d3.json('data/loanwords.json'),
	d3.json('data/genders.json'),
	d3.json('data/world.geojson'),
	d3.json('data/speakers.json'),
	d3.json('data/learners.json'),
]).then(data => {
	data = {
		'nodes': data[0],
		'links': data[1],
		'nouns': data[2],
		'loanwords': data[3],
		'genders': data[4],
		'world': data[5],
		'speakers': data[6],
		'learners': data[7],
	}
	// move singular "other" to end of nodes list
	var removed = data.nodes.splice(data.nodes.findIndex(x => x.name == 'other' & x.type == 'singular'), 1)
	data.nodes = data.nodes.concat(removed)

	// create copy or original untouched data
	data_orig = _.cloneDeep(data)
	console.log('data', data)

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


	// CREATE VISUALIZATIONS

	createLoanwords()
	createForce()
	createMap()
	createSankey()
	createBubble()
	createPie()
	createWordlist()
	createScatter()

	// HIDE LOADING SCREEN
	document.body.classList.toggle('noscroll', false)
	$('#loading').css('visibility', 'hidden')

})