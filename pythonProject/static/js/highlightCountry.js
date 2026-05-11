function highlightCountry(code){
    d3.select("#svg_pca").selectAll("circle")
        .filter(d => d.code == code)
        .attr("fill", "orange")
        .attr("opacity", 1)
        .attr("r", 7);

    d3.select("#svg_map").selectAll("path")
        .filter(d => d?.properties?.id === code)
        .attr("fill", "orange")
        .attr("opacity", 1);
}

function unhighlightCountry(code){
    d3.select("#svg_pca").selectAll("circle")
        .filter(d => d.code == code)
        .attr("fill", "blue")
        .attr("opacity", 0.7)
        .attr("r", 5);

    d3.select("#svg_map").selectAll("path")
        .filter(d => d?.properties?.id === code)
        .attr("fill", dataCountries.has(code) ? "blue" : "white")
        .attr("opacity", 1);
}