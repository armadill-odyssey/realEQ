'use strict';

import { Component } from '@angular/core';

import { EQComponent } from './eq';
import { ImpulseComponent } from './impulse';

@Component({
    selector: 'real',
    templateUrl: './app.component.html',
    styles: ['', require('./app.component.less')],
})
class AppComponent implements OnInit {
    constructor () {}

    ngOnInit() {
    }
}

export { AppComponent }
