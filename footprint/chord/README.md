[State Impact Reports](../)

The following is being setup in our []()

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

### Support stretched chord visualizations

[Stretched Chord Starter](stretched) - Version created in 2015. Let's find a newer one with improved text.  
Here's the [source](https://gist.github.com/MisunoKitara/abe8987858204fae859b0e07d4d3aa21) and [related blog post](https://www.visualcinnamon.com/2015/08/stretched-chord/)

