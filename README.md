# ds-engine
A dating simulator (i mean visual novel) game engine written for the web

## Installation
No install necessary! Go to [the game loader](http://saltyJeff.github.io/ds-engine/) and point the
game folder to the location of your game (or just the pre-filled demo game) and let
the magic of AJAX happen.

## Installation (for devs)
1. Clone the repo
2. Run yarn (or NPM)
3. Run `npm start` to run the dev server (puts all the files in a `dist` folder) or `npm run build` to build the files (puts all the files in a `docs` folder)

*the default location for the built files is `docs` since github-pages won't let you put HTML anywhere else*

## Creating a game
Check out the wiki page! You can get started on the "Getting Started" page with the folder structure.

Also check out `/docs/demo` for the sample project source

## Features
This engine is meant for formulaic visual novels. A game designer would not have to touch a single line of code as
all the configuration happens in YAML files for ease of editing.

* Supports both graphics and audio
* Uses an intuitive finite state machine
* Includes a game save mechanic
* Allows execution of arbitrary JS
	- Q: Isn't it incredibly irresponsible to load arbitrary code from an untrusted source?
	- A: Hell yeah, but I'm too lazy to make a DSL. If you see a prompt for any private information DO NOT DO IT. Exercise due dilligence and make sure you trust the game!

## Talk Nerdy to Me
Built with love off ReactJS, the parcel-bundler, mobx, and Typescript. Open to pull requests!


