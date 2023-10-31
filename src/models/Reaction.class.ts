export class Reaction {
    id: string;
    name: string;
    users: string[]

    constructor(obj?: any) {
        this.id = obj ? obj.id : "";
        this.name = obj ? obj.name : "";
        this.users = obj ? obj.users : [];
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            users: this.users
        }
    }
}