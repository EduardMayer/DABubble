import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthFirebaseService);
  const router = inject(Router); 
  if(authService.isLoggedIn()){
    return true; 
  }
  else{
    router.navigate(['']); 
    return false;
  }
};
