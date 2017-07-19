// module to manage bike sizing calculation
var sizeModule = (function () {
    
    var hscale = d3.scale.linear().domain([90, 45]).range([0, 188]);
    var len = {
        maxmax: 0,
        max: 0,
        min: 0,
        minmin: 0
    };
    var dat = {
        Hs: 0,
        Hzmin: 0,
        Hzmax: 0,
        Lsmin: 0,
        Lsmax: 0,
        Hzmin2: 0,
        Hzmax2: 0,
        Hsmin2: 0,
        Hsmax2: 0,
        Lsdl: 0,
        Lsdh: 0,
        Lsvl: 0,
        Lsvh: 0
    };
    
    function _parseValues() {
        dat.Hs = parseFloat( document.getElementById("Hs").value );
        dat.Hzmin = parseFloat( document.getElementById("Hzmin").value );
        dat.Hzmax = parseFloat( document.getElementById("Hzmax").value );
        dat.Lsmin = parseFloat( document.getElementById("Lsmin").value );
        dat.Lsmax = parseFloat( document.getElementById("Lsmax").value );
    }
    
    function _parseValues2() {
        dat.Hzmin2 = parseFloat( document.getElementById("Hzmin2").value );
        dat.Hzmax2 = parseFloat( document.getElementById("Hzmax2").value );
        dat.Hsmin2 = parseFloat( document.getElementById("Hsmin2").value );
        dat.Hsmax2 = parseFloat( document.getElementById("Hsmax2").value );
        
        dat.Lsdl = parseFloat( document.getElementById("Lsdl").value );
        dat.Lsdh = parseFloat( document.getElementById("Lsdh").value );
        dat.Lsvl = parseFloat( document.getElementById("Lsvl").value );
        dat.Lsvh = parseFloat( document.getElementById("Lsvh").value );
    }
    
    function _rughoek(l1, Ls, Hz, Hs) {
        // verhoudingen uit ergonomische tabellen
        // l1 = lichaamslengte
        var l35 = 0.26 * l1; // romplengte
        var l34 = 0.095 * l1; // kruis tot heup afstand
        var l17 = 0.42 * l1; // schouder tot posl afstand
        
        // tussenberekening
        var Hsz = Hs - Hz - l34;
        var ld = Math.sqrt(Ls*Ls + Hsz*Hsz);
        
        // hoek tussen hulplijn ld en horizon
        var a = Math.asin( Hsz / ld );
        // hoek tussen hulplijn ld en rug
        var b = Math.acos( (l35*l35 + ld*ld - l17*l17) / (2*l35*ld) );
        
        // hoek tussen rug en horizon in graden
        return (a+b) * 180 / Math.PI;
    }
    
    function calcSize() {
        var Lzmax = parseFloat( document.getElementById("Lzmax").value );
        var Lzmin = parseFloat( document.getElementById("Lzmin").value );

        if (Lzmin < 0 || Lzmin > 2) {
            alert("Lz laag moet tussen 0 en 2 meter zijn.")
        } else if (Lzmax < 0 || Lzmax > 2) {
            alert("Lz hoog moet tussen 0 en 2 meter zijn.")
        } else {
            len.maxmax = Math.round(Lzmax / 45 / 1.1 * 10000) / 100;
            len.max = Math.round(Lzmax / 48 / 1.1 * 10000) / 100;
            len.min = Math.round(Lzmin / 45 / 1.1 * 10000) / 100;
            len.minmin = Math.round(Lzmin / 48 / 1.1 * 10000) / 100;
            
            document.getElementById("maxmaxLengte").innerHTML = len.maxmax + " m";
            document.getElementById("maxLengte").innerHTML = len.max + " m";
            document.getElementById("minLengte").innerHTML = len.min + " m";
            document.getElementById("minminLengte").innerHTML = len.minmin + " m";
        }
    }
    
    function calcPost() {
        // get input values
        //------------------------------------------------------------------
        _parseValues();
        
        var lmin = (len.min + len.minmin) / 2;
        var lmax = (len.max + len.maxmax) / 2; 
        
        var gammaL = _rughoek(lmin, dat.Lsmin, dat.Hzmin, dat.Hs);
        var gammaH = _rughoek(lmax, dat.Lsmax, dat.Hzmax, dat.Hs);
        
        console.log("gamma laag: " + gammaL);
        console.log("gamma hoog: " + gammaH);
        
        if (gammaL > 90) {gammaL = 90};
        if (gammaH > 90) {gammaH = 90};
        
        d3.select(".arrow1").attr("transform", "translate(" + hscale(gammaL) + ",0)");
        d3.select(".arrow2").attr("transform", "translate(" + hscale(gammaH) + ",0)");
    }
    
    function calcPost2() {
        _parseValues2();
        
        var lmin = (len.min + len.minmin) / 2;
        var lmax = (len.max + len.maxmax) / 2;
        
        var gamma1 = _rughoek(lmin, dat.Lsdl, dat.Hzmin2, dat.Hsmin2);
        var gamma2 = _rughoek(lmax, dat.Lsdh, dat.Hzmax2, dat.Hsmin2);
        var gamma3 = _rughoek(lmin, dat.Lsvl, dat.Hzmin2, dat.Hsmax2);
        var gamma4 = _rughoek(lmax, dat.Lsvh, dat.Hzmax2, dat.Hsmax2);
        
        console.log("gamma 1: " + gamma1);
        console.log("gamma 2: " + gamma2);
        console.log("gamma 3: " + gamma3);
        console.log("gamma 4: " + gamma4);
        
        if (gamma1 > 90) {gamma1 = 90};
        if (gamma2 > 90) {gamma2 = 90};
        if (gamma3 > 90) {gamma3 = 90};
        if (gamma4 > 90) {gamma4 = 90};
        
        d3.select(".arrow12").attr("transform", "translate(" + hscale(gamma1) + ",0)");
        d3.select(".arrow22").attr("transform", "translate(" + hscale(gamma2) + ",0)");
        d3.select(".arrow32").attr("transform", "translate(" + hscale(gamma3) + ",0)");
        d3.select(".arrow42").attr("transform", "translate(" + hscale(gamma4) + ",0)");
    }
    
    return {
        calcSize: calcSize,
        calcPost: calcPost,
        calcPost2: calcPost2,
        dat: dat,
        len: len
    };
})();

sizeModule.calcSize();

/*

var Lsmin = parseFloat( document.getElementById("Lsmin").value );
    var Lsmax = parseFloat( document.getElementById("Lsmax").value );
    var Hzmin = parseFloat( document.getElementById("Hzmin").value );
    var Hzmax = parseFloat( document.getElementById("Hzmax").value );
    var Hsmin = parseFloat( document.getElementById("Hsmin").value );
    var Hsmax = parseFloat( document.getElementById("Hsmax").value );
    
    var hscale = d3.scale.linear().domain([0, 90]).range([4, 204]);
    
    var h1 = hscale(0);
    var h2 = hscale(30);
    var h3 = hscale(60);
    var h4 = hscale(90);
    d3.select(".arrow1").attr("transform", "translate(" + h1 + ",0)");
    d3.select(".arrow1").attr("transform", "translate(" + h2 + ",0)");
    d3.select(".arrow1").attr("transform", "translate(" + h3 + ",0)");
    d3.select(".arrow4").attr("transform", "translate(" + h4 + ",0)");
    
const UNIT = 80;
const WIDTH = 6 * UNIT;
const HEIGHT = 6 * UNIT;

var framePoints = (2.5*UNIT) + "," + (5*UNIT) + " " +
    (1.5*UNIT) + "," + (3.5*UNIT) + " " +
    (3*UNIT) + "," + (3.5*UNIT) + " " +
    (4*UNIT) + "," + (5*UNIT) + " " +
    (2.5*UNIT) + "," + (5*UNIT) + " " +
    (3*UNIT) + "," + (3.5*UNIT);

var handlebarPoints = (UNIT) + "," + (5*UNIT) + " " +
    (1.5*UNIT) + "," + (3.5*UNIT) + " " +
    (1.6*UNIT) + "," + (3.2*UNIT) + " " +
    (1.8*UNIT) + "," + (3.2*UNIT);

var svgBike = d3.select("#bike")
                .attr("width", WIDTH)
                .attr("height", HEIGHT);

svgBike.append("circle")
        .attr("cx", UNIT)
        .attr("cy", 5 * UNIT)
        .attr("r", UNIT - 6)
        .attr("stroke", "black")
        .attr("stroke-width", "3")
        .attr("fill", "none");

svgBike.append("circle")
        .attr("cx", 4 * UNIT)
        .attr("cy", 5 * UNIT)
        .attr("r", UNIT - 6)
        .attr("stroke", "black")
        .attr("stroke-width", "3")
        .attr("fill", "none");

svgBike.append("polyline")
        .attr("points", framePoints)
        .style("stroke", "black")
        .style("stroke-width", "3")
        .style("fill", "none");

svgBike.append("polyline")
        .attr("points", handlebarPoints)
        .style("stroke", "black")
        .style("stroke-width", "3")
        .style("fill", "none");
        */