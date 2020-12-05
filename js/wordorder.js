// tooltip hint on how to use
d3.selectAll('.grid-square')
	.on('click.tooltip', function() {
		tooltip.transition()
			.duration(200)
			.style('opacity', .9)
		tooltip.html('Drag me!')
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


// EXAMPLE 1 (ENGLISH)
example1 = document.getElementById('example1')
new Sortable(example1, {
	animation: 350,
	swapThreshold: 1,
	ghostClass: 'gray-grid-square',
	onUpdate: function () {
		checkexample1()
	},
})

// check sentence correctness
function checkexample1() {
	var sent = ''
	$('#example1 .grid-square').each(function() {
		sent = sent + $(this).attr('data-word') + ' '
	})
	// console.log('SENT', sent)

	// correct sentence 1
	if (sent == 'the dog bit the mailman ') {
		$('#example1-output .meaning').text('"The dog bit the mailman."')
		$('#example1-output .correct').text('CORRECT')
			.css('color', 'green')
	} // correct sentence 2
	else if (sent == 'the mailman bit the dog ') {
		$('#example1-output .meaning').text('"The mailman bit the dog." (strange but okay)')
		$('#example1-output .correct').text('CORRECT')
			.css('color', 'green')
	} // bad sentences
	else {
		$('#example1-output .meaning').text('UNGRAMMATICAL SENTENCE')	
			.css('color', 'rgb(182, 45, 45)') // dark red
			.css('font-weight', 'bold')
		$('#example1-output .correct').text('INCORRENT')
			.css('color', 'rgb(182, 45, 45)') // dark red
		return
	}
	$('#example1-output .meaning').css('color', '#4d4b47')
}

// EXAMPLE 3 (ENGLISH)
example3 = document.getElementById('example3')
new Sortable(example3, {
	animation: 350,
	swapThreshold: 1,
	ghostClass: 'gray-grid-square',
	onUpdate: function () {
		checkExample3()
	},
})

// check sentence correctness
function checkExample3() {
	var sent = ''
	$('#example3 .grid-square').each(function() {
		sent = sent + $(this).attr('data-word') + ' '
	})
	// console.log('SENT', sent)

	// correct sentence
	if (sent == 'the boy gave the dog a bone ') {
		$('#example3-output .meaning').text('"The boy gave the dog a bone."')
		$('#example3-output .correct').text('CORRECT')
			.css('color', 'green')
	} // correct sentence
	else if (sent == 'the boy gave a bone the dog ') {
		$('#example3-output .meaning').text('"The boy gave the dog to a bone." (strange but okay)')
		$('#example3-output .correct').text('CORRECT')
			.css('color', 'green')
	} // correct sentence
	else if (sent == 'the dog gave the boy a bone ') {
		$('#example3-output .meaning').text('"The dog gave the boy a bone." (weird role reversal but okay)')
		$('#example3-output .correct').text('CORRECT')
			.css('color', 'green')
	} // correct sentence
	else if (sent == 'the dog gave a bone the boy ') {
		$('#example3-output .meaning').text('"The dog gave the boy to a bone." (strange but okay)')
		$('#example3-output .correct').text('CORRECT')
			.css('color', 'green')
	} // correct sentence
	else if (sent == 'a bone gave the dog the boy ') {
		$('#example3-output .meaning').text('"The bone gave the boy to the dog." (very strange but okay)')
		$('#example3-output .correct').text('CORRECT')
			.css('color', 'green')
	} // correct sentence
	else if (sent == 'a bone gave the boy the dog ') {
		$('#example3-output .meaning').text('"The bone gave the dog to the boy." (very strange but okay)')
		$('#example3-output .correct').text('CORRECT')
			.css('color', 'green')
	} // bad sentences
	else {
		$('#example3-output .meaning').text('UNGRAMMATICAL SENTENCE')
			.css('color', 'rgb(182, 45, 45)') // dark red
			.css('font-weight', 'bold')
		$('#example3-output .correct').text('INCORRENT')
			.css('color', 'rgb(182, 45, 45)') // dark red
		return
	}
	$('#example3-output .meaning').css('color', '#4d4b47')
}

// EXAMPLE 2 (GERMAN)
example2 = document.getElementById('example2')
new Sortable(example2, {
	animation: 350,
	swapThreshold: 1,
	ghostClass: 'gray-grid-square',
	onUpdate: function () {
		checkexample2()
	},
	
})

// check sentence correctness
function checkexample2() {
	var sent = ''
	$('#example2 .grid-square').each(function() {
		sent = sent + $(this).attr('data-word') + ' '
	})
	// console.log('SENT', sent)

	var correct_sents = [
		'the author writes stories for his friends ',
		'stories writes the author for his friends ',
		'for his friends writes the author stories ',
		'the author writes for his friends stories ',
		'stories writes for his friends the author ',
	]

	var okay_sents = [
		'for his friends writes stories the author ',
	]

	// correct sentence
	if (correct_sents.includes(sent)) {
		$('#example2-output .meaning').text('"The author writes stories for his friends."')
		$('#example2-output .correct').text('CORRECT')
			.css('color', 'green')
	} // okay sentence
	else if (okay_sents.includes(sent)) {
		$('#example2-output .meaning').text('"The author writes stories for his friends." (strong emphasis on the author)')
		$('#example2-output .correct').text('OKAY')
			.css('color', 'green')
	} // bad sentence
	else {
		$('#example2-output .meaning').text('BAD SENTENCE')
		$('#example2-output .correct').text('INCORRENT')
		.css('color', 'rgb(182, 45, 45)') // dark red
	}
}


