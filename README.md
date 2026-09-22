# Votação Eletrônica - Frontend

Este é o frontend da aplicação de votação eletrônica, desenvolvido com React, TypeScript e Tailwind CSS.

## Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto localmente:

### 1. Instalar Dependências

Execute o comando abaixo para instalar todas as dependências necessárias:

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Renomeie o arquivo `.env.local.example` para `.env.local`:

```bash
mv .env.local.example .env.local
```

Certifique-se de preencher as variáveis de ambiente conforme necessário (por exemplo, URL da API).

### 3. Executar o Projeto

Inicie o servidor de desenvolvimento com o comando:

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173/`.

O servidor também aceita conexões da rede local. Em outra máquina na mesma rede,
acesse `http://<IP-DESTA-MAQUINA>:5173/` (use a porta exibida pelo Vite).
No macOS, consulte o IP do Wi-Fi com `ipconfig getifaddr en0`.
Mantenha o servidor em execução durante o acesso.

A URL da API em `VITE_SERVER_URL` deve ser acessível pela outra máquina.
Se usar Reverb, configure `VITE_REVERB_HOST` com o IP do servidor, sem `http://`,
em vez de `localhost`. O backend deve aceitar conexões pela rede e permitir
a origem do frontend no CORS.

## Deploy na Vercel

Este repositório contém apenas o frontend. O backend precisa estar publicado e
acessível por HTTPS.

Nas variáveis de ambiente do projeto na Vercel, configure `VITE_SERVER_URL` para
os ambientes utilizados (Production e, se necessário, Preview). Exemplo:

```text
VITE_SERVER_URL=https://api.seu-dominio.com/api/v1
```

Substitua o domínio pelo endereço real do backend e confirme o prefixo das suas
rotas. Com esse exemplo, o login envia `POST https://api.seu-dominio.com/api/v1/login`.
Não inclua `/login` no valor da variável.

O proxy de `vite.config.ts` funciona somente no servidor de desenvolvimento.
Usar `/api/v1` na Vercel exige um proxy de produção configurado separadamente.
O backend também precisa permitir a origem do frontend no CORS.

Após alterar a variável, faça um novo deploy: o Vite incorpora seu valor durante
o build. Na aba Network do navegador, confira a URL completa da requisição de
login. Um 404 indica que o servidor de destino não encontrou essa rota; verifique
o domínio, o prefixo da API e a rota de login no backend.

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- Vite
- React Hook Form
- Zod
- Axios
