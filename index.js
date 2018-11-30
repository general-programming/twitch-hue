/*--------------------------------------------------------------
 *  Copyright (c) general-programming. All rights reserved.
 *  Licensed under the GNU General Public License.
 * 
 *  Authored by linuxgemini
 *-------------------------------------------------------------*/

"use strict";

const twitch_hue = require("./classes/index");
const conf = require("./config");
const client = new twitch_hue.Client(conf);

client.initiateClient();
