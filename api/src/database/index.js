import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import Product from '../app/models/Product.js';
import User from '../app/models/User.js';
import Category from '../app/models/Category.js';

import configDatabase from '../config/database.cjs';

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models),
      );
  }

  mongo() {
    // Sem o catch, uma credencial errada vira unhandled rejection e derruba a
    // API inteira — inclusive catalogo e login, que nao dependem do Mongo.
    // Apenas as rotas de pedidos ficam indisponiveis.
    this.mongoConnection = mongoose
      .connect(process.env.MONGO_URL)
      .catch((err) => {
        console.error('Falha ao conectar no MongoDB:', err.message);
      });
  }
}

export default new Database();
