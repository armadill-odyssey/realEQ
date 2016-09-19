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

        let impulse = dsp.generateSignal(dsp.kroneckerDelta, 32);

        let signal = dsp.dft(impulse);

        let frequencies = Object.keys(signal);

        let complexFreqs = frequencies.map(key => signal[key]);
        let freqAmplitudes = dsp.toReal(complexFreqs);
        let freqData = [];
        let dbAmps = dsp.ampToDbfs(freqAmplitudes);

        for (var i=0; i < frequencies.length; i++) {
            freqData[i] = {
                x: frequencies[i],
                y: dbAmps[i]
            };
        }

        let realEqChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    data: freqData,
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 2,
                    pointRadius: 0,
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
                            min: -24,
                            max: 18,
                            fixedStepSize: 6,
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
