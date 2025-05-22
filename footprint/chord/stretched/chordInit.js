import ChordDiagram from './script.js';

// Default configuration
const defaultConfig = {
    containerId: '#chart',
    titles: {
        left: "Sectors",
        right: "Indicators"
    }
};

// Initialize with sample data if no data is provided
let chordDiagram;

// Function to process sector supply data into chord diagram format
function processSectorData(sectorData, indicators) {
    // Create nodes array
    const nodes = [
        // Add sectors
        ...sectorData.map(s => ({
            id: s.sector,
            name: s.sector,
            type: 'sector',
            group: 1
        })),
        // Add indicators
        ...indicators.slice(0, 10).map(i => ({
            id: i.code,
            name: i.name || i.code,
            type: 'indicator',
            group: 2
        }))
    ];

    // Create links array
    const links = [];
    sectorData.forEach(sector => {
        indicators.slice(0, 10).forEach(indicator => {
            if (sector[indicator.code] !== undefined) {
                links.push({
                    source: sector.sector,
                    target: indicator.code,
                    value: Math.abs(sector[indicator.code])
                });
            }
        });
    });

    return { nodes, links };
}

// Initialize chord diagram with sector supply data
export async function initializeChordDiagram(sectorData, indicators, config = {}) {
    try {
        const combinedConfig = { ...defaultConfig, ...config };
        const chordData = processSectorData(sectorData, indicators);
        
        // Destroy existing diagram if it exists
        if (chordDiagram) {
            d3.select(combinedConfig.containerId).html('');
        }

        // Create new chord diagram
        chordDiagram = new ChordDiagram(combinedConfig.containerId, chordData, combinedConfig);
        
        return chordDiagram;
    } catch (error) {
        console.error('Error initializing chord diagram:', error);
        throw error;
    }
}

// Event listener for data updates
document.addEventListener('dataUpdated', (event) => {
    if (event.detail && event.detail.sectorData && event.detail.indicators) {
        initializeChordDiagram(event.detail.sectorData, event.detail.indicators);
    }
});

// Export diagram instance for external access
export { chordDiagram };