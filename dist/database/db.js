"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const knexfile = require('./knexfile');
const env = process.env.NODE_ENV || 'development';
const configOptions = knexfile[env];
exports.db = knex_1.default(configOptions);
