import { Component, Injectable } from '@angular/core';
import { Moment } from 'moment';
import { NxDatepickerIntl } from '@aposin/ng-aquila/datefield';

@Injectable()
export class MyIntl extends NxDatepickerIntl {
  calendarLabel = 'My Calendar';                /** used by screen readers */
  openCalendarLabel = 'Open my calendar';       /** used by screen readers */
  prevMonthLabel = 'My previous month';         /** used by screen readers */
  nextMonthLabel = 'My next month';             /** used by screen readers */
  prevYearLabel = 'My previous year';           /** used by screen readers */
  nextYearLabel = 'My next year';               /** used by screen readers */
  prevMultiYearLabel = 'My previous 20 years';  /** used by screen readers */
  nextMultiYearLabel = 'My next 20 years';      /** used by screen readers */
  switchToMonthViewLabel = 'Choose a special date';
  switchToMultiYearViewLabel = 'Choose button';
}

/**
* @title Localizing labels and messages example
*/
@Component({
  templateUrl: './datefield-localize-texts-example.html',
  providers: [
    {provide: NxDatepickerIntl, useClass: MyIntl}
  ]
})

export class DatefieldLocalizeTextsExampleComponent {
  currentDate: Moment = null;
}
