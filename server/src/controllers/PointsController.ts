import { Request, Response } from 'express';
import * as Yup from 'yup';

import knex from '../database/connections'

class PointsController {

  async index(request: Request, response: Response) {
    const { city, uf, washs } = request.query;

    //serializa o query Wash para um array sem espacos entre a virgula
    const parsedWash = String(washs).split(',').map(wash => Number(wash.trim()));

    // faz um join na tabela Points_wash para pegar o ID da lavagem que seja igual ao passado no Query
    //Onde tenha City e Uf
    //Selecionando por fim todos os pontos com essas informacoes contidas
    const points = await knex('points')
      .join('points_wash', 'points.id', '=', 'points_wash.points_id')
      .whereIn('points_wash.wash_id', parsedWash)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

      //serializa o retorna para o cliente com todos os pontos listados junto da URL da imagem cadastrada
    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://localhost:3333/uploads/${point.image}`,
      };
    });
    
    return response.status(200).json(serializedPoints);

  }

  async show(request: Request, response: Response) {

    const { id } = request.params;
    // procura no BD de Points onde o ID seja igual ao id passado na rota
    const point = await knex('points').where('id', id).first();

    //serializa o retorna para o cliente com o ponto listado junto da URL da imagem cadastrada
    const serializedPoint = {
      ...point,
      image_url: `http://localhost:3333/uploads/${point.image}`,
    };

    //caso o ponto n exista retorna um erro
    if (!point) {

      return response.status(401).json({ error: "Id not Found!" })

    }
    //faz um join na tabela Points_Wash para pegar o ID da lavagem que seja igual ao ID cadastrado
    const washs = await knex('wash')
      .join('points_wash', 'wash.id', '=', 'points_wash.wash_id')
      .where('points_wash.points_id', id)
      .select('wash.title')

    return response.status(200).json({ point: serializedPoint, washs });

  }
  async create(request: Request, response: Response) {

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

    const trx = await knex.transaction();

    //grava todas as variaveis do corpo da requisicao em um OBJETO 
    const point = {
      image: request.file.filename,
      name,
      email,
      price,
      whatsapp,
      longitude,
      latitude,
      uf,
      city,
    };

    //gera validacoes para o usuario
    const schema = Yup.object().shape({

      name: Yup.string().required(),
      email: Yup.string().email().required(),
      price: Yup.number().required(),
      whatsapp: Yup.string().required().min(10),
      longitude: Yup.number().required(),
      latitude: Yup.number().required(),
      uf: Yup.string().min(2).required(),
      city: Yup.string().required()
    })

    await schema.validate(point, {
      abortEarly: false
    })
    //pega todos os IDS da insercao feita no BD com todas as variaves de POINTS
    const insertedIds = await trx('points').insert(point);

    //cria uma variavel que armavena o id da Gravacao
    const points_id = insertedIds[0];

    //serializa o retorno dos IDS dos pontos e Washs para um array que elimine espacos entre cada valor
    const pointWash = wash
      .split(',')
      .map((wash: string) => Number(wash.trim()))
      .map((wash_id: number) => {
        return {
          wash_id,
          points_id,
        };
      })

    //grava a serializacao na tabela Poinst_Wash
    await trx('points_wash').insert(pointWash)

    await trx.commit();

    return response.status(201).json({
      id: points_id,
      ...point,
    });
  };
};

export default PointsController;