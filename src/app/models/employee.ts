export class EmployeeModel {
    eno: number;
    ename: string;
    age: number;
    constructor(no?: number, name?: string, age?: number) {
        this.eno = no;
        this.ename = name;
        this.age = age;
    }
}