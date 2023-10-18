import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
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
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
