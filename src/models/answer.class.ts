export class Answer {

    id: string;
    fullName: string;
    mail: string;
    avatar: string;
    channels: string[];
    chats: string[];
    content: string;
    answer: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : "";
        this.fullName = obj ? obj.fullName : "";
        this.mail = obj ? obj.mail : "";
        this.avatar = obj ? obj.avatar : "assets/img/avatar/avatar0.svg";
        this.channels = obj ? obj.channels : [];
        this.chats = obj ? obj.chats : [];
        this.content = obj ? obj.mail : "";

        this.answer = obj ? obj.answer : "";
    }

    toJSON() {
        return {
            id: this.id,
            fullName: this.fullName,
            mail: this.mail,
            avatar: this.avatar,
            channels: this.channels,
            chats: this.chats,
            content: this.content,
            answer: this.answer
        }
    }

}