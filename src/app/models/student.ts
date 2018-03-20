export class StudentModel {
    sno: number;
    sname: string;
    age: number;
    constructor(no?: number, name?: string, age?: number) {
        this.sno = no;
        this.sname = name;
        this.age = age;
    }
}