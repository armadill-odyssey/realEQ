'use strict';

import { Component, OnInit, Inject } from '@angular/core';
import { Chart } from 'chart.js';
import * as math  from 'mathjs';
import * as dsp from '../shared/dsp';

@Component({
    selector: 'eq',
    template: `<div id="realeq"><canvas></canvas></div>`,
})
class EQComponent implements OnInit {
    constructor() {
    }


    ngOnInit() {

        this.render();
    }

    render() {
        const ctx = document.getElementById('realeq').querySelector('canvas');

        let labels = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

        let realEqChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    data: [{
                        x: 10,
                        y: -18
                    }, {
                        x: 100,
                        y: -3
                    }, {
                        x: 1000,
                        y: 0
                    }, {
                        x: 10000,
                        y: 0
                    }, {
                        x: 20000,
                        y: 0
                    }],
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 2,
                    pointRadius: [0, 0, 0, 0, 0],
                    lineTension: 0.5,
                }]
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
                    text: 'Parametric Equalizer',
                },
                scales: {
                    xAxes: [{
                        type: 'logarithmic',
                        position: 'bottom',
                        ticks: {
                            min: 10,
                            max: 20000,
                            callback: function (val) {
                                if (labels.indexOf(val) >= 0) {
                                    if (val >= 1000) {
                                        return (val / 1000) + 'k';
                                    } else {
                                        return val.toString();
                                    }
                                } else {
                                    return '';
                                }
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Frequency (Hz)',
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                            min: -18,
                            max: 18,
                            fixedStepSize: 3,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Amplitude (dB)',
                        }
                    }]
                }
            }
        });
    }
}

export { EQComponent };
