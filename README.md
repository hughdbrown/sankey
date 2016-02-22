# Sisense Sankey widget

This source repo has a copy of the Sankey widget released by Sisense developer, Eli. The reference can be found [here]
(https://support.sisense.com/entries/45935590-Sankey-diagram-custom-widget).

The Sankey widget is a `d3.js` widget that is wrapped in Sisense widget code. Accordingly, the code's operation can
be viewed within a purely web environment (HTML + CSS + javascript) or within the Sisense environment.

The code has been updated to version 3.5.16 of d3.min.js. In addition, there are fixes from the d3.js repo for rendering data with cycles.

## data/
This directory has sample data to use with a Sisense data cube.

## src/
This directory has the source code for the Sisense widget.

