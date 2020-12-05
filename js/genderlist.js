var gender_sort = '' // col to sort by

var colorScale_gender = d3.scaleThreshold()
	.domain([0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1])
	// .range(['transparent'].concat(d3.schemeYlGn[9]))
	.range(['transparent', '#f0ffe7b3', '#daf3cab3', '#c3e6acb3', '#acd98eb3', '#95cc70b3'])

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
		html_content = html_content + '<div class="col-5 gender-ending-select"><b>' + suffix + '</b></div>'
		
		// fem. pct
		var fem = gender_pct[suffix].f
		if (fem == max) {
			html_content = html_content + '<div class="col-2 gender-pct" style="background-color: ' + colorScale_gender(fem) + '"><b>' + Math.round(fem * 1000) / 10 + '%</b></div>'
		} else {
			html_content = html_content + '<div class="col-2 gender-pct" style="background-color: ' + colorScale_gender(fem) + '">' + Math.round(fem * 1000) / 10 + '%</div>'
		}

		// masc. pct
		var masc = gender_pct[suffix].m
		if (masc == max) {
			html_content = html_content + '<div class="col-2 gender-pct" style="background-color: ' + colorScale_gender(masc) + '"><b>' + Math.round(masc * 1000) / 10 + '%</b></div>'
		} else {
			html_content = html_content + '<div class="col-2 gender-pct" style="background-color: ' + colorScale_gender(masc) + '">' + Math.round(masc * 1000) / 10 + '%</div>'
		}

		// neut. pct
		var neut = gender_pct[suffix].n
		if (neut == max) {
			html_content = html_content + '<div class="col-2 gender-pct" style="background-color: ' + colorScale_gender(neut) + '"><b>' + Math.round(neut * 1000) / 10 + '%</b></div>'
		} else {
			html_content = html_content + '<div class="col-2 gender-pct" style="background-color: ' + colorScale_gender(neut) + '">' + Math.round(neut * 1000) / 10 + '%</div>'
		}

		// end row
		html_content = html_content + '</div>'
	}

	$('#genderlist-list').html(html_content)
	// highlight selected ending if any
	$('.gender-ending-select').each((i,d) => {
		if ($(d).text() == selected_ending_gender) {
			$(d).css('background-color', '#4d4b47')
				.css('color', '#fef9ee')
		}
	})

}

// show tooltip on genderlist header
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
