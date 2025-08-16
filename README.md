# useeio.js

The useeio.js repo contains a fast JSON front-end for state model data assembled in [USEEIO-R](https://github.com/USEPA/useeior).  HTML and JavaScript files can be edited directly in the [footprint folder](footprint) since running a build only occurs every few years (when new models are published by US EPA).

Files for the built useeio.js library reside in the src folder. It's written in TypeScript and uses [rollup.js](https://rollupjs.org) with the [typescript2 plugin](https://www.npmjs.com/package/rollup-plugin-typescript2) to create a single UMD bundle. [Terser](https://terser.org/) is then optionally used to create a minified bundle.

## Impact Reports

[Javascript reports for the US EPA's 50 state models](https://model.earth/useeio.js/footprint) reside in the [model.earth fork](https://github.com/modelearth/useeio.js) of the useeio.js repo.


## Build Comands

You can edit javascript and visualizations for the [State Impact Reports](https://model.earth/useeio.js/footprint) without running the build commands.

When new model versions are published by US EPA every few years, you can build useeio.js and useeio-widgets to deploy updates for the [USEEIO&nbsp;React&nbsp;Widgets](https://model.earth/io/charts/).

The useeio-widgets build pulls the bundle (dist/useeio.js or dist/useeio.min.js) from the useeio.js repo. 
The dependency resides in useeio-widgets/package.json. You can use either of these:

"useeio": "github:USEPA/useeio.js"  
"useeio": "github:modelearth/useeio.js"

To build useeio.js, run the following in the useeio.js folder.

	npm install
	npm run build

`npm ci` (clean install) is similar to `npm install`, but doesn't modify the package-lock.json. If dependencies in the package lock do not match those in package.json, npm ci will exit with an error, instead of updating the package lock.  If you're upgrading, npm install will make a lot of changes in package-lock.json.

<!--
Previous deletion of the `dist` folder has been [resolved]](https://github.com/USEPA/useeio.js/issues/2).
-->

If you'd like, you can generate a minified file with the following command.  
You may want to avoid minifying so you can see what lines any issues occur on.

	npm run build:minjs

## Install option

`useeio.js` is not on `npmjs.org`. Instead, you can install it from Github directly:

	npm install git+https://github.com/USEPA/useeio.js.git

As stated above, the useeio-widgets package.json contains a useeio.js dependency:

	"useeio": "github:USEPA/useeio.js"

## Dump API data locally
This project contains a script for downloading a JSON dump of an USEEIO-API instance:

	node scripts/dumpjson.js --endpoint {URL}

Where `{URL}` is some API endpoint. Formerly https://smmtool.app.cloud.gov/api.
If the API requires a key, append --apikey [Add API key here]
You can [register for an API key](https://github.com/USEPA/USEEIO_API/wiki/Use-the-API) via the US EPA's contact link.

## Loading of json files

The 50 state json files are pre-generated for you at [useeio-json/models](https://github.com/ModelEarth/useeio-json/tree/main/models)

1. D3 Detection in build from src/webapi.ts. Checks if D3 is already loaded on the page.
2. Automatic Loading: If D3 is missing, dynamically loads it from [CloudFlare CDN](https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js)
3. CORS-friendly Fetching: Uses D3's d3.json() method which handles CORS better than XMLHttpRequest
4. Graceful Fallback: If D3 loading or usage fails, falls back to the original XMLHttpRequest method which works only when useeio-json folder is adjacent to usseeio.js folder.

## Run on Github Page

Model.earth developers use the following [http-server setup steps](https://model.earth/localsite/start/steps/) with port 8887.

Alternatively you can host the json files via [npm http-server](https://www.npmjs.com/package/http-server) and the following:

```bash
# just install it once, globally
npm install http-server -g

# host the data folder on port 8080, allowing CORS
http-server ./data -p 8080 --cors

# Alternative
http-server ../useeio-json/models/2020 -p 8080 --cors
```