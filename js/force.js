var width = 600
var height = 400 
var size = d3.scaleLinear().range([0,10])
var colors = d3.scaleOrdinal(d3.schemeCategory10)
var dataset;
var visType = "Force";
var drag = force =>{
  
function dragstart(event) {
    if (!event.active) force.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
}
    
function drag(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}
    
function dragend(event) {
    if (!event.active) force.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
}
    
return d3.drag()
    .filter(event => visType === "Force")
    .on("start", dragstart)
    .on("drag", drag)
    .on("end", dragend);
}


    
// creat svg
	let svg = d3.select('#force')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
        .attr("viewBox", [0,0,width,height])


Promise.all(d3.json('genders.json'))
    .then(data=>{
        let dataset = data;
        size.domain([0,d3.max(dataset.nodes, d=>(d.passengers))])
        const force = d3.forceSimulation(dataset.nodes)
            .force("charge", d3.forceManyBody().strength(-5))
            .force("link", d3.forceLink(dataset.links).distance(40))
            .force("center", d3.forceCenter().x(width/2).y(height/2).strength(1.5));
    
        var edges = svg.selectAll("line")
            .data(dataset.links)
            .enter()
            .append("line")
            .style("stroke", "#ccc")
            .style("stroke-width", 1);
            
        var nodes = svg.selectAll("circle")
            .data(dataset.nodes)
            .enter()
            .append("circle")
            .attr("r", d=>size(d.passengers))
            .style("fill", 'orange')
            .call(drag(force));

        nodes.append("title")
            .text(function(d) {
                return d.name;
            });
            
        force.on("tick", function() {
            nodes.attr("cx", function(d){d.x = Math.max(10, Math.min(width - 10, d.x)); return d.x;})
                .attr("cy", function(d) {d.y = Math.max(10, Math.min(height - 10, d.y)); return d.y});
            edges.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
            });