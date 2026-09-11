# DevBurger

Aplicação de delivery de hamburgueria com catálogo, carrinho, checkout via Stripe
e painel administrativo.

- **api/** — REST API em Node + Express, com Postgres (catálogo e usuários) e
  MongoDB (pedidos)
- **interface/** — SPA em React + Vite

## Stack

| Backend | Frontend |
|---|---|
| Express 4 | React 19 |
| Sequelize 6 + Postgres | Vite 8 |
| Mongoose 8 + MongoDB | styled-components 6 |
| JWT + bcrypt | React Router 7 |
| Multer (upload de imagens) | React Hook Form + Yup |
| Stripe | Stripe Elements, MUI |

## Pré-requisitos

- **Node 22**
- **Docker** (para Postgres e MongoDB)

## Subindo o projeto

### 1. Bancos de dados

```bash
docker run -d --name devburger-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=devburger \
  -p 5433:5432 \
  -v devburger-pgdata:/var/lib/postgresql/data \
  postgres:14-alpine

docker run -d --name devburger-mongo \
  -p 27018:27017 \
  -v devburger-mongodata:/data/db \
  mongo:5
```

As portas são 5433 e 27018 para não conflitar com um Postgres ou Mongo já
rodando nas portas padrão.

Nas próximas vezes, basta `docker start devburger-postgres devburger-mongo`.

### 2. API

```bash
cd api
npm install
cp .env.example .env
```

Preencha o `.env`:

```ini
APP_URL="http://localhost:3001"
APP_PORT=3001

JWT_SECRET="uma-chave-secreta-qualquer"
JWT_EXPIRES_IN="5d"

MONGO_URL="mongodb://localhost:27018/devburger"

PG_HOST="localhost"
PG_PORT=5433
PG_USERNAME="postgres"
PG_PASSWORD="postgres"
PG_DATABASE="devburger"

STRIPE_SECRET_KEY=""

# domínios liberados no CORS, separados por vírgula (vazio = qualquer origem)
CORS_ORIGIN=
```

> `APP_URL` não é só informativo: é o domínio usado para montar a URL das
> imagens devolvidas pela API.

Crie as tabelas e suba:

```bash
npx sequelize-cli db:migrate
npm run dev
```

A API sobe em `http://localhost:3001`.

### 3. Interface

```bash
cd interface
npm install
npm run dev
```

Abre em `http://localhost:5173`.

Em desenvolvimento não é preciso configurar nada — a interface assume
`http://localhost:3001`. Para apontar para outra API, crie um `.env.local`:

```ini
VITE_API_URL=https://sua-api.exemplo.com
```

## Primeiro acesso

O banco começa vazio. Crie uma conta em `/cadastro` — ela nasce como cliente
comum. Para acessar o painel administrativo, promova o usuário direto no banco:

```bash
docker exec devburger-postgres psql -U postgres -d devburger \
  -c "UPDATE users SET admin = true WHERE email = 'seu@email.com';"
```

Saia e entre novamente (o `admin` fica gravado no token).

Com o usuário admin, cadastre categorias e produtos em `/admin/novo-produto`.

## Rotas

**Cliente**

| Rota | |
|---|---|
| `/login`, `/cadastro` | autenticação |
| `/` | home com categorias e ofertas |
| `/cardapio` | catálogo, com filtro por categoria via `?categoria=<id>` |
| `/carrinho` | carrinho e resumo do pedido |
| `/checkout`, `/complete` | pagamento |

**Admin** (exige `admin = true`)

| Rota | |
|---|---|
| `/admin/pedidos` | lista pedidos e altera o status |
| `/admin/produtos` | lista produtos |
| `/admin/novo-produto` | cadastra produto |
| `/admin/editar-produto` | edita produto |

## API

Todas as rotas abaixo de `/sessions` exigem `Authorization: Bearer <token>`.

| Método | Rota | |
|---|---|---|
| POST | `/users` | cadastro |
| POST | `/sessions` | login, devolve o JWT |
| GET/POST/PUT | `/products` | produtos (POST e PUT em `multipart/form-data`, campo `file`) |
| GET/POST/PUT | `/categories` | categorias (idem) |
| GET/POST/PUT | `/orders` | pedidos |
| GET | `/delivery-tax` | valor da taxa de entrega, em centavos |
| POST | `/create-payment-intent` | cria a intenção de pagamento no Stripe |

Imagens são servidas em `/product-file/<arquivo>` e `/category-file/<arquivo>`.

## Stripe

O checkout precisa de chaves do Stripe. Crie uma conta e pegue as chaves de
teste em https://dashboard.stripe.com/test/apikeys:

```ini
# api/.env
STRIPE_SECRET_KEY=sk_test_...
```

```ini
# interface/.env.local
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Sem elas o restante da aplicação funciona normalmente — apenas o botão
"Finalizar Pedido" não conclui. Com as chaves de teste, use o cartão
`4242 4242 4242 4242`, qualquer data futura e qualquer CVC.

## Deploy

A aplicação tem duas partes com necessidades diferentes:

| peça | tipo | onde hospedar |
|---|---|---|
| `interface/` | site estático | Netlify, Vercel, Cloudflare Pages |
| `api/` | servidor Node | Render, Railway, Fly.io |
| Postgres | banco | Neon, Supabase |
| MongoDB | banco | MongoDB Atlas |

**A interface não funciona sozinha** — todas as telas dependem da API, então
hospedar só o front num serviço estático resulta numa aplicação vazia.

Variáveis a definir em produção:

```ini
# na API
APP_URL=https://sua-api.exemplo.com      # usado nas URLs das imagens
CORS_ORIGIN=https://seu-front.exemplo.com
MONGO_URL=...
PG_HOST=...  PG_PORT=...
STRIPE_SECRET_KEY=sk_...

# na interface (build time)
VITE_API_URL=https://sua-api.exemplo.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_...
```

Rode as migrations contra o banco de produção antes do primeiro acesso:

```bash
npx sequelize-cli db:migrate
```

### Limitação conhecida

As imagens são gravadas em disco (`api/uploads/`) via multer. Serviços como
Render e Railway têm **filesystem efêmero**: a cada deploy ou restart, tudo que
foi enviado é perdido. Para produção de verdade, o upload precisa ir para um
storage externo (Cloudinary, S3) ou um volume persistente.

## Observações

- Os preços são armazenados em **centavos** (`price: 3290` = R$ 32,90).
- A taxa de entrega fica em `api/src/config/delivery.js` e é a única fonte do
  valor: o carrinho a consome via `GET /delivery-tax` e a cobrança a soma no
  `create-payment-intent`.
- O valor cobrado é sempre calculado no backend, a partir dos preços do banco —
  o preço enviado pelo cliente é ignorado.
- As imagens enviadas ficam em `api/uploads/`, fora do controle de versão.
- As migrations usam extensão `.cjs`: o `package.json` da API declara
  `"type": "module"`, mas o `sequelize-cli` só carrega CommonJS.
