# Using test.html for debugging

To use this for debugging, run a python server in a console to serve up the HTML file:
```
% python -m SimpleHTTPServer
Serving HTTP on 0.0.0.0 port 8000 ...
```

Then you can get the file rendered in the browser from `http://localhost:8000/test.html`.

The idea is that this isolates the `d3.js` behavior from Sisense plugin behavior. In the current version, there is a difference in the
rendering that needs to be fixed.