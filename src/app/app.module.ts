import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StartscreenComponent } from './startscreen/startscreen.component';
import { MainscreenComponent } from './mainscreen/mainscreen.component';
import { LoginComponent } from './startscreen/login/login.component';
import { RegisterComponent } from './startscreen/register/register.component';
import { SidenavComponent } from './mainscreen/sidenav/sidenav.component';
import { HeaderComponent } from './mainscreen/header/header.component';
import { ChannelComponent } from './mainscreen/channel/channel.component';
import { ThreadComponent } from './mainscreen/thread/thread.component';
import { ChatComponent } from './mainscreen/chat/chat.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImprintComponent } from './startscreen/imprint/imprint.component';
import { PrivacyPolicyComponent } from './startscreen/privacy-policy/privacy-policy.component';
import { TestModuleComponent } from './test-module/test-module.component';
import { MessageComponent } from './mainscreen/message/message.component';
import { AvatarChooseComponent } from './startscreen/avatar-choose/avatar-choose.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import { AddChannelDialogComponent } from './add-channel-dialog/add-channel-dialog.component';


import { MessageEditComponent } from './mainscreen/channel/message-edit/message-edit.component';
import { MessageCreateComponent } from './mainscreen/channel/message-create/message-create.component';

@NgModule({
  declarations: [
    AppComponent,
    StartscreenComponent,
    MainscreenComponent,
    LoginComponent,
    RegisterComponent,
    SidenavComponent,
    HeaderComponent,
    ChannelComponent,
    ThreadComponent,
    ChatComponent,
    ImprintComponent,
    PrivacyPolicyComponent,
    TestModuleComponent,
    MessageComponent,
    AvatarChooseComponent,
    AddChannelDialogComponent,
    MessageEditComponent,
    MessageCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule, 
    MatMenuModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
