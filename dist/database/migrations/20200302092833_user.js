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
        yield knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        return knex.schema.createTable('users', (table) => {
            table
                .uuid('id')
                .unique()
                .notNullable()
                .primary()
                .defaultTo(knex.raw('uuid_generate_v4()'));
            table.string('first_name').notNullable;
            table.string('last_name').notNullable;
            table.string('email').notNullable;
            table.string('country');
            table.string('street');
            table.string('phone');
            table.string('language');
            table.boolean('ishost');
            table.timestamp('joined_date');
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable('users');
    });
}
exports.down = down;
