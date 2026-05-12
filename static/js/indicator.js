const indicatorDropdown = d3.select("#indicator_change");
const indicators = [
        'Access to electricity (% of population)',
        'Agricultural irrigated land (% of total agricultural land)',
        'Average precipitation in depth (mm per year)',
        'Employment in agriculture (% of total employment) (modeled ILO estimate)',
        'GDP per capita (current US$)',
        'Land area (sq. km)',
        'Population, total'];

indicatorDropdown.selectAll("option")
    .data(indicators)
    .enter().append("option")
    .text(d => d)
    .attr("value", d=> d);

indicatorDropdown.on("change", function(){
    updateLinePlot();
})