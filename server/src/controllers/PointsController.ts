import { Request, Response } from 'express';

import knex from '../database/connections'

class PointsController {

    async index(request: Request, response: Response) {
        const { city, uf, washs } = request.query;

        try {
            const parsedWash = String(washs).split('.').map(wash => Number(wash.trim()));

            const points = await knex('points')
                .join('points_wash', 'points.id', '=', 'points_wash.points_id')
                .whereIn('points_wash.wash_id', parsedWash)
                .where('city', String(city))
                .where('uf', String(uf))
                .distinct()
                .select('points.*')

            return response.status(200).json(points);
        } catch (error) {
            return response.status(401).json({ message: error.message, error: "Point not Found" })
        }

    }

    async show(request: Request, response: Response) {

        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {

            return response.status(401).json({ error: "Id not Found!" })

        }

        const washs = await knex('wash')
            .join('points_wash', 'wash.id', '=', 'points_wash.wash_id')
            .where('points_wash.points_id', id)
            .select('wash.title')

        return response.status(200).json({ point, washs });

    }
    async create(request: Request, response: Response) {

        try {
            //pega todas as variaves do corpo da requisicao 
            const {
                name,
                email,
                whatsapp,
                longitude,
                latitude,
                uf,
                price,
                city,
                wash,
            } = request.body;

            //grava todas as variaveis do corpo da requisicao em um OBJETO 
            const point = {
                image: "image-fake",
                name,
                email,
                price,
                whatsapp,
                longitude,
                latitude,
                uf,
                city,
            };

            //pega todos os IDS da insercao feita no BD com todas as variaves de POINTS
            const insertedIds = await knex('points').insert(point);

            //cria uma variavel que armavena o id da Gravacao
            const points_id = insertedIds[0];

            //serializa uma variavel com o retorno do ID da lavagem e o ID do ponto cadastrado
            const pointWash = wash.map((wash_id: Number) => {
                return {
                    wash_id,
                    points_id,
                };
            });

            //grava a serializacao na tabela Poinst_Wash
            await knex('points_wash').insert(pointWash)

            return response.status(201).json({
                id: points_id,
                ...point,
            });

        } catch (error) {
            return response.status(401).json({
                error: "Creation Failed.",
            });
        };
    };
};

export default PointsController;