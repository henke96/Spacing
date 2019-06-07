const HTML_RESULT_ID = "result";
const HTML_WAVE_ID = "wave";
const HTML_SPAWNTIME_ID = "spawntime";
const HTML_DEATHTIME_ID = "deathtime";
const HTML_NUMFOOD_ID = "numfood";
const HTML_HEALERHP_ID = "healerhp";

function setResult(res) {
	document.getElementById(HTML_RESULT_ID).textContent = res;
}

function verifySpawnTime(spawnTime) {
	if (!Number.isInteger(spawnTime)) {
		setResult("Invalid spawn time.");
		return false;
	}
	
	if (spawnTime % 6 !== 0) {
		setResult("Spawn time has to be a multiple of 6 seconds.");
		return false;
	}
	
	if (spawnTime < 12) {
		setResult("Spawn time can't be below 12 seconds. (The first healer should be set as 12 seconds)");
		return false;
	}
	
	return true;
}

function verifyDeathTime(deathTime, spawnTime) {
	if (!Number.isInteger(deathTime)) {
		setResult("Invalid death time.");
		return false;
	}
	
	if (deathTime % 3 !== 0) {
		setResult("Death time has to be a multiple of 3 seconds.");
		return false;
	}
	
	if (deathTime < spawnTime + 3) {
		setResult("Death time has to be atleast 3 seconds after spawn time.");
		return false;
	}
	
	return true;
}

function verifyNumFood(numFood) {
	if (!Number.isInteger(numFood)) {
		setResult("Invalid number of food.");
		return false;
	}
	
	if (numFood < 1) {
		setResult("Need atleast 1 food.");
		return false;
	}
	
	if (numFood > 1000) {
		setResult("Can have max 1000 food.");
		return false;
	}
	
	return true;
}

function calculateDeathTime(poisonAfters, healerHp) {
	let spawnTime = poisonAfters[0];
	let currentTime = spawnTime;
	let poisonIndex = 0;
	let currentStrength = 4;
	let currentStrengthCount = 0;
	let nextRegen = currentTime + 60;
	
	while (true) {
		while (poisonIndex < poisonAfters.length && poisonAfters[poisonIndex] === currentTime) {
			healerHp -= 4;
			currentStrengthCount = 0;
			currentStrength = 4;
			++poisonIndex;
		}
		
		if (currentTime === nextRegen) {
			++healerHp;
			nextRegen += 60;
		}
		
		currentTime += 3;
		healerHp -= currentStrength;
		if (++currentStrengthCount === 5) {
			if (--currentStrength < 0) currentStrength = 0;
			currentStrengthCount = 0;
		}
		
		if (healerHp <= 0) return currentTime;
		else if (poisonIndex === poisonAfters.length && currentStrength === 0) return -1;
	}
}

function optimizeUntil(spawnTime, untilTime, numFood) {
	let poisonAfters = [];
	
	let currentTime = spawnTime;
	while (numFood) {
		poisonAfters.push(currentTime);
		let ticksRemaining = (untilTime - currentTime) / 3;
		let ticksTilNext = Math.min(Math.trunc(ticksRemaining / numFood), 20);
		currentTime += ticksTilNext * 3;
		--numFood;
	}
	
	return poisonAfters;
}

function calculate() {
	var healerHp = Number(document.getElementById(HTML_WAVE_ID).value);
	document.getElementById(HTML_HEALERHP_ID).textContent = "(" + healerHp + " hp)";
	
	var spawnTime = Number(document.getElementById(HTML_SPAWNTIME_ID).value);
	if (!verifySpawnTime(spawnTime)) return;
	
	var deathTime = Number(document.getElementById(HTML_DEATHTIME_ID).value);
	if (!verifyDeathTime(deathTime, spawnTime)) return;
	
	var numFood = Number(document.getElementById(HTML_NUMFOOD_ID).value);
	if (!verifyNumFood(numFood)) return;
	
	let poisonAfters = optimizeUntil(spawnTime, deathTime, numFood);
	let actualDeathTime = calculateDeathTime(poisonAfters, healerHp);
	if (actualDeathTime === -1 || actualDeathTime > deathTime) {
		setResult("Not enough food.");
		return;
	}
	
	let lastFoodAfter = poisonAfters.pop();
	if (numFood > 1) {
		while (lastFoodAfter > spawnTime) {
			let newLastFoodAfter = lastFoodAfter - 3;
			poisonAfters = optimizeUntil(spawnTime, newLastFoodAfter, numFood - 1);
			poisonAfters.push(newLastFoodAfter);
			actualDeathTime = calculateDeathTime(poisonAfters, healerHp);
			if (actualDeathTime === -1 || actualDeathTime > deathTime) break;
			lastFoodAfter = newLastFoodAfter;
		}
	}
	setResult("Last food after " + lastFoodAfter + " seconds.");
}