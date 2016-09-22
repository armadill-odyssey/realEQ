'use strict';
import * as math from 'mathjs';


export function angularFreq(freq) {
	return 2 * math.pi * freq;
}


/**
 * Gets the real part of a Complex object
 * @param complexNums : Array of Complex's
 */
export function toReal(complexNums) {
	return complexNums.map((com) => com.re);
}

export function toImaginary(complexNums) {
	return complexNums.map((com) => com.im);
}


export function ampToDbfs(amplitudes) {
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

export function createRect(width) {
	let half = width / 2;
	return function (input) {
		if (input >= -half && input <= half) return 1;
		else return 0;
	}
}

export function createLogX(base) {
	const maxFreq = 22000;
	return function (val) {
		return Math.log(val) / Math.log(base);
	}
}

/**
 * Takes a Function and generates a signal of the specified length
 * @param fn : Function to run
 * @param length : Number, iterations of funtion
 * @returns {Array} : generated signal
 */
export function generateSignal(fn, length, start) {
	let out = [];
	start = start !== undefined ? start : -length / 2;
	for (var n = 0; n < length; n++) {
		out[n] = fn(n + start);
	}
	return out;
}
