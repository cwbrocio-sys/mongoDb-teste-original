# Guia do Código

Este documento fornece uma visão geral da estrutura e da lógica do backend, do frontend e do painel de administração da sua aplicação.

## Backend

O backend é uma aplicação Node.js com Express que serve uma API RESTful para o frontend e o painel de administração.

### Estrutura de Arquivos

- `configs/`: Contém as configurações de conexão com o banco de dados (`db.js`) e com o Cloudinary (`cloudinary.js`).
- `controllers/`: Contém a lógica de negócios da aplicação. Cada arquivo de controlador corresponde a um recurso (por exemplo, `productController.js`).
- `middlewares/`: Contém os middlewares do Express, como `auth.js` para autenticação de usuários e `multer.js` para upload de arquivos.
- `models/`: Contém os modelos de dados do Mongoose, que definem a estrutura dos documentos no MongoDB.
- `routes/`: Define os endpoints da API. Cada arquivo de rota corresponde a um recurso (por exemplo, `productRoute.js`).
- `server.js`: É o ponto de entrada da aplicação. Ele configura o Express, conecta-se ao banco de dados e ao Cloudinary, aplica os middlewares e inicia o servidor.

### Fluxo de Dados

1.  Uma requisição HTTP chega a um endpoint definido em um dos arquivos de rota em `routes/`.
2.  O middleware apropriado em `middlewares/` é executado (por exemplo, para verificar a autenticação).
3.  A requisição é passada para a função de controlador correspondente em `controllers/`.
4.  A função de controlador interage com os modelos em `models/` para realizar operações no banco de dados.
5.  A função de controlador envia uma resposta JSON para o cliente.

## Frontend

O frontend é uma aplicação React que consome a API do backend para exibir informações aos usuários e permitir que eles interajam com a aplicação.

### Estrutura de Arquivos

- `src/components/`: Contém os componentes React reutilizáveis, como `Navbar`, `Footer`, `ProductItem`, etc.
- `src/contexts/`: Contém os contextos React, como o `ShopContext`, que gerencia o estado global da aplicação.
- `src/pages/`: Contém os componentes de página, que são renderizados para rotas específicas (por exemplo, `Home`, `Product`, `Cart`).
- `src/App.jsx`: É o componente raiz da aplicação. Ele define as rotas e renderiza os componentes de página apropriados.
- `src/main.jsx`: É o ponto de entrada da aplicação. Ele renderiza o componente `App` e o envolve com o `BrowserRouter` e o `ShopContextProvider`.

### Lógica Principal

- **Gerenciamento de Estado:** O `ShopContext` (`src/contexts/ShopContext.jsx`) é o coração da lógica do frontend. Ele gerencia o estado do carrinho de compras, busca dados de produtos do backend, lida com a autenticação do usuário e fornece todas essas informações e funções para os componentes que as consomem.
- **Roteamento:** O `react-router-dom` é usado para o roteamento. As rotas são definidas no `App.jsx`, e cada rota renderiza um componente de página específico.
- **Comunicação com o Backend:** O `axios` é usado para fazer requisições HTTP para a API do backend. O `ShopContext` contém a maior parte da lógica para buscar e enviar dados para o backend.

## Painel de Administração

O painel de administração é uma aplicação React separada que permite que os administradores gerenciem os produtos, os pedidos e outras partes da aplicação.

### Estrutura de Arquivos

A estrutura de arquivos do painel de administração é muito semelhante à do frontend, com componentes, páginas e um ponto de entrada `main.jsx`.

### Lógica Principal

- **Autenticação:** O painel de administração tem uma lógica de autenticação simples. O componente `App.jsx` verifica se um token de autenticação está presente no `localStorage`. Se estiver, ele renderiza a interface do painel de administração. Caso contrário, ele renderiza um componente de `Login`.
- **Gerenciamento de Dados:** As páginas do painel de administração (por exemplo, `Add`, `List`, `Orders`) usam o `axios` para fazer requisições para a API do backend para adicionar, listar e gerenciar dados.