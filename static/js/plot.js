function initPlot() {
    const svg = d3.select("#svg_plot");

    // Get container dimensions from your CSS or define them here
    const width = 500;
    const height = 400;
    const margin = {top: 30, right: 30, bottom: 50, left: 50};

    svg.attr("width", width).attr("height", height);

    // 1. Setup Scales (Task 3: PCA result as 2D scatterplot)
    const xScale = d3.scaleLinear()
        .domain(d3.extent(pca_data, d => d.x))
        .range([margin.left, width - margin.right])
        .nice();

    const yScale = d3.scaleLinear()
        .domain(d3.extent(pca_data, d => d.y))
        .range([height - margin.bottom, margin.top])
        .nice();

    // 2. Add Axes
//    svg.append("g")
//        .attr("transform", `translate(0,${height - margin.bottom})`)
//        .call(d3.axisBottom(xScale))
//        .append("text")
//        .attr("x", width - margin.right)
//        .attr("y", -10)
//        .attr("fill", "black")
//        .text("PC1");
//
//    svg.append("g")
//        .attr("transform", `translate(${margin.left},0)`)
//        .call(d3.axisLeft(yScale))
//        .append("text")
//        .attr("transform", "rotate(-90)")
//        .attr("x", -margin.top)
//        .attr("y", 15)
//        .attr("fill", "black")
//        .text("PC2");

    // 3. Draw Dots (Task 3)
    const dots = svg.selectAll(".dot")
        .data(pca_data)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .attr("fill", "#4e79a7")
        .attr("stroke", "#fff");

    // 4. Clear Association (Task 3: Tooltips/Labels)
    // Create a simple tooltip div in your body if it doesn't exist
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("height", "200px")
        .style("padding", "5px");

    dots.on("mouseover", function(event, d) {
        tooltip.style("visibility", "visible").text(d.country);
        tooltip.html(`
            <strong><u>${d.country}</u></strong><br/>
            <strong>Access to electricity (% of population):</strong> ${d.access}<br/>
            <strong>Agricultural irrigated land (% of total agricultural land):</strong> ${d.agricultural}<br/>
            <strong>Average precipitation in depth (mm per year):</strong> ${d.precipitation}<br/>
            <strong>Employment in agricultural (% of total employment) (modeled ILO estimate):</strong> ${d.employment}<br/>
            <strong>GDP per capita (current US$):</strong> ${d.gdp}<br/>
            <strong>Land area (sq. km):</strong> ${d.area}<br/>
            <strong>Population, total:</strong> ${d.population}<br/>
        `);
        d3.select(this).attr("r", 8).attr("fill", "orange");

        // Task 5 Prep: Trigger map highlight
        if(window.highlightMapCountry) highlightMapCountry(d.country);
    })
    .on("mousemove", function(event, d) {
        tooltip.style("top", (event.pageY - 10) + "px")
               .style("left", (event.pageX + 10) + "px");

        // CALL THE HIGHLIGHT FUNCTION (The link!)
        highlightCountryOnMap(d.country);
    })
    .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("r", 5).attr("fill", "#4e79a7");

        if(window.highlightMapCountry) highlightMapCountry(null);

        // CLEAR THE HIGHLIGHT
        highlightCountryOnMap(null);
    });
}