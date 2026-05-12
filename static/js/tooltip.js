const tooltip = d3.select("#tooltip");
let currentYear = 2020;

function getRow(code) {
    return data.find(d => d["Country Code"] === code && d.year == currentYear);
}
function showTooltip(event, code) {
    const record = getRow(code);

    if (!record) {
    tooltip.style("opacity", 1)
            .html(`<strong>${code}</strong><br/>
            No data available for ${currentYear}`);
    }
    else {
        tooltip.style("opacity", 1)
                .html(`<strong>${record["Country Name"]}</strong><br/>
                    Year: ${currentYear}<br/>
                    Code: ${record["Country Code"]}<br/>
                    Land area (sq. km): ${record["Land area (sq. km)"]} <br/>
                    Agricultural irrigated land (% of total agricultural land): ${record["Agricultural irrigated land (% of total agricultural land)"]} <br/>
                    Access to electricity (% of population): ${record["Access to electricity (% of population)"]} <br/>
                    Employment in agricultural (% of total employment) (modeled ILO estimate): ${record["Employment in agriculture (% of total employment) (modeled ILO estimate)"]} <br/>
                    GDP per capita (current US$): ${record["GDP per capita (current US$)"]} <br/>
                    Population, total: ${record["Population, total"]} <br/>
                    Average precipitation in depth (mm per year): ${record["Average precipitation in depth (mm per year)"]}
                `);
    }

    moveTooltip(event);
}

function moveTooltip(event){
    tooltip.style("left", (event.pageX + 20) + "px")
            .style ("top", (event.pageY - 20) + "px");
}

function hideTooltip(){
    tooltip.style("opacity", 0);
}