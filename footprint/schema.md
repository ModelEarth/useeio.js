# SQL Tables

Database name: **US-2020-17schema** (Which indictes the 2017 schema.)

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
CountryCode, CommodityID, FlowUUID, Footprint (EF cryptically stands for Environmental Footprint)
Source: multiplier_df_exio_2020_17sch

[From ChatGPT](https://chatgpt.com/share/3a89cc73-c839-4592-bc6e-e82a6a8e400b) - Python resides after it in a hidden comment.

```
SectorUS:
  source: USsummaryimportfactorsexio202017sch.csv
  columns:
    SectorID: SectorID
    FlowUUID: FlowUUID
    FlowAmount: FlowAmount
  omit:
    - Unit
    - ReferenceCurrency
    - PriceType

CommodityUS:
  source: USdetailimportfactorsexio202017sch.csv
  columns:
    CommodityID: CommodityID
    FlowUUID: FlowUUID
    FlowAmount: FlowAmount

ImportSectorUS:
  source: Regionalsummaryimportfactorsexio202017sch.csv
  columns:
    CountryCode: CountryCode
    SectorID: SectorID
    FlowUUID: FlowUUID
    FlowAmount: FlowAmount

ImportCommodityUS:
  source: Regionaldetailimportfactorsexio202017sch.csv
  columns:
    CountryCode: CountryCode
    CommodityID: CommodityID
    FlowUUID: FlowUUID
    FlowAmount: FlowAmount

ImportContributionsUS:
  source: countrycontributionsby_sector.csv
  columns:
    CountryCode: CountryCode
    CommodityID: CommodityID (BEA Detail)
    ImportQuantity: ImportQuantity
    ContributionImportSector: ContributionImportSector
    ContributionImportCommodity: ContributionImportCommodity
    ContributionSector: ContributionSector
    ContributionCommodity: ContributionCommodity
  omit:
    - Country
    - Region
    - Unit
    - Source
    - BEA Summary

ImportMultiplierUS:
  source: multiplier_df_exio_2020_17sch.csv
  columns:
    CountryCode: CountryCode
    CommodityID: CommodityID
    FlowUUID: FlowUUID
    Footprint: Footprint
```

<!--
import yaml
import pandas as pd
import sqlalchemy
from sqlalchemy import create_engine, Table, MetaData

# Load the YAML file
with open('create-database.yaml', 'r') as file:
    config = yaml.safe_load(file)

# Create SQL Alchemy Engine
engine = create_engine('sqlite:///example.db')
metadata = MetaData()

# Function to convert column names to CamelCase without underscores
def to_camel_case(snake_str):
    components = snake_str.split('_')
    return components[0].capitalize() + ''.join(x.title() for x in components[1:])

# Process each table in the YAML configuration
for table_name, table_config in config.items():
    csv_file = table_config['source']
    df = pd.read_csv(csv_file)

    columns_map = table_config.get('columns', {})
    omit_columns = table_config.get('omit', [])

    # Drop omitted columns
    df.drop(columns=omit_columns, errors='ignore', inplace=True)

    # Rename columns as per the YAML configuration
    df.rename(columns=columns_map, inplace=True)

    # Generate new column names for remaining columns
    new_columns = {}
    for col in df.columns:
        if col not in columns_map.values():
            new_columns[col] = to_camel_case(col)
    df.rename(columns=new_columns, inplace=True)

    # Exclude 'Year' column if not explicitly included in columns_map
    if 'Year' not in columns_map.values() and 'Year' in df.columns:
        df.drop(columns=['Year'], inplace=True)

    # Append "US" to the table name
    table_name = table_name + "US"

    # Insert/Update the data into the database
    if engine.dialect.has_table(engine, table_name):
        # Update existing table
        temp_table_name = table_name + "_temp"
        df.to_sql(temp_table_name, engine, if_exists='replace', index=False)
        with engine.connect() as conn:
            conn.execute(f"""
                INSERT OR REPLACE INTO {table_name}
                SELECT * FROM {temp_table_name}
            """)
            conn.execute(f"DROP TABLE {temp_table_name}")
    else:
        # Create and insert new table
        df.to_sql(table_name, engine, if_exists='replace', index=False)
-->