// show/hide answer on click
$('.funword-part').on('click', function() {
	var parent = $(this).parent()
	if ($('.funword-answer', parent).css('visibility') == 'hidden') {
		// show answer
		$('.funword-answer', parent)
			.css('visibility', 'visible')
			.css('opacity', 1)
		// play word pronunciation
		myAudioFunction(parent)
	} else {
		// hide answer
		$('.funword-answer', parent)
			.css('visibility', 'hidden')
			.css('opacity', 0)
	}
})

// play word pronunciation
function myAudioFunction(parent) {
	word = ''
	$('.funword-part', parent).each(function() {
		word = word + $(this).text()
	})
	var audiofile = new Audio('audio/' + word.toLowerCase() + '.mp3')
	audiofile.play()
}

// show meaning of each part on hover
d3.selectAll('.funword-part')
	.on('mouseover.tooltip', function(d) {
		tooltip.transition()
			.duration(200)
			.style('font-family', 'Nunito Sans')
			.style('padding', '10px')
			.style('opacity', .9)
		tooltip.html(d3.select(this).attr('data-funword-part'))
			.style('left', (d3.event.pageX - 30) + 'px')
			.style('top', (d3.event.pageY - 70) + 'px')
		d3.select(this)
			.style('text-decoration', 'underline')
			.style('text-decoration-thickness', '1px')
		d3.select(this.parentNode)
			.selectAll('.funword-part')
			.style('opacity', 0.7)
	})
	.on('mouseout.tooltip', function() {
		tooltip.transition()
			.duration(200)
			.style('opacity', 0)
		d3.select(this)
			.style('text-decoration', 'none')
		d3.select(this.parentNode)
			.selectAll('.funword-part')
			.style('opacity', 1)
	})
	.on('mousemove', function() {
		tooltip.style('left', (d3.event.pageX - 30) + 'px')
			.style('top', (d3.event.pageY - 70) + 'px')
	})
