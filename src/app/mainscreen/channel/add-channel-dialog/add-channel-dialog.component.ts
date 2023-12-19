import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Channel } from 'src/models/channel.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';

import {
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrls: ['./add-channel-dialog.component.scss']
})
export class AddChannelDialogComponent {
  channelName: any;
  channelDescription: any;
  creatorChannel: any;

  public channel = new Channel();

  location: string | undefined;

  addChannelForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder,
    public firebaseChannel: ChannelFirebaseService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddChannelDialogComponent>) {
    this.getInput();
  }

  @Input()
  public set currentLocation(value: string) {
    this.location = value;
  }

  /**
   * Connects form variable with hmtl input form and adds a validation. 
   */
  getInput() {
    this.addChannelForm = this.fb.group({
      channelName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      channelDescription: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }


  /**
   * Gets value of input field and give it to the next componente, to create the new channel. 
   * @param value - iput form value
   */
  onSubmitNewChannel(value: any) {
    const newChannel = new Channel(value);
    const dialogRef = this.dialog.open(AddUserDialogComponent) //hier fügen wir die Komponente ein die geöffnet werden soll. In diesem Fall, "DialogAddUserComponent", weil da unser Dialog enthalten ist.
    dialogRef.componentInstance.channel = new Channel(newChannel);  // Mit dieser Zeile greifen wir auf die DialogEditAdressComponent zu und lagern die user in dieser component dort ein um auf daten zuzugreifen.
    this.closeDialog();
  }


  /**
   * Opens addChannel dialog
   */
  openDialog(): void {
    this.dialog.open(AddUserDialogComponent, {
      width: '250px',
    });
  }

  
  /**
   * Closes addChanenelDialog
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
