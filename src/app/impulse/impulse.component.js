'use strict';

import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as math  from 'mathjs';
import * as dsp from '../shared/dsp';

@Component({
    selector: 'impulse',
    template: `<div id="impulse"><canvas></canvas></div>`,
})
class ImpulseComponent implements OnInit {
    constructor() {
    }


    ngOnInit() {

        this.render();
    }

    render() {
        const ctx = document.getElementById('impulse').querySelector('canvas');

        let impulse = dsp.fir(20, .2);
        console.log(impulse);
        let k = -1;
        let labels = Array.apply(null, Array(impulse.length)).map(() => {
            k++;
            if (k % 5 === 0) return k;
            else return '';
        });

        let impulseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: impulse,
                    backgroundColor: '#29B6F6',
                    borderColor: '#29B6F6',
                    borderWidth: 2,
                }],
            },
            options: {
                tooltips: {
                    enabled: false,
                },
                legend: {
                    display: false,
                },
                title: {
                    display:true,
                    text: 'Impulse Response',
                },
                scales: {
                    xAxes: [{
                        categoryPercentage:.5,
                        barPercentage: .2,
                        //type: 'linear',
                        //position: 'bottom',
                        ticks: {
                            fixedStepSize: 2,
                            //min:0,
                            //max:10,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'N Samples',
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Amplitude',
                        }
                    }],
                },
            }
        });
    }
}

export { ImpulseComponent };
