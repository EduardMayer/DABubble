import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenerateIdService {
  
  generateRandomId(length: number) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idArray = new Array(length);
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      idArray[i] = charset[randomIndex];
    }
  
    return idArray.join('');
  }
}
