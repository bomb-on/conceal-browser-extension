# Conceal Browser Extension

> Work in progress...

### Usage

Requirements:
 - NodeJS (v17 or higher)

#### Development

Clone repository:
```bash
git clone https://github.com/bomb-on/conceal-browser-extension
cd conceal-browser-extension

# optional, checkout specific tag
# git checkout tags/<tag> -b <branch>
```

Install project dependencies:
```bash
npm install
```

Run local development server:
```bash
npm start
```

Or build production-ready version and load it as a temporary extension in your browser from `build` folder`:
```bash
npm run build
```
[Load temporary add-on in Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#Trying_it_out)  
[Load unpacked extension in Chrome](https://developer.chrome.com/extensions/getstarted#manifest)
