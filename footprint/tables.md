| | |
| ----------- | ----------- |
| Flow (uses UUID) | [flows](https://github.com/USEPA/fedelemflowlist/blob/master/format%20specs/FlowList.md) |
| Indicator (Includes simple unit) | [indicators](https://github.com/USEPA/useeior/blob/master/format_specs/Model.md#indicators) |
| SectorCrosswalk (where are titles by year?) | <a href="https://github.com/ModelEarth/OpenFootprint/blob/main/impacts/2020/sectorcrosswalk.csv">SectorCrosswalk</a> |
| Sector_SectorPerDollar | A matrix |
| Flow_Sector (Impact Sector) | B matrix |
| Characteristic_Impact | C matrix |
| Indicator_Sector (ImpactDirect) | [D matrix](../charts/d3/chord-diagram/)  |
| Commodity | q matrix |
| Sector_Sector (Leontief) | L matrix |
| Flow_Sector (Imports Commodity) | M matrix |
| CommodityValueAdded_IndustryFinalDemand (Impact Totals) | [U matrix](https://github.com/USEPA/useeior/blob/master/format_specs/Model.md#indicators) |
| Industry_Commodity (Make) | V matrix |
| Sector\_Sector\_DataQuality | A_d |
| Impact\_Sector\_DataQuality | B_d |
| Leontief_DataQuality | L_d |
| ImportCommodity_DataQuality | M_d |
| Impact | N matrix |
| ImpactDomestic | N_d |
| Producer_Purchaser (price ratio) | Phi |
| Sector_Year | Rho |
| ImpactTotal_DataQuality | U_d |
| X | x matrix |
| Demand | demands |

<br>Rho contains sector-specific currency deflation ratios that can be used to put results into another currency year.