export class User {
    id: string;
    fullName:string;
    mail: string;
    avatar: string;
    channels: string[]; 
    chats: string[]; 
    status: string; 

    constructor(obj?: any) {
        this.id = obj ? obj.id : "";
        this.fullName = obj ? obj.fullName : "";
        this.mail = obj ? obj.mail : "";
        this.avatar = obj ? obj.avatar : "assets/img/avatar/avatar0.svg";
        this.channels = obj ? obj.channels : []; 
        this.chats = obj ? obj.chats : []; 
        this.status = obj ? obj.status : "offline"; 
    }

    toJSON() {
        return {
            id: this.id,
            fullName: this.fullName,
            mail: this.mail,
            avatar: this.avatar, 
            channels: this.channels, 
            chats: this.chats,
            status: this.status
        }
    }
}