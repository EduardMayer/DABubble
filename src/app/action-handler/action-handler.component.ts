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

  constructor(
    private route: ActivatedRoute, 
    private authService: AuthFirebaseService, 
    private router: Router) { }

  /**
   * Gets QueryParams from URL and routes to the components for recoverPasswort or verfiyEmail. 
   */
  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      const mode = queryParams.get('mode');
      const oobCode = queryParams.get('oobCode');
      const apiKey = queryParams.get('apiKey');

      if (mode == "verifyAndChangeEmail") {
        this.verifyAndChangeEmail(oobCode!); 
      }
      else if (mode == "resetPassword") {
        this.router.navigate(['reset', oobCode], { queryParams: { oobCode: oobCode } });
      }
    });
  }

  /**
   * Verify change or recover email an redirects to main after confirm. 
   * @param oobCode - oobCode from Url to verfy firebase change action. 
   */
  verifyAndChangeEmail(oobCode:string){
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
      this.router.navigate(['index']);
    }, 3000);
  }

}
