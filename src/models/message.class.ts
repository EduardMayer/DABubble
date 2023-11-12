import { Reaction } from "./reaction.class";

export class Message {
    id: string;
    content: string;
    timestamp: number;
    autorId: string;
    avatarSrc: string;
    fileSrc: string;
    fileName: string;
    reactions: Reaction[];
    path: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : "";
        this.content = obj ? obj.content : "";
        this.timestamp = obj ? obj.timestamp : 0;
        this.autorId = obj ? obj.autorId : "";
        this.avatarSrc = obj ? obj.avatarSrc : "";
        this.path = obj ? obj.path : "";
        this.fileSrc= obj ? obj.fileSrc : "";
        this.fileName= obj ? obj.fileName : "";
        this.reactions = obj ? obj.reactions : [];
    }

    toJSON() {
        return {
            content: this.content,
            timestamp: this.timestamp,
            autorId: this.autorId,
            avatarSrc: this.avatarSrc,
            reactions: this.reactions,
            fileSrc: this.fileSrc,
            fileName: this.fileName
        }
    }
}