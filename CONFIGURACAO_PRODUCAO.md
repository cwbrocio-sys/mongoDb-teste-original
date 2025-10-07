# 🚀 Configuração para Produção - E-commerce com MercadoPago

## 📋 Checklist de Configuração

### ✅ 1. MongoDB Atlas (Já Configurado)
- ✅ Conexão funcionando: `mongodb+srv://ifparfum:345BtSxrKnyS8LLb@cluster0.vevbpum.mongodb.net/ecom`
- ✅ Database: `ecom`
- ✅ Coleções: `users`, `products`, `orders`

### ⚠️ 2. MercadoPago - MIGRAR PARA PRODUÇÃO

#### Credenciais Atuais (TESTE/SANDBOX):
```
MERCADOPAGO_ACCESS_TOKEN=TEST-1475395128145771-093014-2e1620b622241bb9a485646b9dae1c41-156449492
MERCADOPAGO_PUBLIC_KEY=TEST-8fc7d9c4-e57e-4f27-b70b-4e54db8ecf34
```

#### 🔴 PARA RECEBER DINHEIRO REAL - CONFIGURAR PRODUÇÃO:

1. **Acesse sua conta MercadoPago**: https://www.mercadopago.com.br/developers
2. **Vá em "Suas integrações" > "Credenciais"**
3. **Copie as credenciais de PRODUÇÃO** (não teste):

```bash
# Substitua no backend/.env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Substitua no frontend/.env
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 🔔 3. Webhook do MercadoPago (OBRIGATÓRIO para receber dinheiro)

#### Configurar no MercadoPago:
1. **Acesse**: https://www.mercadopago.com.br/developers/panel/notifications/webhooks
2. **Adicione uma nova URL de webhook**:
   - URL: `https://seu-dominio.com/api/mercadopago/webhook`
   - Eventos: `payment`, `merchant_order`

#### Configurar no Backend:
```bash
# Adicione no backend/.env
MERCADOPAGO_WEBHOOK_SECRET=sua_chave_secreta_webhook_aqui
BACKEND_URL=https://seu-dominio.com
```

### 🌐 4. Deploy e Domínio

#### Opções Recomendadas:
- **Backend**: Railway, Render, ou Heroku
- **Frontend**: Vercel, Netlify
- **Domínio**: Registrar um domínio próprio

#### Variáveis de Ambiente para Produção:
```bash
# Backend (.env)
MONGODB_URI=mongodb+srv://ifparfum:345BtSxrKnyS8LLb@cluster0.vevbpum.mongodb.net/ecom?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=ecommerce_super_secret_jwt_key_2024_mongodb_atlas_project_secure
MERCADOPAGO_ACCESS_TOKEN=APP_USR-[SUA_CHAVE_PRODUCAO]
MERCADOPAGO_PUBLIC_KEY=APP_USR-[SUA_CHAVE_PUBLICA_PRODUCAO]
MERCADOPAGO_WEBHOOK_SECRET=[SUA_CHAVE_WEBHOOK]
BACKEND_URL=https://seu-backend.com
PORT=3000

# Frontend (.env)
VITE_BACKEND_URL=https://seu-backend.com
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-[SUA_CHAVE_PUBLICA_PRODUCAO]
```

### 💰 5. Configuração da Conta MercadoPago

#### Para Receber Dinheiro:
1. **Conta Verificada**: Complete a verificação da sua conta
2. **Dados Bancários**: Configure sua conta bancária para recebimento
3. **Certificado SSL**: Seu site deve ter HTTPS (obrigatório)
4. **Política de Privacidade**: Tenha uma política de privacidade válida

### 🔒 6. Segurança

#### Implementado:
- ✅ JWT para autenticação
- ✅ Validação de dados no backend
- ✅ Middleware de autenticação
- ✅ Sanitização de dados

#### Recomendações Adicionais:
- 🔴 **HTTPS obrigatório** (certificado SSL)
- 🔴 **Rate limiting** para APIs
- 🔴 **Logs de segurança**
- 🔴 **Backup automático do MongoDB**

### 📊 7. Monitoramento

#### Implementar:
- **Logs de pagamento**: Já implementado
- **Notificações de erro**: Configurar alertas
- **Dashboard de vendas**: Usar o painel admin
- **Backup de dados**: Configurar backup automático

### 🚨 PASSOS CRÍTICOS PARA RECEBER DINHEIRO:

1. **MIGRAR CREDENCIAIS PARA PRODUÇÃO** ⚠️
2. **CONFIGURAR WEBHOOK** ⚠️
3. **DEPLOY COM HTTPS** ⚠️
4. **VERIFICAR CONTA MERCADOPAGO** ⚠️
5. **TESTAR PAGAMENTO REAL** ⚠️

### 📞 Suporte MercadoPago:
- Documentação: https://www.mercadopago.com.br/developers
- Suporte: https://www.mercadopago.com.br/ajuda

---

## ⚡ Status Atual:
- ✅ MongoDB: Funcionando
- ✅ Sistema de Pedidos: Funcionando
- ✅ Interface de Pagamento: Funcionando
- ⚠️ MercadoPago: **MODO TESTE** (não recebe dinheiro real)
- ❌ Webhook: Não configurado
- ❌ Deploy: Local apenas

**Para receber dinheiro real, siga os passos marcados com ⚠️ acima.**