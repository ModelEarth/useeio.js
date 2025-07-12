# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the useeio.js library - a TypeScript-based JavaScript library for interacting with USEEIO (US Environmentally-Extended Input-Output) models. It provides a frontend interface for state model data assembled in USEEIO-R and includes visualization tools for impact reports.

## Key Architecture

### Core Components

- **src/useeio.ts**: Main entry point that exports all modules
- **src/model.ts**: Core data structures and interfaces for USEEIO models (Indicator, Sector, DemandVector, etc.)
- **src/webapi.ts**: WebApi and WebModel classes for API communication and data caching
- **src/matrix.ts**: Matrix operations for calculations
- **src/calc.ts**: Calculation utilities
- **src/sectors.ts**: Sector-related functionality
- **src/sector-analysis.ts**: Sector analysis utilities

### Data Flow

The library follows this pattern:
1. WebApi handles HTTP requests to USEEIO API endpoints
2. WebModel provides caching and higher-level operations
3. Matrix operations enable local calculations when using JSON file dumps
4. Results are provided via the Result interface with indicator/sector data

### Two Operating Modes

1. **Live API Mode**: Direct requests to USEEIO API endpoints
2. **JSON Dump Mode**: Local calculations using pre-downloaded JSON files (set `asJsonFiles: true` in WebApiConfig)

## Common Development Commands

```bash
# Install dependencies
npm install

# Build the library (runs all build steps)
npm run build

# Individual build steps
npm run clean          # Clean dist directory
npm run build:js       # Build TypeScript to JavaScript
npm run build:types    # Generate TypeScript declarations
npm run build:minjs    # Create minified version

# Development server for footprint visualizations
http-server ./data -p 8080 --cors
```

## Build System

- **Build Tool**: Rollup.js with TypeScript plugin
- **Output**: UMD bundle in `dist/useeio.js` and `dist/useeio.min.js`
- **Type Definitions**: Generated in `dist/useeio.d.ts`
- **Target**: ES5 for broad browser compatibility

## File Structure

- `src/`: TypeScript source files
- `dist/`: Built JavaScript files (UMD bundle)
- `footprint/`: HTML/JS visualization files (can be edited directly)
- `data/`: JSON data files for models
- `scripts/`: Build and utility scripts
- `env/`: Environment-specific configurations

## Working with Visualizations

The `footprint/` directory contains HTML and JavaScript files for impact reports and visualizations. These can be edited directly without running the build process, as they are separate from the core library build.

## API Integration

When working with USEEIO APIs:
- Use WebApiConfig to configure endpoint, model ID, and optional API key
- For static JSON files, set `asJsonFiles: true` in config
- The library handles both live API calls and local JSON file processing
- Results are cached in WebModel for performance

## Data Structures

Key interfaces to understand:
- `Indicator`: Environmental/economic indicators with units and groups
- `Sector`: Industry sectors with codes, names, and locations
- `DemandVector`: Maps sector IDs to demand values
- `Result`: Calculation results with indicator/sector matrices
- `CalculationSetup`: Configuration for calculations (perspective, demand)

## Local Development Server

For testing with JSON data files:
```bash
# Using http-server (install globally first)
npm install http-server -g
http-server ./data -p 8080 --cors

# Alternative for pre-generated state data
http-server ../useeio-json/models/2020 -p 8080 --cors
```