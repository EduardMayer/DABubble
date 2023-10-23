import { Message } from "./message.class";
import { User } from "./user.class";

export class Chat {
    id: string;
    messages: string[];
    users: string[];


    constructor(data: any) {
        this.id = data.id || "";
        this.messages = data.messages || [];
        this.users = data.users || [];
    }


    toJSON() {

        let messagesAsString = "";
        if (Array.isArray(this.messages)) {
            messagesAsString = this.messages.join();
        }

        let usersAsString = "";
        if (Array.isArray(this.users)) {
            usersAsString = this.users.join();
        }

        return {
            id: this.id,
            messages: messagesAsString,
            users: usersAsString
        }
    }
}