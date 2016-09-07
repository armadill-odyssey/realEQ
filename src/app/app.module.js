'use strict';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { EQComponent }  from './eq';
import { ImpulseComponent }  from './impulse';

@NgModule({
    imports: [ BrowserModule ],
    declarations: [ AppComponent, EQComponent, ImpulseComponent ],
    bootstrap:    [ AppComponent ]
})
class AppModule {
    constructor () {}
}

export { AppModule };
