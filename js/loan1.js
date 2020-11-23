//color based on origin lanuguage/dialect?
//details on origin language
//or a diagram of bubbles, hover over bubbles for source word, color bubbles by language

//make interactive, put circles containing the word. Activity is to guess what the english word borrowed from the german word is. Click circle to see source word.

d3.csv('data/loanWordsFromGerman.csv', d3.autoType).then(data => {
    let words = data; 
    console.log(words);
      let width = 1000;
      let height = 1000;
    
        const svg = d3.select(".chart-area").append("svg")
        .attr("viewBox",  [-width / 2, -height / 2, width, height]);


        let circle = svg.selectAll('circles') 
        .data(data);
        circle.enter()
        .append('circle')
        .attr('fill', 'lightblue')
        .attr('cx', (d,i)=>(50*i))
    .attr('cy', (d,i) =>(50*i))
    .attr('r', 50)
    .attr('opacity', .6) 
          
    svg.selectAll('text.labels')
    .data(words)
    .enter()
    .append('text')
    .text(function(d){
        return d.BorrowedWord;
    })
    .attr('x', (d,i)=>(0))
    .attr('y', (d,i)=>((65*i)+70))
    .attr("text-anchor", "left")
    .attr("font-size", "12")
})