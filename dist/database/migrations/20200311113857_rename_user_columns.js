"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.alterTable('users', (table) => {
            table.renameColumn('first_name', 'firstName');
            table.renameColumn('last_name', 'lastName');
            table.renameColumn('joined_date', 'joinedDate');
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.alterTable('users', (table) => {
            table.renameColumn('firstName', 'first_name');
            table.renameColumn('lastName', 'last_name');
            table.renameColumn('joinedDate', 'joined_date');
        });
    });
}
exports.down = down;
