import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';

@Component({
  selector: 'app-action-handler',
  templateUrl: './action-handler.component.html',
  styleUrls: ['./action-handler.component.scss']
})
export class ActionHandlerComponent implements OnInit {

  userMessage = "";

  constructor(private route: ActivatedRoute, private authService: AuthFirebaseService, private router: Router) { }


  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      const mode = queryParams.get('mode');
      const oobCode = queryParams.get('oobCode');
      const apiKey = queryParams.get('apiKey');

      console.log('mode:', mode);
      console.log('oobCode:', oobCode);
      console.log('apiKey:', apiKey);

      if(mode == "recoverEmail"){

        if (oobCode) {
          this.authService.applyActionCode(oobCode);
        }
        switch (this.userMessage) {
          case "recoverEmail":
            this.userMessage = "Ihre Email-Adresse wurde erfolgreich zurückgesetzt"
            break;
            case "verifyAndChangeEmail":
              this.userMessage = "Ihre Email-Adresse wurde erfolgreich geändert"
            }
            setTimeout(() => {
              this.router.navigate(['main']);
            }, 3000);
        }
        else if(mode == "resetPassword"){
          this.router.navigate(['reset'] , { queryParams: { oobCode: oobCode }});
        }
    });
  }

}
