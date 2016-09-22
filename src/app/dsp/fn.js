'use strict';
import * as math from 'mathjs';

/**
* Hann window function
* @param n : current sample to evaluate
* @param N : number of samples for signal
*/
export function hannWindow(n, N) {
	return 0.5 * (1 - Math.cos((2 * Math.PI * n) / N - 1));
}

/**
  * Rectangular window function
  * Returns 1 for any input
  * @param n : input
  */
export function rectWindow(n) {
	return 1
}

/**
  * Creates an ideal low pass filter
  * @param cutoff : cutoff Frequency
  * @returns function : Any input below or equal to the cutoff returns 1,
  *                     and returns 0 elsewhereamp
  */
export function idealLowPass(cutoff) {
	return function (input) {
		if (input <= cutoff) return 1;
		else return 0;
	}
}

export function kroneckerDelta(input) {
	return input === 0 ? 1 : 0;
}

export function pulse(input) {
	return input % 2 === 0 ? 1 : 0;
}

export function rect(input) {
	if (input >= -1 && input <= 1) return 1;
	else return 0;
}
