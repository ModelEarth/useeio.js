<style>
#schemaDiv strong {
  font-size: 16px;
}
.yamlPre {
  background-color: #eee;
  padding: 20px;
  overflow-y: scroll;
}
.dark .yamlPre {
  background-color: #222;
}
</style>

# SQL Tables

Row totals below are for the 6 .csv files in the [US-2020-17schema](https://github.com/ModelEarth/OpenFootprint/tree/main/impacts/exiobase/US-source/2022) which merges 2020 Exiobase trade data and US BEA.

### Table Names

**Country** (Includes country and region and rest of world)
CountryCode (2-char), Country, Region (2-char)

**Sector** (5-char and fewer sector ID)
SectorID, SectorName

**Commodity** (6-char sector ID)
CommodityID, CommodityName

**Flow**
FlowUUID, Flowable, Unit, Context

**FlowInfo** (Only 1 row and 2 columns)
Every country in a database will be tracked with the same currency.
ReferenceCurrency = "USD"
PriceType = "Basic"

**SectorUS** (5-char and fewer sector ID)
SectorID, FlowUUID, FlowAmount
Omit: Unit ReferenceCurrency PriceType 
Source: US\_summary\_import\_factors\_exio\_2020\_17sch (220 rows)

**CommodityUS** (6-char sector ID)
CommodityID, FlowUUID, FlowAmount
Source: US\_detail\_import\_factors\_exio\_2020\_17sch (1490 rows)

**ImportSectorUS** (5-char and fewer sector ID)
CountryCode (Region), SectorID, FlowUUID, FlowAmount
Source: Regional\_summary\_import\_factors\_exio\_2020\_17sch (1515 rows)

**ImportCommodityUS** (6-char sector ID)
CountryCode (Region), CommodityID, FlowUUID, FlowAmount
Source: Regional\_detail\_import\_factors\_exio\_2020\_17sch (10405 rows)

**ImportContributionsUS** (6-char sector ID)
CountryCode, CommodityID (BEA Detail), ImportQuantity, ContributionImportSector, ContributionImportCommodity, ContributionSector, ContributionCommodity
Omit: Country, Region, Unit, Source, BEA Summary
Source: country\_contributions\_by\_sector (61675 rows)

**ImportMultiplierUS** (6-char sector ID)<!-- If we ever have a 5-char sector multiplier, the 5-char table will be ImportSectorMultiplierUS -->
CountryCode, CommodityID, FlowUUID, Footprint (EF stands for Environmental Footprint)
Source: multiplier\_df\_exio\_2020\_17sch

Commodity.csv for CommodityNames could be from <a href="https://www.bea.gov/industry/input-output-accounts-data">BEA input-output (ImportMatrices_Before_Redefinitions_DET_2017.xlsx</a>.
[The Concordance raw files](https://github.com/insongkim/concordance/tree/master/data-raw) is another option for category names. See our [Harmonized System (HS) page](/OpenFootprint/harmonized-system).
