// Module for bikes data
//---------------------------------------------------------------------------
var bikes = (function() {
	var data = [];
	var selectedData = [];
	// give meaningfull initial maxScore
	var maxScore;

	// Define module functions
	function addBikes(newBikes) {
		data = data.concat(newBikes);
		selectedData = data;

		updateScore(sliders.getWeights());
		ranking.render();
		ranking.update();
	}
	function updateScore(w) {
		maxScore = 1; // reset maxScore before every change
		for (i = 0; i < data.length; i++) {
			data[i].score = Math.round(
				w[0] * data[i].performance
				+ w[1] * data[i].safety
				+ w[2] * data[i].useability
			);
			// track max score for scaling
			if (data[i].score > maxScore) {
				maxScore = data[i].score;
			};
		}
	}

	function getMaxScore() {
		return maxScore;
	}
	// hier het de param key in data private maken
	function getData() {
		return selectedData;
	}

	function updateSelection(minSpeed, maxSpeed, minNae) {
		selectedData = data.filter(function(x) {
			return (x.designSpeed >= minSpeed)
				&& (x.designSpeed < maxSpeed)
				&& (x.netAvailableEnergy > minNae);
		});
		ranking.render();
		ranking.update();
	}

	return {
		addBikes: addBikes,
		updateScore: updateScore,
		getMaxScore: getMaxScore,
		getData: getData,
		updateSelection: updateSelection
	};
})();
// Module for slider
//-----------------------------------------------------------------------------
var sliders = (function() {
	// chache dom elements with d3.select
	var $labels = [
		d3.select("#performance-slider-label"),
		d3.select("#safety-slider-label"),
		d3.select("#useability-slider-label")
	];
	var $sliders = [
		d3.select("#performance-slider"),
		d3.select("#safety-slider"),
		d3.select("#useability-slider")
	];

	var w = [1, 1, 1]; // array with initial slider values

	// Draw initial slider value
	for (i = 0; i < $labels.length; i++) {
		$labels[i].text(w[i]);
	}

	// Bind sliders to slider update function in this module
	for (i = 0; i < $sliders.length; i++) {
		$sliders[i].on("input", _update);
	}

	function _update() {
		// update slider values array (weights)
		w = [
			document.getElementById("performance-slider").value,
			document.getElementById("safety-slider").value,
			document.getElementById("useability-slider").value
		];
		// update labels with new weights
		for (i = 0; i < $sliders.length; i++) {
			$labels[i].text(w[i]);
		}
		//ranking based on new weights
		bikes.updateScore(w);
		ranking.update();
	}

	function getWeights() {
		return w;
	}

	return {
		getWeights: getWeights
	}
})();
//  Module for ranking board
// //---------------------------------------------------------------------------
var ranking = (function() {
	// Graphical parameters
	var h = 30; // height of the bike box
	var padding = 3; // padding between the boxes
	var canvas = d3.select("#ranking").append("svg")

	render();
	// Define module funtions
	// Render score board based on data in bikes module
	function render() {
		// Draw initial canvas to render elements in
		canvas.attr("width", "100%")
			.attr("height", (h + padding) * bikes.getData().length + 10)
			.attr("fill", "#3071A9");

		// draw bike rectangles
		var rect = canvas.selectAll("rect")
			.data(bikes.getData(),function(d) { return d.name; });
		rect.exit().remove();
		rect.enter()
			.append("rect")
			.attr("x", 0)
			.attr("y", function(d,i) {
				return i * (h + padding)
			})
			.attr("height", h)
			.attr("width", function(d) {
				return Math.round((d.score / bikes.getMaxScore()) * 100) + "%";
			})
			.attr("opacity", 0.7);
		// draw text labels on rectangles
		var text = canvas.selectAll("text")
			.data(bikes.getData(), function(d) { return d.name; });
		text.exit().remove();
		text.enter()
			.append("text")
			.text(function(d) {
				return d.name;
			})
			.attr("x", 10)
			.attr("y", function(d,i) {
				return i * (h + padding) + 20;
			})
			.attr("fill", "white")
			.attr("font-size", "20px");
	}
	function _sortItems(a, b) {
		return b.score - a.score;
	};
	// Update ranking based on scores in bikes
	function update() {
		canvas.selectAll("rect").sort(_sortItems)
			.transition()
			.duration(1000)
			.attr("x", 0)
			.attr("y", function(d,i) {
				return i * (h + padding)
			})
			.attr("width", function(d) {
				return Math.round((d.score / bikes.getMaxScore()) * 100) + "%";
			});

		canvas.selectAll("text").sort(_sortItems)
			.transition()
			.duration(1000)
			.attr("x", 10)
			.attr("y", function(d,i) {
				return i * (h + padding) + 20;
			});
	}
	// Reveal public functions
	return {
		update: update,
		render: render
	};
})();
// Module for form
// --------------------------------------------------------------------------
var form = (function() {

	var minSpeed = 0;
	var maxSpeed = 50;

	// Cache dom
	var $speedSlider = d3.select("#speedSlider");
	var $minSpeed = d3.select("#minSpeed");
	var $maxSpeed = d3.select("#maxSpeed");

	var $naeLabel = d3.select("#nae-slider-label");
	var $naeSlider = d3.select("#nae-slider");

	var $submit = d3.select("#submit");

	// draw speedSlider
	$speedSlider.call(d3.slider()
		.min(0).max(50).step(1)
		.value([0, 50])
		.on("slide", function(evt, value) {
			minSpeed = value[0];
			maxSpeed = value[1];
			$minSpeed.text(minSpeed);
			$maxSpeed.text(maxSpeed);
		}));
	$minSpeed.text(minSpeed);
	$minSpeed.style("color", "grey");
	$maxSpeed.text(maxSpeed);
	$maxSpeed.style("color", "grey")
		.style("display", "block")
		.style("float", "right");

	// bind inputs to functions
	$naeSlider.on("input", _updateLabel);
	$submit.on("click", _update);

	// Default labels
	$naeLabel.text($naeSlider.node().value);

	function _updateLabel(evt, value) {
		$naeLabel.text($naeSlider.node().value);
	}

	function _update() {
		bikes.updateSelection(minSpeed, maxSpeed, $naeSlider.node().value);
	}

})();
// Add example data and update site
// --------------------------------------------------------------------------
// read bikeData from csv file with d3
var bikesFromFile = ["test"];
var dataReady = 0;
d3.csv("bikeData.csv", function(csv) {
	bikes.addBikes(csv);
	ranking.update();
	drawTable();
});

function drawTable(){

	var table = d3.select("table");
	var heading = ["Name",
		"Performance",
		"Safety",
		"Useability",
		"Design Speed",
		"Net Available E"
	];	//.append("table")
	table.append("thead")
		.append("tr")
		.selectAll("th")
		.data(heading).enter()
		.append("th")
		.text(function(d) {return d;});
		//.attr("class", "table");

	// create table header
	var tr = table.append("tbody")
		.selectAll('tr')
    .data(bikes.getData()).enter()
    .append('tr');

	tr.append('td').html(function(m) { return m.name; });
	tr.append('td').html(function(m) { return m.performance; });
	tr.append('td').html(function(m) { return m.safety; });
	tr.append('td').html(function(m) { return m.useability; });
	tr.append('td').html(function(m) { return m.designSpeed; });
	tr.append('td').html(function(m) { return m.netAvailableEnergy; });
}
