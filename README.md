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

A aplicação tem quatro peças com necessidades diferentes:

| peça | tipo | serviço |
|---|---|---|
| `interface/` | site estático | Netlify (há um `netlify.toml` pronto na raiz) |
| `api/` | servidor Node | Render, Railway, Fly.io |
| Postgres | banco gerenciado | Neon, Supabase |
| MongoDB | banco gerenciado | MongoDB Atlas |
| imagens | armazenamento | Cloudinary |

**A interface não funciona sozinha** — todas as telas dependem da API, então
hospedar só o front num serviço estático resulta numa aplicação vazia.

### 1. Bancos

Crie o Postgres (Neon) e o cluster MongoDB (Atlas). No Atlas, libere o acesso em
*Network Access*: serviços como o Render não têm IP fixo, então é preciso
permitir `0.0.0.0/0` e proteger o banco pela senha.

### 2. API

No Render, um **Web Service** apontando para este repositório:

| campo | valor |
|---|---|
| Root Directory | `api` |
| Build Command | `npm install && npx sequelize-cli db:migrate` |
| Start Command | `npm start` |

O build roda as migrations a cada deploy, o que cria as tabelas no primeiro e
não faz nada nos seguintes.

Variáveis de ambiente:

```ini
APP_URL=https://sua-api.exemplo.com      # monta a URL das imagens; sem barra no fim
CORS_ORIGIN=https://seu-front.exemplo.com # sem barra no fim

JWT_SECRET=uma-chave-secreta-longa
JWT_EXPIRES_IN=5d

MONGO_URL=mongodb+srv://usuario:senha@cluster.mongodb.net/devburger

PG_HOST=...
PG_PORT=5432
PG_USERNAME=...
PG_PASSWORD=...
PG_DATABASE=...
PG_SSL=true                               # obrigatório em Postgres gerenciado

STRIPE_SECRET_KEY=sk_...
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

Não defina `PORT`: o Render injeta essa variável e a API a usa automaticamente.
`APP_PORT` vale só no ambiente local.

### 3. Interface

No Netlify, importe o repositório. O `netlify.toml` da raiz já define o
diretório base, o comando de build e o redirect de SPA — basta preencher as
variáveis, que são lidas **no momento do build**:

```ini
VITE_API_URL=https://sua-api.exemplo.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_...
```

Alterar qualquer uma delas exige um novo deploy para ter efeito.

### 4. Primeiro acesso

O banco sobe vazio. Crie a conta pela tela de cadastro, promova-a a admin
direto no Postgres de produção e cadastre as categorias e produtos pelo painel:

```sql
UPDATE users SET admin = true WHERE email = 'seu@email.com';
```

Saia e entre novamente — o `admin` fica gravado no token.

### Armadilhas conhecidas

Todas já mordem em silêncio, com mensagens que não apontam para a causa:

- **`CORS_ORIGIN` com barra no fim.** O header `Origin` do navegador nunca
  traz barra final, então `https://site.app/` não casa com `https://site.app`.
  A API normaliza isso, mas outros serviços na frente dela podem não fazê-lo.
- **`CLOUDINARY_URL` copiada do painel.** O botão de copiar às vezes traz junto
  o prefixo `CLOUDINARY_URL=`, e os `<>` do formato são só marcadores — se
  ficarem no valor, o upload falha embora a API suba normalmente.
- **Migrations contra banco com SSL.** `sequelize-cli --url` ignora
  `dialectOptions`, então a conexão é recusada. Rode com as variáveis
  `PG_*` no ambiente, como faz o Build Command acima.
- **Filesystem efêmero.** Sem `CLOUDINARY_URL`, o upload grava em
  `api/uploads/` e tudo se perde no deploy seguinte.

### Imagens em produção

Serviços como Render e Railway têm filesystem efêmero: a cada deploy, tudo que
foi enviado para o disco é perdido. Por isso o upload suporta **Cloudinary**.

Com `CLOUDINARY_URL` definida, as imagens vão para lá e a URL definitiva é
gravada no banco. O valor está pronto no painel, em *Settings → API Keys*.

**Sem essa variável nada muda**: o upload continua gravando em `api/uploads/`,
que é o comportamento usado em desenvolvimento.

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
