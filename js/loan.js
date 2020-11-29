// color based on origin lanuguage/dialect?
// details on origin language
// or a diagram of bubbles, hover over bubbles for source word, color bubbles by language

// make interactive, put circles containing the word. Activity is to guess what the english word borrowed from the german word is. Click circle to see source word.

function createLoanwords() {
	data = _.cloneDeep(data_orig)
	let words = data.loanwords 
	// console.log(words)
	let width = 1000
	let height = 540

	

	let loan_nodes = words.nodes
	let borrowed = loan_nodes.BorrowedWord
	console.log('loanwords', nodes)
	console.log('loanwords', borrowed)

	const svg = d3.select('#loanwords').append('svg')
	.attr('width', width)
	.attr('height', height)
	
		loan_nodes.forEach(d=>{
		d.r = 40
	})

	const force = d3.forceSimulation(loan_nodes)
		.force('charge', d3.forceManyBody().strength(50))
		.force('center', d3.forceCenter(500, 280))
		.force('collide', d3.forceCollide().radius(function(d) {
			return d.r
		}))

	
	// create node as circles
	var node = svg.selectAll('g')
		.data(words.nodes).enter()
		.append('g')

	let colorScale = d3.scaleOrdinal()
    .domain(["German", "Germanic", "Middle High German", "Middle Low German", "Middle North Germanic", "Proto-Germanic", "West Germanic"])
	.range(d3.schemeTableau10)

	let circle = node.append('circle')
		.attr('class', 'node')
		.attr('r', width / 25)
		.attr('fill', d => colorScale(d.DonorLanguage))
		.attr('opacity', 0.8)
		.call(drag(force))
		.on('mouseover.tooltip', function(d) {
			tooltip.transition()
				.duration(200)
				.style('font-family', 'Nunito Sans')
				.style('padding', '20px')
				.style('opacity', 0.9)
			tooltip.html('English Word: <b>' + d.BorrowedWord + '</b><br>Origin: <b>' + d.DonorLanguage + '</b>')
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

	// circle labels
	let text = node.append('text')
		.text(function(d) {
			return d.SourceWord
		})
		.style('font-size', '18px')
		.attr('class', 'nunito')
		.attr('fill', '#4d4b47')
		.attr('x', 0)
		.attr('y', 0)
		.attr('text-anchor', 'middle')
		.call(drag(force))
		.on('mouseover.tooltip', function(d) {
			tooltip.transition()
				.duration(200)
				.style('font-family', 'Nunito Sans')
				.style('padding', '10px')
				.style('opacity', 0.9)
			tooltip.html('English Word: <b>' + d.BorrowedWord + '</b><br>Origin: <b>' + d.DonorLanguage + '</b>')
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
		

	// tooltip
	var tooltip = d3.select('body')
		.append('div')
		.attr('class', 'tooltip')
		.style('opacity', 0)

	//Legend
		var legend = svg.append("g")
		.attr("class", "legend")
		.attr("height", 100)
		.attr("width", 100)
	  .attr('transform', 'translate(-20,50)')    
		
	  legend.selectAll('rect')
		.data(["German", "Germanic", "Middle High German", "Middle Low German", "Middle North Germanic", "Proto-Germanic", "West Germanic"])
		.enter()
		.append("rect")
		.attr("x", width - 145)
		.attr("y", function(d, i){ return (i *  20) + 200;})
		.attr("width", 10)
		.attr("height", 10)
		.attr('fill', function(d){return colorScale(d);}) 
  
		legend.selectAll('text')
		.data(["German", "Germanic", "Middle High German", "Middle Low German", "Middle North Germanic", "Proto-Germanic", "West Germanic"])
		.enter()
		.append("text")
		.attr("x", width - 130)
		.attr("y", function(d, i){return (i *  20 + 9) + 200;})
		.attr("font-size", "16")
		.attr('font-family', 'Nunito Sans')
		.text(function(d) {
		  let text = d;
		  return text;
  });

	// called each time the simulation ticks
	// each tick, take new x and y values for each link and circle, x y values calculated by d3 and appended to our dataset objects
	force.on('tick', ()=>{
		circle.attr('cx', d => d.x)
		.attr('cy', d => d.y)
		text.attr('x', function(d) { return d.x; })
			.attr('y', function(d) { return d.y; })
	})
}