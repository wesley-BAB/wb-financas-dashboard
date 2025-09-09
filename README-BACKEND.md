# WB Finanças - Backend Setup Guide

Este guia explica como configurar o backend local para o WB Finanças usando Node.js, Express, Sequelize e SQLite.

## Estrutura do Backend

Crie uma pasta `server` na raiz do projeto com a seguinte estrutura:

```
server/
├── config/
│   └── database.js
├── models/
│   ├── index.js
│   ├── User.js
│   ├── Category.js
│   ├── Type.js
│   └── Transaction.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── categories.js
│   ├── types.js
│   └── transactions.js
├── middleware/
│   └── auth.js
├── package.json
└── server.js
```

## Dependências Necessárias

No diretório `server`, instale as dependências:

```bash
cd server
npm init -y
npm install express cors helmet morgan bcryptjs jsonwebtoken sequelize sqlite3 dotenv
npm install -D nodemon
```

## Configuração do package.json

```json
{
  "name": "wb-financas-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate": "node migrations/run.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^6.1.5",
    "morgan": "^1.10.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "sequelize": "^6.31.1",
    "sqlite3": "^5.1.6",
    "dotenv": "^16.1.4"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

## Arquivos de Configuração

### server/config/database.js
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './wb-financas.sqlite',
  logging: false,
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true
  }
});

module.exports = sequelize;
```

### server/.env
```
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

### server/server.js
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const typeRoutes = require('./routes/types');
const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database sync and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();
```

## Como Executar

1. Configure o frontend para usar `http://localhost:3001/api` (já configurado em `src/services/api.js`)

2. No diretório `server`:
```bash
npm run dev
```

3. No diretório raiz (frontend):
```bash
npm run dev
```

## Endpoints da API

- **POST** `/api/auth/login` - Login do usuário
- **POST** `/api/auth/register` - Registro de usuário
- **GET** `/api/users` - Listar usuários (admin)
- **POST** `/api/users` - Criar usuário (admin)
- **PUT** `/api/users/:id` - Atualizar usuário (admin)
- **DELETE** `/api/users/:id` - Deletar usuário (admin)
- **GET** `/api/categories` - Listar categorias
- **POST** `/api/categories` - Criar categoria (admin)
- **PUT** `/api/categories/:id` - Atualizar categoria (admin)
- **DELETE** `/api/categories/:id` - Deletar categoria (admin)
- **GET** `/api/types` - Listar tipos
- **POST** `/api/types` - Criar tipo (admin)
- **PUT** `/api/types/:id` - Atualizar tipo (admin)
- **DELETE** `/api/types/:id` - Deletar tipo (admin)
- **GET** `/api/transactions` - Listar transações
- **POST** `/api/transactions` - Criar transação
- **PUT** `/api/transactions/:id` - Atualizar transação
- **DELETE** `/api/transactions/:id` - Deletar transação
- **GET** `/api/transactions/stats` - Estatísticas do dashboard

## Banco de Dados

O arquivo `wb-financas.sqlite` será criado automaticamente na pasta `server` quando você executar o backend pela primeira vez.

## Autenticação

O sistema usa JWT tokens para autenticação. O token é armazenado no localStorage do frontend e enviado no header `Authorization: Bearer <token>` para rotas protegidas.