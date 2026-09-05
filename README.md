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

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- Vite
- React Hook Form
- Zod
- Axios
