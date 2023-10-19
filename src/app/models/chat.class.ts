import { Message } from "./message.class";
import { User } from "./user.class";

export class Chat {
    id: string;
    messages: Array<Message["id"]>; //Funktioniert wahrscheinlich ansonsten statt Message["id"]-> string
    users: Array<User["id"]>;//Funktioniert wahrscheinlich ansonsten statt User["id"]-> string

    constructor(obj?: any) {
        this.id = obj ? obj.id : "";
        this.messages = obj ? obj.messages : [];
        this.users = obj ? obj.users : [];

    }

    toJSON() {
        return {
            id: this.id,
            messages: this.messages,
            users: this.users
        }
    }
}