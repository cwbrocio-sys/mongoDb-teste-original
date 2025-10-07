# 🚀 Instruções de Deploy para Produção

## 📋 Pré-requisitos para Receber Dinheiro Real

### 1. ✅ Status Atual (Já Configurado)
- ✅ MongoDB Atlas funcionando
- ✅ Sistema de autenticação JWT
- ✅ API de pedidos funcionando
- ✅ Interface de pagamento MercadoPago
- ✅ Webhook configurado e testado

### 2. 🔴 CRÍTICO: Migrar para Credenciais de Produção

#### Passo 1: Obter Credenciais de Produção
1. Acesse: https://www.mercadopago.com.br/developers
2. Faça login na sua conta MercadoPago
3. Vá em **"Suas integrações"** → **"Credenciais"**
4. Copie as credenciais de **PRODUÇÃO** (não teste):

```bash
# Credenciais de PRODUÇÃO (começam com APP_USR-)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### Passo 2: Atualizar Arquivos de Configuração

**Backend (.env):**
```bash
# Substitua estas linhas no backend/.env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-[SUA_CHAVE_PRODUCAO]
MERCADOPAGO_PUBLIC_KEY=APP_USR-[SUA_CHAVE_PUBLICA_PRODUCAO]
BACKEND_URL=https://seu-dominio-backend.com
```

**Frontend (.env):**
```bash
# Substitua estas linhas no frontend/.env
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-[SUA_CHAVE_PUBLICA_PRODUCAO]
VITE_BACKEND_URL=https://seu-dominio-backend.com
```

## 🌐 Deploy Recomendado

### Backend (API)
**Opção 1: Railway (Recomendado)**
1. Acesse: https://railway.app
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy automático

**Opção 2: Render**
1. Acesse: https://render.com
2. Conecte seu repositório
3. Configure as variáveis de ambiente
4. Deploy automático

### Frontend (Interface)
**Opção 1: Vercel (Recomendado)**
1. Acesse: https://vercel.com
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy automático

**Opção 2: Netlify**
1. Acesse: https://netlify.com
2. Conecte seu repositório
3. Configure as variáveis de ambiente
4. Deploy automático

## 🔔 Configurar Webhook no MercadoPago

### Passo 1: Configurar URL do Webhook
1. Acesse: https://www.mercadopago.com.br/developers/panel/notifications/webhooks
2. Clique em **"Criar webhook"**
3. Configure:
   - **URL**: `https://seu-dominio-backend.com/api/mercadopago/webhook`
   - **Eventos**: Selecione `payment` e `merchant_order`
   - **Versão da API**: v1

### Passo 2: Obter Chave Secreta do Webhook
1. Após criar o webhook, copie a **chave secreta**
2. Adicione no backend/.env:
```bash
MERCADOPAGO_WEBHOOK_SECRET=sua_chave_secreta_webhook_aqui
```

## 🔒 Configurações de Segurança

### 1. HTTPS Obrigatório
- Seu site DEVE ter certificado SSL (HTTPS)
- MercadoPago não aceita webhooks HTTP em produção

### 2. Domínio Próprio
- Registre um domínio próprio
- Configure DNS para apontar para seus serviços

### 3. Variáveis de Ambiente Seguras
- NUNCA commite credenciais no código
- Use variáveis de ambiente em produção

## 💰 Configuração da Conta MercadoPago

### Para Receber Dinheiro:
1. **Conta Verificada**: Complete a verificação da sua conta MercadoPago
2. **Dados Bancários**: Configure sua conta bancária para recebimento
3. **Informações Fiscais**: Complete dados fiscais (CPF/CNPJ)
4. **Política de Privacidade**: Tenha uma política de privacidade válida no seu site

## 🧪 Teste em Produção

### Passo 1: Deploy Completo
1. Deploy do backend com credenciais de produção
2. Deploy do frontend apontando para backend de produção
3. Configuração do webhook no MercadoPago

### Passo 2: Teste Real
1. Faça um pedido real no seu site
2. Use um cartão real (será cobrado)
3. Verifique se o webhook recebe a notificação
4. Confirme se o dinheiro aparece na sua conta MercadoPago

## 📊 Monitoramento

### Logs Importantes
- Logs de pagamento no backend
- Logs do webhook
- Erros de API

### Dashboard MercadoPago
- Acompanhe vendas em: https://www.mercadopago.com.br/activities
- Verifique webhooks em: https://www.mercadopago.com.br/developers/panel/notifications/webhooks

## 🚨 Checklist Final

- [ ] Credenciais de produção configuradas
- [ ] Backend deployado com HTTPS
- [ ] Frontend deployado apontando para backend de produção
- [ ] Webhook configurado no MercadoPago
- [ ] Conta MercadoPago verificada
- [ ] Dados bancários configurados
- [ ] Teste real realizado com sucesso
- [ ] Monitoramento configurado

## 📞 Suporte

### MercadoPago
- Documentação: https://www.mercadopago.com.br/developers
- Suporte: https://www.mercadopago.com.br/ajuda
- Status da API: https://status.mercadopago.com

### Deploy
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs

---

**⚠️ IMPORTANTE**: Só após completar TODOS os passos acima você estará recebendo dinheiro real. As credenciais de teste não processam pagamentos reais!