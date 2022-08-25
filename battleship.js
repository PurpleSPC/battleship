//battleship game from ch 8 of head first JS 
//Stephen Cochran 6/28/2022

//view object for updating the view of the game
var view ={
    //displays a string in the message display area
    displayMessage: function(msg){
        var messageArea=document.getElementById("messageArea");
        messageArea.innerHTML=msg;
    },

    //displays the ship image when there is a hit
    displayHit: function(location){
        var cell=document.getElementById(location);
        cell.setAttribute("class", "hit");

    },

    //displays the miss image when there is a miss
    displayMiss:function(location){
        var cell=document.getElementById(location);
        cell.setAttribute("class", "miss");

    },
};

//a model object for game logic and state
var model ={
    boardSize:7,
    numShips:3,
    shipLength:3,
    shipsSunk:0,
    //an array that holds the ship objects> DONT FORGET THE "QUOTES!!"
    ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	], 
    
     //a "fire" method for hit/miss logic
    fire: function(guess){
        for(var i=0;i<this.numShips;i++){
            var ship = this.ships[i];
            var locations=ship.locations;
            //indexOf method looks for match in locations and returns the index for hit or (-1) for miss
            var index=locations.indexOf(guess);
        
            //a miss returns a -1, anything else is a hit
            if (index>=0){
                ship.hits[index]="hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                //checks is ship is sunk
                if (this.isSunk(ship)){
                    view.displayMessage("You Sank My BATTLESHIP!!");
                    this.shipsSunk++;
                }
                return true;
            } 
        }
        view.displayMiss(guess);
        view.displayMessage("MISS!");
        return false;        
    },
   //method for checking if ship is sunk
    isSunk: function(ship){
        for (var i=0;i<this.shipLength;i++){
            if (ship.hits[i] !== "hit"){
                return false;
            }
        } 
        return true;
    },
    generateShipLocations: function(){
        var locations;
        for (var i=0;i<this.numShips;i++){
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log(this.ships);
    },
    generateShip: function(){
        var direction = Math.floor(Math.random()*2);
        var row;
        var col;
        //generates start locations for ships
        if (direction === 1){
            //generate start location for horizontal ship
            row = Math.floor(Math.random()*this.boardSize);
            col = Math.floor(Math.random()*(this.boardSize-this.shipLength+1));
        } else {
            //generate start location for vertical ship
            col = Math.floor(Math.random()*this.boardSize);
            row = Math.floor(Math.random()*(this.boardSize-this.shipLength+1));
        }
        //fills the array of ship locations
        var newShipLocations=[];
        for (var i=0;i<this.shipLength;i++){
            if(direction===1){
                //add locationS to array for horizontal ship
                newShipLocations.push(row + "" + (col+i));
            } else {
                //add locationS to arry for vertical ship
                newShipLocations.push((row+i) + "" + col);
            }
        }
        return newShipLocations;
    },
    collision: function(locations){
        for(var i=0;i<this.numShips;i++){
            var ship = this.ships[i];
            for(var j=0;j<locations.length;j++){
                if (ship.locations.indexOf(locations[j])>=0){
                    return true;
                }
            }   
        }
        return false;
    }
 };
 
//controller object to process the guess, track# of guesses, pass the guess to the model, and end the game
 var controller={
    guesses:0,
    processGuess: function(guess){
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips){
                view.displayMessage("You sunk all of my battleships with " + this.guesses + " shots.");
            } 
        }

    }
};
function init(){
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
}
function handleFireButton(){
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}
function handleKeyPress(e){
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13){
        fireButton.onclick();
        return false;
    }
}

window.onload = init;
console.log(model.newShipLocations);

function parseGuess(guess){
    var aplhabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess===null || guess.length !== 2){
        alert("Please enter valid firing coordinates");
    }else {
        var firstChar = guess.charAt(0);
        var row= aplhabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)){
            alert("Please enter valid firing coordinates");
        } else if (row < 0 || row >= model.boardSize || column <0 || column >= model.boardSize){
            alert("Please enter valid firing coordinates");
        } else {
            return row + column;
        }
    } return null;
}
