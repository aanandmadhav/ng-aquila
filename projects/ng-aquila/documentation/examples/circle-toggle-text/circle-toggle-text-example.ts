import { Component } from '@angular/core';

/** @title Circle text example */
@Component({
  templateUrl: './circle-toggle-text-example.html',
  styleUrls: ['./circle-toggle-text-example.css']
})
export class CircleToggleTextExampleComponent {
  sampleValues = [
    { value: 'A', circleText: 'Yes', selected: true },
    { value: 'B', circleText: 'No', selected: false },
  ];
}
