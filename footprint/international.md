
<h1>International Trade Flow</h1>
<b>US Bureau of Economic Analysis (BEA) + Exiobase International Trade Data</b>
Our SQL Team has been generating <a href="/OpenFootprint/prep/sql/supabase/">Supabase</a> and <a href="/OpenFootprint/prep/sql/duckdb/">DuckDB</a> databases for US Imports.


TO DO: Create [interactive versions](/OpenFootprint/impacts/) of the [three Exiobase charts](https://exiobase.eu)

TO DO: Update Exiobase pull to generate trade inflow CSV files for all countries by adding parameters to <a href="https://github.com/ModelEarth/USEEIO/tree/import_factors/import_factors_exio">generate\_import\_factors.py</a>. Send each country to a 2-char folder. Ruolin, Nancy, Yuhao.

TO DO: Generate for [US States from Matrix table files](/io/about/) with new [50 State USEEIO json](https://github.com/ModelEarth/OpenFootprint/tree/main/impacts/2020)

TO DO: <a href="/OpenFootprint/impacts/">More SQL and javascript</a>

<!--<a href="#reports">Our Javascript USEEIO TO DOs</a>-->
<!--<a href="/io/charts/">Our React USEEIO widget TO DOs</a>-->

<b>Pulling data into state SQL databases</b>
New simple table names - for use by elementary school students
<a href="/OpenFootprint/prep/sql/supabase/">Supabase Data Loader</a>
<a href="/OpenFootprint/prep/sql/duckdb/">DuckDB Data Loader</a>
<a href="/requests/products/">Harmonized System (HS) codes</a> - <a href="https://colab.research.google.com/drive/1etpn1no8JgeUxwLr_5dBFEbt8sq5wd4v?usp=sharing">Our HS CoLab</a>

<b>View SQL Data</b>
[Javascript with Supabase](/OpenFootprint/impacts) and [Just Tables](/OpenFootprint/prep/sql/supabase/SupabaseWebpage.html)
[Our DuckDB parquet tables in ObservableHQ](https://observablehq.com/d/2898d01446cefef1)
<a href="/OpenFootprint/impacts/">Sample of JavaScript joining DuckDB Parquet tables</a>
<a href="https://model.earth/storm/impact/process.html">SQL Documentation Sample - Storm Tweet Data</a>

<b>Python to pull CSV files into SQL</b>
<a href="https://colab.research.google.com/drive/1qWgO_UjeoYYB3ZSzT3QdXSfVZb7j09_S?usp=sharing">Generate Supabase Exiobase (Colab)</a> - <a href="https://github.com/ModelEarth/OpenFootprint/tree/main/impacts/exiobase/US-source">Bkup</a>
<a href="https://colab.research.google.com/drive/1Wm9Bvi9pC66xNtxKHfaJEeIYuXKpb1TA?usp=sharing">Generate DuckDB Exiobase (CoLab) - <a href="https://github.com/ModelEarth/OpenFootprint/tree/main/impacts/exiobase/US-source">Bkup</a>

<b>State Models - US Environmentally Extended Input-Output</b> (US EEIO)
<a href="/io/about/">USEEIO state models</a> - Upcoming SQL tables
<a href="https://colab.research.google.com/drive/1CYKNTnLiZ_PbP5WS_dMVtYyYDIAFwzq8?usp=sharing" target="useeio_colab">Generate Supabase USEEIO (CoLab)</a> - Upcoming python to migrate from matrix to SQL tables
<a href="/data-pipeline/research/economy/">Commodities for US and All 50 States (uses python to pull from matrix files)</a> - <a href="https://github.com/ModelEarth/OpenFootprint/tree/main/impacts/2020">2020 Data Source</a>
<!--
2019 data - Wes and Ben say to just host 2019 here
<a href="https://github.com/ModelEarth/USEEIO/tree/import_factors/import_factors_exio/output">Exiobase+BEA output for 2019</a>.
-->

# Our Trade Data Pipeline

We first generate six [US-2020-17schema CSV files](https://github.com/ModelEarth/OpenFootprint/tree/main/impacts/exiobase/US-source/2022) by running <a href="https://github.com/ModelEarth/USEEIO/tree/import_factors/import_factors_exio">generate\_import\_factors.py</a>. The merge combines US BEA and <a href="https://exiobase.eu">EXIOBASE</a> data emissions factors for annual trade data.

Exiobase provides the equivalent to <a href="https://github.com/USEPA/useeior/blob/master/format_specs/Model.md">M, N, and x</a> which is used in the <a href="/io/about/">USEEIO models</a> for import emissions factors. Exiobase also provides gross trade data which has no equivalent in USEEIO.



**Data Prep Notes**
- We remove underscores and use CamelCase for column names.
- We exclude the Year columns because each database is a different year.
- Commodity refers to the 6-character detail sectors.
- Sector refers to the 5-character and fewer sectors.
- Region is referred to as Import.
- National is omitted from the table names.
- Country abbreviations (Example: US) are appended to country-specific tables.
This structure supports pulling all the country data into one database.