# useeio.js
`useeio.js` is a JavaScript client API for the [USEEIO
API](https://github.com/USEPA/USEEIO_API) that runs in the browser. It is written in TypeScript and uses [rollup.js](https://rollupjs.org) with the [typescript2 plugin](https://www.npmjs.com/package/rollup-plugin-typescript2) to create a single UMD bundle; [terser](https://terser.org/) is then used to create a minified bundle.

View [Footprint Sample Links](footprint)

## Impact Reports

You can contribute to the javascript reports in our [footprint](footprint) folder without building.

## Build Usage

When model versions change, you can build useeio.min.js locally to update it in [io charts](https://model.earth/io/charts/).

<!--
Warning: We are avoiding this currently since the `dist` folder gets deleted. An [issue has been posted](https://github.com/USEPA/useeio.js/issues/2).
-->

<!-- npm install was required after updates for tsconfig.js and package.js to resolve https://github.com/USEPA/useeio.js/issues/2

We could show this after package-lock.json is updated in parent repo.
`npm ci` (clean install) is similar to `npm install`, but doesn't modify the package-lock.json. If dependencies in the package lock do not match those in package.json, npm ci will exit with an error, instead of updating the package lock.  If you're upgrading, npm install will make a lot of changes in package-lock.json.
-->

To build, run the following in the useeio.js folder.

	npm install
	npm run build


## Install option

`useeio.js` is not on `npmjs.org` yet but you can just install it from Github directly:

	npm install git+https://github.com/USEPA/useeio.js.git

<!-- Not sure when we'd do the above command -->

## Dump API data locally
This project contains a script for downloading a JSON dump of an USEEIO-API instance:

	node scripts/dumpjson.js --endpoint {URL}

Where `{URL}` is some API endpoint. Formerly https://smmtool.app.cloud.gov/api.
If the API requires a key, append --apikey [Add API key here]
You can [register for an API key](https://github.com/USEPA/USEEIO_API/wiki/Use-the-API) via the US EPA's contact link.


The 50 state json files are pre-generated for you at [https://model.earth/OpenFootprint/impacts](https://model.earth/OpenFootprint/impacts)

Model.earth developers use the following [http-server setup steps](https://model.earth/localsite/start/steps/) with port 8887.

Alternatively you can host the json files via [npm http-server](https://www.npmjs.com/package/http-server) and the following: 


```bash
# just install it once, globally
npm install http-server -g

# host the data folder on port 8080, allowing CORS
http-server ./data -p 8080 --cors

# Alternative
http-server ../OpenFootprint/impacts/2020 -p 8080 --cors
```