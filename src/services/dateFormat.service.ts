import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class DateFormatService {

    /**
    * Formats a Date object to a string in the "dd.mm.yyyy" (day.month.year) format.
    *
    * @param {Date} date - The Date object to be formatted.
    * @returns {string} The formatted date string.
    */
    formatDateToDmy(date: Date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }

}