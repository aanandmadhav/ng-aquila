import { Component } from '@angular/core';
import * as moment from 'moment';

/**
* @title Example of setting min and max values
*/
@Component({
  templateUrl: './datefield-min-max-example.html'
})

export class DatefieldMinMaxExampleComponent {
  minDate = moment([2010, 1, 1]);
  maxDate = moment([2020, 1, 1]);
}
