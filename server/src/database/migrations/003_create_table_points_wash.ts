import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('points_wash', table => {
        table.increments('id').primary();
        //cria uma referencia no campo ID da Tabela points  
        table.integer("points_id")
            .notNullable()
            .references('id')
            .inTable('points');

        //cria uma referencia no campo ID da tabela wash
        table.integer('wash_id')
            .notNullable()
            .references('id')
            .inTable('wash');
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('points_wash');
}