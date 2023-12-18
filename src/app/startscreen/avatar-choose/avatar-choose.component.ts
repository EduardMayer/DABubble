import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StorageFirebaseService } from 'src/services/storage-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/services/notification.service';


@Component({
  selector: 'app-avatar-choose',
  templateUrl: './avatar-choose.component.html',
  styleUrls: ['./avatar-choose.component.scss'],
})
export class AvatarChooseComponent implements OnInit {
  user = this.userService.registUser;
  userName: string = '';

  avatars: string[] = [
    'avatar1.svg',
    'avatar2.svg',
    'avatar3.svg',
    'avatar4.svg',
    'avatar5.svg',
    'avatar6.svg',
  ];
  constructor(
    private storageService: StorageFirebaseService, 
    public userService: UserFirebaseService,
    private notificationService: NotificationService,
    public router: Router) {
    this.user.avatar = 'assets/img/avatar/avatar0.svg';
  }

  @Output() closeAvatarView = new EventEmitter<void>();

  /**
 * Emits an event to close the avatar view.
 * 
 * @emits closeAvatarView
 * @returns {void}
 */
  closeAvatar() {
    this.closeAvatarView.emit();
  }

  /**
   * Angular lifecycle hook called after component initialization.
   * Does not perform any specific actions in this implementation.
   * 
   * @returns {void}
   */
  ngOnInit() {
  }

  /**
   * Selects an avatar and updates the user's avatar property.
   * 
   * @param {string} avatar - The selected avatar's filename.
   * @returns {void}
   */
  selectAvatar(avatar: string) {
    this.user.avatar = 'assets/img/avatar/' + avatar;
  }

  /**
   * Uploads an image file and updates the user's avatar with the uploaded URL.
   * 
   * @param {HTMLInputElement} input
   * @returns {Promise<void>}
   */
  async uploadFile(input: HTMLInputElement) {
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    try {
      const url = await this.storageService.uploadIMGFile(file);
      this.user.avatar = url;
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  }
  /**
   * Submits the user's avatar update, marks the avatar as submitted, and navigates to the 'main' route after a delay.
   * 
   * @returns {void}
   */
  onSubmitAvatar() {
    this.userService.update(this.user);
    this.notificationService.renderNotification("Konto erfolgreich erstellt!");

    setTimeout(() => {
      this.router.navigate(['index']);
    }, 1500);
  }

}
