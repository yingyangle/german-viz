//color based on origin lanuguage/dialect?
//details on origin language
//or a diagram of bubbles, hover over bubbles for source word, color bubbles by language

//make interactive, put circles containing the word. Activity is to guess what the english word borrowed from the german word is. Click circle to see source word.

d3.json('data/loanWords.json', d3.autoType).then(data => {
let words = data; // data1.csv
console.log(words);
  let width = 1000;
  let height = 1000;

  let nodes = words.nodes;
  let borrowed = nodes.BorrowedWord;
  console.log(nodes);
console.log(borrowed);

    const svg = d3.select(".chart-area").append("svg")
    .attr("viewBox",  [-width / 2, -height / 2, width, height]);
    
    nodes.forEach(d=>{
        d.r = 50;
    })

    const force = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(20))
    .force('center', d3.forceCenter())
    .force('collide', d3.forceCollide().radius(function(d) {
      return d.r
    }))

      //drag
      drag = simulation => {

        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
      
        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }
      
        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
      
        return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
        }

    
    //Create node as circles

    var node = svg.selectAll("g")
    .data(words.nodes).enter()
    .append("g");


    let circle = node.append("circle")
    .attr("class", "node")
    .attr("r", 50)
    .attr("fill", "lightblue")
    .call(drag(force));
    

  

    let text = node.append("text")
    .text(function(d){
      return d.SourceWord;
    })
        .style('font-size', '14px')
        .attr("fill", "black")
        .attr('x', 0)
        .attr('y', 0)
        .attr("text-anchor", "middle")
        .on('mouseover.tooltip', function(d) {
          tooltip.transition()
            .duration(100)
            .style("opacity", .8);
          tooltip.html("English Word: " + d.BorrowedWord + "<p/>Origin Language/Dialect: " + d.DonorLanguage)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 10) + "px");
        })
      .on("mouseout.tooltip", function() {
          tooltip.transition()
            .duration(100)
            .style("opacity", 0);
        })
        .on("mousemove", function() {
          tooltip.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 10) + "px");
        });
        

 //tooltip
 var tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);
      


//Called each time the simulation ticks
//Each tick, take new x and y values for each link and circle, x y values calculated by d3 and appended to our dataset objects
    force.on("tick", ()=>{
      circle.attr("cx", d => d.x)
      .attr("cy", d => d.y);
      text.attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
    });
  });