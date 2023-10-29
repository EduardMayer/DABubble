export class User {
    id: string;
    fullName:string;
    firstName: string;
    lastName: string;
    mail: string;
    birthDate: number;
    street: string;
    zipCode: number;
    city: string;
    avatar: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : "";
        this.fullName = obj ? obj.fullName : "";
        this.firstName = obj ? obj.firstName : "";
        this.lastName = obj ? obj.lastName : "";
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
            firstName: this.firstName,
            fullName: this.fullName,
            lastName: this.lastName,
            mail: this.mail,
            birthDate: this.birthDate,
            street: this.street,
            zipCode: this.zipCode,
            city: this.city,
            avatar: this.avatar
        }
    }
}