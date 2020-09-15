import { Component } from '@angular/core';

/**
* @title Side navigation Methods
*/
@Component({
  selector: 'nx-sidebar-methods-example',
  styleUrls: ['sidebar-methods-example.css'],
  templateUrl: './sidebar-methods-example.html'
})
export class SidebarMethodsExampleComponent {
  actions = [
    {
      icon: 'file-text',
      label: 'All Files',
      query: { a: 1 }
    },
    {
      icon: 'calendar',
      label: 'Calendar',
      query: { a: 2 }
    },
    {
      icon: 'mail-o',
      label: 'Email',
      query: { a: 3 }
    },
    {
      icon: 'user-business-o',
      label: 'My Profile',
      query: { a: 4 }
    },
    {
      icon: 'file',
      label: 'Recent Downloads',
      query: { a: 5 }
    }
  ];
}
