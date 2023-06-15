class Car{
    constructor(x, y, width, height, controlType, maxSpeed=3){
        //Car's position and size
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        //Car's speed and acceleration
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;

        //Check car if crashed or not
        this.damaged = false;

        // We only want the sensors on the controlled car, not the dummy cars
        if(controlType != "DUMMY"){
            //Car's sensors
            this.sensor = new Sensor(this);
        }

        //Car's controls
        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic){
        if(!this.damaged){ // If the car hasn't crashed, we can keep moving the car
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
        }
    }

    // Check if the car is crashed or not
    #assessDamage(roadBorders, traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }

        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon, traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    // Locating and modifying the car's corner points
    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2; //The radius of the car
        const alpha = Math.atan2(this.width, this.height); //The angle of the car
        // Location of the top right point of the car
        points.push({
            x:this.x - Math.sin(this.angle - alpha) * rad,
            y:this.y - Math.cos(this.angle - alpha) * rad
        });

        // Location of the bottom right point of the car
        points.push({
            x:this.x - Math.sin(this.angle + alpha) * rad,
            y:this.y - Math.cos(this.angle + alpha) * rad
        });
        
        // Location of the bottom left point of the car
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y:this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });

        // Location of the top left point of the car
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y:this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });
        
        return points;
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
    draw(ctx, color){
        // Check if car is crashed or not
        if(this.damaged){
            ctx.fillStyle = 'gray';
        }
        else{
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i = 1; i < this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        if(this.sensor){
            this.sensor.draw(ctx);
        }
    }
}