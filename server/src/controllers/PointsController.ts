import { Request, Response } from 'express';

import knex from '../database/connections'

class PointsController {
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

            //cria uma transacao no BD para caso algo der erro na gravacao
            

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

            //
          

            return response.json({
                id: points_id,
                ...point,
            });

        } catch (error) {
            response.json({
                error: true,
                message: error.message
            });
        };
    };
};

export default PointsController;