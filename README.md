# WB - Finanças

Sistema completo de controle financeiro desenvolvido com React, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

### 🔐 Autenticação
- Login e registro de usuários
- Controle de permissões (Admin/Usuário)
- Sessão persistente

### 📊 Dashboard
- Resumo financeiro com métricas principais
- Gráficos de distribuição por categoria
- Gráfico comparativo mensal (receitas vs despesas)
- Transações recentes

### 💰 Movimentações
- CRUD completo de transações
- Filtros avançados (data, categoria, tipo, busca)
- Exportação para PDF
- Resumo do período filtrado

### ⚙️ Administração (Apenas Admins)
- Gerenciamento de usuários
- Gerenciamento de categorias
- Gerenciamento de tipos de transação

## 🎨 Design System

- **Tema:** Clean e minimalista com predominância de verde
- **Componentes:** Baseados em shadcn/ui customizados
- **Animações:** Framer Motion para transições suaves
- **Responsividade:** Mobile-first design
- **Notificações:** Toast notifications integradas

## 🚀 Tecnologias

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS com design system customizado
- **UI Components:** shadcn/ui
- **Animações:** Framer Motion
- **Gráficos:** Recharts
- **Notificações:** React Toastify
- **PDF:** jsPDF + html2canvas
- **Mobile:** Preparado para Capacitor

## 📱 Preparação Mobile

O projeto já está configurado para Capacitor:

```json
{
  "appId": "app.lovable.cb694e3ea89d4f16bceba173c295acbb",
  "appName": "WB - Finanças",
  "webDir": "dist"
}
```

Para gerar APK:
1. `npx cap add android`
2. `npm run build`
3. `npx cap sync`
4. `npx cap run android`

## 🎯 Credenciais de Teste

### Administrador
- **Usuário:** admin
- **Senha:** admin123

### Usuário Normal
- **Usuário:** user
- **Senha:** user123

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn)
│   ├── Layout.tsx      # Layout principal
│   ├── Navbar.tsx      # Navegação horizontal
│   └── StatCard.tsx    # Card de estatísticas
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Autenticação
├── pages/              # Páginas da aplicação
├── services/           # Serviços e APIs
│   └── mockApi.ts      # API mock com localStorage
├── types/              # Definições TypeScript
└── lib/                # Utilitários
```

### Gerenciamento de Estado
- **Autenticação:** Context API
- **Dados:** Local Storage (simulando backend)
- **UI State:** React Hooks

## 🎨 Sistema de Cores

```css
/* Paleta Principal */
--primary: 142 76% 36%;           /* Verde principal */
--success: 142 76% 36%;           /* Verde sucesso */
--warning: 45 93% 47%;            /* Amarelo alerta */
--destructive: 0 75% 55%;         /* Vermelho erro */

/* Gradientes */
--gradient-primary: linear-gradient(135deg, hsl(142 76% 36%), hsl(142 76% 28%));
--gradient-success: linear-gradient(135deg, hsl(142 76% 36%), hsl(142 76% 28%));
```

## 📊 Funcionalidades dos Gráficos

### Dashboard
- **Gráfico de Pizza:** Distribuição por categorias
- **Gráfico de Barras:** Comparativo mensal receitas vs despesas
- **Cards de Métricas:** Receitas, despesas, saldo e contadores

### Relatórios
- **Exportação PDF:** Tabela de transações filtradas
- **Filtros Avançados:** Por período, categoria, tipo e busca textual

## 🔒 Segurança

- Autenticação baseada em roles
- Proteção de rotas administrativas
- Validação de formulários
- Sanitização de dados

## 📱 Responsividade

- **Desktop:** Layout de 3-4 colunas
- **Tablet:** Layout de 2 colunas
- **Mobile:** Layout de 1 coluna com menu hambúrguer
- **Navegação:** Menu horizontal no desktop, dropdown no mobile

## 🎯 Próximos Passos

### Backend Real
- Implementar API REST com Node.js + Express
- Banco SQLite com Sequelize ORM
- Autenticação JWT
- Hash de senhas com bcrypt

### Funcionalidades Futuras
- Metas financeiras
- Lembretes de pagamentos
- Importação de extratos bancários
- Modo escuro
- Notificações push (mobile)

## 📄 Licença

Este projeto foi desenvolvido como um sistema de demonstração e está disponível para uso e modificação.