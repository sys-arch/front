export class Matrix {
    values: number[][] = [];
    rows: number;
    columns: number;

    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;

        for (let i = 0; i < rows; i++) {
            this.addRow(i);
        }
    }

    addRow(rowIndex: number) {
        this.values[rowIndex] = Array(this.columns).fill(0);
    }
}
