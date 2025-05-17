[State Impact Reports](../)

[Our separated chord chart](../sector_supply_impacts.html) will use a json object that already resides in our [Sector Supply Impacts report](../sector_supply_impacts.html).

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

### Stretched chord visualization

[Stretched Chord Starter (in current folder)](stretched) in [our github repo](https://github.com/ModelEarth/useeio.js/tree/dev/footprint/chord)

[Developed by Nadieh in 2015](https://www.visualcinnamon.com/2015/08/stretched-chord/) and updated to v7 by sending [v3 source from Misuno Kitara](https://gist.github.com/MisunoKitara/abe8987858204fae859b0e07d4d3aa21) to ClaudeAI.

### Sankey Visualization

[Sankey Sample](/io/charts/sankey/) and it's [sankey json](/io/charts/sankey/data/IO.js)
