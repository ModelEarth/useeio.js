////////////////////////////////////////////////////////////
/////////////// Custom Chord Function //////////////////////
//////// Pulls the chords pullOutSize pixels apart /////////
////////////////// along the x axis ////////////////////////
////////////////////////////////////////////////////////////
///////////// Created by Nadieh Bremer /////////////////////
//////////////// VisualCinnamon.com ////////////////////////
////////////////////////////////////////////////////////////
//// Adjusted from the original d3.svg.chord() function ////
///////////////// from the d3.js library ///////////////////
//////////////// Created by Mike Bostock ///////////////////
////////////////////////////////////////////////////////////

// Stretched Chord function for D3 v5
function stretchedChord() {
    // Default accessor functions
    let source = d => d.source;
    let target = d => d.target;
    let radius = d => d.radius;
    let startAngle = d => d.startAngle;
    let endAngle = d => d.endAngle;
    let pullOutSize = 50; // Default value for pull out size
    
    const π = Math.PI;
    const halfπ = π / 2;
    
    function subgroup(self, f, d, i) {
        const subgroup = f.call(self, d, i);
        const r = radius.call(self, subgroup, i);
        const a0 = startAngle.call(self, subgroup, i) - halfπ;
        const a1 = endAngle.call(self, subgroup, i) - halfπ;
        return {
            r: r,
            a0: [a0],
            a1: [a1],
            p0: [r * Math.cos(a0), r * Math.sin(a0)],
            p1: [r * Math.cos(a1), r * Math.sin(a1)]
        };
    }
    
    function arc(r, p, a) {
        const sign = (p[0] >= 0 ? 1 : -1);
        return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + (p[0] + sign * pullOutSize) + "," + p[1];
    }
    
    function curve(p1) {
        const sign = (p1[0] >= 0 ? 1 : -1);
        return "Q 0,0 " + (p1[0] + sign * pullOutSize) + "," + p1[1];
    }
    
    /*
    M = moveto
    M x,y
    Q = quadratic Bézier curve
    Q control-point-x,control-point-y end-point-x, end-point-y
    A = elliptical Arc
    A rx, ry x-axis-rotation large-arc-flag, sweep-flag end-point-x, end-point-y
    Z = closepath
    M251.5579641956022,87.98204731514328
    A266.5,266.5 0 0,1 244.49937503334525,106.02973926358392
    Q 0,0 -177.8355222451483,198.48621369706098
    A266.5,266.5 0 0,1 -191.78901944612068,185.0384338992728
    Q 0,0 251.5579641956022,87.98204731514328
    Z
    */
    
    function chord(d, i) {
        const s = subgroup(this, source, d, i);
        const t = subgroup(this, target, d, i);
        
        return "M" + (s.p0[0] + pullOutSize) + "," + s.p0[1] + 
               arc(s.r, s.p1, s.a1 - s.a0) + 
               curve(t.p0) + 
               arc(t.r, t.p1, t.a1 - t.a0) + 
               curve(s.p0) + 
               "Z";
    }
    
    // Method to set or get the radius accessor
    chord.radius = function(_) {
        return arguments.length ? (radius = typeof _ === "function" ? _ : () => _, chord) : radius;
    };
    
    // Method to set or get the source accessor
    chord.source = function(_) {
        return arguments.length ? (source = typeof _ === "function" ? _ : () => _, chord) : source;
    };
    
    // Method to set or get the target accessor
    chord.target = function(_) {
        return arguments.length ? (target = typeof _ === "function" ? _ : () => _, chord) : target;
    };
    
    // Method to set or get the start angle accessor
    chord.startAngle = function(_) {
        return arguments.length ? (startAngle = typeof _ === "function" ? _ : () => _, chord) : startAngle;
    };
    
    // Method to set or get the end angle accessor
    chord.endAngle = function(_) {
        return arguments.length ? (endAngle = typeof _ === "function" ? _ : () => _, chord) : endAngle;
    };
    
    // Method to set or get the pull out size
    chord.pullOutSize = function(_) {
        return arguments.length ? (pullOutSize = _, chord) : pullOutSize;
    };
    
    return chord;
}

// Usage example with D3 v5:
/*
// Import D3 v5
// import * as d3 from "d3";

// Create a chord diagram
const width = 600;
const height = 600;
const innerRadius = 200;
const outerRadius = 230;

// Create SVG
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

// Create chord generator
const myChord = stretchedChord()
    .pullOutSize(50);

// Use with your data
// svg.selectAll("path")
//    .data(yourChordData)
//    .enter()
//    .append("path")
//    .attr("d", myChord)
//    .attr("fill", ...)
//    .attr("stroke", ...);
*/