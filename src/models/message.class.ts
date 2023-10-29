export class Message {
    id: string;
    content: Message;
    timestamp: number;
    autorId: string;
    avatarSrc: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : "";
        this.content = obj ? obj.content : "";
        this.timestamp = obj ? obj.timestamp : 0;
        this.autorId = obj ? obj.autorId : "";
        this.avatarSrc = obj ? obj.avatarSrc : "";
    }

    toJSON() {
        return {
            id: this.id,
            content: this.content,
            timestamp: this.timestamp,
            autorId: this.autorId,
            avatarSrc: this.avatarSrc
        }
    }
}