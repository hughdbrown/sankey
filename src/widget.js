
prism.registerWidget("sankey", {
	name : "sankey",
	family : "d3",
	title : "sankey Diagram",
	iconSmall : "/plugins/sankeyWIdget/widget-24.png",
	styleEditorTemplate : null,
	style : {},
	// sizing must be stated
	sizing: {
		minHeight: 128, //header
		maxHeight: 2048,
		minWidth: 128,
		maxWidth: 2048,
		height: 640,
		defaultWidth: 512
	},
	data : {
		selection : [],
		defaultQueryResult : {},
		panels : [
			//dimension panel
			{
				name : 'nodes',
				type : 'visible',
				metadata : {
					types : ['dimensions'],
					maxitems : -1
				}
			},
			//measure panel
			{
				name : 'value',
				type : 'visible',
				metadata : {
					types : ['measures'],
					maxitems : 1
				}
			},
			{
				name: 'filters',
				type: 'filters',
				metadata: {
					types: ['dimensions'],
					maxitems: -1
				}
			}
		],
		allocatePanel : function (widget, metadataItem) {
			// measure
			if (prism.$jaql.isMeasure(metadataItem) && widget.metadata.panel("value").items.length === 0) {
				return "value";
			}
			// item
			else if (!prism.$jaql.isMeasure(metadataItem) && widget.metadata.panel("nodes").items.length < 3) {
				return "items";
			}
		},
		// returns true/ reason why the given item configuration is not/supported by the widget
		isSupported : function (items) {
			return this.rankMetadata(items, null, null) > -1;
		},
		// ranks the compatibility of the given metadata items with the widget
		rankMetadata : function (items, type, subtype) {
			var a = prism.$jaql.analyze(items);
			// require at least 2 dimensions of lat and lng and 1 measure
			if (a.dimensions.length >= 2 && a.measures.length == 1) {
				return 0;
			}
			return -1;
		},
		// populates the metadata items to the widget
		populateMetadata : function (widget, items) {
			var a = prism.$jaql.analyze(items);
			// allocating dimensions
			widget.metadata.panel("nodes").push(a.dimensions);
			widget.metadata.panel("value").push(a.measures);
			widget.metadata.panel("filters").push(a.filters);
		},
		// builds a jaql query from the given widget
		buildQuery : function (widget) {
			// building jaql query object from widget metadata
			var query = {
				datasource : widget.datasource,
				metadata : []
			};
			// pushing items
			widget.metadata.panel("nodes").items.forEach(function (item) {
				query.metadata.push(item);
			});
			// pushing data
			query.metadata.push(widget.metadata.panel("value").items[0]);
			// series - dimensions
			widget.metadata.panel('filters').items.forEach(function (item) {
				item = $$.object.clone(item, true);
				item.panel = "scope";
				query.metadata.push(item);
			});
			return query;
		},
		// prepares the widget-specific query result from the given result data-table
		processResult : function (widget, queryResult) {
		return queryResult;
		}
	},
	render : function (s, e) {
		/** variable declaration **/
		// widget element
		var $lmnt = $(e.element);
		var rawData = s.queryResult.$$rows; // results
		var headers = s.rawQueryResult.headers; // headers
			var data = {
				nodes : [], // nodes of diagram
				links : [] // links of the diagram
			}
			// indexes to access the raw data
			var indexes = {
				"source" : 0,
				"destination" : 1,
				"value" : headers.length - 1
			}
			var nodeLimit = 110;	// limit of source/destination target due to low performance on large amount records
			var nodesObj = {};
			var i = 0;
			var numOfSources = 0;
			var numofDests = 0;
			// create distinct nodes
			_.each(rawData, function(record, index){
				var source_key = record[indexes.source].text,
					dest_key = record[indexes.destination].text;
				if (nodesObj[source_key] == undefined) {
					nodesObj[source_key] = record;
					numOfSources++;
					data.nodes.push({node: i++, name: source_key});
				}
				if (nodesObj[dest_key] == undefined) {
					nodesObj[dest_key] = record;
					numofDests++;
					data.nodes.push({node: i++, name: dest_key});
				}
			})
			// verify amount of nodes
			if (numOfSources > nodeLimit|| numofDests > nodeLimit){
				alert('Exceeded limit of records('+nodeLimit+')');
				return null;
			}
			// create the links
			_.each(rawData,function(row, index){
				var link = {};
				//retrieve the link source
				link.source = _.find(data.nodes, function(node){
					return node.name == row[indexes.source].text;
				}).node;
				//retrieve the link destinations
				link.target = _.find(data.nodes, function(node){
					return node.name == row[indexes.destination].text;
				}).node;
				//retrieve the link value
				link.value = row[indexes.value].data;
				//retrieve the link info
				if (indexes.value > 2){
					link.info = "";
					for(var i = 2; i< indexes.value ; i++){
						link.info += headers[i] + " - " + row[i].text + "\n";
					}
				}
				if (link.source != undefined && link.value != undefined && link.target != undefined)
				{
					data.links.push(link);
				}
			});
			/** Diagram loading **/
			/* sankey diagram properties */
			//width and height of the diagram
		var margin = {top: 1, right: 1, bottom: 6, left: 1},
			width = $lmnt.width() - margin.left - margin.right,
			height = $lmnt.height() - margin.top - margin.bottom;
		var formatNumber = d3.format(",.0f"),
			format = function(d) { return formatNumber(d) + ""; },
			color = d3.scale.category20();
		//clear the container
		$lmnt.empty();
		// create svg element and apply the properites on it
		var svg = d3.select($lmnt[0]).append("svg")
		//.attr("width", $lmnt.width())
		//.attr("height", $lmnt.height())
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		  .append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		// load sankey instance
		var sankey = d3.sankey()
			.nodeWidth(10)
			.nodePadding(5)
			.size([width, height]);
		var path = sankey.link();
		// load sankey data
		  sankey
			  .nodes(data.nodes)
			  .links(data.links)
			  .layout(32);
		  var link = svg.append("g").selectAll(".link")
			  .data(data.links)
			.enter().append("path")
			  .attr("class", "link")
			  .attr("d", path)
			  .style("stroke-width", function(d) { return Math.max(1, d.dy); })
			  .sort(function(a, b) { return b.dy - a.dy; });
		  link.append("title")
			  .text(function(d) {
					return d.source.name + " → " + d.target.name +": " + d.value + (d.info ? "\n" + d.info : "") ;
				});
		  var node = svg.append("g").selectAll(".node")
			  .data(data.nodes)
			.enter().append("g")
			  .attr("class", "node")
			  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			.call(d3.behavior.drag()
			  .origin(function(d) { return d; })
			  .on("dragstart", function() { this.parentNode.appendChild(this); })
			  .on("drag", dragmove));
		  node.append("rect")
			  .attr("height", function(d) { return d.dy; })
			  .attr("width", sankey.nodeWidth())
			  .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
			  .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
			.append("title")
			  .text(function(d) { return d.name + "\n" + format(d.value); });
		  node.append("text")
			  .attr("x", -6)
			  .attr("y", function(d) { return d.dy / 2; })
			  .attr("dy", ".35em")
			  .attr("text-anchor", "end")
			  .attr("transform", null)
			  .text(function(d) { return d.name; })
			.filter(function(d) { return d.x < width / 2; })
			  .attr("x", 6 + sankey.nodeWidth())
			  .attr("text-anchor", "start");
		function dragmove(d) {
			d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
			sankey.relayout();
			link.attr("d", path);
		}
	},
	destroy : function (s, e) {}
});
