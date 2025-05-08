"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    // 创建用户表
    await knex.schema.createTable('users', (table) => {
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
    await knex.schema.createTable('commissions', (table) => {
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
    await knex.schema.createTable('settlements', (table) => {
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
    await knex.schema.createTable('platform_earnings', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('settlement_id').notNullable();
        table.decimal('amount', 10, 2).notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        // 添加外键约束
        table.foreign('settlement_id').references('id').inTable('settlements');
    });
    // 创建用户收益表
    await knex.schema.createTable('user_earnings', (table) => {
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
}
async function down(knex) {
    // 按依赖关系顺序删除表
    await knex.schema.dropTable('user_earnings');
    await knex.schema.dropTable('platform_earnings');
    await knex.schema.dropTable('settlements');
    await knex.schema.dropTable('commissions');
    await knex.schema.dropTable('users');
}
//# sourceMappingURL=20240320000000_create_settlement_tables.js.map