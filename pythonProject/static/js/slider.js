const slider = d3.select("#yearSlider");
const label = d3.select("#yearLabel");

slider.on("input", function() {
    currentYear = +this.value;
    label.text(`Year: ${currentYear}`);
    updateMap();
})