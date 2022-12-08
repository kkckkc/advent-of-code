declare global {
  interface Array<T> {
    "sum": () => number,
    "num": () => number[],
    "max": () => number,
    "min": () => number,
    "sortNum": () => number[],
    "splitOn": (fn: ((t: T) => boolean)) => T[][],
    "splitAt": (n: number) => T[][],
    "splitBefore": (n: number) => T[][],
    "splitAfter": (n: number) => T[][],
  }

  interface Object {
    copyDeep: () => any;
  }
}

export const applyPatches = () => {
  Object.defineProperties(Object.prototype, {
		copyDeep: {
			value: function() {
				return JSON.parse(JSON.stringify(this))
			},
			configurable: true
		}
	})

  Object.defineProperties(Array.prototype, {
    sum: {
      value: function() {
        return this.reduce((a, b) => a + b, 0)
      },
      configurable: true
    },
    num: {
      value: function() {
        return this.map(e => +e);
      },
      configurable: true
    },
    sortNum: {
      value: function() {
        return this.sort((a, b) => a - b);
      },
      configurable: true
    },
    max: {
      value: function() {
        return this.length === 0 ? undefined : Math.max(...this);
      },
      configurable: true
    },
    min: {
      value: function() {
        return this.length === 0 ? undefined : Math.min(...this);
      },
      configurable: true
    },
    splitOn: {
      value: function(fn) {
        let arr = [[]]

				for (let i = 0; i < this.length; i++) {
					if (fn(this[i], i)) {
						arr.push([])
					} else {
						arr[arr.length - 1].push(this[i])
					}
				}

				return arr
      },
      configurable: true
    },
    splitAt: {
      value: function(idx) {
        return [this.slice(0, idx), this.slice(idx + 1)]
      }      
    },
    splitBefore: {
      value: function(idx) {
        return [this.slice(0, idx), this.slice(idx)]
      }      
    },
    splitAfter: {
      value: function(idx) {
        return [this.slice(0, idx + 1), this.slice(idx + 1)]
      }      
    }
  });
}

export default {};

