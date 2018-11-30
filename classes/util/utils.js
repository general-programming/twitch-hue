/*--------------------------------------------------------------
 *  Copyright (c) general-programming. All rights reserved.
 *  Licensed under the GNU General Public License.
 * 
 *  Authored by linuxgemini
 *-------------------------------------------------------------*/

"use strict";

class utils {
    constructor() {}
    
    static getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static returnRandomHue(range) {
        if (!(range instanceof Array)) throw new Error("Range is not an array.");
        if (!range.some(isNaN)) throw new Error("Range array contains a variable thats not a number.");
        if (range.length !== 2) throw new Error("Range values are missing or overdone. It should be: [min, max]");
        range = range.sort((a, b) => a - b);
        return this.getRandomIntInclusive(range[0], range[1]);
    }

    static returnSubType(months) {
        if (isNaN(months)) throw new Error("Given variable is NaN");
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
        if (cheerTiers.constructor !== Object) throw new Error("Cheer bits has to be in an object key.");
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