import {NgModule} from '@angular/core';
import {NxPopoverTriggerDirective} from './popover-trigger.directive';
import {NxPopoverComponent} from './popover.component';
import {NxPopoverContentDirective} from './popover-content';
import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {NxIconModule} from '@aposin/ng-aquila/icon';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    NxIconModule
  ],
  declarations: [
    NxPopoverTriggerDirective,
    NxPopoverComponent,
    NxPopoverContentDirective
  ],
  exports: [
    NxPopoverTriggerDirective,
    NxPopoverComponent,
    NxPopoverContentDirective
  ]
})
export class NxPopoverModule {

}
