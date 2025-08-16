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
    // Limit to 10 indicators
    const limitedIndicators = indicators.slice(0, 10);
    
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
        ...limitedIndicators.map(i => ({
            id: i.code,
            name: i.name || i.code,
            type: 'indicator',
            group: 2
        }))
    ];

    // Calculate the raw matrix and find max values for normalization
    const rawMatrix = [];
    const numSectors = sectorData.length;
    const numIndicators = limitedIndicators.length;
    const totalNodes = numSectors + numIndicators;
    
    // Initialize matrix with zeros
    for (let i = 0; i < totalNodes; i++) {
        rawMatrix[i] = new Array(totalNodes).fill(0);
    }
    
    // Fill in the raw values (sectors to indicators only)
    sectorData.forEach((sector, sectorIndex) => {
        limitedIndicators.forEach((indicator, indicatorIndex) => {
            const value = sector[indicator.code];
            if (value !== undefined) {
                const targetIndex = numSectors + indicatorIndex;
                rawMatrix[sectorIndex][targetIndex] = Math.abs(value);
            }
        });
    });
    
    // Calculate current totals
    const sectorTotals = [];
    const indicatorTotals = [];
    
    for (let i = 0; i < numSectors; i++) {
        sectorTotals[i] = rawMatrix[i].reduce((sum, val) => sum + val, 0);
    }
    
    for (let i = 0; i < numIndicators; i++) {
        const indicatorIndex = numSectors + i;
        indicatorTotals[i] = 0;
        for (let j = 0; j < totalNodes; j++) {
            indicatorTotals[i] += rawMatrix[j][indicatorIndex];
        }
    }
    
    // Target: each side should be about 30% of circle (like chart1)
    // Scale values so the largest sector/indicator arc is reasonable
    const maxSectorTotal = Math.max(...sectorTotals);
    const maxIndicatorTotal = Math.max(...indicatorTotals);
    
    // Scale factor to make largest arc about 30% max
    const targetMaxValue = 1000; // Arbitrary target for manageable arc sizes
    const sectorScale = targetMaxValue / Math.max(maxSectorTotal, 1);
    const indicatorScale = targetMaxValue / Math.max(maxIndicatorTotal, 1);
    
    console.log(`Scaling - Max sector: ${maxSectorTotal.toFixed(2)}, Max indicator: ${maxIndicatorTotal.toFixed(2)}`);
    console.log(`Scale factors - Sectors: ${sectorScale.toFixed(3)}, Indicators: ${indicatorScale.toFixed(3)}`);
    
    // Create balanced links array with original values stored
    const links = [];
    sectorData.forEach((sector, sectorIndex) => {
        limitedIndicators.forEach((indicator, indicatorIndex) => {
            const originalValue = sector[indicator.code];
            if (originalValue !== undefined && originalValue !== 0) {
                // Apply scaling to keep arc sizes reasonable
                const scaledValue = Math.abs(originalValue) * sectorScale * indicatorScale;
                links.push({
                    source: sector.sector,
                    target: indicator.code,
                    value: scaledValue,
                    originalValue: originalValue // Store original for tooltips
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