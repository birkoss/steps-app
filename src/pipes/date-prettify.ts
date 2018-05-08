import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'datePrettify'
})

@Injectable()
export class DatePrettify implements PipeTransform {
    transform(value, args) {

      let monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

      let date = new Date(value);

      let day = date.getDate();
      let monthIndex = date.getMonth();
      let year = date.getFullYear();

      return monthNames[monthIndex] + ' ' + day  + ', ' + year;
    }
}
