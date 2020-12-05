function createPie() {
	var width = 500
	var height = 300
	var radius = Math.min(width, height) / 2 - 80

	var total = 0

	// set the color scale
	var colorScale = d3.scaleOrdinal()
		.domain(data.nouns)
		.range(['rgb(171, 198, 155)', 'rgb(247, 200, 200)', 'rgb(186, 211, 205)'])
		// green, pink, blue

	// compute position of each group on pie chart
	var pie = d3.pie()
		.value(d => d.value)
		
	// shape helper to build arcs
	var arcGenerator = d3.arc()
		.innerRadius(0)
		.outerRadius(radius)
	
	nouns = get_data()
	var data_ready = pie(d3.entries(nouns))
	console.log('pie', nouns)

	// create svg
	var svg = d3.select('#pie')
		.append('svg')
		.attr('viewBox',  [-width / 2, -height / 2, width, height])
		.append('g')
		// .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

	// build pie chart
	svg.selectAll('g')
		.data(data_ready)
		.enter()
		.append('path')
		.attr('d', arcGenerator)
		.transition()
		.duration(300)
		// .attr('stroke', 'black') // outline
		// .style('stroke-width', '1px')
		.attr('fill', d => colorScale(d.data.key))
		// .attr('fill-opacity', 1)
		.each(function(d) { this._current = d })
	
	// tooltip on hover
	svg.selectAll('path')
		.on('mouseover.tooltip', function(d) {
			var pct = Math.round(1000 * d.data.value / total) / 10
			tooltip.transition()
				.duration(200)
				.style('opacity', 0.9)
			tooltip.html('Gender: <b>' + gender_names[d.data.key] + '</b><br>Percentage: <b>' + pct + '%</b>')
				.style('left', (d3.event.pageX) + 'px')
				.style('top', (d3.event.pageY + 10) + 'px')
		})
		.on('mouseout.tooltip', function() {
			tooltip.transition()
				.duration(200)
				.style('opacity', 0)
		})
		.on('mousemove', function() {
			tooltip.style('left', (d3.event.pageX) + 'px')
				.style('top', (d3.event.pageY + 10) + 'px')
		})

	// legend boxes
	svg.append('g')
		.selectAll('rect')
		.data(data_ready)
		.enter()
		.append('rect')
		.attr('class', 'box')
		.attr('height', 16) 
		.attr('width', 16) 
		.attr('x', (d,i) => i * 100 - radius - 52)
		.attr('y', height - 200)
		.attr('fill', d => colorScale(d.data.key))

	// legend labels
	svg.append('g')
		.selectAll('text')
		.data(data_ready)
		.enter()
		.append('text')
		.text(d => gender_names_short[d.data.key])
		.attr('x', (d,i) => i * 100 - radius - 52 + 24)
		.attr('y', height - 200 + 13)
		.attr('font-size', '14px')
		.attr('font-family', 'Nunito Sans')
		.attr('text-anchor', 'beginning')

	// filter and format data
	function get_data() {
		nouns = data_orig.nouns

		// filter data to only included selected ending
		if (selected_type == 'singular' & selected_ending != '') {
			nouns = nouns.filter(word => {
				return word.suffix == selected_ending
			})
		} else if (selected_type == 'plural' & selected_ending != '') {
			nouns = nouns.filter(word => {
				return word.plural_type == selected_ending 
			})
		}
		// console.log('pie', nouns)

		// count nouns for each gender
		total = 0
		var gender_count = {
			'f': 0,
			'm': 0,
			'n': 0
		}
		for (var i in nouns) {
			if (nouns[i].genus == 0) continue
			gender_count[nouns[i].genus] += 1
			total += 1
		}
		nouns = gender_count

		// console.log('pie ', nouns)
		return nouns
	}

	// update pie chart
	function update() {
		nouns = get_data()
		data_ready = pie(d3.entries(nouns))
		console.log('pie', data_ready)

		// join new data
		var path = svg.selectAll('path')
			.data(data_ready)
		
		// update existing arcs
		path.transition()
			.duration(800)
			.attrTween('d', arcTween)

		// enter new arcs
		path.enter().append('path')
			.attr('fill', d => colorScale(d.data.key))
			.attr('d', arcGenerator)
			.attr('stroke', 'white')
			.attr('stroke-width', '6px')
			.each(function(d) { this._current = d })

		// remove old title
		svg.selectAll('.pie-title').remove()

		// title
		svg.append('text')
			.attr('class', 'pie-title')
			.attr('x', -10)
			.attr('y', -120)
			.attr('text-anchor', 'middle')
			.style('font-size', '30px')
			.style('fill', '#4d4b47')
			.text(() => {
				if (selected_ending == '') return 'Gender Distribution For All Nouns'
				return 'Gender Distribution For Nouns'
			})
		svg.append('text')
			.attr('class', 'pie-title')
			.attr('x', -10)
			.attr('y', -120 + 30)
			.attr('text-anchor', 'middle')
			.style('font-size', '30px')
			.style('fill', '#4d4b47')
			.text(() => {
				console.log(selected_ending)
				if (selected_ending == '') return ''
				if (selected_type == 'plural') {
					return 'with Plurals Ending in "' + selected_ending + '"'
				} else {
					return 'with Singulars Ending in "' + selected_ending + '"'
				}
			})
		
		// console.log('UPDATED PIE !')
	}

	function arcTween(a) {
		const i = d3.interpolate(this._current, a)
		this._current = i(1)
		return (t) => arcGenerator(i(t))
	}

	update()

	// event listeners
	$('#sankey-range').on('change', () => {
		$('.sankey-node').on('click', () => {
			update()
		})
	})

	$('.sankey-node').on('click', () => {
		update()
	})

	$('#show-all-singulars').on('click', () => {
		update()
	})

	$('#show-all-plurals').on('click', () => {
		update()
	})
}