# Arquitetura: StreamIF

Este documento descreve a organização técnica do StreamIF, explicando as responsabilidades de cada arquivo, o fluxo de dados, a estratégia de componentização e as decisões arquiteturais usadas no projeto.

---

## Visão geral

O StreamIF foi organizado em uma arquitetura modular baseada em três camadas principais:

```text
App.js
screens/
components/
```

A ideia central foi separar responsabilidades:

- `App.js` controla o estado global e as regras principais;
- `screens/` organiza as telas do app;
- `components/` concentra elementos reutilizáveis da interface.

Essa organização evita que todo o código fique concentrado em um único arquivo e facilita manutenção, leitura, testes e apresentação oral.

---

## Estrutura arquitetural

```text
StreamIF/
├── App.js
├── components/
│   ├── AddMediaForm.js
│   ├── EmptyState.js
│   ├── IFMark.js
│   └── MediaCard.js
└── screens/
    ├── CatalogScreen.js
    └── DetailScreen.js
```

---

## Árvore de componentes

```text
App.js
├── CatalogScreen
│   ├── FlatList
│   │   └── MediaCard
│   ├── EmptyState
│   └── Modal
│       └── AddMediaForm
└── DetailScreen
```

O `App.js` decide qual tela deve aparecer:

- se existe uma mídia selecionada, renderiza `DetailScreen`;
- caso contrário, renderiza `CatalogScreen`.

Essa navegação é feita por renderização condicional, sem uso de React Navigation ou Expo Router.

---

## Papel do App.js

O `App.js` é o orquestrador principal do projeto.

Ele concentra o estado global:

```js
const [medias, setMedias] = useState([]);
const [modalVisible, setModalVisible] = useState(false);
const [selectedMediaId, setSelectedMediaId] = useState(null);
const [editingMediaId, setEditingMediaId] = useState(null);

const [sortMode, setSortMode] = useState('az');
const [isDarkMode, setIsDarkMode] = useState(true);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('all');
```

Ele também concentra as funções de regra de negócio:

- adicionar mídia;
- editar mídia;
- excluir mídia;
- alternar status de assistido;
- abrir detalhes;
- voltar ao catálogo;
- alterar anotações;
- abrir e fechar modal;
- alternar ordenação;
- alternar tema;
- limpar filtros;
- carregar dados de exemplo.

O `App.js` não desenha diretamente cada card nem o formulário. Ele envia dados e funções para os componentes filhos.

Essa escolha deixa o `App.js` como fonte única da verdade do aplicativo.

---

## Papel das telas

### CatalogScreen.js

A `CatalogScreen` é responsável pela tela principal do catálogo.

Ela recebe do `App.js`:

- lista filtrada de mídias;
- estatísticas do catálogo;
- tema atual;
- estado do modal;
- busca;
- filtro;
- ordenação;
- mídia em edição;
- callbacks para adicionar, editar, excluir, buscar e filtrar.

Responsabilidades principais:

- renderizar cabeçalho;
- exibir contador de mídias;
- exibir busca;
- exibir filtros;
- exibir botão de ordenação;
- renderizar a lista com `FlatList`;
- exibir `EmptyState` quando necessário;
- abrir o modal com `AddMediaForm`.

A tela não é dona da lista original de mídias. Ela apenas exibe os dados recebidos.

---

### DetailScreen.js

A `DetailScreen` mostra os detalhes de uma mídia selecionada.

Responsabilidades principais:

- exibir imagem ou fallback visual;
- mostrar título, gênero, nota e status;
- permitir anotações pessoais;
- permitir edição da mídia;
- permitir voltar para o catálogo.

Ela recebe a mídia por props e chama callbacks quando precisa modificar algo, como as anotações.

---

## Papel dos componentes

### MediaCard.js

O `MediaCard` representa visualmente uma mídia dentro da lista.

Ele recebe por props:

- objeto da mídia;
- tema atual;
- função de toque curto;
- função de toque longo;
- função de exclusão.

Responsabilidades:

- exibir pôster ou marca “IF”;
- exibir título;
- exibir gênero;
- exibir nota;
- exibir status;
- aplicar cor da nota de acordo com a faixa;
- disparar eventos para o componente pai.

O card não altera o estado global diretamente. Ele apenas chama funções recebidas via props.

---

### AddMediaForm.js

O `AddMediaForm` é o formulário usado dentro do `Modal`.

Ele possui estado local para os campos:

```js
const [title, setTitle] = useState('');
const [genre, setGenre] = useState('');
const [rating, setRating] = useState('');
const [imageUri, setImageUri] = useState('');
```

Isso faz sentido porque os dados digitados ainda são temporários. Eles só sobem para o `App.js` quando o usuário toca em salvar.

O formulário funciona em dois modos:

- criação de nova mídia;
- edição de mídia existente.

Ao salvar, chama:

```js
onSave(mediaData);
```

A função `onSave` vem do componente pai. Isso cria o fluxo bottom-up.

---

### EmptyState.js

O `EmptyState` aparece quando:

- o catálogo está vazio;
- a busca ou filtro não encontrou resultados.

Ele melhora a experiência do usuário porque evita uma tela vazia sem explicação.

Quando não há nenhuma mídia, oferece o botão para carregar exemplos.

Quando há mídias cadastradas, mas nenhuma aparece por causa de busca/filtro, oferece o botão para limpar filtros.

---

### IFMark.js

O `IFMark` é um componente visual simples que exibe a sigla “IF”.

Ele foi criado para:

- substituir ícones genéricos de rolo de filme;
- dar identidade própria ao app;
- funcionar como fallback visual quando uma mídia não possui imagem.

---

## Fluxo de dados

O app segue dois fluxos principais:

- dados descem por props;
- eventos sobem por callbacks.

```text
App.js
  ↓ envia dados por props
CatalogScreen / DetailScreen
  ↓ repassam dados
Componentes reutilizáveis
  ↓ disparam eventos por callbacks
App.js atualiza o estado
  ↓
React renderiza a interface novamente
```

---

## Exemplo: cadastro de uma mídia

```text
Usuário digita no AddMediaForm
        ↓
Estados locais do formulário são atualizados
        ↓
Usuário toca em Salvar
        ↓
AddMediaForm chama onSave(mediaData)
        ↓
CatalogScreen repassa a função recebida
        ↓
App.js executa handleSubmitMedia(mediaData)
        ↓
App.js atualiza o array medias com setMedias()
        ↓
React renderiza CatalogScreen novamente
        ↓
FlatList mostra a nova mídia
```

Esse fluxo mantém o `App.js` como fonte única da verdade para a lista.

---

## Exemplo: edição de uma mídia

Quando o usuário toca em **Editar**, o `App.js` salva o ID da mídia em edição:

```js
setEditingMediaId(id);
setSelectedMediaId(null);
setModalVisible(true);
```

Depois, o formulário recebe a mídia atual por props e preenche os campos com `useEffect`.

Ao salvar, o `App.js` percorre a lista com `map()` e substitui apenas a mídia correspondente ao ID editado.

Esse processo preserva a imutabilidade do estado.

---

## Exemplo: exclusão de mídia

A exclusão é feita no `App.js` com `Array.filter()`:

```js
setMedias((currentMedias) =>
  currentMedias.filter((media) => media.id !== id)
);
```

O uso de `filter()` cria um novo array, respeitando a imutabilidade do React.

Essa escolha é melhor do que usar `splice()` ou `delete`, porque essas abordagens alteram o array original e podem impedir que a interface atualize corretamente.

---

## Busca, filtro e ordenação

A lista exibida na tela não é exatamente o array original `medias`.

O `App.js` calcula uma versão derivada chamada `visibleMedias`.

Essa lista passa por três etapas:

```text
medias
  ↓ busca por título/gênero
filteredBySearch
  ↓ filtro por status
filteredByStatus
  ↓ ordenação A-Z ou por nota
visibleMedias
```

Isso mantém o array original preservado e evita perda de dados durante busca ou filtragem.

---

## Navegação sem biblioteca externa

O trabalho não usa React Navigation nem Expo Router.

A navegação foi feita por renderização condicional:

```jsx
{selectedMedia ? (
  <DetailScreen />
) : (
  <CatalogScreen />
)}
```

Quando `selectedMedia` existe, o app mostra a tela de detalhes.

Quando `selectedMedia` é `null`, o app volta para o catálogo.

Essa solução é simples, suficiente para o escopo do trabalho e fácil de explicar.

---

## Modal de cadastro e edição

O `Modal` é controlado por estado booleano:

```js
const [modalVisible, setModalVisible] = useState(false);
```

A tela de catálogo recebe esse valor e repassa para o componente `Modal`:

```jsx
<Modal
  visible={modalVisible}
  animationType="slide"
>
```

O mesmo formulário é usado para adicionar e editar.

A diferença é controlada pelo estado `editingMediaId`.

Se `editingMediaId` for `null`, o formulário cria uma nova mídia.

Se houver um ID, o formulário edita uma mídia existente.

---

## Imagens

O app aceita dois tipos de imagem:

```js
imageSource // imagem local salva no projeto
imageUri    // imagem escolhida pelo usuário
```

As mídias de exemplo usam imagens locais:

```js
imageSource: require('./assets/posters/interestelar.jpg')
```

As mídias adicionadas manualmente podem usar imagens escolhidas pelo usuário pelo `expo-image-picker`.

Para resolver os dois casos, os componentes usam uma função auxiliar:

```js
function getMediaImageSource(media) {
  if (media.imageSource) {
    return media.imageSource;
  }

  if (media.imageUri) {
    return { uri: media.imageUri };
  }

  return null;
}
```

---

## Estilos

Cada componente possui seu próprio `StyleSheet`.

Isso evita que todos os estilos fiquem misturados em um único arquivo e melhora a manutenção.

Exemplo de organização:

```text
MediaCard.js
  ├── componente
  ├── funções auxiliares
  └── StyleSheet próprio
```

Estilos inline foram usados apenas em casos dinâmicos, como:

- tema claro/escuro;
- cores calculadas;
- tamanhos responsivos;
- estados de botão pressionado.

---

## Tema claro e escuro

O tema é controlado pelo `App.js`:

```js
const [isDarkMode, setIsDarkMode] = useState(true);
const theme = isDarkMode ? darkTheme : lightTheme;
```

O objeto `theme` é enviado para telas e componentes por props.

Isso evita duplicação de cores e mantém a interface consistente.

---

## Conclusão arquitetural

A arquitetura do StreamIF prioriza clareza e separação de responsabilidades.

O `App.js` é a fonte única da verdade.

As telas organizam a experiência visual.

Os componentes reutilizáveis cuidam de partes específicas da interface.

Os dados descem por props e os eventos sobem por callbacks.

Essa estrutura torna o projeto mais fácil de manter, explicar e evoluir.
