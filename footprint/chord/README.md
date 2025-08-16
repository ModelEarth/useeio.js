[State Impact Reports](../)

[Our separated chord chart](../sector_supply_impacts.html) is displayed from a chartData{} json object in the [Sector Supply Impacts report](../sector_supply_impacts.html).

### About D3 v7 Stretched Chord Diagrams

JSON loaded via javascript resides in one object, which includes:

	let chartData = {
	    nodes: [],
	    links: []
	};

**nodes: Array of all elements (sectors and indicators)**
1. id: Unique identifier (sector or indicator code)
2. name: Display name
3. type: Either 'sector' or 'indicator'
4. group: Grouping number for visualization (1=sectors, 2=indicators)

**links: Array of connections between sectors and indicators**

1. source: Sector code
2. target: Indicator code
3. value: Impact value

The object automatically updates with changes, and maintains connections between sectors and impact indicators.

### Configuration Options

The chord diagram supports various configuration options that can be passed when creating a new instance:

```javascript
const options = {
    titles: {
        left: "Sectors",
        right: "Indicators"
    },
    chordBorder: {
        style: "light", // Options: "none", "light", "dark"
        width: "1px"
    },
    opacity: {
        default: 0.7,
        low: 0.02
    },
    margin: {left: 50, top: 10, right: 50, bottom: 10}
};

// Create diagram with custom options
const chordDiagram = new ChordDiagram('#chart2', chartData, options);
```

**Border Style Options:**
- `"none"` - No borders on chord connections
- `"light"` - Light, subtle borders that blend with connection gradients (default)
- `"dark"` - Darker borders using source node colors

**Usage Examples:**
```javascript
// No borders
const noBorderOptions = { chordBorder: { style: "none" } };

// Dark borders  
const darkBorderOptions = { chordBorder: { style: "dark", width: "2px" } };

// Custom light borders
const customLightOptions = { chordBorder: { style: "light", width: "1.5px" } };
```

### Stretched chord visualization

[Stretched Chord Starter (in current folder)](stretched) in [our github repo](https://github.com/ModelEarth/useeio.js/tree/dev/footprint/chord)

[Developed by Nadieh in 2015](https://www.visualcinnamon.com/2015/08/stretched-chord/) and updated to v7 by sending [v3 source from Misuno Kitara](https://gist.github.com/MisunoKitara/abe8987858204fae859b0e07d4d3aa21) to ClaudeAI.

### Sankey Visualization

[Sankey Sample](/io/charts/sankey/) and it's [sankey json](/io/charts/sankey/data/IO.js)
