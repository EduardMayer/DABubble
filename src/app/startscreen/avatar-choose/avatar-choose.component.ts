import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/models/user.class';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';

@Component({
  selector: 'app-avatar-choose',
  templateUrl: './avatar-choose.component.html',
  styleUrls: ['./avatar-choose.component.scss'],
})
export class AvatarChooseComponent implements OnInit {
  private readonly storage: Storage = inject(Storage);
  user: User;
  avatars: string[] = [
    'avatar1',
    'avatar2',
    'avatar3',
    'avatar4',
    'avatar5',
    'avatar6',
  ];
  
  
  constructor() {
    this.user = new User();
    this.user.avatar = 'avatar0';
  }

  ngOnInit() {}

  selectAvatar(avatar: string) {
    this.user.avatar = avatar;
  }

  

  uploadFile(input: HTMLInputElement) {
    if (!input.files) return;
  
    const files: FileList = input.files;
  
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const storageRef = ref(this.storage, 'gs://dabubble-aa8ad.appspot.com/Userpics/' + file.name);
        uploadBytesResumable(storageRef, file);
      }
    }
  }

  
}
