/*--------------------------------------------------------------
 *  Copyright (c) general-programming. All rights reserved.
 *  Licensed under the GNU General Public License.
 *
 *  Authored by linuxgemini
 *  Original code written by eslachance
 *-------------------------------------------------------------*/

"use strict";

const tebesir = require("chalk");
const an = require("moment");

class logger {
    
    /**
     * Log something.
     * @param {string} content 
     * @param {"log" | "warn" | "error" | "debug" | "cmd" | "ready"} type 
     */
    static log(content, type = "log") {
        const tz = `[${an().format("YYYY-MM-DD HH:mm:ss")}]:`;

        switch (type) {
            case "log":
                return console.log(`${tz} ${tebesir.bgBlue(type.toUpperCase())} ${content} `);
            case "warn":
                return console.log(`${tz} ${tebesir.black.bgYellow(type.toUpperCase())} ${content} `);
            case "error":
                return console.log(`${tz} ${tebesir.bgRed(type.toUpperCase())} ${content} `);
            case "debug":
                return console.log(`${tz} ${tebesir.green(type.toUpperCase())} ${content} `);
            case "sub":
                return console.log(`${tz} ${tebesir.black.bgWhite(type.toUpperCase())} ${content}`);
            case "ready":
                return console.log(`${tz} ${tebesir.black.bgGreen(type.toUpperCase())} ${content}`);
            default:
                throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
        }
    }

    static error(...args) {
        this.log(...args, "error");
    }
    static warn(...args) {
        this.log(...args, "warn");
    }
    static debug(...args) {
        this.log(...args, "debug");
    }
    static sub(...args) {
        this.log(...args, "sub");
    }
    static cheer(...args) {
        this.log(...args, "cheer");
    }
}

module.exports = logger;