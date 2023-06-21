class Sensor{
    constructor(car){
        this.car = car;
        // The car can detect obstacles by rays, so we can set the number of rays, how long the rays are 
        // and the angle between the rays here.
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI/2;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, traffic){
        this.#castRays();
        this.readings = [];
        for(let i=0;i<this.rays.length;i++){
            this.readings.push(
                this.#getReading(
                    this.rays[i], 
                    roadBorders,
                    traffic
                )
            );
        }
    }

    // This method will return the intersection point of two lines.
    #getReading(ray, roadBorders, traffic){
        let touches = [];
        // Add sensor detection for the road's borders.
        for(let i=0;i<roadBorders.length;i++){
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if(touch){
                touches.push(touch);
            }
        }

        // Add sensor detection for traffic on the road.
        for(let i=0;i<traffic.length;i++){
            const poly = traffic[i].polygon;
            for(let j=0;j<poly.length;j++){
                const touch = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1)%poly.length]
                );
                if(touch){
                    touches.push(touch);
                }
            }
        }

        if(touches.length == 0){
            return null;
        }else{
            // Getting an array of values from the touches map, which is the offset.
            const offset = touches.map(e => e.offset); 
            // Getting the minimum value from the offset array.
            const minOffset = Math.min(...offset);
            return touches.find(e => e.offset == minOffset);
        }
    }

    // This method will cast the rays from the car.
    #castRays(){
        this.rays = [];
        for(let i=0;i<this.rayCount;i++){
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount == 1 ? 0.5 : i/(this.rayCount-1)
            ) + this.car.angle;
            const start = {x: this.car.x, y: this.car.y};
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength,
            };
            this.rays.push([start, end]);
        }
    }

    // This function displays the rays on the car.
    draw(ctx){
        for(let i = 0; i < this.rayCount ; i++){
            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }
            
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
            
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }        
}