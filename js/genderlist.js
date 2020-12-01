var gender_sort = ''

function createGenderlist(gender_pct) {
	// console.log('genderlist', gender_pct)

	var html_content = ''

	// sort endings if gender_sort selected
	var endings_list = Object.keys(gender_pct)
	if (gender_sort != '') {
		endings_list.sort((a,b) => { 
			return gender_pct[b][gender_sort] - gender_pct[a][gender_sort]
		})
	} else { // sort alphabetically
		endings_list.sort()
	}
	
	// loop through each noun, add data to word list
	for (var i in endings_list) {
		var suffix = endings_list[i]
		// don't include if below count_cutoff_gender
		if (gender_pct[suffix].total < count_cutoff_gender) continue

		// get max pct so we know which one to bold
		var max = Math.max(gender_pct[suffix].f, gender_pct[suffix].m, gender_pct[suffix].n)

		// new row
		html_content = html_content + '<div class="row">'

		// suffix
		html_content = html_content + '<div class="col-5 gender-row"><b>' + suffix + '</b></div>'
		
		// fem. pct
		if (gender_pct[suffix].f == max) {
			html_content = html_content + '<div class="col-2"><b>' + Math.round(gender_pct[suffix].f * 1000) / 10 + '%</b></div>'
		} else {
			html_content = html_content + '<div class="col-2">' + Math.round(gender_pct[suffix].f * 1000) / 10 + '%</div>'
		}

		// masc. pct
		if (gender_pct[suffix].m == max) {
			html_content = html_content + '<div class="col-2"><b>' + Math.round(gender_pct[suffix].m * 1000) / 10 + '%</b></div>'
		} else {
			html_content = html_content + '<div class="col-2">' + Math.round(gender_pct[suffix].m * 1000) / 10 + '%</div>'
		}

		// neut. pct
		if (gender_pct[suffix].n == max) {
			html_content = html_content + '<div class="col-2"><b>' + Math.round(gender_pct[suffix].n * 1000) / 10 + '%</b></div>'
		} else {
			html_content = html_content + '<div class="col-2">' + Math.round(gender_pct[suffix].n * 1000) / 10 + '%</div>'
		}

		// end row
		html_content = html_content + '</div>'
	}

	$('#genderlist-list').html(html_content)

}

// show meaning of each part on hover
d3.selectAll('#genderlist-header div')
	.on('mouseover.tooltip', function(d) {
		tooltip.transition()
			.duration(200)
			.style('opacity', .9)
		tooltip.html('Click on a column header to sort by that column')
			.style('left', (d3.event.pageX - 100) + 'px')
			.style('top', (d3.event.pageY - 90) + 'px')
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
		tooltip.style('left', (d3.event.pageX - 100) + 'px')
			.style('top', (d3.event.pageY - 90) + 'px')
	})
