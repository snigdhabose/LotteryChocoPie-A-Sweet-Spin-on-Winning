import kaboom from "kaboom"

const k = kaboom({
    width: 800,
    height: 800, // Make the canvas square for a 10x10 grid
    scale: 1,
    background: [212, 110, 179],
});

// Colors for characters
const colors = {
    red: rgb(255, 0, 0),
    blue: rgb(0, 0, 255),
    green: rgb(0, 255, 0),
    yellow: rgb(255, 255, 0),
};
const shapes = ["bean", "bobo", "btfly", "dino","ghosty"];

function getColorName(colorObj) {
    for (const [name, rgbValue] of Object.entries(colors)) {
        if (colorObj.r === rgbValue.r && colorObj.g === rgbValue.g && colorObj.b === rgbValue.b) {
            return name; // This returns 'red', 'blue', 'green', or 'yellow'
        }
    }
    return null; // If the color doesn't match any predefined color
}


// User selection
let currentShapeIndex = 0;
let currentColorKey = "red";

const gridSize = 5;
const cellSize = 600 / gridSize; // Assuming canvas width and height of 800

const userSelection = {
    sprite: "dino", // Example sprite
    color: "blue", // Example color
};

// Helper function to check for win condition
function checkForWin() {
    const cells = get("cell"); // Retrieve all cells
    for (const cell of cells) {
		console.log("cell",cell.name," ",userSelection.sprite," ",cell.color," ",colors[userSelection.color] )
        // Check if this cell has the user's selected shape and color
        if ((cell.name)==(userSelection.sprite)) {
            const cellColor = getColorName(cell.color);
		console.log("cell3333",cell.name," ",cell.color," ",cellColor," ",userSelection.color )
            if (colorEquals(cell.color, colors[userSelection.color])) {
				k.addKaboom(cell.pos)
				
                return true;
            }
        }
    }
    return false;
}

// Helper function to compare Kaboom.js color arrays
function colorEquals(colorA, colorB) {
    return colorA.r === colorB.r && colorA.g === colorB.g && colorA.b === colorB.b && colorA.a === colorB.a;
}

// Function to generate a single grid cell
function generateCell(x, y, shape, chosenColor) {
	const theSprite = shape;
    k.add([
        sprite(shape),
        pos(100 + x * cellSize, 100 + y * cellSize),  // Position at the top-left corner of the grid cell
        //scale(0.1), // Scale down the sprite to fit in the cell
        color(colors[chosenColor]), // Apply color transformation
        anchor("topleft"), // Set origin to top-left for correct positioning
        "cell", // Tag this game object as "cell" for potential future use
		shape,
		{ name: shape },
    ]);
}


// Function to generate the entire grid
function generateGrid() {
	
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const shape = choose(shapes);
            const chosenColor = choose(Object.keys(colors));
            generateCell(x, y, shape, chosenColor);
        }
    }
}

let curFont = 0
let curSize = 48
const pad = 24

k.loadSprite("bean", "sprites/bean.png")
k.loadSprite("bobo", "sprites/bobo.png");
k.loadSprite("bean", "sprites/bean.png");
k.loadSprite("btfly", "sprites/btfly.png");
k.loadSprite("dino", "sprites/dino.png");
k.loadSprite("ghosty", "sprites/ghosty.png");
k.loadSprite("mark", "sprites/mark.png");
k.loadSprite("mushroom", "sprites/mushroom.png");
k.loadSprite("pineapple", "sprites/pineapple.png");
k.loadSprite("sun", "sprites/sun.png");
k.loadSprite("watermelon", "sprites/watermelon.png");
k.loadSprite("choco-bg", "sprites/choco-bg.png");


k.scene("main", () => {
	k.add([
		text("[wavy]Lottery Choco Pie![/wavy]", {
			width: width(),
			styles: {
				"green": {
					color: rgb(128, 128, 255),
				},
				"wavy": (idx, ch) => ({
					color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
					pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
				}),
			},
		}),
		pos(pad+180, pad),
		anchor("topleft"),
		// scale(0.5),
	])
	k.add([
        sprite("choco-bg"),
        "cell", // Tag this game object as "cell" for potential future use
		scale(0.9),
		
    ]);
	
	k.add([
		text("[green]~ Made with 🍩 by Hackler[/green]", {
			width: width(),
			styles: {
				"green": {
					// color: rgb(128, 128, 255),
				},
				"wavy": (idx, ch) => ({
					color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
					pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
				}),
			},
		}),
		pos(740-pad, height() - pad),
		anchor("bot"),
		scale(0.4),
	])
	// reset cursor to default on frame start for easier cursor management
	onUpdate(() => setCursor("default"))
	
	function addButton(txt, p, f) {
	
		// add a parent background object
		const btn = add([
			rect(240, 80, { radius: 8 }),
			pos(p),
			area(),
			scale(1),
			anchor("center"),
			outline(4),
		])
	
		// add a child object that displays the text
		btn.add([
			text(txt),
			anchor("center"),
			color(0, 0, 0),
		])
	
		// onHoverUpdate() comes from area() component
		// it runs every frame when the object is being hovered
		btn.onHoverUpdate(() => {
			const t = time() * 10
			btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7)
			btn.scale = vec2(1.2)
			setCursor("pointer")
		})
	
		// onHoverEnd() comes from area() component
		// it runs once when the object stopped being hovered
		btn.onHoverEnd(() => {
			btn.scale = vec2(1)
			btn.color = rgb()
		})
	
		// onClick() comes from area() component
		// it runs once when the object is clicked
		btn.onClick(f)
	
		return btn
	
	}
	
	addButton("Start", vec2(400, 200), () => k.go("selector"))
	addButton("Credits", vec2(400, 300), () => debug.log("Prepared by Snigdha Bose and Kshitij Srivastava"))
})

k.scene("gridgame", () => {
    generateGrid();
	
    // After grid generation, check for win condition
    if (checkForWin()) {
        k.add([
            text("You Win!", 32),
            pos(width() / 2, height() / 2),
            anchor("center"),
        ]);
		
    } else {
        k.add([
            text("You Lose!", 32),
            pos(width() / 2, height() / 2),
            anchor("center"),
        ]);
    
	}

	k.onKeyPress("enter", () => {
        k.go("main")
    });
});


k.scene("selector", () => {
    // Display current selection
    const selectionDisplay = k.add([
        k.text(`${shapes[currentShapeIndex]} - ${currentColorKey}`),
        k.pos(k.width() / 2, 100),
        anchor("center"),
    ]);

	k.add([
        k.text("Use Arrow Keys to Change"),
        k.pos(k.width() / 2, k.height() - 50),
        anchor("center"),
        { size: 16 },
    ]);

	let characterSprite = k.add([
        k.sprite(shapes[currentShapeIndex]),
        k.pos(k.width() / 2, k.height() / 2),
        anchor("center"),
        k.color(colors[currentColorKey]),
    ]);

	function updateCharacterSprite() {
        // Update the sprite image
        characterSprite.use(k.sprite(shapes[currentShapeIndex]));
        // Update the color
        characterSprite.color = colors[currentColorKey];
    }


    // Function to update selection display
    function updateSelectionDisplay() {
        selectionDisplay.text = `${shapes[currentShapeIndex]} - ${currentColorKey}`;
		updateCharacterSprite();
    }

    // Cycle through shapes
    k.onKeyPress("right", () => {
        currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
        updateSelectionDisplay();
    });

    k.onKeyPress("left", () => {
        currentShapeIndex = (currentShapeIndex - 1 + shapes.length) % shapes.length;
        updateSelectionDisplay();
    });

    // Cycle through colors
    k.onKeyPress("up", () => {
        const colorKeys = Object.keys(colors);
        const currentColorIndex = colorKeys.indexOf(currentColorKey);
        currentColorKey = colorKeys[(currentColorIndex + 1) % colorKeys.length];
        updateSelectionDisplay();
    });

    k.onKeyPress("down", () => {
        const colorKeys = Object.keys(colors);
        const currentColorIndex = colorKeys.indexOf(currentColorKey);
        currentColorKey = colorKeys[(currentColorIndex - 1 + colorKeys.length) % colorKeys.length];
        updateSelectionDisplay();
    });

	k.onKeyPress("enter", () => {
        k.go("gridgame")
    });
});

k.go("main")
