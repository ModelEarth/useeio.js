# useeio.js
`useeio.js` is a JavaScript client API for the [USEEIO
API](https://github.com/USEPA/USEEIO_API) that runs in the browser. It is written in TypeScript and uses [rollup.js](https://rollupjs.org) with the [typescript2 plugin](https://www.npmjs.com/package/rollup-plugin-typescript2) to create a single UMD bundle; [terser](https://terser.org/) is then used to create a minified bundle.

View [Footprint Sample Links](footprint)

## Usage

`useeio.js` is not on `npmjs.org` yet but you can just install it from Github directly:

```
$ npm install git+https://github.com/USEPA/useeio.js.git
```

Alternatively, you can download and build it locally.
Warning: We are avoiding this currently since the `dist` folder gets deleted. An [issue has been posted](https://github.com/USEPA/useeio.js/issues/2).

You can contribute to the javascript in our [footprint](footprint) folder without building.

```bash
$ cd {some folder}
$ git clone https://github.com/USEPA/useeio.js.git
$ cd useeio.js
$ npm install
$ npm run build
```


## Dump API data locally
This project contains a script for downloading a JSON dump of an USEEIO-API instance:

```
$ node scripts/dumpjson.js --endpoint {URL}
```
Where `{URL}` is some API endpoint. Formerly https://smmtool.app.cloud.gov/api.
If the API requires a key, append --apikey [Add API key here]
You can [register for an API key](https://github.com/USEPA/USEEIO_API/wiki/Use-the-API) via the US EPA's contact link.

You can then host the json files locally, e.g. via [http-server](https://www.npmjs.com/package/http-server).  
The state json files are also pre-generated for you at [https://model.earth/OpenFootprint/impacts](https://model.earth/OpenFootprint/impacts)


```bash
# just install it once, globally
npm install http-server -g

# host the data folder on port 8080, allowing CORS
http-server ./data -p 8080 --cors

# Alternative
http-server ../OpenFootprint/impacts/2020 -p 8080 --cors
```