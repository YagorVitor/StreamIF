# StreamIF

![React Native](https://img.shields.io/badge/React%20Native-Mobile-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![Expo](https://img.shields.io/badge/Expo-Go-000020?style=for-the-badge&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111827)
![Status](https://img.shields.io/badge/Status-MVP%20Finalizado-E11D48?style=for-the-badge)

Aplicativo mobile desenvolvido em **React Native com Expo** para o trabalho bimestral de ARQAPMO.

O **StreamIF** permite gerenciar uma watchlist pessoal de filmes e séries, com cadastro, edição, exclusão, busca, filtros, ordenação, status de assistido, nota pessoal, imagens e anotações.

O projeto foi construído com foco em **componentização**, **estado centralizado**, **fluxo de dados por props**, **interface moderna** e **organização arquitetural**.

---

## Integrantes

| Nome completo |
|---|
| Yagor Vitor Silva dos Santos |

---

## Sumário

- [Objetivo](#objetivo)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Como executar](#como-executar)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Arquitetura resumida](#arquitetura-resumida)
- [Documentação complementar](#documentação-complementar)
- [Como testar](#como-testar)
- [Observações sobre persistência](#observações-sobre-persistência)

---

## Objetivo

O objetivo do StreamIF é simular um MVP mobile para curadoria pessoal de conteúdos, permitindo que o usuário organize filmes e séries em uma interface simples, responsiva e visualmente profissional.

O app foi desenvolvido para demonstrar os principais conceitos do bimestre:

- componentes reutilizáveis;
- props;
- callbacks;
- estado com `useState`;
- listas com `FlatList`;
- formulário em `Modal`;
- navegação por renderização condicional;
- atualização imutável de arrays;
- organização em `components/` e `screens/`.

---

## Funcionalidades

### Funcionalidades principais

- cadastro de filmes e séries via `Modal`;
- edição de mídias já cadastradas;
- exclusão com confirmação;
- marcação de status como assistido ou pendente;
- nota pessoal de 1 a 10;
- tela de detalhes com anotações;
- busca por título ou gênero;
- filtros por status;
- ordenação A-Z ou por maior nota;
- tema claro e escuro;
- imagens locais para os exemplos;
- imagem escolhida pelo usuário;
- feedback tátil com `expo-haptics`;
- animações com `react-native-reanimated`;
- identidade visual própria com a marca “IF”.

### Requisitos obrigatórios atendidos

| Requisito | Status |
|---|---|
| Adicionar mídia via `Modal` | Implementado |
| Formulário com título, gênero e nota | Implementado |
| Elevar dados ao `App.js` via props | Implementado |
| Two-Way Binding com `useState` | Implementado |
| Listagem com `FlatList` | Implementado |
| Card reutilizável `MediaCard` | Implementado |
| Nota colorida por faixa de valor | Implementado |
| Marcar/desmarcar como assistido | Implementado |
| `EmptyState` quando a lista está vazia | Implementado |
| Tela de detalhes com `ScrollView` | Implementado |
| Anotações pessoais | Implementado |
| Navegação por renderização condicional | Implementado |
| Exclusão com `Array.filter()` | Implementado |
| ID gerado com `Date.now()` | Implementado |
| `StyleSheet` próprio por componente | Implementado |

### Funcionalidades extras

| Extra | Status |
|---|---|
| Contador de mídias e assistidos | Implementado |
| Ordenação A-Z / maior nota | Implementado |
| Validação robusta no formulário | Implementado |
| Tema claro/escuro manual | Implementado |
| Busca por título ou gênero | Implementado |
| Filtros por status | Implementado |
| Edição de mídia existente | Implementado |
| Confirmação antes de excluir | Implementado |
| Imagens locais para exemplos | Implementado |
| Imagem escolhida pelo usuário | Implementado |
| Feedback tátil | Implementado |
| Animações | Implementado |
| Marca visual “IF” | Implementado |

---

## Tecnologias

| Tecnologia | Uso no projeto |
|---|---|
| React Native | Construção da interface mobile |
| Expo | Execução no Expo Go |
| JavaScript | Linguagem principal |
| FlatList | Renderização da lista de mídias |
| ScrollView | Tela de detalhes |
| Modal | Formulário de cadastro/edição |
| StyleSheet | Organização dos estilos |
| React Hooks | Controle de estado |
| lucide-react-native | Ícones |
| react-native-reanimated | Animações |
| expo-image-picker | Seleção de imagem pelo usuário |
| expo-haptics | Feedback tátil |

---

## Como executar

### 1. Entrar na pasta do projeto

```bash
cd StreamIF
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar o Expo

```bash
npx expo start
```

Para iniciar limpando cache:

```bash
npx expo start -c
```

### 4. Abrir no celular

Abra o app **Expo Go** no celular e escaneie o QR Code exibido pelo Expo.

---

## Estrutura do projeto

```text
StreamIF/
├── App.js
├── app.json
├── index.js
├── package.json
├── package-lock.json
├── README.md
├── assets/
│   └── posters/
│       ├── interestelar.jpg
│       ├── breaking-bad.jpg
│       ├── cidade-de-deus.jpg
│       └── todo-mundo-em-panico.jpg
├── components/
│   ├── AddMediaForm.js
│   ├── EmptyState.js
│   ├── IFMark.js
│   └── MediaCard.js
├── docs/
│   ├── ARQUITETURA.md
│   ├── DEPURACAO.md
│   └── QUESTOES.md
└── screens/
    ├── CatalogScreen.js
    └── DetailScreen.js
```

---

## Arquitetura resumida

O `App.js` funciona como orquestrador principal do app. Ele concentra o estado global e as funções que modificam a lista de mídias.

As telas ficam em `screens/`:

- `CatalogScreen.js`;
- `DetailScreen.js`.

Os componentes reutilizáveis ficam em `components/`:

- `MediaCard.js`;
- `AddMediaForm.js`;
- `EmptyState.js`;
- `IFMark.js`.

O fluxo de dados segue o padrão:

```text
App.js
  ↓ props
Telas e componentes filhos
  ↓ callbacks
App.js atualiza o estado
  ↓
Interface renderiza novamente
```

A explicação completa da arquitetura está em:

- [docs/ARQUITETURA.md](./docs/ARQUITETURA.md)

---

## Documentação complementar

Para manter o README limpo e profissional, os documentos acadêmicos e técnicos foram separados:

- [Arquitetura do projeto](./docs/ARQUITETURA.md)
- [Diário de depuração](./docs/DEPURACAO.md)
- [Respostas às questões obrigatórias](./docs/QUESTOES.md)

---

## Como testar

1. Abrir o app no Expo Go.
2. Tocar em **Carregar exemplo**.
3. Verificar se os cards aparecem com imagens.
4. Tocar em um card para alternar entre assistido e pendente.
5. Fazer toque longo em um card para abrir detalhes.
6. Escrever uma anotação pessoal.
7. Tocar em **Editar**.
8. Alterar título, gênero, nota ou imagem.
9. Salvar e verificar a atualização.
10. Buscar por um termo inexistente.
11. Usar **Limpar busca e filtros**.
12. Excluir uma mídia e confirmar no alerta.
13. Alternar entre tema claro e escuro.
14. Alternar ordenação entre A-Z e maior nota.

---

## Observações sobre persistência

O StreamIF mantém os dados em memória durante a execução do app.

Isso significa que, ao reiniciar o aplicativo, os dados cadastrados manualmente são perdidos.

Essa escolha foi intencional porque o trabalho tem foco em estado, props, componentes, listas, modal, navegação condicional e organização arquitetural, sem exigir backend ou banco de dados.

---

## Resumo técnico

O StreamIF é um app React Native com Expo que demonstra uma arquitetura mobile modular, baseada em componentes reutilizáveis, estado centralizado e fluxo de dados por props.

A lista principal usa `FlatList`, os detalhes usam `ScrollView`, o cadastro usa `Modal`, e as atualizações são feitas de forma imutável.

Além dos requisitos obrigatórios, o app inclui filtros, busca, edição, tema manual, imagens locais, animações e feedback tátil.
