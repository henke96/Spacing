const HTML_RESULT_ID = "result";
const HTML_WAVE_ID = "wave";
const HTML_SPAWNTIME_ID = "spawntime";
const HTML_DEATHTIME_ID = "deathtime";
const HTML_NUMFOOD_ID = "numfood";
const HTML_HEALERHP_ID = "healerhp";

function setResult(res) {
    document.getElementById(HTML_RESULT_ID).textContent = res;
}

function calculate() {
    var healerHP = Number(document.getElementById(HTML_WAVE_ID).value);
    document.getElementById(HTML_HEALERHP_ID).textContent = "(" + healerHP + " hp)";
    
    var spawnTime = Number(document.getElementById(HTML_SPAWNTIME_ID).value);
    if (isNaN(spawnTime) || spawnTime < 12 || spawnTime % 6 !== 0) {
        setResult("Invalid spawn time (has to be a multiple of 6 seconds).");
        return;
    }
    
    var dieTime = Number(document.getElementById(HTML_DEATHTIME_ID).value);
    if (isNaN(dieTime) || dieTime < 15 || dieTime % 3 !== 0) {
        setResult("Invalid death time (has to be a multiple of 3 seconds).");
        return;
    }
    
    if (dieTime <= spawnTime) {
        setResult("Death before spawning :thinking:");
        return;
    }
    
    var numFood = Number(document.getElementById(HTML_NUMFOOD_ID).value);
    if (isNaN(numFood) || numFood < 1) {
        setResult("Invalid number of food.");
        return;
    }
    
    var poisonTicks = (dieTime - spawnTime) / 3;
    var maxDamage = (numFood + poisonTicks) * 4;
    var overkill = maxDamage - healerHP;
    if (overkill < 0) {
        setResult("Not enough food.");
        return;
    }
    
    var numThrees = overkill;
    var numTwos = 0;
    var numOnes = 0;
    var numZeros = 0;
    if (numThrees > 5) {
        numThrees = 5;
        overkill -= 5;
        numTwos = Math.trunc(overkill / 2);
        if (numTwos > 5) {
            numTwos = 5;
            overkill -= 10;
            numOnes = Math.trunc(overkill / 3);
            if (numOnes > 5) {
                numOnes = 5;
                overkill -= 15;
                numZeros = Math.trunc(overkill / 4);
            }
        }
    }

    var lastFoodAfter = poisonTicks - 5 - numThrees - numTwos - numOnes - numZeros;
    if (lastFoodAfter < 0) {
        lastFoodAfter = 0;
    } else if (lastFoodAfter > (numFood - 1) * 5) {
        setResult("Impossible spacing.");
        return;
    }
    
    setResult("Last food after " + (spawnTime + lastFoodAfter * 3) + " seconds.");
}