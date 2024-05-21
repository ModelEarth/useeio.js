| | |
| ----------- | ----------- |
| [Flow](https://github.com/USEPA/useeior/blob/master/inst/extdata/Crosswalk_USEEIO_FlowMapping.csv) (Uses UUID in flows.json [View Feed](/feed/view/#feed=flow)) | [flows](https://github.com/USEPA/fedelemflowlist/blob/master/format%20specs/FlowList.md) |
| [Indicator](https://github.com/USEPA/useeior/blob/master/inst/extdata/USEEIO_LCIA_Indicators.csv) (Includes SimpleUnit) | [indicators](https://github.com/USEPA/useeior/blob/master/format_specs/Model.md#indicators) |
| [Demand](https://github.com/USEPA/useeior/blob/master/format_specs/ModelSpecification.md#demand-vector-specifications) (type and year) | Demands |
| [DataSources](https://github.com/USEPA/useeior/blob/master/format_specs/ModelSpecification.md#demand-vector-specifications) (yml) | DataSources |
| SectorCrosswalk (where are titles by year?) | <a href="https://github.com/ModelEarth/OpenFootprint/blob/main/impacts/2020/sectorcrosswalk.csv">SectorCrosswalk</a> |
| Sector_SectorPerDollar | A matrix |
| Flow_Sector (Impact Sector) | B matrix |
| Characteristic_Impact | C matrix |
| Indicator_SectorDirect | [D matrix](../charts/d3/chord-diagram/)  |
| Commodity | q matrix |
| Sector_Sector (Leontief) | L matrix |
| Flow_Sector (Imports Commodity) | M matrix |
| Indicator_SectorIndirect (Impact Totals) | N matrix |
| Commodity_Industry<br>Value Added to FinalDemand | [U matrix](https://github.com/USEPA/useeior/blob/master/format_specs/Model.md#indicators) |
| Industry_Commodity (Make) | V matrix |
| Industry (total output) | x matrix |
| SectorSectorPerDollar\_DataQuality | A_d |
| FlowSector\_DataQuality | B_d |
| SectorSector_DataQuality | L_d |
| ImportCommodity_DataQuality | M_d |
| IndicatorSectorIndirect_DataQuality | N_d |
| Producer_Purchaser (price ratio) | Phi |
| Sector_Year | Rho |
| CommodityIndustry_DataQuality | U_d |


<br>Rho contains sector-specific currency deflation ratios that can be used to put results into another currency year.