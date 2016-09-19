'use strict';
import * as math from 'mathjs';


function rectWindow(n) {
	return n >= 0 ? 1 : 0;
}

function createRect(width) {
	let half = width / 2;
	return function (input) {
		if (input >= -half && input <= half) return 1;
		else return 0;
	}
}

function hannWindow(n, N) {
	return 0.5 * (1 - Math.cos((2 * Math.PI * n) / N - 1));
}

function angularFreq(freq) {
	return 2 * math.pi * freq;
}

function unitImpulse(length) {
	let impl = [1];
	for (let i = 0; i < length; i++) {
		impl.push(0);
	}
	return impl;
}

function impulseResponse(input, order) {
	let out = [];
	let delta = generateImpulse(order);
	for (let n = 0; n < input.length; n++) {
		let sum = 0;
		for (let k = 0; k < order; k++) {
			sum += input[k] * (delta[n - k] || 0);
		}
	}
}


/**
 * finite impulse response
 * @param nthOrder,
 * @param cutoff, normallized cutoff freq
 * @param window, window function to use for filter
 * @returns {Array} Filter coefficients, as a row vector of length n + 1
 */
function fir(nthOrder, cutoff, window = rectWindow) {
	let w_cutoff = this.angularFreq(cutoff);
	let coeff = w_cutoff / math.pi;

	let h = [coeff]; //impulse response of filter

	for (let n = 1; n <= nthOrder; n++) {
		// ideal
		//let filter = coeff * (math.sin(w_cutoff * n) / (math.pi * n));

		//approximation to perfect filter
		let filter = math.sin(w_cutoff * n) / (math.pi * n);
		// avoid NaN
		filter = filter || 0;
		// round to 0
		filter = math.abs(filter) < 0.00001 ? 0 : filter;

		//let w = window(n, nthOrder);

		//h[n] = filter * w;
		h[n] = filter;
	}

	return h;
}

/**
 * Discrete Fourier Transform O(N^2)
 * @param input, input signal array
 * @returns {Array}, output of signal, made up of complex numbers
 */
function dft(input) {
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

function idft(input, N) {
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

function createLogX(base) {
	const maxFreq = 22000;
	return function (val) {
		return Math.log(val) / Math.log(base);
	}
}

function logSignal(length) {
	const maxFreq = 25000;
	var out = [];
	for (let n = 0; n < length; n++) {
		out[n] = Math.pow(Math.E, n);
	}
	return out;
}

/**
 * Convolves two functions
 * @param f : first Fn
 * @param g : second Fn to Convolve
 * @param N : length of f to use in signal, length of output
 * @param M : length of g to use in signal
 * @returns {*}
 */
function convolve(f, g, N, M) {
	var output = Array(2 * N);

	for (var n = -N; n < N; n++) {
		var sample = 0;
		for (var m = -M; m < M; m++) {
			sample += f(n - m) * g(m);
		}
		output[n] = sample;
	}
	return output;
}

function generateNoise(seconds) {
	let samplingRate = 441;
	let length = samplingRate * seconds;
	let output = [];

	for (var i = 0; i < length; i++) {
		output.push(
			(Math.random() * 2) - 1
		);
	}
	return output;
}

/**
 * Takes a Function and generates a signal of the specified length
 * @param fn : Function to run
 * @param length : iterations of funtion
 * @returns {Array} : generated signal
 */
function generateSignal(fn, length, start) {
	let out = [];
	start = start !== undefined ? start : -length / 2;
	for (var n = 0; n < length; n++) {
		out[n] = fn(n + start);
	}
	return out;
}

function rect(input) {
	if (input >= -1 && input <= 1) return 1;
	else return 0;
}




/**
 * Cooley-Turkey Algorithm O(NlogN)
 * @param input
 */
function fft(input) {
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

function idealLowPass(cutoff) {
	return function (input) {
		if (input <= cutoff) return 1;
		else return 0;
	}
}

function kroneckerDelta(input) {
	return input === 0 ? 1 : 0;
}

function pulse(input) {
	return input % 2 === 0 ? 1 : 0;
}

/**
 * Gets the real part of a Complex object
 * @param complexNums : Array of Complex's
 */
function toReal(complexNums) {
	return complexNums.map((com) => com.re);
}

function toImaginary(complexNums) {
	return complexNums.map((com) => com.im);
}


function ampToDbfs(amplitudes) {
  let valueDBFS;
  if (Array.isArray(amplitudes)) {
    valueDBFS = amplitudes.map(a => {
      return 20 * math.log10(math.abs(a))
    })
  } else {
    valueDBFS = 20*log10(math.abs(amplitudes))
  }
  return valueDBFS
}

class Signal {
	constructor(fn) {
		this.fn = fn;
	}

	setCenterIndex(index) {
		if (this.length > index && index > 0) {
			this.centerIndex = index;
		}
	}

	generate(length, fnOrigin) {
		let out = [];
		fnOrigin = fnOrigin || length / 2;
		for (var n = 0; n < length; n++) {
			out[n] = this.fn(n - fnOrigin);
		}
		return out;
	}

}


// api
export {
	Signal,
	rectWindow,
	hannWindow,
	angularFreq,
	fir,
	dft,
	fft,
	convolve,
	kroneckerDelta,
	generateSignal,
	toReal,
	toImaginary,
	rect,
	idealLowPass,
	pulse,
	createRect,
	logSignal,
  idft,
  ampToDbfs,
}
