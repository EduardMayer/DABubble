export class Reaction {
    id: string;
    name: string;
    users: string[];
    path: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : "";
        this.name = obj ? obj.name : "";
        this.users = obj ? obj.users : [];
        this.path = obj ? obj.path : "";
    }

    toJSON() {
        return {
            name: this.name,
            users: this.users
        }
    }
}