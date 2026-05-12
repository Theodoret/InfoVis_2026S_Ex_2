function pca_plot(pca_data) {
    console.log("pca_plot called", pca_data);
    var svgElement = document.getElementById("svg_pca");
    var totalWidth  = svgElement.clientWidth;
    var totalHeight = svgElement.clientHeight;

    var margin = {top: 20, right: 20, bottom: 40, left: 50};
    var width  = totalWidth - margin.left - margin.right;
    var height = totalHeight - margin.top  - margin.bottom;

    var svg = d3.select("#svg_pca")
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var xScale = d3.scaleLinear().domain(d3.extent(pca_data, d => d.x)).range([0,width]);
    var yScale = d3.scaleLinear().domain(d3.extent(pca_data, d => d.y)).range([0,height]);

    var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background", "#d3d3d3")
            .style("opacity", 0)
            .style("padding", "5px 3px");

    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

    //draw circles
    svg.selectAll("circle")
        .data(pca_data)
        .enter()
        .append("circle")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", 5)
            .attr("fill", "blue")
            .attr("opacity", 0.7);

    // hover mechanic
    svg.selectAll("circle")
        .on("mouseover", function(event, d) {
            highlightCountry(d.code);
            showTooltip(event, d.code);
        })
        .on("mousemove", moveTooltip)
        .on("mouseout", function(event, d) {
            unhighlightCountry(d.code);
            hideTooltip();
        })


}
