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
    const drag = d3.drag()
      .on("start", (event)=>{
        force.alphaTarget(0.3).restart();
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on("drag", (event)=>{
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on("end", (event)=>{
        force.alphaTarget(0.0);
        event.subject.fx = null;
        event.subject.fy = null;
      })

    //Create node as circles
    let node = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 50)
    .attr("fill", "lightblue")
   // .call(drag);
      
//Tooltip
    node.append("title")
      .text(nodes.BorrowedWord);
    
    
//Called each time the simulation ticks
//Each tick, take new x and y values for each link and circle, x y values calculated by d3 and appended to our dataset objects
    force.on("tick", ()=>{
      node.attr("cx", d => d.x)
      .attr("cy", d => d.y);
    });
  });