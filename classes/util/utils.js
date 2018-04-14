/*--------------------------------------------------------------
 *  Copyright (c) general-programming. All rights reserved.
 *  Licensed under the GNU General Public License.
 *-------------------------------------------------------------*/

"use strict";

class utils {
    constructor() {}
    
    static * range(begin, end, interval = 1) {
        for (let i = begin; i < end; i += interval) {
            yield i;
        }
    }

    static returnSubType(months) {
        if (typeof(months) !== "number") throw new Error("Given variable is NaN");
        let type;
        if (months >= 24) {
            type = 24;
        } else if (months >= 12) {
            type = 12;
        } else if (months >= 6) {
            type = 6;
        } else if (months >= 3) {
            type = 3;
        } else if (months >= 1) {
            type = 1;
        }
        return type;
    }

    static returnCheerTier(bits, cheerTiers) {
        if (!bits || !cheerTiers) throw new Error("One or more variables are not provided.");
        if (typeof (cheerTiers) !== "object" || Array.isArray(cheerTiers)) throw new Error("Cheer bits has to be in an object key.");
        let ranges = Object.values(cheerTiers).sort((a, b) => a - b);
        let rangePairs = ranges.reduce((result, value, index, array) => {
            if (index % 2 === 0)
                result.push(array.slice(index, index + 2));
            return result;
        }, []);

        if (ranges.length === 0 || rangePairs.length === 0) throw new Error("Cheer tiers are not supplied.");

        let lastMinimum, lastMaximum;
        for (const key in rangePairs) {
            let arr = rangePairs[key];
            let numKey = parseInt(key);
            if (arr.length === 1 && key !== 0)  {
                arr[1] = arr[0];
                arr[0] = lastMaximum;
            } else if (arr.length === 1 && key === 0) {
                if (bits >= arr[0]) return (numKey + 1);
                return NaN;
            }
            lastMinimum = arr[0];
            lastMaximum = arr[1];
            if (bits >= lastMinimum && bits <= lastMaximum) return (numKey + 1);
        }
    }
}

module.exports = utils;