import express from 'express';
import routes from './routes.js';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';

import './database/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

class App {
  constructor() {
    this.app = express();

    const origins = process.env.CORS_ORIGIN;

    // O header Origin nunca traz barra final; normalizamos para que
    // "https://site.app/" e "https://site.app" sejam equivalentes.
    const permitidas = origins
      ? origins
          .split(',')
          .map((o) => o.trim().replace(/\/+$/, ''))
          .filter(Boolean)
      : null;

    this.app.use(
      cors({
        origin: permitidas || '*',
      }),
    );

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(
      '/product-file',
      express.static(resolve(__dirname, '..', 'uploads')),
    );

    this.app.use(
      '/category-file',
      express.static(resolve(__dirname, '..', 'uploads')),
    );
  }

  routes() {
    this.app.use(routes);
    this.errorHandler();
  }

  errorHandler() {
    // eslint-disable-next-line no-unused-vars
    this.app.use((err, request, response, next) => {
      console.error(err);

      if (response.headersSent) return;

      response.status(500).json({ error: 'Erro interno no servidor' });
    });
  }
}

export default new App().app;
