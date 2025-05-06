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
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        // 创建用户表
        yield knex.schema.createTable('users', (table) => {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.string('username').notNullable().unique();
            table.string('email').notNullable().unique();
            table.string('password_hash').notNullable();
            table.uuid('referrer_id').nullable();
            table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
            table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
            // 添加外键约束
            table.foreign('referrer_id').references('id').inTable('users');
        });
        // 创建佣金表
        yield knex.schema.createTable('commissions', (table) => {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('user_id').notNullable();
            table.decimal('amount', 10, 2).notNullable();
            table.string('status').notNullable().defaultTo('pending');
            table.jsonb('details').nullable();
            table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
            table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
            // 添加外键约束
            table.foreign('user_id').references('id').inTable('users');
        });
        // 创建结算表
        yield knex.schema.createTable('settlements', (table) => {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('user_id').notNullable();
            table.decimal('amount', 10, 2).notNullable();
            table.jsonb('commission_ids').notNullable();
            table.string('status').notNullable().defaultTo('pending');
            table.decimal('platform_share', 10, 2).notNullable();
            table.decimal('level1_share', 10, 2).notNullable();
            table.decimal('level2_share', 10, 2).notNullable();
            table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
            table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
            // 添加外键约束
            table.foreign('user_id').references('id').inTable('users');
        });
        // 创建平台收益表
        yield knex.schema.createTable('platform_earnings', (table) => {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('settlement_id').notNullable();
            table.decimal('amount', 10, 2).notNullable();
            table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
            // 添加外键约束
            table.foreign('settlement_id').references('id').inTable('settlements');
        });
        // 创建用户收益表
        yield knex.schema.createTable('user_earnings', (table) => {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('user_id').notNullable();
            table.uuid('settlement_id').notNullable();
            table.decimal('amount', 10, 2).notNullable();
            table.integer('level').notNullable(); // 1 表示第一代，2 表示第二代
            table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
            // 添加外键约束
            table.foreign('user_id').references('id').inTable('users');
            table.foreign('settlement_id').references('id').inTable('settlements');
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        // 按依赖关系顺序删除表
        yield knex.schema.dropTable('user_earnings');
        yield knex.schema.dropTable('platform_earnings');
        yield knex.schema.dropTable('settlements');
        yield knex.schema.dropTable('commissions');
        yield knex.schema.dropTable('users');
    });
}
exports.down = down;
//# sourceMappingURL=20240320000000_create_settlement_tables.js.map