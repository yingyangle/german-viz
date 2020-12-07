function createWordlist() {
	nouns = data.nouns
	console.log('wordlist', nouns)

	var html_content = ''

	// loop through each noun, add data to word list
	for (var i in nouns) {
		var noun = nouns[i]
		// console.log(noun)

		if (noun.definition == 0) continue

		var plural = noun.plural
		var singular = noun.singular
		if (plural == 0 & singular == 0) continue

		// singular, plural
		if (plural == 0) { // if no plural form
			plural = '(no pl.)'
			html_content = html_content + '<b>' + singular + ' (no pl.)</b>' 
		}
		else if (singular == 0) { // if no singular form
			html_content = html_content + '<b>' + plural + ' (no s.)</b>' 
		}
		else {
			html_content = html_content + '<b>' + singular + ', ' + plural + '</b>' 
		}

		// gender
		html_content = html_content + ' (' + noun.genus + '.) '
		
		// POS
		if (noun.pos.length > 0) {
			html_content = html_content + '('
			for (var j in noun.pos) {
				html_content = html_content + noun.pos[j]
				if (j < noun.pos.length - 1) html_content = html_content + ', '
			}
			html_content = html_content + ')'
		}

		// definition
		if (noun.definition != 0) {
			html_content = html_content + ' ' + noun.definition
		}

		// new line
		html_content = html_content + '<br>'
	}

	$('#wordlist').html(html_content)
}
