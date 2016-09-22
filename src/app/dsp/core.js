'use strict';
import * as math from 'mathjs';

export function impulseResponse(input, order) {
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
export function fir(nthOrder, cutoff, window = rectWindow) {
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


export function logSignal(length) {
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
export function convolve(f, g, N, M) {
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
