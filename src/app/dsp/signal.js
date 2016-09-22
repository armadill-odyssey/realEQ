'use strict';
import * as math from 'mathjs';


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

export default Signal
