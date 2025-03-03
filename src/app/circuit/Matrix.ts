export class Matrix {

    values: number[][] = [];
    iqubits: number = 1;
    oqubits: number = 1;

    constructor(inputQubits: number, outputQubits: number) {
        this.iqubits = Math.pow(2, inputQubits);
        this.oqubits = inputQubits % outputQubits;
        for (let i = 0; i < this.iqubits; i++) {
            this.addRow(i, inputQubits, outputQubits);

        }
    }
    
    addRow(i: number, inputqubits:number, ouputqubits: number) {
        
    }
}
