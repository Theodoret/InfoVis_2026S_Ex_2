let mapWidth = 800;
let mapHeight = 500;
let map = null;
let mapData = null;
let selectedCountryNames = new Set();
let hoveredCountryName = null;


const COUNTRIES = ['Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria',
             'Azerbaijan', 'Brazil', 'Bulgaria', 'Cameroon', 'Chile', 'China', 'Colombia', 'Croatia', 'Cuba',
             'Cyprus', 'Czech Republic', 'Ecuador', 'Egypt, Arab Rep.', 'Eritrea', 'Ethiopia', 'France', 'Germany',
             'Ghana', 'Greece', 'India', 'Indonesia', 'Iran, Islamic Rep.', 'Iraq', 'Ireland', 'Italy', 'Japan',
             'Jordan', 'Kazakhstan', 'Kenya', 'Lebanon', 'Malta', 'Mexico', 'Morocco', 'Pakistan', 'Peru',
             'Philippines', 'Russian Federation', 'Syrian Arab Republic', 'Tunisia', 'Turkey', 'Ukraine'];

function initMap() {

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
            .attr('fill', function(d) {
                if (COUNTRIES.includes(d.properties.admin)) {
                    return "grey";
                } else {
                    return "white";
                }
            });

        renderMapSelection();
    });


}

function getMapCountryName(feature) {
    return feature?.properties?.admin || feature?.properties?.name || feature?.properties?.id;
}

function getCurrentIndicator() {
    const indicatorNode = d3.select("#indicator_change");
    return indicatorNode.empty() ? null : indicatorNode.property("value");
}

function getCountryRecordForYear(countryName) {
    const year = Number(currentYear);
    const byName = data.find(d => d["Country Name"] === countryName && +d.year === year);
    if (byName) {
        return byName;
    }

    return data.find(d => d["Country Code"] === countryName && +d.year === year);
}

function getChoroplethColorScale() {
    const indicator = getCurrentIndicator();
    if (!indicator) {
        return null;
    }

    const values = data
        .filter(d => +d.year === Number(currentYear))
        .map(d => +d[indicator])
        .filter(value => Number.isFinite(value));

    if (values.length === 0) {
        return null;
    }

    return d3.scaleSequential(d3.interpolateYlGnBu)
        .domain(d3.extent(values));
}

function renderMapSelection() {
    const colorScale = getChoroplethColorScale();

    d3.select("#svg_map").selectAll("path")
        .attr("fill", function(d) {
            const countryName = getMapCountryName(d);
            const record = getCountryRecordForYear(countryName);
            const indicator = getCurrentIndicator();

            if (selectedCountryNames.size > 0) {
                return selectedCountryNames.has(countryName)
                    ? "#f28e2b"
                    : (record && colorScale && indicator ? colorScale(+record[indicator]) : (COUNTRIES.includes(countryName) ? "#d9d9d9" : "white"));
            }

            if (hoveredCountryName && hoveredCountryName === countryName) {
                return "#f28e2b";
            }

            if (record && colorScale && indicator) {
                const value = +record[indicator];
                return Number.isFinite(value) ? colorScale(value) : (COUNTRIES.includes(countryName) ? "grey" : "white");
            }

            return COUNTRIES.includes(countryName) ? "grey" : "white";
        })
        .attr("opacity", function(d) {
            const countryName = getMapCountryName(d);

            if (selectedCountryNames.size > 0) {
                return selectedCountryNames.has(countryName) ? 1 : 0.45;
            }

            return hoveredCountryName && hoveredCountryName === countryName ? 1 : 1;
        })
        .attr("stroke-width", function(d) {
            const countryName = getMapCountryName(d);
            return (selectedCountryNames.has(countryName) || hoveredCountryName === countryName) ? 1.5 : 0.5;
        })
        .classed("highlighted", function(d) {
            const countryName = getMapCountryName(d);
            return selectedCountryNames.has(countryName) || hoveredCountryName === countryName;
        });
}

function updateMapSelection(countryNames) {
    selectedCountryNames = new Set((countryNames || []).filter(Boolean));
    renderMapSelection();
}

function updateMap() {
    renderMapSelection();
}

function highlightCountryOnMap(countryName) {
    hoveredCountryName = countryName;
    renderMapSelection();
}

function clearCountryHighlightOnMap() {
    hoveredCountryName = null;
    renderMapSelection();
}

window.updateMapSelection = updateMapSelection;
window.updateMap = updateMap;
window.highlightCountryOnMap = highlightCountryOnMap;
window.clearCountryHighlightOnMap = clearCountryHighlightOnMap;
