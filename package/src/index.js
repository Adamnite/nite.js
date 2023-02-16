/**
 *
 * Copyright (c)2023 Adamnite.
 *
 * This code is open-sourced under the MIT license.
 */

const version = require("../package.json").version;

let Nite = function Nite() {
  this.version = version;
};

Nite.version = version;

module.exports = Nite;
