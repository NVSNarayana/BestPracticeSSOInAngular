export class CustomerModel {
    cno: number;
    cname: string;
    age: number;
    constructor(no?: number, name?: string, age?: number) {
        this.cno = no;
        this.cname = name;
        this.age = age;
    }
}