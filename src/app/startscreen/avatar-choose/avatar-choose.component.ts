import { Component, OnInit } from '@angular/core';
import { StorageFirebaseService} from 'src/services/storage-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { Router} from '@angular/router';


@Component({
  selector: 'app-avatar-choose',
  templateUrl: './avatar-choose.component.html',
  styleUrls: ['./avatar-choose.component.scss'],
})
export class AvatarChooseComponent implements OnInit {
  user = this.userService.currentUser
  userName: string = '';

  avatars: string[] = [
    'avatar1.svg',
    'avatar2.svg',
    'avatar3.svg',
    'avatar4.svg',
    'avatar5.svg',
    'avatar6.svg',
  ];
  constructor(private storageService: StorageFirebaseService, public userService: UserFirebaseService, private router: Router) {
    this.user.avatar = 'assets/img/avatar/avatar0.svg';
  }
  
  ngOnInit() {
    
  }

  selectAvatar(avatar: string) {
    this.user.avatar = 'assets/img/avatar/' + avatar;
  }


  async uploadFile(input: HTMLInputElement) {
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    try {
      const url = await this.storageService.uploadFile(file);
      this.user.avatar = url;
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  }

  onSubmitAvatar() {
    this.userService.update(this.user);
    this.router.navigate(['']);
  }
  
}
