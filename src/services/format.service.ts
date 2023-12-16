import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class FormatService {

    /**
    * Formats a Date object to a string in the "dd.mm.yyyy" (day.month.year) format.
    *
    * @param {Date} date - The Date object to be formatted.
    * @returns {string} The formatted date string.
    */
    formatDateToDMY(date: Date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }

    formatTimestampToHHMM(timestamp: number) {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, '0'); // Ensure two digits with leading zero
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits with leading zero
        return hours + ':' + minutes;
      }
    
    formatTimeDelta(timestamp: number): string {
      const now = new Date().getTime();
        const delta = now - timestamp;
        const oneDayInMs = 24 * 60 * 60 * 1000; // One day in milliseconds
    
        const yesterdayDmy = this.formatDateToDMY(new Date(now - oneDayInMs));
        const timestampDmy = this.formatDateToDMY(new Date(timestamp));
    
        if (yesterdayDmy == timestampDmy) {
          return "gestern";
        } else if (delta < oneDayInMs) {
          return this.formatTimestampToHHMM(timestamp);
        } else {
          const daysAgo = Math.floor(delta / oneDayInMs);
          return `vor ${daysAgo} Tagen`;
        }
    }

    cutStrLen(string: string){
      
      if(string){
        if(string.length>40){
          string=string.slice(0,39)+"..";
        }
        return string;
      }
      return undefined;
    }

}