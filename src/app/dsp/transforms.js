'use strict';
import * as math from 'mathjs';
import {
	generateSignal,
} from './util'

/**
 * Discrete Fourier Transform O(N^2)
 * @param input, input signal array
 * @returns {Array}, output of signal, made up of complex numbers
 */
export function dft(input) {
	let out = {};
	let N = input.length;
	const maxFreq = 22000;
	let base = Math.pow(maxFreq, 1 / N);
	let testFreqs = generateSignal(n => {
		return Math.round(Math.pow(base, n));
	}, N, 0);

	testFreqs = testFreqs.filter(f => f >= 10);

	for (let k = 0; k < testFreqs.length; k++) {
		let val = 0;
		for (let n = 0; n < N; n++) {
			let exponent = -(2 * math.PI * n * testFreqs[k]) / N;
			let complex = math.pow(math.E, math.complex(0, exponent));
			val = math.add(val, math.multiply(input[n], complex));
		}

		out[testFreqs[k]] = val;
	}
	return out;
}

/**
 * Cooley-Turkey Algorithm O(NlogN)
 * @param input
 */
export function fft(input) {
	let N = input.length;

	for (let n = N; n >= 2; n = n / 2) {
		if (n % 2 !== 0) throw 'FFT: Input length (N) must be base 2';
	}

	let output = (function radix2(x) {
		let n = x.length;
		if (n === 1) {
			return math.complex(x[0], 0);
		} else {
			let half1input = x.slice(0, (n / 2));
			let half1 = radix2(half1input);

			let half2input = x.slice(n / 2);
			let half2 = radix2(half2input);

			var out = [].concat(half1, half2);

			for (let k = 0; k < (n / 2); k++) {
				let t = out[k];

				let complex = math.complex(0, -2 * math.pi * (k / n));
				let exponent = math.pow(math.E, complex);
				let val = math.multiply(exponent, out[k + (n / 2)]);

				out[k] = math.add(t, val);
				out[k + (n / 2)] = math.subtract(t, val);
			}
			return out;
		}

	})(input);

	return output;
}


export function idft(input, N) {
	let out = [];
	let frequencies = Object.keys(input);

	for (let n = 0; n < N; n++) {
		let val = 0;
		for (let k = 0; k < frequencies.length; k++) {
			let exponent = (2 * math.PI * n * frequencies[k]) / N;
			let complex = math.pow(math.E, math.complex(0, exponent));
			val = math.add(val, math.multiply(input[frequencies[k]], complex));
		}
		out[n] = math.multiply((1 / N), val);
	}
	return out;
}
