// per fiets tanden voor en achter ingeven
// wheel size constant

// Bike data can not be changed at the moment
// CURRENT SIMULATION ONLY TWO GEARS
var bikeData = [
  {
    name: "Nuvinci",
    gearRatios: [0.5, 1.8]
  },
  {
    name: "Nexus 8",
    gearRatios: [0.527, 1.615]
  },
  {
    name: "Nexus 7",
    gearRatios: [0.632, 1.545]
  },
    {
        name: "Nexus 3",
        gearRatios: [0.733, 1.364]
    },
    {
        name: "Rohloff 14",
        gearRatios: [0.279, 1.467]
    }
];

// bike names in seperate vector for use of plot flexible function
//var bikeNames = [];
//for (i=0; i<bikeData.length; i++) {
//  bikeNames.push(bikeData[i].name);
//}

// Init data for speed plot, changed by updateData
var plotData = [
  {
    name: "Nuvinci",
    small: 5,
    big: 10
  },
  {
    name: "Nexus 8",
    small: 5,
    big: 10
  },
  {
    name: "Nexus 7",
    small: 5,
    big: 10
  },
  {
    name: "Nexus 3",
    small: 5,
    big: 10
  },
  {
    name: "Rohloff 14",
    small: 5,
    big: 10
  }
];


plotModule.add(plotData);

function update() {
  var wheelSize = document.getElementById("wheelSize").value;
  var front = document.getElementById("front").value;
  var back = document.getElementById("back").value;

  var msg = "Wheel size: " + wheelSize + " front " + front + " back " + back;
  console.log(msg);
    
    for(var i = 0; i < bikeData.length; ++i) {
        var wheelCirc = parseInt(wheelSize) * 0.0254 * 3.1415; // 0.0254 meter per inch
        
        var totalRatioSmall = bikeData[i].gearRatios[0] * parseInt(front) / parseInt(back);
        var small = wheelCirc * totalRatioSmall * 50 / 60 * 3.6; // 50 rpm / 60 seconds per minute(3.6 to km/h)
        
        var totalRatioBig = bikeData[i].gearRatios[1] * parseInt(front) / parseInt(back);
        var big = wheelCirc * totalRatioBig * 70 / 60 * 3.6; // 50 rpm / 60 seconds per minute(3.6 to km/h)
        
        plotData[i].small = small;
        plotData[i].big = big;
    }
    
  //plotModule.add(bikeNames, speedData);
  plotModule.update(plotData, "plot1");
}

update();
