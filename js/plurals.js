// SHOW LOADING SCREEN
// document.body.classList.toggle('noscroll', true)
// $('#loading').css('visibility', 'visible')

var count_cutoff_plural = $('#sankey-range').val()
var other_flag = 0 // whether or not to show singular "other" category

var selected_ending = ''
var selected_type = 'singular'
var selected_i = -1 // index of selected_ending in nodes list

var data, nodes, links, nouns
var data_orig

var f = d3.format(',.0f') // format number strings
var colorScale_plurals = d3.scaleOrdinal(d3.schemeTableau10)

// RANGE SLIDER FOR *PLURALS* MINIMUM COUNT (count_cutoff_plural)
var range_plural = document.getElementById('sankey-range')
var rangeV_plural = document.getElementById('sankey-range-value')
var setValue_plural = () => {
		var newValue_plural = Number( (range_plural.value - range_plural.min) * 100 / (range_plural.max - range_plural.min) )
		var newPosition_plural = 10 - (newValue_plural * 0.2)
		rangeV_plural.innerHTML = `<span>${range_plural.value}</span>`
		rangeV_plural.style.left = `calc(${newValue_plural}% + (${newPosition_plural}px))`
	}
document.addEventListener('DOMContentLoaded', setValue_plural)
range_plural.addEventListener('input', setValue_plural)

// load .json files
Promise.all([ 
	d3.json('data/nodes.json'),
	d3.json('data/links.json'),
	d3.json('data/nouns.json'),
	// d3.json('data/loanwords.json'),
	// d3.json('data/genders.json'),
	// d3.json('data/world.geojson'),
	// d3.json('data/speakers.json'),
	// d3.json('data/learners.json'),
]).then(data => {
	data = {
		'nodes': data[0],
		'links': data[1],
		'nouns': data[2],
		// 'loanwords': data[3],
		// 'genders': data[4],
		// 'world': data[5],
		// 'speakers': data[6],
		// 'learners': data[7],
	}
	// move singular "other" to end of nodes list
	var removed = data.nodes.splice(data.nodes.findIndex(x => x.name == 'other' & x.type == 'singular'), 1)
	data.nodes = data.nodes.concat(removed)

	// create copy or original untouched data
	data_orig = _.cloneDeep(data)
	console.log('data', data)


	// CREATE VISUALIZATIONS

	createSankey()
	createBubble()
	createPie()
	// createWordlist()
	// createScatter()

	// HIDE LOADING SCREEN
	// document.body.classList.toggle('noscroll', false)
	// $('#loading').css('visibility', 'hidden')

})