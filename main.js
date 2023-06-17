const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200; // Giving the width of the canvas

// Creating a canvas to visualize how the neural network operates
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI"); // This is the controlled car

// We add more cars to the road
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
];

animate();

function animate(){
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders,[]);
    }
    car.update(road.borders, traffic);
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height*0.7);
    
    // Draw the road on the canvas
    road.draw(carCtx);

    // Draw the traffic on the canvas
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }

    // Draw the car on the canvas
    car.draw(carCtx, "blue");

    // This method will recursively call the animate function over and over again,
    // providing a smooth animation loop.
    carCtx.restore();

    // Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(animate);
}