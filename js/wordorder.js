// EXAMPLE 1 (ENGLISH)
example1 = document.getElementById('example1')
new Sortable(example1, {
	animation: 150,
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
	console.log('SENT', sent)

	// correct sentence 1
	if (sent == 'the dog bit the mailman ') {
		console.log('111')
		$('#example1-output .translation').text('"The dog bit the mailman."')
		$('#example1-output .correct').text('CORRECT')
			.css('color', 'green')
	} // correct sentence 2
	else if (sent == 'the mailman bit the dog ') {
		console.log('222')
		$('#example1-output .translation').text('"The mailman bit the dog." (strange but okay)')
		$('#example1-output .correct').text('CORRECT')
			.css('color', 'green')
	} // bad sentences
	else {
		console.log('333')
		$('#example1-output .translation').text('BAD SENTENCE')
		$('#example1-output .correct').text('INCORRENT')
		.css('color', 'rgb(182, 45, 45)') // dark red
	}
}



// EXAMPLE 2 (GERMAN)
example2 = document.getElementById('example2')
new Sortable(example2, {
	animation: 150,
	ghostClass: 'gray-grid-square',
	onUpdate: function () {
		console.log('UPDATEEEE')
		checkexample2()
	},
	
})

// check sentence correctness
function checkexample2() {
	var sent = ''
	$('#example2 .grid-square').each(function() {
		sent = sent + $(this).attr('data-word') + ' '
	})
	console.log('SENT', sent)

	var correct_sents = [
		'I write stories for my friends ',
		'stories write I for my friends ',
		'for my friends write I stories ',
		'I write for my friends stories ',
	]

	var okay_sents = [
		'stories write for my friends I ',
		'for my friends write stories I ',
	]

	// correct sentence
	if (correct_sents.includes(sent)) {
		$('#example2-output .translation').text('"I write stories for my friends."')
		$('#example2-output .correct').text('CORRECT')
			.css('color', 'green')
	} // okay sentence
	else if (okay_sents.includes(sent)) {
		$('#example2-output .translation').text('"I write stories for my friends." (slightly unnatural)')
		$('#example2-output .correct').text('OKAY')
			.css('color', 'green')
	} // bad sentence
	else {
		$('#example2-output .translation').text('BAD SENTENCE')
		$('#example2-output .correct').text('INCORRENT')
		.css('color', 'rgb(182, 45, 45)') // dark red
	}
}


