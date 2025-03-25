//Unlocks stuff
// Option values
const options = [
	"Negative Tag",
	"Foil Tag",
	"Holographic Tag",
	"Polychrome Tag",
	"Rare Tag",
	"Golden Ticket",
	"Mr. Bones",
	"Acrobat",
	"Sock and Buskin",
	"Swashbuckler",
	"Troubadour",
	"Certificate",
	"Smeared Joker",
	"Throwback",
	"Hanging Chad",
	"Rough Gem",
	"Bloodstone",
	"Arrowhead",
	"Onyx Agate",
	"Glass Joker",
	"Showman",
	"Flower Pot",
	"Blueprint",
	"Wee Joker",
	"Merry Andy",
	"Oops! All 6s",
	"The Idol",
	"Seeing Double",
	"Matador",
	"Hit the Road",
	"The Duo",
	"The Trio",
	"The Family",
	"The Order",
	"The Tribe",
	"Stuntman",
	"Invisible Joker",
	"Brainstorm",
	"Satellite",
	"Shoot the Moon",
	"Driver's License",
	"Cartomancer",
	"Astronomer",
	"Burnt Joker",
	"Bootstraps",
	"Overstock Plus",
	"Liquidation",
	"Glow Up",
	"Reroll Glut",
	"Omen Globe",
	"Observatory",
	"Nacho Tong",
	"Recyclomancy",
	"Tarot Tycoon",
	"Planet Tycoon",
	"Money Tree",
	"Antimatter",
	"Illusion",
	"Petroglyph",
	"Retcon",
	"Palette"
];
selectedOptions = Array(61).fill(true);

// Get references to elements
const openCheckboxesBtn = document.getElementById("openCheckboxesBtn");
const checkboxesOverlay = document.getElementById("checkboxesOverlay");
const checkboxesPopup = document.getElementById("checkboxesPopup");
const checkboxesContainer = document.getElementById("checkboxesContainer");
const submitBtn = document.getElementById("submitBtn");
const lockBtn = document.getElementById("lockBtn");
const unlockBtn = document.getElementById("unlockBtn");

// Function to create checkboxes
function createCheckboxes() {
	checkboxesContainer.innerHTML = "";
	const numColumns = 6;
	const optionsPerColumn = Math.ceil(options.length / numColumns);

	for (let i = 0; i < numColumns; i++) {
		const columnDiv = document.createElement("div");
		columnDiv.classList.add("checkbox-column");

		for (let j = i * optionsPerColumn; j < (i + 1) * optionsPerColumn && j < options.length; j++) {
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.value = options[j];
			checkbox.checked = selectedOptions[j]; // Set checkboxes as selected by default
			const label = document.createElement("label");
			label.textContent = options[j];
			label.prepend(checkbox);
			columnDiv.appendChild(label);
		}

		checkboxesContainer.appendChild(columnDiv);
	}
}

// Function to handle checkbox selections
function handleSubmit() {
	const checkboxes = checkboxesContainer.querySelectorAll('input[type="checkbox"]');
	selectedOptions = [];
	checkboxes.forEach((checkbox) => {
		selectedOptions.push(checkbox.checked);
	});
	console.log("Selected Options:", selectedOptions);
	// Do something with the selected options
	closeOverlay();
}
function handleLock() {
	const checkboxes = checkboxesContainer.querySelectorAll('input[type="checkbox"]');
	selectedOptions = [];
	checkboxes.forEach((checkbox) => {
		checkbox.checked = false;
	});
}
function handleUnlock() {
	const checkboxes = checkboxesContainer.querySelectorAll('input[type="checkbox"]');
	selectedOptions = [];
	checkboxes.forEach((checkbox) => {
		checkbox.checked = true;
	});
}

// Function to open the checkbox overlay
function openOverlay() {
	createCheckboxes();
	checkboxesOverlay.style.display = "block";
}

// Function to close the checkbox overlay
function closeOverlay() {
	checkboxesOverlay.style.display = "none";
}

// Event listeners
openCheckboxesBtn.addEventListener("click", openOverlay);
window.addEventListener("click", (event) => {
	if (event.target == checkboxesOverlay) {
		closeOverlay();
	}
});
submitBtn.addEventListener("click", handleSubmit);
lockBtn.addEventListener("click", handleLock);
unlockBtn.addEventListener("click", handleUnlock);

instantAnalysis = false;

const anteInput = document.getElementById("ante");
const cardsPerAnteInput = document.getElementById("cardsPerAnte");
const deckSelect = document.getElementById("deck");
const stakeSelect = document.getElementById("stake");
const versionSelect = document.getElementById("version");
const seedInput = document.getElementById("seed");
const analyzeButton = document.getElementById("analyzeButton");
const copyLinkButton = document.getElementById("copyButton");
const downloadButton = document.getElementById("downloadButton");
const outputBox = document.getElementById("outputBox");

// Add event listener for the "Copy Link" button
copyLinkButton.addEventListener("click", copyLink);

function copyLink() {
	const baseUrl = window.location.origin + window.location.pathname;
	const params = new URLSearchParams();

	// Hash the unlocks
	// Convert the array of booleans to a binary string
	const binaryString = selectedOptions.map((unlock) => (unlock ? "1" : "0")).join("");

	// Convert the binary string to a byte array
	const byteArray = [];
	for (let i = 0; i < binaryString.length; i += 8) {
		const byte = parseInt(binaryString.substr(i, 8), 2);
		byteArray.push(byte);
	}

	// Pad the byte array with a null byte if necessary
	if (binaryString.length % 8 !== 0) {
		const paddingBits = "0".repeat(8 - (binaryString.length % 8));
		const paddingByte = parseInt(`${binaryString.slice(-binaryString.length % 8)}${paddingBits}`, 2);
		byteArray.push(paddingByte);
	}

	// Encode the byte array to base64
	const base64Unlocks = btoa(String.fromCharCode.apply(null, byteArray));

	// Add non-default input values as URL parameters
	if (anteInput.value !== "8") params.append("ante", anteInput.value);
	if (cardsPerAnteInput.value !== "15,50,50,50,50,50,50,50") params.append("cardsPerAnte", cardsPerAnteInput.value);
	if (deckSelect.value !== "Red Deck") params.append("deck", deckSelect.value);
	if (stakeSelect.value !== "White Stake") params.append("stake", stakeSelect.value);
	if (versionSelect.value != "10106") params.append("version", versionSelect.value);
	if (seedInput.value !== "") params.append("seed", seedInput.value);
	if (base64Unlocks != "/////////x/4") params.append("unlocks", base64Unlocks);

	const url = `${baseUrl}?${params.toString()}`;

	// Copy the URL to the clipboard
	navigator.clipboard
		.writeText(url)
		.then(() => {
			// alert("Link copied to clipboard!");
		})
		.catch((err) => {
			console.error("Failed to copy link: ", err);
		});
}

downloadButton.addEventListener("click", () => {
	const filename = seedInput.value + "_analysis.txt";
	const content = outputBox.value;

	const blob = new Blob([content], { type: "text/plain" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();

	URL.revokeObjectURL(url);
});

// Add event listener to the "Analysis" button
analyzeButton.addEventListener("click", performAnalysis);

function performAnalysis() {
	// Get input values
	const ante = parseInt(anteInput.value, 10);
	const cardsPerAnte = cardsPerAnteInput.value.split(",").map(Number);
	const deck = deckSelect.value;
	const stake = stakeSelect.value;
	const version = parseInt(versionSelect.value);
	console.log("Version:", version);
	const seed = seedInput.value.toUpperCase().replace(/0/g, "O");

	output = "";

	// It's analysis time!
	var inst = new Immolate.Instance(seed);
	inst.params = new Immolate.InstParams(deck, stake, false, version);
	inst.initLocks(1, false, false);
	inst.lock("Overstock Plus");
	inst.lock("Liquidation");
	inst.lock("Glow Up");
	inst.lock("Reroll Glut");
	inst.lock("Omen Globe");
	inst.lock("Observatory");
	inst.lock("Nacho Tong");
	inst.lock("Recyclomancy");
	inst.lock("Tarot Tycoon");
	inst.lock("Planet Tycoon");
	inst.lock("Money Tree");
	inst.lock("Antimatter");
	inst.lock("Illusion");
	inst.lock("Petroglyph");
	inst.lock("Retcon");
	inst.lock("Palette");
	for (let i = 0; i < options.length; i++) {
		if (selectedOptions[i] == false) inst.lock(options[i]);
	}
	inst.setStake(stake);
	inst.setDeck(deck);
	var ghostDeck = deck == "Ghost Deck";
	for (let a = 1; a <= ante; a++) {
		inst.initUnlocks(a, false);
		output += "==ANTE " + a + "==\n";
		output += "Boss: " + inst.nextBoss(a) + "\n";
		var voucher = inst.nextVoucher(a);
		output += "Voucher: " + voucher + "\n";
		inst.lock(voucher);
		// Unlock next level voucher
		for (let i = 0; i < Immolate.VOUCHERS.size(); i += 2) {
			if (Immolate.VOUCHERS.get(i) == voucher) {
				// Only unlock it if it's unlockable
				if (selectedOptions[options.indexOf(Immolate.VOUCHERS.get(i + 1))]) {
					inst.unlock(Immolate.VOUCHERS.get(i + 1));
				}
			}
		}
		output += "Tags: " + inst.nextTag(a) + ", " + inst.nextTag(a) + "\n";

		output += "Shop Queue: \n";
		for (let q = 1; q <= cardsPerAnte[a - 1]; q++) {
			output += q + ") ";
			var item = inst.nextShopItem(a);
			if (item.type == "Joker") {
				if (item.jokerData.stickers.eternal) output += "Eternal ";
				if (item.jokerData.stickers.perishable) output += "Perishable ";
				if (item.jokerData.stickers.rental) output += "Rental ";
				if (item.jokerData.edition != "No Edition") output += item.jokerData.edition + " ";
			}
			output += item.item + "\n";
			item.delete();
		}

		output += "\nPacks: \n";
		var numPacks = a == 1 ? 4 : 6;
		for (let p = 1; p <= numPacks; p++) {
			var pack = inst.nextPack(a);
			output += pack + " - ";
			var packInfo = Immolate.packInfo(pack);
			if (packInfo.type == "Celestial Pack") {
				var cards = inst.nextCelestialPack(packInfo.size, a);
				for (let c = 0; c < packInfo.size; c++) {
					output += cards.get(c);
					output += c + 1 != packInfo.size ? ", " : "";
				}
				cards.delete();
			}
			if (packInfo.type == "Arcana Pack") {
				var cards = inst.nextArcanaPack(packInfo.size, a);
				for (let c = 0; c < packInfo.size; c++) {
					output += cards.get(c);
					output += c + 1 != packInfo.size ? ", " : "";
				}
				cards.delete();
			}
			if (packInfo.type == "Spectral Pack") {
				var cards = inst.nextSpectralPack(packInfo.size, a);
				for (let c = 0; c < packInfo.size; c++) {
					output += cards.get(c);
					output += c + 1 != packInfo.size ? ", " : "";
				}
				cards.delete();
			}
			if (packInfo.type == "Buffoon Pack") {
				var cards = inst.nextBuffoonPack(packInfo.size, a);
				for (let c = 0; c < packInfo.size; c++) {
					var joker = cards.get(c);
					if (joker.stickers.eternal) output += "Eternal ";
					if (joker.stickers.perishable) output += "Perishable ";
					if (joker.stickers.rental) output += "Rental ";
					if (joker.edition != "No Edition") output += joker.edition + " ";
					output += joker.joker;
					joker.delete();
					output += c + 1 != packInfo.size ? ", " : "";
				}
				cards.delete();
			}
			if (packInfo.type == "Standard Pack") {
				var cards = inst.nextStandardPack(packInfo.size, a);
				for (let c = 0; c < packInfo.size; c++) {
					var card = cards.get(c);
					if (card.seal != "No Seal") output += card.seal + " ";
					if (card.edition != "No Edition") output += card.edition + " ";
					if (card.enhancement != "No Enhancement") output += card.enhancement + " ";
					var rank = card.base[2];
					if (rank == "T") output += "10";
					else if (rank == "J") output += "Jack";
					else if (rank == "Q") output += "Queen";
					else if (rank == "K") output += "King";
					else if (rank == "A") output += "Ace";
					else output += rank;
					output += " of ";
					var suit = card.base[0];
					if (suit == "C") output += "Clubs";
					else if (suit == "S") output += "Spades";
					else if (suit == "D") output += "Diamonds";
					else if (suit == "H") output += "Hearts";
					card.delete();
					output += c + 1 != packInfo.size ? ", " : "";
				}
				cards.delete();
			}
			output += "\n";
		}

		output += "\n";
	}

	inst.delete();

	// Update output box with analysis result
	outputBox.value = output;
}

window.addEventListener("DOMContentLoaded", () => {
	const seedInput = document.getElementById("seed");
	const cardsPerAnteInput = document.getElementById("cardsPerAnte");
	const anteInput = document.getElementById("ante");
	const deckInput = document.getElementById("deck");
	const stakeInput = document.getElementById("stake");
	const versionInput = document.getElementById("version");

	// Get seed value from URL parameters
	const urlParams = new URLSearchParams(window.location.search);
	const urlSeed = urlParams.get("seed");
	const urlAnte = urlParams.get("ante");
	const urlCardsPerAnte = urlParams.get("cardsPerAnte");
	const urlDeck = urlParams.get("deck");
	const urlStake = urlParams.get("stake");
	const urlVersion = urlParams.get("version");
	const urlUnlocks = urlParams.get("unlocks");

	if (urlUnlocks) {
		// Decode the base64 string
		const binaryString = atob(urlUnlocks)
			.split("")
			.map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
			.join("");

		// Remove the padding byte (if present)
		const paddingLength = binaryString.length % 8;
		const unpadded = paddingLength > 0 ? binaryString.slice(0, -paddingLength) : binaryString;

		// Convert the binary string back to an array of booleans
		const decodedUnlocks = unpadded.split("").map((bit) => bit === "1");
		selectedOptions = decodedUnlocks;
	}

	// Set default seed value
	if (urlAnte) {
		anteInput.value = urlAnte;
		anteInput.value = Math.min(anteInput.value, 999);
		anteInput.value = Math.max(anteInput.value, 1);
		cardsPerAnteInput.value = "15,50,50,50,50,50,50,50";
		var input = cardsPerAnteInput.value.split(",").map(Number);
		var fixedInput = [];
		for (let i = 0; i < anteInput.value; i++) {
			if (input.length < i) {
				fixedInput.push(0);
			} else {
				fixedInput.push(input[i]);
			}
			if (fixedInput[i] == undefined) fixedInput[i] = 0;
			if (isNaN(fixedInput[i])) fixedInput[i] = 0;
		}
		cardsPerAnteInput.value = fixedInput;
	}
	if (urlCardsPerAnte) {
		cardsPerAnteInput.value = urlCardsPerAnte;
		var input = cardsPerAnteInput.value.split(",").map(Number);
		var fixedInput = [];
		for (let i = 0; i < anteInput.value; i++) {
			if (input.length < i) {
				fixedInput.push(0);
			} else {
				fixedInput.push(input[i]);
			}
			if (fixedInput[i] == undefined) fixedInput[i] = 0;
			if (isNaN(fixedInput[i])) fixedInput[i] = 0;
		}
		cardsPerAnteInput.value = fixedInput;
	}
	if (urlDeck) {
		deckInput.value = urlDeck;
	}
	if (urlStake) {
		stakeInput.value = urlStake;
	}
	if (urlSeed) {
		seedInput.value = filterSeed(urlSeed);
		instantAnalysis = true;
	}
	if (urlVersion) {
		versionInput.value = urlVersion;
	}

	// Add event listener for input event
	seedInput.addEventListener("input", () => {
		seedInput.value = filterSeed(seedInput.value);
	});
	anteInput.addEventListener("input", () => {
		anteInput.value = Math.min(anteInput.value, 999);
		anteInput.value = Math.max(anteInput.value, 1);
		var input = cardsPerAnteInput.value.split(",").map(Number);
		var fixedInput = [];
		for (let i = 0; i < anteInput.value; i++) {
			if (input.length < i) {
				fixedInput.push(0);
			} else {
				fixedInput.push(input[i]);
			}
			if (fixedInput[i] == undefined) fixedInput[i] = 0;
			if (isNaN(fixedInput[i])) fixedInput[i] = 0;
		}
		cardsPerAnteInput.value = fixedInput;
	});
	cardsPerAnteInput.addEventListener("input", () => {
		var input = cardsPerAnteInput.value.split(",").map(Number);
		var fixedInput = [];
		for (let i = 0; i < anteInput.value; i++) {
			if (input.length < i) {
				fixedInput.push(0);
			} else {
				fixedInput.push(input[i]);
			}
			if (fixedInput[i] == undefined) fixedInput[i] = 0;
			if (isNaN(fixedInput[i])) fixedInput[i] = 0;
		}
		cardsPerAnteInput.value = fixedInput;
	});

	function filterSeed(seed) {
		const filteredSeed = seed
			.replace(/[^A-Za-z0-9]/g, "")
			.toUpperCase()
			.replace(/0/g, "O");

		// Truncate the seed if it's longer than 8 characters
		return filteredSeed.slice(0, 8);
	}
});
