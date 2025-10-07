# 📧 Configuração de Email para Verificação

## ✅ **Status Atual**
- ✅ Sistema de verificação por email implementado
- ✅ Códigos de 6 dígitos gerados automaticamente
- ✅ Interface de verificação funcionando
- ⚠️ **PENDENTE**: Configuração de email real

## 🔧 **Como Configurar Email Real (Gmail)**

### **Passo 1: Preparar sua conta Gmail**
1. Acesse: https://myaccount.google.com/security
2. Ative a **"Verificação em duas etapas"** (obrigatório)
3. Vá em **"Senhas de app"**
4. Selecione:
   - **App**: Email
   - **Dispositivo**: Outro (personalizado)
5. Digite um nome: `Sistema Verificação E-commerce`
6. **Copie a senha gerada** (16 caracteres, ex: `abcd efgh ijkl mnop`)

### **Passo 2: Configurar no arquivo .env**
Edite o arquivo `backend/.env`:

```env
# Email Configuration - Para envio de emails de verificação
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

**⚠️ IMPORTANTE:**
- Use sua conta Gmail real
- Use a **senha de app** (não sua senha normal)
- Mantenha os espaços na senha de app

### **Passo 3: Reiniciar o servidor**
```bash
cd backend
npm start
```

### **Passo 4: Testar**
1. Registre um novo usuário
2. Verifique sua caixa de entrada
3. Use o código recebido para verificar

## 🎯 **Funcionalidades Implementadas**

### **Backend**
- ✅ Geração de códigos de 6 dígitos
- ✅ Expiração em 10 minutos
- ✅ Limite de 3 tentativas
- ✅ Template HTML para emails
- ✅ Fallback para console (desenvolvimento)
- ✅ Endpoints RESTful completos

### **Frontend**
- ✅ Interface de verificação
- ✅ Botão "Reenviar código"
- ✅ Feedback visual
- ✅ Integração com login

### **Segurança**
- ✅ Códigos únicos por usuário
- ✅ Expiração automática
- ✅ Limite de tentativas
- ✅ Validação de formato

## 🚀 **Próximos Passos**
1. Configure suas credenciais Gmail
2. Teste o envio real
3. Sistema estará 100% funcional!

## 📞 **Suporte**
Se tiver problemas:
1. Verifique se a verificação em duas etapas está ativa
2. Confirme se usou a senha de app (não a senha normal)
3. Verifique se não há espaços extras no .env
4. Reinicie o servidor após mudanças

---
**Sistema desenvolvido e testado ✅**