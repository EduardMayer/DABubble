import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/models/user.class';
import { Storage, getDownloadURL, ref, uploadBytes, deleteObject, getStorage } from "@angular/fire/storage";




@Component({
  selector: 'app-avatar-choose',
  templateUrl: './avatar-choose.component.html',
  styleUrls: ['./avatar-choose.component.scss'],
})
export class AvatarChooseComponent implements OnInit {
  private readonly storage: Storage = inject(Storage);
  user: User;
  
  avatars: string[] = [
    'avatar1.svg',
    'avatar2.svg',
    'avatar3.svg',
    'avatar4.svg',
    'avatar5.svg',
    'avatar6.svg',
];
  
  
  constructor() {
    this.user = new User();
    this.user.avatar = 'assets/img/avatar/avatar0.svg';
    
  }

  ngOnInit() {

  }

  selectAvatar(avatar: string) {
    this.user.avatar = 'assets/img/avatar/' + avatar;
  }

  
  uploadFile(input: HTMLInputElement) {
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (file.type.startsWith('image/')) {
      const timestamp = new Date().getTime();
      const uniqueFilename = timestamp + '_' + file.name;
      const storageRef = ref(this.storage, 'Userpics/' + uniqueFilename);

      uploadBytes(storageRef, file).then(() => {
        console.log('Image uploaded with unique filename: ' + uniqueFilename);

        getDownloadURL(storageRef).then((url) => {
          console.log('Download URL: ' + url);
          this.user.avatar = url;
        }).catch(error => {
          console.error('Error getting download URL: ', error);
        });
      }).catch(error => {
        console.error('Error uploading image: ', error);
      });
    }
  }
}




