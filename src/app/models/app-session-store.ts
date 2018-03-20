export class AppSessionStoreModel {
    sno: number;
    sname: string;
    age: number;
    constructor(
        { sno, sname, age }: {
            sno?: number,
            sname?: string,
            age?: number
        }) {
        this.sno = sno;
        this.sname = sname;
        this.age = age;
    }
}