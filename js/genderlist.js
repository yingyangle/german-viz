Promise.all([
	d3.json('data/gender_pct.json')
]).then(data => {
	createGenderlist(data[0])
})

function createGenderlist(gender_pct) {
	console.log('genderlist', gender_pct)

	var html_content = ''
	
	// loop through each noun, add data to word list
	for (var suffix in gender_pct) {
		// new row
		html_content = html_content + '<div class="row">'

		// suffix
		html_content = html_content + '<div class="col-5"><b>' + suffix + '</b></div>'
		
		// fem. pct
		html_content = html_content + '<div class="col-2">' + Math.round(gender_pct[suffix].f * 1000) / 100 + '</div>'

		// masc. pct
		html_content = html_content + '<div class="col-2">' + Math.round(gender_pct[suffix].m * 1000) / 100 + '</div>'
		
		// neut. pct
		html_content = html_content + '<div class="col-2">' + Math.round(gender_pct[suffix].n * 1000) / 100 + '</div>'

		// end row
		html_content = html_content + '</div>'
	}


	$('#genderlist-list').html(html_content)
}
