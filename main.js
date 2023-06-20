const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200; // Giving the width of the canvas

// Creating a canvas to visualize how the neural network operates
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
const N = 500;
const cars = generateCars(N);
let bestCar = cars[0];

if(localStorage.getItem("bestBrain")){
    bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
}

// We add traffic to the road by adding more dummy cars as obstacles
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
];

animate();

// Save the best car's brain to local storage
function save(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

// Discard the best car's brain from local storage
function discard(){
    localStorage.removeItem("bestBrain");
}

// We generate more generations of cars to see which car has the most successful run.
function generateCars(N){
    const cars = [];
    for(let i = 1; i <= N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}


function animate(time){
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders,[]);
    }

    for(let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    // We go through the cars array and find the car with the lowest y value
    // This constant will help us pick out the car that can travel the furthest
    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        ));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.7);
    
    // Draw the road on the canvas
    road.draw(carCtx);

    // Draw the traffic on the canvas
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }
    
    // Make the newer car generation transparent
    carCtx.globalAlpha = 0.2;

    // Draw the car on the canvas
    for(let i = 0; i < cars.length; i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);

    // This method will recursively call the animate function over and over again,
    // providing a smooth animation loop.
    carCtx.restore();

    //Adding animation to the neural network visualization
    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}