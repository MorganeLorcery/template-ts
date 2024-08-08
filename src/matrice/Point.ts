export class Point {
    constructor(private x: number, private y: number) {}

    public toArray(): [number, number] {
        return [this.x, this.y];
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public setX(x: number): void {
        this.x = x;
    }

    public setY(y: number): void {
        this.y = y;
    }
}