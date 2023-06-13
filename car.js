class Car{
    constructor(x, y, width, height){
        //Car's position and size
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        //Car's speed and acceleration
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 5;
        this.friction = 0.05;
        this.angle = 0;

        //Car's sensors
        this.sensor = new Sensor(this);

        //Car's controls
        this.controls = new Controls();
    }

    update(roadBorders){
        this.#move();
        this.sensor.update(roadBorders);
    }

    #move(){ //Make the movement function private
        // Move the car forward
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        
        // Move the car backward
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }
        
        //Clamp the speed to the maxSpeed when moving forward
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        
        //Clamp the speed to the maxSpeed when moving backward
        if(this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }
        
        //Apply friction
        if(this.speed > 0){
            this.speed -= this.friction;
        }

        if(this.speed < 0){
            this.speed += this.friction;
        }
        
        // This is to make sure that the car doesn't move when it stops.
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        if(this.speed != 0){
            //The filp will adjust the direction of the car when it drives backward
            const flip = this.speed > 0 ? 1 : -1;
            // Move the car to the left
            if(this.controls.left){
                this.angle += 0.03 * flip;
            }

            // Move the car to the right
            if(this.controls.right){
                this.angle -= 0.03 * flip;
            }
        }
        
        this.x -= this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);   
    }

    // This method draws the car on the canvas.
    draw(ctx){
        // Making the car rotate    
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2, 
            this.width, 
            this.height
        );
        ctx.fill();

        ctx.restore();

        this.sensor.draw(ctx);
    }
}