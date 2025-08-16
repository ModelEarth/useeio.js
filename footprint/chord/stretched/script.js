// D3 v7 Separated chord chart
// Updated from D3 v3 original version

// Global configuration
const config = {
    margin: {left: 50, top: 10, right: 50, bottom: 10},
    opacity: {
        default: 0.7,
        low: 0.02
    },
    titles: {
        left: "Sectors",
        right: "Indicators"
    }
};

// Sample data for testing
const sampleData = {
    nodes: [
        // Sectors
        {id: "sector1", name: "Agriculture", type: "sector", group: 1},
        {id: "sector2", name: "Manufacturing", type: "sector", group: 1},
        // Indicators
        {id: "ind1", name: "CO2", type: "indicator", group: 2},
        {id: "ind2", name: "Water", type: "indicator", group: 2}
    ],
    links: [
        {source: "sector1", target: "ind1", value: 100},
        {source: "sector1", target: "ind2", value: 50},
        {source: "sector2", target: "ind1", value: 75},
        {source: "sector2", target: "ind2", value: 125}
    ]
};

// Global variables
let pullOutSize;

// Custom Chord Function adjusted from the original d3.svg.chord() function
// Modified for D3 v7
function stretchedChord() {
    let source = d => d.source;
    let target = d => d.target;
    let radius = d => d.radius;
    let startAngle = d => d.startAngle;
    let endAngle = d => d.endAngle;
    
    const π = Math.PI;
    const halfπ = π / 2;

    function subgroup(self, f, d, i) {
        let subgroup = f(d);
        let r = radius(subgroup);
        let a0 = startAngle(subgroup) - halfπ;
        let a1 = endAngle(subgroup) - halfπ;
        return {
            r: r,
            a0: [a0],
            a1: [a1],
            p0: [r * Math.cos(a0), r * Math.sin(a0)],
            p1: [r * Math.cos(a1), r * Math.sin(a1)]
        };
    }

    function arc(r, p, a) {
        let sign = (p[0] >= 0 ? 1 : -1);
        return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + (p[0] + sign*pullOutSize) + "," + p[1];
    }

    function curve(p1) {
        let sign = (p1[0] >= 0 ? 1 : -1);
        return "Q 0,0 " + (p1[0] + sign*pullOutSize) + "," + p1[1];
    }

    /*
    M = moveto
    M x,y
    Q = quadratic Bézier curve
    Q control-point-x,control-point-y end-point-x, end-point-y
    A = elliptical Arc
    A rx, ry x-axis-rotation large-arc-flag, sweep-flag  end-point-x, end-point-y
    Z = closepath
    */
    function chord(d) {
        let s = subgroup(this, source, d);
        let t = subgroup(this, target, d);
                
        return "M" + (s.p0[0] + pullOutSize) + "," + s.p0[1] + 
                arc(s.r, s.p1, s.a1 - s.a0) + 
                curve(t.p0) + 
                arc(t.r, t.p1, t.a1 - t.a0) + 
                curve(s.p0) + 
                "Z";
    }//chord

    chord.radius = function(v) {
        if (!arguments.length) return radius;
        radius = typeof v === "function" ? v : () => v;
        return chord;
    };
    
    chord.source = function(v) {
        if (!arguments.length) return source;
        source = typeof v === "function" ? v : () => v;
        return chord;
    };
    
    chord.target = function(v) {
        if (!arguments.length) return target;
        target = typeof v === "function" ? v : () => v;
        return chord;
    };
    
    chord.startAngle = function(v) {
        if (!arguments.length) return startAngle;
        startAngle = typeof v === "function" ? v : () => v;
        return chord;
    };
    
    chord.endAngle = function(v) {
        if (!arguments.length) return endAngle;
        endAngle = typeof v === "function" ? v : () => v;
        return chord;
    };
    
    return chord;
}

// Custom Chord Layout - updated for D3 v7
function customChordLayout() {
    const τ = 2 * Math.PI;
    let chord = {},
        chords,
        groups,
        matrix,
        n,
        padding = 0,
        sortGroups,
        sortSubgroups,
        sortChords;

    function relayout() {
        let subgroups = {};
        let groupSums = [];
        let groupIndex = d3.range(n);
        let subgroupIndex = [];
        let k;
        let x;
        let x0;
        let i;
        let j;
        
        chords = [];
        groups = [];
        
        k = 0, i = -1;
        while (++i < n) {
            x = 0, j = -1;
            while (++j < n) {
                x += matrix[i][j];
            }
            groupSums.push(x);
            subgroupIndex.push(d3.range(n).reverse());
            k += x;
        }
        
        if (sortGroups) {
            groupIndex.sort((a, b) => sortGroups(groupSums[a], groupSums[b]));
        }
        
        if (sortSubgroups) {
            subgroupIndex.forEach((d, i) => {
                d.sort((a, b) => sortSubgroups(matrix[i][a], matrix[i][b]));
            });
        }
        
        k = (τ - padding * n) / k;
        x = 0, i = -1;
        while (++i < n) {
            let di = groupIndex[i]; // Define di here
            x0 = x, j = -1;
            while (++j < n) {
                let dj = subgroupIndex[di][j];
                let v = matrix[di][dj];
                let a0 = x;
                let a1 = x += v * k;
                subgroups[di + "-" + dj] = {
                    index: di,
                    subindex: dj,
                    startAngle: a0,
                    endAngle: a1,
                    value: v
                };
            }
            groups[di] = { // Use di as the index for groups
                index: di,
                startAngle: x0,
                endAngle: x,
                value: (x - x0) / k
            };
            x += padding;
        }
        
        i = -1;
        while (++i < n) {
            j = i - 1;
            while (++j < n) {
                let source = subgroups[i + "-" + j];
                let target = subgroups[j + "-" + i];
                if (source.value || target.value) {
                    chords.push(source.value < target.value ? {
                        source: target,
                        target: source
                    } : {
                        source: source,
                        target: target
                    });
                }
            }
        }
        
        if (sortChords) resort();
    }
    
    function resort() {
        chords.sort((a, b) => sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2));
    }
    
    chord.matrix = function(x) {
        if (!arguments.length) return matrix;
        n = (matrix = x) && matrix.length;
        chords = groups = null;
        return chord;
    };
    
    chord.padding = function(x) {
        if (!arguments.length) return padding;
        padding = x;
        chords = groups = null;
        return chord;
    };
    
    chord.sortGroups = function(x) {
        if (!arguments.length) return sortGroups;
        sortGroups = x;
        chords = groups = null;
        return chord;
    };
    
    chord.sortSubgroups = function(x) {
        if (!arguments.length) return sortSubgroups;
        sortSubgroups = x;
        chords = null;
        return chord;
    };
    
    chord.sortChords = function(x) {
        if (!arguments.length) return sortChords;
        sortChords = x;
        if (chords) resort();
        return chord;
    };
    
    chord.chords = function() {
        if (!chords) relayout();
        return chords;
    };
    
    chord.groups = function() {
        if (!groups) relayout();
        return groups;
    };
    
    return chord;
}

// Screen size detection
const screenWidth = $(window).innerWidth();
const mobileScreen = (screenWidth > 500 ? false : true);

// Margins and dimensions
const margin = {left: 50, top: 10, right: 50, bottom: 10};
const width = Math.min(screenWidth, 800) - margin.left - margin.right;
const height = (mobileScreen ? 300 : Math.min(screenWidth, 800)*5/6) - margin.top - margin.bottom;

// Create SVG
const svg = d3.select("#chart1").append("svg")
    .attr("width", (width + margin.left + margin.right))
    .attr("height", (height + margin.top + margin.bottom));

// Create wrapper group
const wrapper = svg.append("g")
    .attr("class", "chordWrapper")
    .attr("transform", `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

// Define dimensions
const outerRadius = Math.min(width, height) / 2 - (mobileScreen ? 80 : 100);
const innerRadius = outerRadius * 0.95;
const opacityDefault = 0.7; // default opacity of chords
const opacityLow = 0.02; // hover opacity of those chords not hovered over

// Set pullout size based on screen
pullOutSize = (mobileScreen ? 20 : 50); // Pull distance for arcs

// Titles on top
const titleWrapper = svg.append("g").attr("class", "chordTitleWrapper");
const titleOffset = mobileScreen ? 15 : 40;
const titleSeparate = mobileScreen ? 30 : 0;

// Title top left
titleWrapper.append("text")
    .attr("class", "title left")
    .style("font-size", mobileScreen ? "12px" : "16px")
    .attr("x", (width/2 + margin.left - outerRadius - titleSeparate))
    .attr("y", titleOffset)
    .text("Left side");

titleWrapper.append("line")
    .attr("class", "titleLine left")
    .attr("x1", (width/2 + margin.left - outerRadius - titleSeparate)*0.6)
    .attr("x2", (width/2 + margin.left - outerRadius - titleSeparate)*1.4)
    .attr("y1", titleOffset+8)
    .attr("y2", titleOffset+8);

// Title top right
titleWrapper.append("text")
    .attr("class", "title right")
    .style("font-size", mobileScreen ? "12px" : "16px")
    .attr("x", (width/2 + margin.left + outerRadius + titleSeparate))
    .attr("y", titleOffset)
    .text("Right side");

titleWrapper.append("line")
    .attr("class", "titleLine right")
    .attr("x1", (width/2 + margin.left - outerRadius - titleSeparate)*0.6 + 2*(outerRadius + titleSeparate))
    .attr("x2", (width/2 + margin.left - outerRadius - titleSeparate)*1.4 + 2*(outerRadius + titleSeparate))
    .attr("y1", titleOffset+8)
    .attr("y2", titleOffset+8);

// Data definition
const Names = ["Domein HR","Logistiek en Financien","Domein ICTS","Servicepunt","Domein Onderzoek","Fac. Inter/intranet","Ondersteuning Lokale Infrastructuur","Other", "",
    "Other.in","Domein Onderwijs.in","Domein Onderzoek.in","Servicepunt.in","Domein ICTS.in","Logistiek en Financien.in","Domein HR.in",""];

const respondents = 4443; // Total number of respondents
const emptyPerc = 0.5; // What % of the circle should become empty
const emptyStroke = Math.round(respondents * emptyPerc);

// Matrix data
const matrix = [
[0, 0,0,0,0,0,0,0, 0, 7,  3,  9,  0,  274,    3,  1478,   0], //  Domein HR
[0, 0,0,0,0,0,0,0, 0, 17, 2,  17, 0,  804,    1211,   14, 0], //  Logistiek en Financien
[0, 0,0,0,0,0,0,0, 0, 31, 0,  0,  90, 334,    13, 7,  0], //  Domein ICTS
[0, 0,0,0,0,0,0,0, 0, 0,  0,  0,  0,  2,  0,  45, 0], //  Servicepunt
[0, 0,0,0,0,0,0,0, 0, 0,  0,  0,  0,  1,  27, 3,  0], //  Domein Onderzoek
[0, 0,0,0,0,0,0,0, 0, 0,  0,  0,  0,  0,  0,  11, 0], //  Fac. Inter/intranet
[0, 0,0,0,0,0,0,0, 0, 0,  0,  0,  0,  0,  7,  2,  0], //  Ondersteuning Lokale Infrastructuur
[0, 0,0,0,0,0,0,0, 0, 0,  0,  0,  0,  3,  13, 16, 0], //  Other
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke], // dummyBottom
[7, 17, 31, 0,  0,  0,  0,  0,  0,  0,0,0,0,0,0,0, 0], // Other.in
[3, 2,  0,  0,  0,  0,  0,  0,  0,  0,0,0,0,0,0,0, 0], // Domein Onderwijs.in
[9, 17, 0,  0,  0,  0,  0,  0,  0,  0,0,0,0,0,0,0, 0], // Domein Onderzoek.in
[0, 0,  90, 0,  0,  0,  0,  0,  0,  0,0,0,0,0,0,0, 0], // Servicepunt.in
[274,    804,    334,    2,  1,  0,  0,  3,  0,  0,0,0,0,0,0,0, 0], // Domein ICTS.in
[3, 1211,   13, 0,  27, 0,  7,  13, 0,  0,0,0,0,0,0,0, 0], // Logistiek en Financien.in
[1478,   14, 7,  45, 3,  11, 2,  16, 0,  0,0,0,0,0,0,0, 0], // Domein HR.in
[0,0,0,0,0,0,0,0,emptyStroke,0,0,0,0,0,0,0,0] // dummyTop
];

// Calculate how far the Chord Diagram needs to be rotated clockwise
const offset = (2 * Math.PI) * (emptyStroke/(respondents + emptyStroke))/4;

// Create custom chord layout
const chord = customChordLayout()
    .padding(.02)
    .sortChords(d3.descending) // chord display order
    .matrix(matrix);

// Create arc generator
const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(d => d.startAngle + offset) // Include the offset
    .endAngle(d => d.endAngle + offset);    // Include the offset

// Create stretched chord path generator
const path = stretchedChord()
    .radius(innerRadius)
    .startAngle(d => d.startAngle + offset)
    .endAngle(d => d.endAngle + offset);

// Draw outer Arcs
const g = wrapper.selectAll("g.group")
    .data(chord.groups())
    .join("g")
    .attr("class", "group")
    .on("mouseover", function(event, d) {
        fade(opacityLow)(d);
        showTooltip(event, d, d.index);
    })
    .on("mouseout", function(event, d) {
        fade(opacityDefault)(d);
        hideTooltip();
    });

// Create a color scale
const colors = d3.schemeCategory10; // D3's built-in color scheme

// Modify the arc path fill and stroke properties
g.append("path")
    .style("stroke", (d, i) => (Names[i] === "" ? "none" : colors[i % colors.length]))
    .style("fill", (d, i) => (Names[i] === "" ? "none" : colors[i % colors.length]))
    .style("opacity", 0.7) // Keep semi-transparency
    .style("pointer-events", (d, i) => (Names[i] === "" ? "none" : "auto"))
    .attr("d", arc)
    .attr("transform", function(d) {
        // Pull the two slices apart
        d.pullOutSize = pullOutSize * (d.startAngle + 0.001 > Math.PI ? -1 : 1);
        return `translate(${d.pullOutSize},0)`;
    });

// Create dynamic gradients for each chord
const defs = svg.append("defs");

// Create a gradient for each chord
chord.chords().forEach((d, i) => {
    if (Names[d.source.index] === "") return;
    
    // sourceColor on left side, targetColor on right side
    const sourceColor = colors[d.source.index % colors.length];
    const targetColor = colors[d.target.index % colors.length];
     
    // Create the gradient for this chord
    const gradient = defs.append("linearGradient")
        .attr("id", `gradient-${i}`)
        .attr("gradientUnits", "userSpaceOnUse");
    
    // For better positioning, set the gradient vectors to follow the chord path
    // Start position - will be near the target arc
    gradient.attr("x1", "100%")
           .attr("y1", "0%")
           // End position - will be near the source arc
           .attr("x2", "0%")
           .attr("y2", "0%");
    
    // Add more stops for better color blending and matching with arcs
    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", sourceColor)
        .attr("stop-opacity", 0.7);
    
    // Add middle blend point if desired
    gradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", d3.interpolateRgb(sourceColor, targetColor)(0.5))
        .attr("stop-opacity", 0.7);
    
    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", targetColor)
        .attr("stop-opacity", 0.7);
});

// Update the chord paths to use the individual gradients
wrapper.selectAll("path.chord")
    .data(chord.chords())
    .join("path")
    .attr("class", "chord")
    .style("stroke", "none")
    .style("fill", (d, i) => Names[d.source.index] === "" ? "none" : `url(#gradient-${i})`)
    .style("opacity", d => (Names[d.source.index] === "" ? 0 : opacityDefault))
    .style("pointer-events", (d, i) => (Names[d.source.index] === "" ? "none" : "auto"))
    .attr("d", path)
    .on("mouseover", function(event, d) {
        fadeOnChord(event, d);
        showChordTooltip(event, d);
    })
    .on("mouseout", function(event, d) {
        fade(opacityDefault)(d);
        hideTooltip();
    });

// Helper function for angle calculations
function startAngle(d) { return d.startAngle + offset; }
function endAngle(d) { return d.endAngle + offset; }

// Append Names to arcs
g.append("text")
    .each(function(d) { 
        d.angle = ((d.startAngle + d.endAngle) / 2) + offset;
    })
    .attr("dy", ".35em")
    .attr("class", "titles")
    .style("font-size", mobileScreen ? "8px" : "10px")
    .attr("text-anchor", function(d) { 
        return d.angle > Math.PI ? "end" : null; 
    })
    .attr("transform", function(d, i) { 
        const c = arc.centroid(d);
        return `translate(${c[0] + d.pullOutSize},${c[1]})` +
               `rotate(${(d.angle * 180 / Math.PI - 90)})` +
               `translate(20,0)` +
               (d.angle > Math.PI ? "rotate(180)" : "");
    })
    .text((d, i) => Names[i])
    .call(wrapChord, 100);

// Draw inner chords
wrapper.selectAll("path.chord")
    .data(chord.chords())
    .join("path")
    .attr("class", "chord")
    .style("stroke", "none")
    //.style("fill", "url(#gradientLinearPerLine)") // SVG Gradient
    .style("opacity", d => (Names[d.source.index] === "" ? 0 : opacityDefault))
    .style("pointer-events", (d, i) => (Names[d.source.index] === "" ? "none" : "auto"))
    .attr("d", path)
    .on("mouseover", fadeOnChord)
    .on("mouseout", (event, d) => fade(opacityDefault)(d));

// Returns an event handler for fading a given chord group
function fade(opacity) {
    return function(d) {
        wrapper.selectAll("path.chord")
            .filter(function(d2) { 
                return d2.source.index != d.index && 
                       d2.target.index != d.index && 
                       Names[d2.source.index] != ""; 
            })
            .transition()
            .style("opacity", opacity);
    };
}

// Fade function when hovering over chord
function fadeOnChord(event, d) {
    const chosen = d;
    wrapper.selectAll("path.chord")
        .transition()
        .style("opacity", function(d) {
            if (d.source.index == chosen.source.index && d.target.index == chosen.target.index) {
                return opacityDefault;
            } else { 
                return opacityLow; 
            }
        });
}

// Wraps SVG text
function wrapChord(text, width) {
    text.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.1; // ems
        const y = 0;
        const x = 0;
        const dy = parseFloat(text.attr("dy"));
        let tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
    });
}

// Tooltip functions for chart1
function showTooltip(event, d, index) {
    const tooltip = document.getElementById('chord-tooltip');
    if (tooltip) {
        const name = Names[index] || `Item ${index}`;
        tooltip.innerHTML = `<strong>${name}</strong><br>Index: ${index}<br>Value: ${d.value || 'N/A'}`;
        tooltip.style.opacity = 1;
        tooltip.style.left = (event.pageX + 10) + 'px';
        tooltip.style.top = (event.pageY - 10) + 'px';
    }
}

function showChordTooltip(event, d) {
    const tooltip = document.getElementById('chord-tooltip');
    if (tooltip) {
        const sourceName = Names[d.source.index] || `Source ${d.source.index}`;
        const targetName = Names[d.target.index] || `Target ${d.target.index}`;
        tooltip.innerHTML = `<strong>Connection</strong><br>From: ${sourceName}<br>To: ${targetName}<br>Value: ${d.source.value.toFixed(3)}`;
        tooltip.style.opacity = 1;
        tooltip.style.left = (event.pageX + 10) + 'px';
        tooltip.style.top = (event.pageY - 10) + 'px';
    }
}

function hideTooltip() {
    const tooltip = document.getElementById('chord-tooltip');
    if (tooltip) {
        tooltip.style.opacity = 0;
    }
}

// ChordDiagram class definition
class ChordDiagram {
    constructor(containerId, data = sampleData, options = {}) {
        this.containerId = containerId;
        this.data = data;
        this.options = {...config, ...options};
        this.init();
    }

    init() {
        // Setup dimensions
        const screenWidth = window.innerWidth;
        const mobileScreen = screenWidth <= 500;
        this.width = Math.min(screenWidth, 800) - this.options.margin.left - this.options.margin.right;
        this.height = (mobileScreen ? 300 : Math.min(screenWidth, 800)*5/6) - 
                     this.options.margin.top - this.options.margin.bottom;
        
        this.pullOutSize = mobileScreen ? 20 : 50;
        this.setupSVG();
        this.processData();
        this.createGradients();
        this.render();
    }

    setupSVG() {
        // Create main SVG
        this.svg = d3.select(this.containerId).append("svg")
            .attr("width", this.width + this.options.margin.left + this.options.margin.right)
            .attr("height", this.height + this.options.margin.top + this.options.margin.bottom);

        // Create wrapper group
        this.wrapper = this.svg.append("g")
            .attr("class", "chordWrapper")
            .attr("transform", `translate(${this.width/2 + this.options.margin.left},
                                       ${this.height/2 + this.options.margin.top})`);

        // Setup dimensions
        const mobileScreen = this.width <= 500;
        this.outerRadius = Math.min(this.width, this.height) / 2 - (mobileScreen ? 80 : 100);
        this.innerRadius = this.outerRadius * 0.95;
    }

    processData() {
        // Convert JSON data to matrix format
        this.matrix = this.createMatrix(this.data);
        
        // Create chord layout
        this.chordLayout = customChordLayout()
            .padding(.02)
            .sortChords(d3.descending)
            .matrix(this.matrix);
    }

    createMatrix(data) {
        // Create matrix from nodes and links
        const nodes = data.nodes;
        const n = nodes.length;
        const matrix = Array(n).fill().map(() => Array(n).fill(0));
        
        // Separate sectors and indicators
        const numSectors = nodes.filter(node => node.type === 'sector').length;
        const numIndicators = nodes.filter(node => node.type === 'indicator').length;
        
        // Fill in the raw matrix
        data.links.forEach(link => {
            const sourceIndex = nodes.findIndex(node => node.id === link.source);
            const targetIndex = nodes.findIndex(node => node.id === link.target);
            matrix[sourceIndex][targetIndex] = link.value;
            // Store original value for tooltips
            if (!matrix.originalValues) matrix.originalValues = {};
            matrix.originalValues[`${sourceIndex}-${targetIndex}`] = link.originalValue || link.value;
        });
        
        // Calculate current row and column sums
        const rowSums = matrix.map(row => row.reduce((sum, val) => sum + val, 0));
        const colSums = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                colSums[j] += matrix[i][j];
            }
        }
        
        // Find max sums for each side
        const maxSectorSum = Math.max(...rowSums.slice(0, numSectors));
        const maxIndicatorSum = Math.max(...colSums.slice(numSectors));
        
        // Scale to target max arc size - need much smaller values to reduce arc size
        // Look at chart1's matrix values - they're in hundreds, not thousands/millions
        const targetMaxArc = 500; // Target similar to chart1's largest values
        const sectorScale = maxSectorSum > 0 ? targetMaxArc / maxSectorSum : 1;
        const indicatorScale = maxIndicatorSum > 0 ? targetMaxArc / maxIndicatorSum : 1;
        
        console.log(`Matrix scaling - Sector: ${sectorScale.toFixed(3)}, Indicator: ${indicatorScale.toFixed(3)}`);
        console.log(`Max sums - Sector: ${maxSectorSum.toFixed(2)}, Indicator: ${maxIndicatorSum.toFixed(2)}`);
        
        // Apply scaling to matrix
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (matrix[i][j] > 0) {
                    // Scale based on whether it's sector->indicator
                    if (i < numSectors && j >= numSectors) {
                        matrix[i][j] *= sectorScale * indicatorScale;
                    }
                }
            }
        }
        
        return matrix;
    }

    createGradients() {
        // Create gradients for chords
        const defs = this.svg.append("defs");
        const colors = d3.schemeCategory10;
        
        this.chordLayout.chords().forEach((d, i) => {
            // Create gradient logic here
            // ...existing gradient creation code...
        });
    }

    render() {
        // Render titles
        this.renderTitles();
        // Render arcs
        this.renderArcs();
        // Render chords
        this.renderChords();
        // Render labels
        this.renderLabels();
    }

    renderArcs() {
        // Draw outer Arcs
        const g = this.wrapper.selectAll("g.group")
            .data(this.chordLayout.groups())
            .join("g")
            .attr("class", "group")
            .on("mouseover", (event, d) => {
                this.fade(this.options.opacity.low)(d);
                this.showTooltip(event, d, d.index);
            })
            .on("mouseout", (event, d) => {
                this.fade(this.options.opacity.default)(d);
                this.hideTooltip();
            });

        // Create a color scale
        const colors = d3.schemeCategory10;

        // Create arc generator
        const arc = d3.arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.outerRadius)
            .startAngle(d => d.startAngle)
            .endAngle(d => d.endAngle);

        // Add arc paths
        g.append("path")
            .style("stroke", (d, i) => colors[i % colors.length])
            .style("fill", (d, i) => colors[i % colors.length])
            .style("opacity", this.options.opacity.default)
            .attr("d", arc)
            .attr("transform", (d) => {
                d.pullOutSize = this.pullOutSize * (d.startAngle + 0.001 > Math.PI ? -1 : 1);
                return `translate(${d.pullOutSize},0)`;
            });
    }

    renderChords() {
        // Create stretched chord path generator
        const path = stretchedChord()
            .radius(this.innerRadius);

        // Draw chords
        this.wrapper.selectAll("path.chord")
            .data(this.chordLayout.chords())
            .join("path")
            .attr("class", "chord")
            .style("stroke", "none")
            .style("fill", (d, i) => `url(#gradient-${i})`)
            .style("opacity", this.options.opacity.default)
            .attr("d", path)
            .on("mouseover", (event, d) => {
                this.fadeOnChord(event, d);
                this.showChordTooltip(event, d);
            })
            .on("mouseout", (event, d) => {
                this.fade(this.options.opacity.default)(d);
                this.hideTooltip();
            });
    }

    renderLabels() {
        // Create arc generator for label positioning
        const arc = d3.arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.outerRadius)
            .startAngle(d => d.startAngle)
            .endAngle(d => d.endAngle);

        // Add labels to arcs
        this.wrapper.selectAll("g.group")
            .selectAll("text")
            .data(d => [d])
            .join("text")
            .each(function(d) { 
                d.angle = (d.startAngle + d.endAngle) / 2;
            })
            .attr("dy", ".35em")
            .attr("class", "titles")
            .style("font-size", "10px")
            .attr("text-anchor", function(d) { 
                return d.angle > Math.PI ? "end" : null; 
            })
            .attr("transform", function(d) { 
                const c = arc.centroid(d);
                return `translate(${c[0] + d.pullOutSize},${c[1]})` +
                       `rotate(${(d.angle * 180 / Math.PI - 90)})` +
                       `translate(20,0)` +
                       (d.angle > Math.PI ? "rotate(180)" : "");
            })
            .text((d, i) => {
                // Get the node name from the original data
                if (this.data.nodes && this.data.nodes[i]) {
                    return this.data.nodes[i].name || this.data.nodes[i].id;
                }
                return `Label ${i}`;
            });
    }

    renderTitles() {
        // Titles on top
        const titleWrapper = this.svg.append("g").attr("class", "chordTitleWrapper");
        const mobileScreen = this.width <= 500;
        const titleOffset = mobileScreen ? 15 : 40;
        const titleSeparate = mobileScreen ? 30 : 0;

        // Title top left
        titleWrapper.append("text")
            .attr("class", "title left")
            .style("font-size", mobileScreen ? "12px" : "16px")
            .attr("x", (this.width/2 + this.options.margin.left - this.outerRadius - titleSeparate))
            .attr("y", titleOffset)
            .text(this.options.titles.left || "Left side");

        titleWrapper.append("line")
            .attr("class", "titleLine left")
            .attr("x1", (this.width/2 + this.options.margin.left - this.outerRadius - titleSeparate)*0.6)
            .attr("x2", (this.width/2 + this.options.margin.left - this.outerRadius - titleSeparate)*1.4)
            .attr("y1", titleOffset+8)
            .attr("y2", titleOffset+8);

        // Title top right
        titleWrapper.append("text")
            .attr("class", "title right")
            .style("font-size", mobileScreen ? "12px" : "16px")
            .attr("x", (this.width/2 + this.options.margin.left + this.outerRadius + titleSeparate))
            .attr("y", titleOffset)
            .text(this.options.titles.right || "Right side");

        titleWrapper.append("line")
            .attr("class", "titleLine right")
            .attr("x1", (this.width/2 + this.options.margin.left - this.outerRadius - titleSeparate)*0.6 + 2*(this.outerRadius + titleSeparate))
            .attr("x2", (this.width/2 + this.options.margin.left - this.outerRadius - titleSeparate)*1.4 + 2*(this.outerRadius + titleSeparate))
            .attr("y1", titleOffset+8)
            .attr("y2", titleOffset+8);
    }

    fade(opacity) {
        return (d) => {
            this.wrapper.selectAll("path.chord")
                .filter(function(d2) { 
                    return d2.source.index != d.index && d2.target.index != d.index; 
                })
                .transition()
                .style("opacity", opacity);
        };
    }

    fadeOnChord(event, d) {
        const chosen = d;
        const opacityDefault = this.options.opacity.default;
        const opacityLow = this.options.opacity.low;
        this.wrapper.selectAll("path.chord")
            .transition()
            .style("opacity", function(d) {
                if (d.source.index == chosen.source.index && d.target.index == chosen.target.index) {
                    return opacityDefault;
                } else { 
                    return opacityLow; 
                }
            });
    }

    showTooltip(event, d, index) {
        const tooltip = document.getElementById('chord-tooltip');
        if (tooltip && this.data.nodes && this.data.nodes[index]) {
            const node = this.data.nodes[index];
            const name = node.name || node.id;
            const type = node.type || 'Unknown';
            tooltip.innerHTML = `<strong>${name}</strong><br>Type: ${type}<br>Index: ${index}<br>Value: ${d.value || 'N/A'}`;
            tooltip.style.opacity = 1;
            tooltip.style.left = (event.pageX + 10) + 'px';
            tooltip.style.top = (event.pageY - 10) + 'px';
        }
    }

    showChordTooltip(event, d) {
        const tooltip = document.getElementById('chord-tooltip');
        if (tooltip && this.data.nodes) {
            const sourceNode = this.data.nodes[d.source.index];
            const targetNode = this.data.nodes[d.target.index];
            const sourceName = sourceNode ? (sourceNode.name || sourceNode.id) : `Source ${d.source.index}`;
            const targetName = targetNode ? (targetNode.name || targetNode.id) : `Target ${d.target.index}`;
            
            // Get original value if stored in matrix
            const originalKey = `${d.source.index}-${d.target.index}`;
            const originalValue = this.matrix.originalValues && this.matrix.originalValues[originalKey];
            
            let valueText = `Original: ${originalValue !== undefined ? originalValue.toFixed(3) : 'N/A'}`;
            valueText += `<br>Scaled: ${d.source.value.toFixed(3)}`;
            
            tooltip.innerHTML = `<strong>Connection</strong><br>From: ${sourceName}<br>To: ${targetName}<br>${valueText}`;
            tooltip.style.opacity = 1;
            tooltip.style.left = (event.pageX + 10) + 'px';
            tooltip.style.top = (event.pageY - 10) + 'px';
        }
    }

    hideTooltip() {
        const tooltip = document.getElementById('chord-tooltip');
        if (tooltip) {
            tooltip.style.opacity = 0;
        }
    }
}

// Export for ES6 modules
export default ChordDiagram;