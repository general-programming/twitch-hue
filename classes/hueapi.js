/*--------------------------------------------------------------
 *  Copyright (c) general-programming. All rights reserved.
 *  Licensed under the GNU General Public License.
 *  Author: linuxgemini
 *-------------------------------------------------------------*/

"use strict";

const huejay = require("huejay");
const colors = require("./db/colors.js");
const colorEffects = require("./db/effect_colors.js");
const utils = require("./util/utils");

class twHue extends huejay.Client {
    constructor(options = {}) {
        super(options);
        this.twColors = colors;
        this.twColorEffects = colorEffects;
    }

    initLamp(type, amount) {
        if (!type || !amount) throw new Error("One or more variables are not provided");
        switch (type) {
            case "sub":
                var subTier = utils.returnSubType(amount);
                // gonna finish here
                break;
        
            default:
                throw new Error("Type not provided");
        }
    }

}

module.exports = twHue;