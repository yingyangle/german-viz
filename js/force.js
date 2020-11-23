const sizeScale = d3.scaleLinear().range([6,42])
var colors = d3.scaleOrdinal(d3.schemeCategory10)

var dataset;
var visType = "Force";

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
// /drag = f(simulation);


// creat svg
	let svg = d3.select('#force')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
        .attr("viewBox", [0, 0, width, height]);


        Promise.all([
            d3.json('data/genders.json')
            // d3.json('data/genders_more.json')
        ])
    .then(data=>{
        let dataset = data[0];
        console.log('test',dataset.nodes);
        sizeScale.domain([0,d3.max(dataset.nodes, d=>(d.freq))])

        const simulation = d3.forceSimulation(dataset.nodes)
            .force("link", d3.forceLink(dataset.links).id(d => d.i).distance(300))
            .force("charge", d3.forceManyBody().strength(-5))
            .force('center', d3.forceCenter(width/5, height /5))
            .force('collide', d3.forceCollide().radius(d =>
                sizeScale(d.freq) + 20));


        let lines = svg.append("g")
            .style("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(dataset.links)
            .join("line");
        console.log(dataset.nodes)

        let nodes = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(dataset.nodes)
            .join("circle")
            .attr("r", d => sizeScale(d.freq))
            .style("fill", 'orange')
            .call(drag(simulation));

        nodes.append("text")
        .text(function(d) {
            console.log('label',d.name);
            return d.name;
          })
          .style('fill', 'black')
          .style('font-size', '12px')
          .attr('x', 6)
          .attr('y', 3);




        simulation.on("tick", function() {
            nodes.attr("cx", function(d){d.x = Math.max(10, Math.min(width - 10, d.x)); return d.x;})
                .attr("cy", function(d) {d.y = Math.max(10, Math.min(height - 10, d.y)); return d.y});
            lines.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
            });
        });
