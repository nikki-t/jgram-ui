import { Component, Input } from '@angular/core';

/**
 * Displays error messages contained in the 'errors' array.
 */
@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent {

  @Input() errors: Array<string>;

  constructor() { }

}
