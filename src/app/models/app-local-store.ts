export class AppLocalStoreModel {
    eno: number;
    ename: string;
    age: number;
    constructor(
        { eno, ename, age }: {
            eno?: number,
            ename?: string,
            age?: number
        }) {
        this.eno = eno;
        this.ename = ename;
        this.age = age;
    }
}