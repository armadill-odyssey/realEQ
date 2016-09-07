'use strict';
import * as math from 'mathjs';


function rectWindow(n) {
    return n >= 0 ? 1 : 0;
}

function hannWindow(n, N) {
    return 0.5 * (1 - Math.cos((2 * Math.PI * n) / N - 1) );
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
            sum += input[k] * (delta[n-k] || 0);
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
function fir(nthOrder, cutoff, window=rectWindow) {
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
 * Discrete Fourier Transform
 * @param input, input signal array
 * @returns {Array}, output of signal, made up of complex numbers
 */
function dft(input) {
    let out = [];
    let N = input.length;
    for (let n = 0; n < N; n++) {
        let exponent = -(2 * math.PI * n) / N;
        let complex = math.pow(math.E, math.complex(0, exponent) );
        out[n] = math.multiply(input[n], complex);
    }
    return out;
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



// api
export {
    rectWindow,
    hannWindow,
    angularFreq,
    fir,
    dft,
}