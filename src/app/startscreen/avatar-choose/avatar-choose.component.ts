import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-avatar-choose',
  templateUrl: './avatar-choose.component.html',
  styleUrls: ['./avatar-choose.component.scss']
})

export class AvatarChooseComponent implements OnInit {
  user: User;
  avatars: string[] = ["avatar1", "avatar2", "avatar3", "avatar4", "avatar5", "avatar6"];
  

  constructor() {
    this.user = new User();
    this.user.avatar = "avatar0";
  }

  ngOnInit() {
    
  }

  selectAvatar(avatar: string) {
    this.user.avatar = avatar;
  }
}