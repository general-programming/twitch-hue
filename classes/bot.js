/*--------------------------------------------------------------
 *  Copyright (c) general-programming. All rights reserved.
 *  Licensed under the GNU General Public License.
 *
 *  Authored by linuxgemini
 *-------------------------------------------------------------*/

"use strict";

const tmi = require("tmi.js");
const logger = require("./logger");
const hueAPI = require("./hueapi");
const utils = require("./util/utils"); // eslint-disable-line no-unused-vars

class TwitchBot extends tmi.Client {
    constructor(config = {}) {
        super(config.options);
        this.twhueOptions = config;
        this.logger = logger;
        this.twhue = new hueAPI({
            host: this.twhueOptions.hueIP,
            port: 80, // Optional
            username: this.twhueOptions.hueUsername,
            timeout: 15000, // Optional, timeout in milliseconds (15000 is the default)
        }, {
            hueLamps: this.twhueOptions.hueLamps,
            timeBetweenAlerts: this.twhueOptions.timeBetweenAlerts,
            cheerOptions: this.twhueOptions.cheerOptions
        });
    }

    _initiateEvents() {
        return new Promise (async (resolve) => {
            this.on("connected", () => {
                this.logger.log(`Successfully connected to ${this.twhueOptions.options.channels.join(", ")}`, "ready");
            });
            this.on("disconnected", (reason) => {
                this.logger.error(`Disconnected! Reason: ${reason}`);
            });
            this.on("resub", (channel, uname, months, msg, userstate) => {  // eslint-disable-line no-unused-vars
                let username = userstate["login"] || uname;
                this.logger.sub(`${username} resubbed for ${months} months!`); //Print username of the subscriber to console
                this.twhue.initLamp("sub", months);
            });
            this.on("cheer", (channel, userstate) => {
                if (userstate.bits >= this.twhueOptions.cheerLimit) { //If users bit amount is not bigger that Hue trigger amount dont go in. You can change this in config.js
                    this.logger.cheer(`${userstate.login} has cheered ${userstate.bits} bit(s)!`);
                    this.twhue.initLamp("cheer", userstate.bits);
                }
            });
            process.on("uncaughtException", (err) => {
                this.logger.error(err.stack);
            });
            process.on("unhandledRejection", (reason) => {
                this.logger.error(reason.stack);
            });
            resolve(true);
        });
    }

    initiateClient() {
        return new Promise(async (resolve, reject) => {
            try {
                await this._initiateEvents();
                await this.connect();
                await this.raw("CAP REQ :twitch.tv/membership");
                await this.raw("CAP REQ :twitch.tv/commands");
                await this.raw("CAP REQ :twitch.tv/tags");
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = TwitchBot;