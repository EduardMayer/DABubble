export class User {
    id: string;
    fullName:string;
    mail: string;
    birthDate: number;
    street: string;
    zipCode: number;
    city: string;
    avatar: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : "";
        this.fullName = obj ? obj.fullName : "";
        this.mail = obj ? obj.mail : "";
        this.birthDate = obj ? obj.birthDate : "";
        this.street = obj ? obj.street : "";
        this.zipCode = obj ? obj.zipCode : "";
        this.city = obj ? obj.city : "";
        this.avatar = obj ? obj.avatar : "assets/img/avatar/avatar0.svg";
    }

    toJSON() {
        return {
            id: this.id,
            fullName: this.fullName,
            mail: this.mail,
            birthDate: this.birthDate,
            street: this.street,
            zipCode: this.zipCode,
            city: this.city,
            avatar: this.avatar
        }
    }
}