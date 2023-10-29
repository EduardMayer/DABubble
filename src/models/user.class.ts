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
        this.id = obj.id ? obj.id : "";
        this.fullName = obj.fullName ? obj.fullName : "";
        this.firstName = obj.firstName ? obj.firstName : "";
        this.lastName = obj.lastName ? obj.lastName : "";
        this.mail = obj.mail ? obj.mail : "";
        this.birthDate = obj.birthDate ? obj.birthDate : "";
        this.street = obj.street ? obj.street : "";
        this.zipCode = obj.zipCode ? obj.zipCode : "";
        this.city = obj.city ? obj.city : "";
        this.avatar = obj.avatar ? obj.avatar : "assets/img/avatar/avatar0.svg";
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