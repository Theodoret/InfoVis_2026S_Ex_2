let mapWidth = 800;
let mapHeight = 500;
let map = null;
let mapData = null;
let dataCountries = new Set();


function initMap() {

    dataCountries = new Set(data.map(d => d["Country Code"]));

    // loads the world map as topojson
    d3.json("../static/data/world-topo.json").then(function (countries) {

        // defines the map projection method and scales the map within the SVG
        let projection = d3.geoEqualEarth()
            .scale(180)
            .translate([mapWidth / 2, mapHeight / 2]);

        // generates the path coordinates from topojson
        let path = d3.geoPath()
            .projection(projection);

        // configures the SVG element
        let svg = d3.select("#svg_map")
            .attr("width", mapWidth)
            .attr("height", mapHeight);

        // map geometry
        mapData = topojson.feature(countries, countries.objects.countries).features;

        // generates and styles the SVG path
        map = svg.append("g")
            .selectAll('path')
            .data(mapData)
            .enter().append('path')
            .attr('d', path)
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5)
            .attr('fill', d => dataCountries.has(d.properties.id) ? 'blue' : 'white')
            .attr('cursor', d => dataCountries.has(d.properties.id) ? 'pointer' : 'default')
            .attr('stroke-width', d => dataCountries.has(d.properties.id) ? 0.5 : 0.3)
            .on("mouseover", function(event, d) {
                if (!dataCountries.has(d.properties.id)) return;
                highlightCountry(d.properties.id);
                showTooltip(event, d.properties.id);

            })
            .on("mousemove", moveTooltip)
            .on("mouseout", function(event, d) {
                unhighlightCountry(d.properties.id);
                hideTooltip();
            })
        // line plot below
        map.on("click", function(event, d){
            if (!dataCountries.has(d.properties.id)) return;
            selectedCountryCode = d.properties.id;
            updateLinePlot();
        })
    });


}

// I know that no countries are entering or leaving the mix over the years, I still wanted to play with it a little bit
function updateMap(){
    const newYearCountries = new Set(
        data.filter(d => d.year == currentYear).map(d => d["Country Code"])
    );
    d3.select("#svg_map").selectAll("path")
        .transition().duration(20)
        .attr("fill", d => newYearCountries.has(d.properties.id) ? "blue": "white")
        .attr("cursor", d => newYearCountries.has(d.properties.id) ? "pointer": "default")
}