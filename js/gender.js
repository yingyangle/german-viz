var count_cutoff_gender = $('#gender-range').val()

var selected_ending_gender = ''

var f = d3.format(',.0f') // format number strings

var gender_pct_orig

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

// RANGE SLIDER FOR *GENDER* MINIMUM COUNT (count_cutoff_gender)
var range_gender = document.getElementById('gender-range')
var rangeV_gender = document.getElementById('gender-range-value')
var setValue_gender = () => {
		var newValue_gender = Number( (range_gender.value - range_gender.min) * 100 / (range_gender.max - range_gender.min) )
		var newPosition_gender = 10 - (newValue_gender * 0.2)
		rangeV_gender.innerHTML = `<span>${range_gender.value}</span>`
		rangeV_gender.style.left = `calc(${newValue_gender}% + (${newPosition_gender}px))`
	}
document.addEventListener('DOMContentLoaded', setValue_gender)
range_gender.addEventListener('input', setValue_gender)


// load .json files
Promise.all([
	d3.json('data/gender_pct.json'),
	// d3.json('data/genders.json'),
]).then(data => {
	data = {
		'gender_pct': data[0],
		// 'genders': data[1],
	}

	// create copy or original untouched data
	gender_pct_orig = _.cloneDeep(data.gender_pct)
	console.log('gender_pct', data.gender_pct)

	// CREATE VISUALIZATIONS
	createGenderlist(data.gender_pct)
	createTernary(data.gender_pct)
})


// instructional tooltip for "Show All" button
d3.selectAll('#ternary-reset')
	.on('mouseover.tooltip', function() {
		tooltip.transition()
			.duration(200)
			.style('opacity', .9)
		tooltip.html('Click to show all endings again')
			.style('left', (d3.event.pageX) + 'px')
			.style('top', (d3.event.pageY + 20) + 'px')
	})
	.on('mouseout.tooltip', function() {
		tooltip.transition()
			.duration(200)
			.style('opacity', 0)
	})
	.on('mousemove', function() {
		tooltip.style('left', (d3.event.pageX) + 'px')
			.style('top', (d3.event.pageY + 20) + 'px')
	})

// instructional tooltip for "Minimum Count" sliders
d3.selectAll('.minimum-count')
	.on('mouseover.tooltip', function() {
		tooltip.transition()
			.duration(200)
			.style('opacity', .9)
		tooltip.html('Use this slider to filter out the less frequent endings')
			.style('left', (d3.event.pageX) + 'px')
			.style('top', (d3.event.pageY + 20) + 'px')
	})
	.on('mouseout.tooltip', function() {
		tooltip.transition()
			.duration(200)
			.style('opacity', 0)
	})
	.on('mousemove', function() {
		tooltip.style('left', (d3.event.pageX) + 'px')
			.style('top', (d3.event.pageY + 20) + 'px')
	})

// instructional tooltip for "Minimum Count" sliders
d3.selectAll('.gender-guess-word')
	.on('mouseover.tooltip', function() {
		tooltip.transition()
			.duration(200)
			.style('opacity', .9)
		tooltip.html('<b>' + gender_names[d3.select(this).attr('data-gender')] + '</b>')
			.style('left', (d3.event.pageX) + 'px')
			.style('top', (d3.event.pageY + 20) + 'px')
	})
	.on('mouseout.tooltip', function() {
		tooltip.transition()
			.duration(200)
			.style('opacity', 0)
	})
	.on('mousemove', function() {
		tooltip.style('left', (d3.event.pageX) + 'px')
			.style('top', (d3.event.pageY + 20) + 'px')
	})
