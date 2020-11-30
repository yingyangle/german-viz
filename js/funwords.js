// show/hide answer on click
$('.funword-part').on('click', function() {
	var parent = $(this).parent()
	if ($('.funword-answer', parent).css('visibility') == 'hidden') {
		// show answer
		$('.funword-answer', parent).css('visibility', 'visible')
	} else { 
		// hide answer
		$('.funword-answer', parent).css('visibility', 'hidden')
	}
})

// show meaning of each part on hover
d3.selectAll('.funword-part')
	.on('mouseover.tooltip', function(d) {
		tooltip.transition()
			.duration(200)
			.style('font-family', 'Nunito Sans')
			.style('padding', '10px')
			.style('opacity', .9)
		tooltip.html(d3.select(this).attr('data-funword-part'))
			.style('left', (d3.event.pageX) + 'px')
			.style('top', (d3.event.pageY + 10) + 'px')
		d3.select(this)
			.style('opacity', 0.5)
	})
	.on('mouseout.tooltip', function() {
		tooltip.transition()
			.duration(200)
			.style('opacity', 0)
		d3.select(this)
			.style('opacity', 1)
	})
	.on('mousemove', function() {
		tooltip.style('left', (d3.event.pageX) + 'px')
			.style('top', (d3.event.pageY + 10) + 'px')
	})
	

