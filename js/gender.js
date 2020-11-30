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

	// update genderlist
	$('#gender-range').on('change', function() {
		count_cutoff_gender = $('#gender-range').val()
		selected_ending_gender = ''
		createGenderlist(data.gender_pct)
	})


})