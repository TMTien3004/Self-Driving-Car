const canvas = document.getElementById('myCanvas');
canvas.width = 200; // Giving the width of the canvas

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width/2, canvas.width*0.9);
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
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height*0.7);
    
    // Draw the road on the canvas
    road.draw(ctx);

    // Draw the traffic on the canvas
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(ctx, "red");
    }

    // Draw the car on the canvas
    car.draw(ctx, "blue");

    // This method will recursively call the animate function over and over again,
    // providing a smooth animation loop.
    ctx.restore();
    requestAnimationFrame(animate);
}