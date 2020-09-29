import { add, subtract, scaled, cubed, zip } from "./utils";

// Units:
//  Time:                   s    tick
//  Length:                 m    screen
//  Mass:                   kg   screen^3 * G^-1 * tick^-2
//  Electric current:       A    
//  Temperature:            K    
//  Amount of substance:    mol  particle
//  Luminous intensity:     cd   
// Derived units:
//  Frequency:              Hz   tick^-1
//  Angle:                  rad  radian
//  Solid angle:            sr   steradian
//  Force, weight:          N    screen^4 * G^-1 * tick^-4
//  Pressure:               Pa   
//  Energy, work, heat:     J    
//  Power, radiant flux:    W    
//  Electric charge:        C    
//  Voltage:                V    
//  Electrical capacitance: F    
//  Area:                        screen^2
//  Volume:                      screen^3
//  Velocity:                    screen * tick^-1
//  Acceleration:                screen * tick^-2
//  Magnetic induction:          
// Other units:

class PhysicsObject {
    constructor(public pos: [number, number], public vel: [number, number], public readonly mass: number, public readonly radius: number) { }
    acc: [number, number] = [NaN, NaN];

    tick(): void {
        this.pos = zip(this.pos, this.vel).map(([a, b]) => a + b) as [number, number]
        this.vel = zip(this.vel, this.acc).map(([a, b]) => a + b) as [number, number]
    }

    toString(): string {
        return `pos: ${this.pos}, vel: ${this.vel}, acc: ${this.acc}, mass: ${this.mass}, radius: ${this.radius}`;
    }
}

class PhysicsUniverse {
    objects: PhysicsObject[];

    constructor(...objects: PhysicsObject[]) {
        this.objects = objects;
    }

    tick(): void {
        this.updateGravity();
        this.tickObjects();
        this.handleCollisions();
    }

    updateGravity(): void {
        for(const object of this.objects) {
            let newAcc: [number, number] = [0, 0];
            for(const other of this.objects) {
                if(other != object) {
                    const vec = subtract(object.pos, other.pos);
                    const mag = other.mass / cubed(Math.hypot(...vec));
                    newAcc[0] += mag * vec[0];
                    newAcc[1] += mag * vec[1];
                }
            }
            object.acc = newAcc;
        }
    }

    tickObjects(): void {
        for(const object of this.objects) {
            object.tick();
        }
    }

    handleCollisions(): void {
        for(const object1 of this.objects) {
            for(const object2 of this.objects) {
                if(Math.hypot(...subtract(object1.pos, object2.pos)) < object1.radius + object2.radius) {
                    [object2.pos, object1.pos] = [object1.pos, object2.pos];
                }
            }
        }
    }
}

const SVG_XMLNS: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";

export function runUniverse(container: SVGSVGElement, ...objects: { pos: [number, number], vel: [number, number], mass: number, radius: number }[]): void {
    if(objects.length == 0) return;

    const universe: PhysicsUniverse = new PhysicsUniverse(...objects.map(o => new PhysicsObject(o.pos, o.vel, o.mass, o.radius)));
    const maxMass: number = Math.max(...objects.map(o => o.mass));
    const circles: SVGCircleElement[] = [];
    const segments: SVGLineElement[] = [];

    objects.forEach(o => {
        const circle: SVGCircleElement = document.createElementNS(SVG_XMLNS, "circle");
        circle.setAttribute("r", o.radius.toString());
        circle.setAttribute("fill", `hsl(0, 0%, ${(1 - (o.mass / maxMass)) * 100}%)`);
        container.appendChild(circle);
        circles.push(circle);
        const segment = document.createElementNS(SVG_XMLNS, "line");
        segment.setAttribute("stroke", "red");
        segment.setAttribute("stroke-width", "5px");
        segments.push(segment);
        container.appendChild(segment);
    });

    setInterval(() => {
        const center = universe.objects.reduce((acc, o) => [acc[0] + o.pos[0], acc[0] + o.pos[0]] as [number, number], [0, 0] as [number, number]);

        zip(universe.objects, circles, segments).forEach(([o, circle, segment]) => {
            const effectivePos = subtract(o.pos, center);
            const futureEffectivePos = add(effectivePos, scaled(o.vel, 100));

            circle.setAttribute("cx", effectivePos[0].toString());
            circle.setAttribute("cy", effectivePos[1].toString());
            segment.setAttribute("x1", effectivePos[0].toString());
            segment.setAttribute("y1", effectivePos[1].toString());
            segment.setAttribute("x2", futureEffectivePos[0].toString());
            segment.setAttribute("y2", futureEffectivePos[1].toString());
        })
        universe.tick();
    }, 0);
}
