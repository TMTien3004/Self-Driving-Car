const canvas = document.getElementById('myCanvas');
canvas.width = 200; // Giving the width of the canvas

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width/2, canvas.width*0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);

animate();

function animate(){
    car.update(road.borders);
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height*0.7);
    
    // Draw the road on the canvas
    road.draw(ctx);

    // Draw the car on the canvas
    car.draw(ctx);

    // This method will recursively call the animate function over and over again,
    // providing a smooth animation loop.
    ctx.restore();
    requestAnimationFrame(animate);
}