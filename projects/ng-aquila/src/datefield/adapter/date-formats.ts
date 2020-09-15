import { InjectionToken } from '@angular/core';

/** @docs-private */
export type NxDateFormats = {
  parse: {
    dateInput: any
  },
  display: {
    dateInput: any,
    monthYearLabel: any,
    dateA11yLabel: any,
    monthYearA11yLabel: any
  }
};

export const NX_DATE_FORMATS = new InjectionToken<NxDateFormats>('nx-date-formats');
