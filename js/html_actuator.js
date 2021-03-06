function HTMLActuator() {
	this.tileContainer    = document.querySelector(".tile-container");
	this.scoreContainer   = document.querySelector(".score-container");
	this.bestContainer    = document.querySelector(".best-container");
	this.messageContainer = document.querySelector(".game-message");

	this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
	var self = this;

	window.requestAnimationFrame(function () {
		self.clearContainer(self.tileContainer);

		grid.cells.forEach(function (column) {
			column.forEach(function (cell) {
				if (cell) {
					self.addTile(cell);
				}
			});
		});

		self.updateScore(metadata.score);
		self.updateBestScore(metadata.bestScore);

		if (metadata.terminated) {
			if (metadata.over) {
				self.message(false); // You lose
			} else if (metadata.won) {
				self.message(true); // You win!
			}
		}

	});
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
	if (typeof ga !== "undefined") {
		ga("send", "event", "game", "restart");
	}

	this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

HTMLActuator.prototype.addTile = function (tile) {
	var self = this;

	var wrapper   = document.createElement("div");
	var inner     = document.createElement("div");
	var position  = tile.previousPosition || { x: tile.x, y: tile.y };
	var positionClass = this.positionClass(position);
	var arrowClass = this.arrowClass(tile);

	// We can't use classlist because it somehow glitches when replacing classes
	var classes = ["tile", "tile-" + tile.value, positionClass, arrowClass];
	for (var i = 2; i <= 2048; i *= 2) {
		if (tile.value >= i) {
			classes[1] = "tile-" + i;
		}
	}

	if (tile.value >= 4096) classes.push("tile-super");

	this.applyClasses(wrapper, classes);

	inner.classList.add("tile-inner");
	if (tile.value == -1) {
		inner.innerHTML = "&phi;";
	} else if (tile.value == -2) {
		inner.innerHTML = "&sigma;";
	} else {
		inner.innerHTML = tile.value;
	}

	if (tile.previousPosition) {
		// Make sure that the tile gets rendered in the previous position first
		window.requestAnimationFrame(function () {
			classes[2] = self.positionClass({ x: tile.x, y: tile.y });
			self.applyClasses(wrapper, classes); // Update the position
		});
	} else if (tile.mergedFrom) {
		classes.push("tile-merged");
		this.applyClasses(wrapper, classes);

		// Render the tiles that merged
		tile.mergedFrom.forEach(function (merged) {
			merged['merge-0'] = merged['merge-1'] = merged['merge-2'] = merged['merge-3'] = false;
			self.addTile(merged);
		});
	} else {
		classes.push("tile-new");
		this.applyClasses(wrapper, classes);
	}

	// Add the inner part of the tile to the wrapper
	wrapper.appendChild(inner);

	// Put the tile on the board
	this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
	element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
	return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
	position = this.normalizePosition(position);
	return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.arrowClass = function (tile) {
	var classes = [];
	var map = {
		0: 'up',
		1: 'right',
		2: 'down',
		3: 'left'
	};

	for (var direction = 0; direction < 4; direction++) {
		if (tile['merge-' + direction] === true) {
			classes.push('arrow-' + map[direction]);
		};
	}
	return classes.join(' ');
};

HTMLActuator.prototype.updateScore = function (score) {
	this.clearContainer(this.scoreContainer);

	var difference = score - this.score;
	this.score = score;

	this.scoreContainer.textContent = this.score;

	if (difference > 0) {
		var addition = document.createElement("div");
		addition.classList.add("score-addition");
		addition.textContent = "+" + difference;

		this.scoreContainer.appendChild(addition);
	}
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
	this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
	var type    = won ? "game-won" : "game-over";
	var message = won ? "You win!" : "Game over!";

	if (typeof ga !== "undefined") {
		ga("send", "event", "game", "end", type, this.score);
	}

	this.messageContainer.classList.add(type);
	this.messageContainer.getElementsByTagName("p")[0].textContent = message;

	twttr.widgets.load();
};

HTMLActuator.prototype.clearMessage = function () {
	// IE only takes one value to remove at a time.
	this.messageContainer.classList.remove("game-won");
	this.messageContainer.classList.remove("game-over");
};

