# Sisense Sankey widget

This source repo has a copy of the Sankey widget released by Sisense developer, Eli. The reference can be found [here]
(https://support.sisense.com/entries/45935590-Sankey-diagram-custom-widget).

The code has been updated to version 3.5.16 of d3.min.js. In addition, there are fixes from the d3.js repo for rendering data with cycles.

## data/
This directory has sample data to use with a Sisense data cube.

## src/
This directory has the source code for the Sisense widget. In addition, there is an HTML test driver named `test.html` that can be used
to compare the rendering in Sisense with the rendering of the d3 widget in HTML. (In the current version, there is a difference in the
rendering that needs to be fixed.)
