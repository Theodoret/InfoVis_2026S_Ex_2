let selectedCountryCode = null;

function updateLinePlot(){
    if (!selectedCountryCode) return;
    var indicator = d3.select("#indicator_change").property("value");

    // getting the data
    var countryData = data.filter(d=> d["Country Code"] === selectedCountryCode)
                            .sort((a,b) => +a.year - +b.year)
                            .map(d => ({ ...d, year: +d.year }));

    var container = d3.select("#svg_line_plot");
    container.selectAll("*").remove();

    var svgElement = document.getElementById("svg_line_plot");
    var totalWidth  = svgElement.clientWidth;
    var totalHeight = svgElement.clientHeight;

    var margin = {top: 20, right: 20, bottom: 40, left: 50};
    var width  = totalWidth - margin.left - margin.right;
    var height = totalHeight - margin.top  - margin.bottom;

    var svg = container.attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleLinear().domain(d3.extent(countryData, d => d.year)).range([0,width]);
    var yScale = d3.scaleLinear().domain([d3.min(countryData, d => +d[indicator]) * 0.9,
                                          d3.max(countryData, d => +d[indicator]) * 1.1]).range([height,0]);

    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

    var line= d3.line()
                    .defined(d => d[indicator] != null && d[indicator] !== "")
                    .x(d => xScale(+d.year))
                    .y(d => yScale(+d[indicator]))

    var lineData = line(countryData);
    console.log("Line path d:", lineData);

    console.log("yScale domain:", yScale.domain());
    console.log("max value:", d3.max(countryData, d => +d[indicator]));

    svg.append("path")
        .datum(countryData)
        .attr("fill", "none")
        .attr("d", line)
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)


}