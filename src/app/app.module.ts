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
import { ThreadComponent } from './mainscreen/message/thread/thread.component';
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
import { MessageComponent } from './mainscreen/message/message.component';
import { AvatarChooseComponent } from './startscreen/avatar-choose/avatar-choose.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';

import { MessageCreateComponent } from './mainscreen/message/message-create/message-create.component';
import { DateLineComponent } from './mainscreen/message/date-line/date-line.component';
import { IfChangedDirective } from './directives/if-changed.directive';
import { ReactionComponent } from './mainscreen/message/reaction/reaction.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from './mainscreen/message/toolbar/toolbar.component';
import { AddreactionComponent } from './mainscreen/message/addreaction/addreaction.component';
import { ForgotPasswordComponent } from './startscreen/forgot-password/forgot-password.component';
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { ActionHandlerComponent } from './action-handler/action-handler.component';
import { SearchbarComponent } from './mainscreen/searchbar/searchbar.component';
import { ResetPasswordComponent } from './startscreen/reset-password/reset-password.component';
import { MessageEditComponent } from './mainscreen/message/message-edit/message-edit.component';
import { UserProfilComponent } from './mainscreen/user-profil/user-profil.component';
import { MentionModule } from 'angular-mentions';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { IntroComponent } from './startscreen/intro/intro.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ChatViewComponent } from './mainscreen/sidenav/chat-view/chat-view.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { EditChannelComponent } from './mainscreen/channel/edit-channel/edit-channel.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatChipsModule} from '@angular/material/chips';
import { EmptyWindowComponent } from './mainscreen/empty-window/empty-window.component';
import { EditChannelUsersComponent } from './mainscreen/channel/edit-channel-users/edit-channel-users.component';
import { ShowChannelUsersComponent } from './mainscreen/channel/show-channel-users/show-channel-users.component';
import { AddUserDialogComponent } from './mainscreen/channel/add-user-dialog/add-user-dialog.component';
import { AddChannelDialogComponent } from './mainscreen/channel/add-channel-dialog/add-channel-dialog.component';



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
    MessageComponent,
    AvatarChooseComponent,
    AddChannelDialogComponent,
    DateLineComponent,
    IfChangedDirective,
    ReactionComponent,
    ToolbarComponent,
    AddreactionComponent,
    ForgotPasswordComponent,
    AddreactionComponent,
    ActionHandlerComponent,
    SearchbarComponent,
    ResetPasswordComponent,
    MessageCreateComponent,
    MessageEditComponent,
    UserProfilComponent,
    IntroComponent,
    ChatViewComponent,
    EditChannelComponent,
    EmptyWindowComponent,
    EditChannelUsersComponent,
    ShowChannelUsersComponent,
    AddUserDialogComponent
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
    provideDatabase(() => getDatabase()),
    BrowserAnimationsModule,
    MatMenuModule,
    MatDialogModule,
    MatBadgeModule,
    MatToolbarModule,
    PickerModule,
    MentionModule,
    MatAutocompleteModule, 
    MatTooltipModule,
    MatRadioModule,
    MatChipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
