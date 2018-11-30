/*--------------------------------------------------------------
 *  Copyright (c) general-programming. All rights reserved.
 *  Licensed under the GNU General Public License.
 *
 *  Authored by linuxgemini
 *  Original code written by batubozkan and root0fallevil
 *-------------------------------------------------------------*/

"use strict";

const huejay = require("huejay");
const utils = require("./util/utils");
const { isUndefined } = require("util");

class twHue extends huejay.Client {
    constructor(options = {}, specialOpts = {
        hueLamps: [],
        timeBetweenAlerts: 3000,
        cheerOptions: {}
    }) {
        super(options);
        this.twColors = require("./db/colors.js");
        this.twColorEffects = require("./db/effect_colors.js");
        this.hueOptions = specialOpts;
        this.hueStatus = 0;
        this.hueJobQueue = [];
        this.logger = require("./logger");
    }

    initLamp(type, amount, colorType = null) {
        if (!type || !amount) throw new Error("One or more variables are not provided");
        if (typeof(type) !== "string" || isNaN(amount)) throw new Error("One or more variables are not valid.");

        var subTier, cheerTier;
        switch (type) {
            case "sub":
                subTier = utils.returnSubType(amount);
                colorType = `sub_${subTier}`;
                break;
            case "cheer":
                cheerTier = utils.returnCheerTier(amount, this.hueOptions.cheerOptions);
                if (isUndefined(cheerTier)) return null;
                colorType = `bit_t${cheerTier}`;
                break;
            case "override":
                break;
            default:
                throw new Error("Type not provided");
        }

        if (this.status === 1) {
            this.hueJobQueue.push(colorType);
            this.logger.log(`New job request (${colorType}) has been added to queue as there is an ongoing process.`);
            return;
        }

        this.status = 1;

        let effectObject = this.twColorEffects[colorType];
        let lampTimer = 0;

        let queueInterval = setInterval(async () => {
            await this.hueOptions.hueLamps.map(async (lampID) => {
                await this.changeColor(lampID, effectObject.colorName);
            });
            if (++lampTimer >= effectObject.blinkTime) {
                clearInterval(queueInterval);
                await this.hueOptions.hueLamps.map(async (lampID) => {
                    await this.changeColor(lampID, "normal");
                });
                this.status = 0;
                this.logger.log("Jobs Done! Checking queue for more jobs.");
                
                if (this.hueJobQueue.length > 0) {
                    this.logger.log("New job has been found!");
                    let newColorType = this.hueJobQueue[0];
                    this.hueJobQueue.shift();
                    setTimeout(() => {
                        this.initLamp("override", 0, newColorType);
                    }, this.hueOptions.timeBetweenAlerts);
                }
            }
        }, effectObject.blinkMS);
        return true;
    }

    changeColor(lampID, color) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!lampID || !color) throw new Error("One or more variables are not provided.");
                let light = await this.lights.getById(lampID);
                let hue = (this.twColors[color].isRandom ? utils.returnRandomHue(this.twColors[color].hueRange) : this.twColors[color].hue);
                let saturation = this.twColors[color].saturation;
                let brightness = (light.brightness !== this.twColors[color].brightness ? this.twColors[color].brightness : this.twColors[color].faded_brightness);
                light.hue = hue;
                light.saturation = saturation;
                light.brightness = brightness;
                await this.lights.save(light);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }

}

module.exports = twHue;