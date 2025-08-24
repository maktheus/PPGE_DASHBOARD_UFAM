<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Painel PPGEE - Elétrica e Computação

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-19.1.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-6.2.0-blueviolet.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.2-blue.svg)](https://www.typescriptlang.org/)

Sistema de painel administrativo para gerenciamento de dados do PPGEE (Programa de Pós-Graduação em Engenharia Elétrica e Computação), permitindo análise de métricas de egressos, docentes e projetos.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Execução Local](#execução-local)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Deploy](#deploy)
- [Uso](#uso)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Contato](#contato)

## 📖 Sobre o Projeto

O Painel PPGEE é uma aplicação web desenvolvida para auxiliar na gestão e análise de dados do Programa de Pós-Graduação em Engenharia Elétrica e Computação. O sistema permite o cadastro e importação de informações de egressos, docentes e projetos, além de fornecer dashboards com métricas importantes para acompanhamento do programa.

A aplicação foi construída com tecnologias modernas como React 19, TypeScript e Vite, proporcionando uma experiência de usuário fluida e responsiva com suporte a tema claro/escuro.

## 🚀 Funcionalidades

### Dashboard Analítico
- Visualização de métricas-chave como número de mestres e doutores formados
- Cálculo de tempo médio de conclusão de mestrado e doutorado
- Gráficos interativos (barras e pizza) para análise de dados
- Filtros por ano, curso, status e orientador

### Gerenciamento de Dados
- Cadastro manual de egressos, docentes e projetos
- Importação de dados via arquivos Excel (.xlsx, .xls)
- Exportação de backup completo em formato JSON
- Funcionalidade de limpeza de todos os dados

### Sistema de Armazenamento
- Persistência local de dados (localStorage)
- Dados mantidos mesmo após fechamento do navegador
- Estrutura de dados tipada com TypeScript

### Interface Responsiva
- Design responsivo que se adapta a diferentes dispositivos
- Tema claro/escuro com persistência de preferência
- Barra lateral recolhível para melhor aproveitamento de espaço

## 🛠️ Tecnologias Utilizadas

- **[React 19.1.1](https://reactjs.org/)** - Biblioteca JavaScript para construção de interfaces
- **[TypeScript 5.8.2](https://www.typescriptlang.org/)** - Superset do JavaScript com tipagem estática
- **[Vite 6.2.0](https://vitejs.dev/)** - Ferramenta de build rápida para desenvolvimento frontend
- **[Recharts 3.1.2](https://recharts.org/)** - Biblioteca de gráficos baseada em React e D3
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário carregado via CDN
- **[XLSX](https://sheetjs.com/)** - Biblioteca para manipulação de arquivos Excel carregada via CDN
- **[PapaParse 5.3.2](https://www.papaparse.com/)** - Biblioteca para parsing de arquivos CSV carregada via CDN

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- npm (geralmente vem com o Node.js)

## 🔧 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/painel-ppgee---eletrica-e-computacao.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd painel-ppgee---eletrica-e-computacao
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

## ▶️ Execução Local

### Modo de Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173` (ou outra porta automaticamente atribuída).

### Build de Produção
```bash
npm run build
```
Os arquivos de produção serão gerados no diretório `dist/`.

### Preview do Build
```bash
npm run preview
```
Permite visualizar o build de produção localmente.

## 📁 Estrutura do Projeto

```
painel-ppgee---eletrica-e-computacao/
├── components/          # Componentes React reutilizáveis
│   ├── icons/           # Ícones SVG
│   ├── AdminPanel.tsx   # Painel administrativo
│   ├── Dashboard.tsx    # Dashboard principal com gráficos
│   ├── DataForm.tsx     # Formulário para adicionar egressos
│   ├── DataManagement.tsx # Gerenciamento de dados
│   ├── DataTable.tsx    # Tabela de dados
│   ├── DocenteForm.tsx  # Formulário para adicionar docentes
│   ├── Header.tsx       # Componente de cabeçalho
│   ├── ProjetoForm.tsx  # Formulário para adicionar projetos
│   └── Sidebar.tsx      # Barra lateral de navegação
├── .env.local           # Variáveis de ambiente (não versionado)
├── .gitignore           # Arquivos e diretórios ignorados pelo Git
├── App.tsx              # Componente principal da aplicação
├── constants.ts         # Constantes e dados mockados
├── index.html           # Página HTML principal
├── index.tsx            # Ponto de entrada da aplicação
├── metadata.json        # Metadados da aplicação
├── package.json         # Configurações do projeto e dependências
├── README.md            # Este arquivo
├── tsconfig.json        # Configurações do TypeScript
├── types.ts             # Definições de tipos TypeScript
├── vercel.json          # Configurações de deploy para Vercel
├── vite.config.ts       # Configurações do Vite
└── dist/                # Diretório gerado após o build (não versionado)
```

## ☁️ Deploy

### Deploy na Vercel (Recomendado)

1. Faça push do código para um repositório Git (GitHub, GitLab, ou Bitbucket)
2. Acesse [Vercel](https://vercel.com/) e faça login
3. Crie um novo projeto e importe seu repositório
4. Vercel detectará automaticamente o projeto Vite e configurará o build
5. Adicione a variável de ambiente `GEMINI_API_KEY` nas configurações do projeto (se necessário)

### Deploy Manual com Vercel CLI
```bash
# Instale o Vercel CLI globalmente
npm install -g vercel

# Faça deploy do projeto
vercel
```

### Outras Opções de Deploy
- **Netlify**: Similar à Vercel, com integração contínua automática
- **GitHub Pages**: Para deploy estático gratuito
- **AWS S3 + CloudFront**: Para infraestrutura escalável
- **Google Cloud Storage**: Para hospedagem estática simples
- **Qualquer servidor web**: Que possa servir arquivos estáticos

## 💡 Uso

### Navegação
A aplicação possui três áreas principais acessíveis pela barra lateral:
1. **Dashboard**: Visualização analítica dos dados
2. **Gerenciar Dados**: Cadastro e importação de informações
3. **Painel Admin**: Configurações administrativas

### Gerenciamento de Egressos

#### Adicionar Manualmente
1. Acesse "Gerenciar Dados"
2. Clique em "Adicionar Egresso"
3. Preencha o formulário com as informações do egresso
4. Clique em "Salvar"

#### Importar via Excel
1. Acesse "Gerenciar Dados"
2. Clique em "Importar Excel" na seção de egressos
3. Selecione o arquivo Excel (.xlsx ou .xls)
4. O sistema processará automaticamente os dados

**Estrutura esperada para arquivo de egressos:**
| Coluna | Descrição |
|--------|-----------|
| NOME DO ALUNO | Nome completo do egresso |
| ANO DE INGRESSO | Ano de ingresso no programa |
| ANO DE DEFESA | Ano de defesa da dissertação/tese |
| ORIENTADOR | Nome do orientador |
| TÍTULO DE DEFESA | Título da dissertação/tese |
| CURSO | "Mestrado" ou "Doutorado" |
| Status | "Defendido" ou "Cursando" |

### Gerenciamento de Docentes

#### Adicionar Manualmente
1. Acesse "Gerenciar Dados"
2. Clique em "Adicionar Docente"
3. Preencha o formulário com as informações do docente
4. Clique em "Salvar"

#### Importar via Excel
1. Acesse "Gerenciar Dados"
2. Clique em "Importar Excel" na seção de docentes
3. Selecione o arquivo Excel (.xlsx ou .xls)

**Estrutura esperada para arquivo de docentes:**
| Coluna | Descrição |
|--------|-----------|
| DOCENTE | Nome do docente |
| CATEGORIA | Categoria do docente |
| ANO | Ano de referência |

### Gerenciamento de Projetos

#### Adicionar Manualmente
1. Acesse "Gerenciar Dados"
2. Clique em "Adicionar Projeto"
3. Preencha o formulário com as informações do projeto
4. Clique em "Salvar"

#### Importar via Excel
1. Acesse "Gerenciar Dados"
2. Clique em "Importar Excel" na seção de projetos
3. Selecione o arquivo Excel (.xlsx ou .xls)

**Estrutura esperada para arquivo de projetos:**
| Coluna | Descrição |
|--------|-----------|
| Título do Projeto | Título completo do projeto |
| Natureza | Tipo/natureza do projeto |
| Coordenador | Nome do coordenador |
| Financiador | Instituição financiadora |
| Valor financiado | Valor em R$ |
| Ano de Início | Ano de início do projeto |
| Ano de Fim | Ano de término (opcional) |

### Backup e Limpeza de Dados

#### Fazer Backup
1. Acesse "Gerenciar Dados"
2. Na seção "Backup e Limpeza de Dados", clique em "Fazer Backup dos Dados"
3. Um arquivo JSON será baixado com todos os dados atuais

#### Limpar Dados
1. Acesse "Gerenciar Dados"
2. Na seção "Backup e Limpeza de Dados", clique em "Limpar Todos os Dados"
3. Confirme a exclusão quando solicitado (ação irreversível)

⚠️ **Atenção**: Recomenda-se fortemente fazer um backup antes de limpar os dados.

### Visualização de Dados (Dashboard)

O dashboard oferece diversas métricas e visualizações:

1. **Cards de Métricas**:
   - Total de mestres formados
   - Total de doutores formados
   - Tempo médio de conclusão do mestrado
   - Tempo médio de conclusão do doutorado

2. **Gráficos**:
   - Egressos por ano de defesa (barras)
   - Distribuição por curso (pizza)
   - Distribuição por status (pizza)

3. **Filtros**:
   - Ano inicial e final de defesa
   - Curso (mestrado ou doutorado)
   - Status (defendido ou cursando)
   - Orientador

## 🤝 Contribuição

Contribuições são o que fazem a comunidade open source ser tão incrível. Qualquer contribuição que você fizer será **muito apreciada**.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

## 📞 Contato

Seu Nome - [@seu_usuario](https://twitter.com/seu_usuario) - seu_email@example.com

Link do Projeto: [https://github.com/seu-usuario/painel-ppgee---eletrica-e-computacao](https://github.com/seu-usuario/painel-ppgee---eletrica-e-computacao)

## 🙏 Agradecimentos

* [React](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Recharts](https://recharts.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [SheetJS](https://sheetjs.com/)
* [PapaParse](https://www.papaparse.com/)