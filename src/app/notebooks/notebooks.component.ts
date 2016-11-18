import {Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppStore} from '../app.store';

@Component({
  selector: 'notebooks',
  providers: [],
  template: require('./notebooks.html'),
  directives: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Notebooks {

}