# E-commerce MongoDB - Deploy Automático

Este é um e-commerce completo com frontend, backend e painel administrativo, configurado para deploy automático no GitHub.

## 🚀 Estrutura do Projeto

```
mongoDb-teste/
├── frontend/          # Aplicação React (cliente)
├── backend/           # API Node.js + Express
├── admin/             # Painel administrativo React
├── .github/workflows/ # GitHub Actions para CI/CD
└── README.md
```

## 📦 Tecnologias Utilizadas

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Admin**: React + Vite + Tailwind CSS
- **Deploy**: Vercel + GitHub Actions
- **Database**: MongoDB Atlas

## 🔧 Configuração do Deploy Automático

### 1. Configurar Secrets no GitHub

Acesse `Settings > Secrets and variables > Actions` no seu repositório GitHub e adicione:

```
VERCEL_TOKEN=seu_token_vercel
VERCEL_ORG_ID=seu_org_id_vercel
VERCEL_PROJECT_ID_FRONTEND=id_projeto_frontend
VERCEL_PROJECT_ID_ADMIN=id_projeto_admin
VERCEL_PROJECT_ID_BACKEND=id_projeto_backend
```

### 2. Como obter os tokens Vercel:

1. **VERCEL_TOKEN**: 
   - Acesse https://vercel.com/account/tokens
   - Crie um novo token
   - Copie o token gerado

2. **VERCEL_ORG_ID**:
   - Execute: `npx vercel` na pasta do projeto
   - O ID será exibido no terminal

3. **VERCEL_PROJECT_ID**:
   - Crie projetos separados no Vercel para frontend, admin e backend
   - Copie os IDs de cada projeto

### 3. Configuração dos Projetos no Vercel

#### Frontend:
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### Admin:
- **Framework Preset**: Vite
- **Root Directory**: `admin`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### Backend:
- **Framework Preset**: Other
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Output Directory**: `.`

## 🔄 Como Funciona o Deploy Automático

1. **Push para master**: Toda vez que você fizer push para a branch master
2. **Testes automáticos**: O GitHub Actions roda testes e linting
3. **Build**: Compila frontend e admin
4. **Deploy**: Faz deploy automático para Vercel
5. **Notificação**: Informa se o deploy foi bem-sucedido

## 📝 Comandos Úteis

### Desenvolvimento Local:

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev

# Admin
cd admin
npm install
npm run dev
```

### Deploy Manual:

```bash
# Deploy frontend
cd frontend
vercel --prod

# Deploy admin
cd admin
vercel --prod

# Deploy backend
cd backend
vercel --prod
```

## 🌐 URLs de Produção

Após configurar o deploy automático, suas aplicações estarão disponíveis em:

- **Frontend**: https://seu-frontend.vercel.app
- **Admin**: https://seu-admin.vercel.app
- **Backend**: https://seu-backend.vercel.app

## 🔒 Variáveis de Ambiente

Certifique-se de configurar as variáveis de ambiente no Vercel:

### Backend:
```
MONGODB_URI=sua_string_conexao_mongodb
JWT_SECRET=seu_jwt_secret
CLOUDINARY_NAME=seu_cloudinary_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

### Frontend:
```
VITE_BACKEND_URL=https://seu-backend.vercel.app
```

### Admin:
```
VITE_BACKEND_URL=https://seu-backend.vercel.app
```

## 🚨 Importante

1. **Nunca commite arquivos .env** - Eles estão no .gitignore
2. **Configure as variáveis de ambiente no Vercel** para cada projeto
3. **Teste localmente** antes de fazer push para master
4. **Monitore os logs** do GitHub Actions em caso de falha

## 📞 Suporte

Se encontrar problemas com o deploy automático:

1. Verifique os logs do GitHub Actions
2. Confirme se todos os secrets estão configurados
3. Teste o build local antes do push
4. Verifique as variáveis de ambiente no Vercel

---

**Desenvolvido com ❤️ para deploy automático e sincronização contínua!**
