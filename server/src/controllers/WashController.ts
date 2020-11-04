import { Request, Response } from 'express'

import knex from '../database/connections'

class WashController {
  async index(request: Request, response: Response) {

    //cria uma variavel que faz um SELECT em todas as colunas da Table WASH
    const wash = await knex('wash').select('*');

    //cria uma variavel que Serializa a forma do return de Toda a SELECAO
    const serializedWash = wash.map((wash) => {
      return {
        id: wash.id,
        title: wash.title,
        image_url: `http://localhost:3333/assets/${wash.image}`
      }
    })
    return response.status(200).json(serializedWash);

  };
}

export default WashController;