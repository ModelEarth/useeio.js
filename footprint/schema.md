# SQL Tables

Database name: **US-2020-17schema** (Which indicates the 2017 schema.)

TO DO: Also output partial databases for other countries with additional downloads from exiobase. (Add a parameter output="notUS" passed to <a href="https://github.com/ModelEarth/USEEIO/tree/import_factors/import_factors_exio">ran exiobase_downloads.py</a> to omit the US-specific BEA data.)

Row totals below are for the 6 .csv files in the [US-2020-17schema](https://github.com/ModelEarth/OpenFootprint/tree/main/impacts/exiobase/US/2020) which merges 2020 Exiobase trade data and US BEA.<!--
	<a href="https://github.com/ModelEarth/USEEIO/tree/import_factors/import_factors_exio/output">Exiobase+BEA output for 2019</a>.
-->

We'll exclude the Year columns.
Commodity refers to the 6-character detail sectors.
Sector refers to the 5-character and fewer sectors.
Region is referred to as Import.
National is omitted from the table names.

We'll remove underscores and use CamelCase with clear naming.

Country abbreviations (Example: US) are appended to country-specific tables.
This structure supports pulling all the country data into one database.

**Country** (Includes country and region and rest of world)
CountryCode (2-char), Country, Region (2-char)

**Sector** (5-char and fewer sector ID)
SectorID, SectorName
[Source](https://github.com/ModelEarth/OpenFootprint/blob/main/impacts/2020/USEEIOv2.0.1-411/sectors.json) - We'll find a .csv file instead in the USEPA repos.

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
Source: US_summary_import_factors_exio_2020_17sch (220 rows)

**CommodityUS** (6-char sector ID)
CommodityID, FlowUUID, FlowAmount
Source: US_detail_import_factors_exio_2020_17sch (1490 rows)

**ImportSectorUS** (5-char and fewer sector ID)
CountryCode (Region), SectorID, FlowUUID, FlowAmount
Source: Regional_summary_import_factors_exio_2020_17sch (1515 rows)

**ImportCommodityUS** (6-char sector ID)
CountryCode (Region), CommodityID, FlowUUID, FlowAmount
Source: Regional_detail_import_factors_exio_2020_17sch (10405 rows)

**ImportContributionsUS** (6-char sector ID)
CountryCode, CommodityID (BEA Detail), ImportQuantity, ContributionImportSector, ContributionImportCommodity, ContributionSector, ContributionCommodity
Omit: Country, Region, Unit, Source, BEA Summary
Source: country_contributions_by_sector (61675 rows)

**ImportMultiplierUS** (6-char sector ID)
<!-- If we ever have a 5-char sector multiplier, the 5-char table will be ImportSectorMultiplierUS -->
CountryCode, CommodityID, FlowUUID, Footprint (EF stands for Environmental Footprint)
Source: multiplier_df_exio_2020_17sch