# Instruções Detalhadas para Deploy na HostGator

Siga estas instruções para implantar sua aplicação Node.js com frontend e admin em React na HostGator.

## 1. Compactar a Pasta de Produção

Antes de fazer o upload, você precisa compactar o conteúdo da pasta `producao` em um arquivo `.zip`.

1.  Navegue até o diretório `producao`.
2.  Selecione todos os arquivos e pastas dentro de `producao`.
3.  Clique com o botão direito e selecione "Enviar para" > "Pasta compactada (zipada)".
4.  Nomeie o arquivo como `producao.zip`.

## 2. Upload para a HostGator

1.  Acesse o cPanel da sua conta HostGator.
2.  Vá para o "Gerenciador de Arquivos".
3.  Navegue até o diretório raiz do seu site (geralmente `public_html` ou um subdomínio que você configurou).
4.  Clique em "Carregar" e selecione o arquivo `producao.zip` do seu computador.

## 3. Extrair os Arquivos

1.  Após o upload, volte para o Gerenciador de Arquivos.
2.  Selecione o arquivo `producao.zip`.
3.  Clique em "Extrair" no menu superior direito.
4.  Confirme o diretório de extração. Os arquivos serão extraídos para o diretório atual.

## 4. Criar a Aplicação Node.js no cPanel

1.  No cPanel, procure por "Setup Node.js App" e clique nele.
2.  Clique em "Create Application".
3.  Preencha os seguintes campos:
    *   **Node.js version:** Selecione a versão mais recente disponível (ou a que você usou no desenvolvimento).
    *   **Application mode:** Selecione "Production".
    *   **Application root:** Insira o caminho para a pasta onde você extraiu os arquivos (por exemplo, `public_html/producao`).
    *   **Application URL:** Selecione o domínio ou subdomínio que você deseja usar.
    *   **Application startup file:** Digite `server.js`.
4.  Clique em "Create".

## 5. Instalar as Dependências

1.  Após a criação da aplicação, a página será recarregada com os detalhes da sua aplicação.
2.  Role para baixo até a seção "Execute NPM Install".
3.  Clique em "NPM Install". Isso instalará todas as dependências listadas no seu `package.json`.

## 6. Configurar Variáveis de Ambiente

1.  Ainda na página de configuração da sua aplicação Node.js, role para baixo até a seção "Environment Variables".
2.  Adicione as seguintes variáveis:
    *   `NODE_ENV`: `production`
    *   `PORT`: Este será preenchido automaticamente pela HostGator.
    *   `DB_URI`: Sua string de conexão do MongoDB Atlas para o ambiente de produção.
    *   `CLOUDINARY_CLOUD_NAME`: Seu nome de nuvem do Cloudinary.
    *   `CLOUDINARY_API_KEY`: Sua chave de API do Cloudinary.
    *   `CLOUDINARY_API_SECRET`: Seu segredo de API do Cloudinary.
    *   `JWT_SECRET`: Um segredo forte para seus tokens JWT.
    *   `MERCADOPAGO_ACCESS_TOKEN`: Seu token de acesso do Mercado Pago.
3.  Clique em "Save".

## 7. Iniciar a Aplicação

1.  No topo da página de configuração da aplicação Node.js, clique em "Start App".
2.  Se tudo estiver configurado corretamente, sua aplicação estará no ar. Você pode visitar a URL da aplicação para vê-la funcionando.

## 8. Solução de Problemas

*   **Verifique os Logs:** Se a aplicação não iniciar, verifique os logs de erro na página de configuração da aplicação Node.js no cPanel.
*   **Caminhos de Arquivo:** Certifique-se de que todos os caminhos no seu `server.js` estão corretos para o ambiente de produção.
*   **Versão do Node.js:** Verifique se a versão do Node.js selecionada no cPanel é compatível com o seu código.