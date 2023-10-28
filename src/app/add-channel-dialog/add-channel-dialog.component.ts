import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Channel } from 'src/models/channel.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';


@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrls: ['./add-channel-dialog.component.scss']
})
export class AddChannelDialogComponent {
channelName: any;
channelDescription: any;
creatorChannel: any;

channel = new Channel();

addChannelForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, public firebaseChannel:ChannelFirebaseService) {
    this.getInput();
  }

  validation_messages = {
    'channelName': [
      { type: 'required', message: 'Full name is required' }
    ],
    'channelDescription': [
      { type: 'maxlength', message: 'Full name is required' },
    ]
  };

  getInput() {

    this.addChannelForm = this.fb.group({
      channelName: ['', [Validators.required, Validators.minLength(3)]],
      channelDescription: ['', [Validators.required, Validators.minLength(3)]]
      //bio: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s", Validators.maxLength(256)],
      //birthday: ['', Validators.required],
      //gender: new FormControl(this.genders[0], Validators.required),
      //countryPhone: this.countryPhoneGroup
    });
    //console.log(this.fullname);
    /*this.accountDetailsForm = this.fb.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      // more form inputs
    })

    //debugger;
console.log(value);*/
  }

  onSubmitNewChannel(value: any) {
debugger;
console.log(value);

const newChannel = new Channel(value);
  console.log(newChannel);

let getPureJson = newChannel.toJSON();

  this.firebaseChannel.addChannel(getPureJson);

  }
}