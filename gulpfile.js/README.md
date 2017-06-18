## Ceraon Front End Build
---

### Commands Overview


To build all the front end assets and trigger the "watcher", run:

    gulp

To build all the JavaScript files, run:

    gulp browserify

To build the sass files into css files, run:

    gulp sass

To watch the static files and trigger either a `gulp sass` or a `gulp browserify`
when any relevant files change, run:

    gulp watch


### Commands detailed


The general idea of the build process is that it takes source files found in
`ceraon/static/src`, builds them appropriately, and delivers the built output
to the `ceraon/static/dest` directory.

For information on the configuration of the different build tasks, take a look
at the `gulpfile.js/config.js` file.
