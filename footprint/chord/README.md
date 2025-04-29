### About Our Chord Diagrams

JSON loaded via javascript resides in one object, which includes:

**nodes: Array of all elements (sectors and indicators)**
1. id: Unique identifier (sector or indicator code)
2. name: Display name
3. type: Either 'sector' or 'indicator'
4. group: Grouping number for visualization (1=sectors, 2=indicators)

**links: Array of connections between sectors and indicators**

1. source: Sector code
2. target: Indicator code
3. value: Impact value

The object automatically updates with changes, and maintain connections between sectors and impact indicators.

Support the stretched chord visualization.