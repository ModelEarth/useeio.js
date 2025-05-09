// Define dimensions and margins
var screenWidth = window.innerWidth,
    mobileScreen = screenWidth <= 500,
    margin = { left: 50, top: 10, right: 50, bottom: 10 },
    width = Math.min(screenWidth, 800) - margin.left - margin.right,
    height = (mobileScreen ? 300 : Math.min(screenWidth, 800) * 5 / 6) - margin.top - margin.bottom;

// Create SVG container
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var wrapper = svg.append("g")
    .attr("class", "chordWrapper")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

// Define radii
var outerRadius = Math.min(width, height) / 2 - (mobileScreen ? 80 : 100),
    innerRadius = outerRadius * 0.95;

// Define opacity
var opacityDefault = 0.7,
    opacityLow = 0.02;

// Define pull out size
var pullOutSize = mobileScreen ? 20 : 50;

// Calculate offset
var respondents = 4443,
    emptyPerc = 0.5,
    emptyStroke = Math.round(respondents * emptyPerc),
    offset = (2 * Math.PI) * (emptyStroke / (respondents + emptyStroke)) / 4;

// TO DO - Change to impact data json in page
var Names = ["Domein HR","Logistiek en Financien","Domein ICTS","Servicepunt","Domein Onderzoek","Fac. Inter/intranet","Ondersteuning Lokale Infrastructuur","Other", "",
    "Other.in","Domein Onderwijs.in","Domein Onderzoek.in","Servicepunt.in","Domein ICTS.in","Logistiek en Financien.in","Domein HR.in",""];
var matrix = [
[0, 0,0,0,0,0,0,0,  0,  7,  3,  9,  0,  274,    3,  1478,   0], //  Domein HR
[0, 0,0,0,0,0,0,0,  0,  17, 2,  17, 0,  804,    1211,   14, 0], //  Logistiek en Financien
[0, 0,0,0,0,0,0,0,  0,  31, 0,  0,  90, 334,    13, 7,  0], //  Domein ICTS
[0, 0,0,0,0,0,0,0,  0,  0,  0,  0,  0,  2,  0,  45, 0], //  Servicepunt
[0, 0,0,0,0,0,0,0,  0,  0,  0,  0,  0,  1,  27, 3,  0], //  Domein Onderzoek
[0, 0,0,0,0,0,0,0,  0,  0,  0,  0,  0,  0,  0,  11, 0], //  Fac. Inter/intranet
[0, 0,0,0,0,0,0,0,  0,  0,  0,  0,  0,  0,  7,  2,  0], //  Ondersteuning Lokale Infrastructuur
[0, 0,0,0,0,0,0,0,  0,  0,  0,  0,  0,  3,  13, 16, 0], //  Other
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke], //dummyBottom
[7, 17, 31, 0,  0,  0,  0,  0,  0,  0,0,0,0,0,0,0,                          0], //Other.in
[3, 2,  0,  0,  0,  0,  0,  0,  0,  0,0,0,0,0,0,0,                          0], //Domein Onderwijs.in
[9, 17, 0,  0,  0,  0,  0,  0,  0,  0,0,0,0,0,0,0,                          0], //Domein Onderzoek.in
[0, 0,  90, 0,  0,  0,  0,  0,  0,  0,0,0,0,0,0,0,                          0], //Servicepunt.in
[274,   804,    334,    2,  1,  0,  0,  3,  0,  0,0,0,0,0,0,0,                          0], //Domein ICTS.in
[3, 1211,   13, 0,  27, 0,  7,  13, 0,  0,0,0,0,0,0,0,                          0], //Logistiek en Financien.in
[1478,  14, 7,  45, 3,  11, 2,  16, 0,  0,0,0,0,0,0,0,                          0], //Domein HR.in
  [0,0,0,0,0,0,0,0,emptyStroke,0,0,0,0,0,0,0,0] //dummyTop
];
//Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
//invisible chord center vertically

// Custom chord layout function
function customChordLayout() {
    var chord = d3.chord()
        .padAngle(0.02)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending);
    return chord;
}

// Define chord layout
var chord = customChordLayout()(matrix);

// Define arc generator
var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(function(d) { return d.startAngle + offset; })
    .endAngle(function(d) { return d.endAngle + offset; });

// Define ribbon generator
var ribbon = d3.ribbon()
    .radius(innerRadius)
    .startAngle(function(d) { return d.startAngle + offset; })
    .endAngle(function(d) { return d.endAngle + offset; });

// Draw outer arcs
var g = wrapper.selectAll("g.group")
    .data(chord.groups)
    .enter().append("g")
    .attr("class", "group")
    .on("mouseover", fade(opacityLow))
    .on("mouseout", fade(opacityDefault));

g.append("path")
    .style("stroke", function(d, i) { return (Names[i] === "" ? "none" : "#00A1DE"); })
    .style("fill", function(d, i) { return (Names[i] === "" ? "none" : "#00A1DE"); })
    .style("pointer-events", function(d, i) { return (Names[i] === "" ? "none" : "auto"); })
    .attr("d", arc)
    .attr("transform", function(d, i) {
        d.pullOutSize = pullOutSize * (d.startAngle + 0.001 > Math.PI ? -1 : 1);
        return "translate(" + d.pullOutSize + ",0)";
    });

// Append names
g.append("text")
    .each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset; })
    .attr("dy", ".35em")
    .attr("class", "titles")
    .style("font-size", mobileScreen ? "8px" : "10px")
    .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .attr("transform", function(d, i) {
        var c = arc.centroid(d);
        return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
            + "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(20,0)"
            + (d.angle > Math.PI ? "rotate(180)" : "");
    })
    .text(function(d, i) { return Names[i]; })
    .call(wrapChord, 100);

// Draw inner chords
wrapper.selectAll("path.chord")
    .data(chord)
    .enter().append("path")
    .attr("class", "chord")
    .style("stroke", "none")
    .style("fill", "url(#gradientLinearPerLine)")
    .style("opacity", function(d) { return (Names[d.source.index] === "" ? 0 : opacityDefault); })
    .style("pointer-events", function(d, i) { return (Names[d.source.index] === "" ? "none" : "auto"); })
    .attr("d", ribbon)
    .on("mouseover", fadeOnChord)
    .on("mouseout", fade(opacityDefault));

// Fade functions
function fade(opacity) {
    return function(d, i) {
        wrapper.selectAll("path.chord")
            .filter(function(d) {
                return d.source.index !== i && d.target.index !== i && Names[d.source.index] !== "";
            })
            .transition()
            .style("opacity", opacity);
    };
}

function fadeOnChord(d) {
    var chosen = d;
    wrapper.selectAll("path.chord")
        .transition()
        .style("opacity", function(d) {
            if (d.source.index === chosen.source.index && d.target.index === chosen.target.index) {
                return opacityDefault;
            } else {
                return opacityLow;
            }
        });
}

// Wrap text function
function wrapChord(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1,
            y = 0,
            x = 0,
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}
