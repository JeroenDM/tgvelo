var sectionHeading = (function(){
  var menu = d3.select("#menu");

  function addEnergy() {
    menu.append("li").append("a")
    .text("Energy")
    .attr("class", "sectionTitle")
    .attr("href", "performance_energy.html");
  }

  function addSafety() {
    menu.append("li").append("a")
    .text("Energy")
    .attr("class", "sectionTitle")
    .attr("href", "performance_safety.html");
  }

  function addUseability() {
    menu.append("li").append("a")
    .text("Energy")
    .attr("class", "sectionTitle")
    .attr("href", "performance_useability.html");
  }

return {
  addEnergy: addEnergy,
  addSafety: addSafety,
  addUseability
}

})();

var sections = (function() {

  // Cache html page elements
  var menu = d3.select("#menu");
  var sections = d3.selectAll("h2")

  // Add section title ids for linking from the menu
  sections.attr("id", function(d, i) {return this.innerHTML.replace(/ /g, '_');});

  function addSections() {
    for (i = 0; i < sections[0].length; i++) {
      menu.append("li").append("a")
        .attr("href", "#" + sections[0][i].id)
        .text(sections[0][i].innerHTML);
    }
  }

  return {
    addSections: addSections
  };

})();
