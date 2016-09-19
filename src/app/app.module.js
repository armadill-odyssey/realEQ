'use strict';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';
import { EQComponent }  from './eq';
import { ImpulseComponent }  from './impulse';

@NgModule({
    imports: [ BrowserModule, FormsModule ],
    declarations: [ AppComponent, EQComponent, ImpulseComponent ],
    bootstrap:    [ AppComponent ]
})
class AppModule {
    constructor () {}
}

export { AppModule };
