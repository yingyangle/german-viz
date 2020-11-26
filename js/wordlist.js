function createWordlist() {
	nouns = data.nouns
	console.log('wordlist', nouns)

	var html_content = ''

	// loop through each noun, add data to word list
	for (var i in nouns) {
		var noun = nouns[i]
		// console.log(noun)
		html_content = html_content + '<b>' + noun.singular + ', ' + noun.plural + '</b> (' 
		for (var j in noun.pos) {
			html_content = html_content + noun.pos[j]
			if (j < noun.pos.length - 1) html_content = html_content + ', '
		}
		html_content = html_content + ')<br>'
	}

	$('#wordlist').html(html_content)
}
