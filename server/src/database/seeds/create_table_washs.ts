import Knex from 'knex'

export async function seed(knex: Knex) {
    await knex('wash').insert([
        { title: 'Lavagem Simples', image: 'lavagem-completa.svg' },
        { title: 'Lavagem Completa', image: 'lavagem-simples.svg' },
        { title: 'Lavagem + Polimento', image: 'lavagem-polimento.svg' },
        { title: 'Lavagem a Seco', image: 'lavagem-seco.svg' },
        { title: 'Lavagem a Vapor', image: 'lavagem-vapor.svg' },
        { title: 'Eco-Lavagem', image: 'eco-lavagem.svg' },
        { title: 'Purificação de Ar', image: 'purificador-de-ar.svg' },
        { title: 'Higienização', image: 'higienizacao.svg' },
    ]);
};

/*
LAVAGEM SIMPLES
LAVAGEM COMPLETA
LAVAGEM + POLIMENTO
LAVAGEM A SECO
LAVAGEM A VAPOR
VARIAÇÃO: ECO-LAVAGEM
PURIFICAÇÃO DE AR
HIGIENIZAÇÃO
*/