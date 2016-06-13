function mean(vec) {
    var sum = 0;
    var len = vec.length;
    
    var i;
    for (i = 0; i < len; ++i) {
        sum += vec[i];
    }
    
    return sum / len;
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function calcResult() {
    var soundLevels = [Number(document.getElementById("sound1").value),
                       Number(document.getElementById("sound2").value),
                       Number(document.getElementById("sound3").value),
                       Number(document.getElementById("sound4").value),
                       Number(document.getElementById("sound5").value)];
    
    var meanSound = round(mean(soundLevels), 1);
    
    document.getElementById("meanSound").value = meanSound + " dBA";
    document.getElementById("soundScore").value = round( ( (meanSound - 80) / 40 ) * 10, 1 ) + " / 10";
}