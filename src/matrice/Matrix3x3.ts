import { Point } from "./Point";

export class Matrix3x3 {
    private data: number[][];

    constructor(data: number[][]) {
        this.data = data;
    }

    public static identity(): Matrix3x3 {
        return new Matrix3x3([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ]);
    }

    public static translation(tx: number, ty: number): Matrix3x3 {
        return new Matrix3x3([
            [1, 0, tx],
            [0, 1, ty],
            [0, 0, 1],
        ]);
    }

    public static rotation(angle: number): Matrix3x3 {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Matrix3x3([
            [cos, -sin, 0],
            [sin, cos, 0],
            [0, 0, 1],
        ]);
    }

    public static scaling(sx: number, sy: number): Matrix3x3 {
        return new Matrix3x3([
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1],
        ]);
    }

    public multiply(matrix: Matrix3x3): Matrix3x3 {
        const result = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    result[i][j] += this.data[i][k] * matrix.data[k][j];
                }
            }
        }

        return new Matrix3x3(result);
    }

    public invert(): Matrix3x3 | null {
        const m = this.data;
        const inv = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        
        inv[0][0] = m[1][1] * m[2][2] - m[1][2] * m[2][1];
        inv[0][1] = m[0][2] * m[2][1] - m[0][1] * m[2][2];
        inv[0][2] = m[0][1] * m[1][2] - m[0][2] * m[1][1];
        inv[1][0] = m[1][2] * m[2][0] - m[1][0] * m[2][2];
        inv[1][1] = m[0][0] * m[2][2] - m[0][2] * m[2][0];
        inv[1][2] = m[0][2] * m[1][0] - m[0][0] * m[1][2];
        inv[2][0] = m[1][0] * m[2][1] - m[1][1] * m[2][0];
        inv[2][1] = m[0][1] * m[2][0] - m[0][0] * m[2][1];
        inv[2][2] = m[0][0] * m[1][1] - m[0][1] * m[1][0];

        let det = m[0][0] * inv[0][0] + m[0][1] * inv[1][0] + m[0][2] * inv[2][0];

        if (det === 0) {
            return null;
        }

        det = 1.0 / det;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                inv[i][j] *= det;
            }
        }

        return new Matrix3x3(inv);
    }

    public transformPoint(point: Point): Point {
        const [x, y] = point.toArray();
        const tx = this.data[0][0] * x + this.data[0][1] * y + this.data[0][2];
        const ty = this.data[1][0] * x + this.data[1][1] * y + this.data[1][2];
        return new Point(tx, ty);
    }
}