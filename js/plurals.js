var count_cutoff_plural = $('#sankey-range').val()
var other_flag = 0 // whether or not to show singular "other" category

var selected_ending = ''
var selected_type = 'singular'
var selected_i = -1 // index of selected_ending in nodes list

var plurals_total = 180424

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
]).then(data => {
	data = {
		'nodes': data[0],
		'links': data[1],
		'nouns': data[2],
	}
	// move singular "other" to end of nodes list
	var removed = data.nodes.splice(data.nodes.findIndex(x => x.name == 'other' & x.type == 'singular'), 1)
	data.nodes = data.nodes.concat(removed)

	// create copy or original untouched data
	data_orig = _.cloneDeep(data)
	// console.log('plurals data', data)


	// CREATE VISUALIZATIONS

	createSankey()
	createBubble()
	createPie()
	// createWordlist()
	// createScatter()

})

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
