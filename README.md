# Sisense Sankey widget

This source repo has a copy of the Sankey widget released by Sisense developer, Eli. The reference can be found [here]
(https://support.sisense.com/entries/45935590-Sankey-diagram-custom-widget).

The Sankey widget is a `d3.js` widget that is wrapped in Sisense widget code. Accordingly, the code's operation can
be viewed within a purely web environment (HTML + CSS + javascript) or within the Sisense environment.

The code has been updated to version 3.5.16 of d3.min.js. In addition, there are fixes from the d3.js repo for rendering data with cycles.

## data/
This directory has sample data to use with a Sisense data cube.

## src/
This directory has the source code for the Sisense widget. In addition, there is an HTML test driver named `test.html` that can be used
to compare the rendering in Sisense with the rendering of the d3 widget in HTML. (In the current version, there is a difference in the
rendering that needs to be fixed.)

## src/test.html
To use this for debugging, run a python server in a console to serve up the HTML file:
```
% python -m SimpleHTTPServer
Serving HTTP on 0.0.0.0 port 8000 ...
```

Then you can get the file rendered in the browser from `http://localhost:8000/test.html`.
