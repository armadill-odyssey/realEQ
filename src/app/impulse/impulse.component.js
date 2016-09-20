'use strict';

import {
	Component,
	OnInit
} from '@angular/core';
import {
	Chart
} from 'chart.js';
import * as math from 'mathjs';
import * as dsp from '../shared/dsp';

@Component({
	selector: 'impulse',
	template: `<div id="impulse"><canvas></canvas>
    <div class="settings float-right">
    <label>Display
      <select [(ngModel)]="chart.type" (ngModelChange)="render($event)">
        <option value="bar">Stem</option>
        <option value="line">Smooth</option>
      </select>
    </label>
    </div></div>`,
})
class ImpulseComponent implements OnInit {
	constructor() {
    // chart defaults
    this.chart = {
      type: 'line',
      signal: null
    }

  }


	ngOnInit() {

		this.render();
	}

	render() {
		const ctx = document.getElementById('impulse').querySelector('canvas');

		let impulse = dsp.generateSignal(dsp.kroneckerDelta, 32);

		let b = dsp.dft(impulse);
		let c = dsp.idft(b, 32);
		let frequencies = Object.keys(c);

		let complexFreqs = frequencies.map(key => c[key]);
		let freqAmplitudes = dsp.toReal(complexFreqs);

		let freqLabels = frequencies.map(f => {
      if (f % 10 === 0) return f;
      else return '';
    })


		let impulseChart = new Chart(ctx, {
			type: this.chart.type,
			data: {
				labels: freqLabels,
				datasets: [{
					data: freqAmplitudes,
					backgroundColor: 'rgba(220,220,220, .5)',
          pointRadius: 0,
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
					display: true,
					text: 'Impulse Response',
				},
				scales: {
					xAxes: [{
						categoryPercentage: .5,
						barPercentage: .2,
						// type: 'linear',
						position: 'bottom',
						scaleLabel: {
							display: true,
							labelString: 'N Samples',
						}
					}],
					yAxes: [{
						type: 'linear',
						scaleLabel: {
							display: true,
							labelString: 'Amplitude',
						}
					}],
				},
			}
		});
		window.impulseChart = impulseChart
	}
}

export {
	ImpulseComponent
};
