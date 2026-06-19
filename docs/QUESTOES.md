# Respostas às Questões Obrigatórias: StreamIF

Este documento responde às questões de verificação do trabalho StreamIF.

---

# Q1: Sobre Props e Fluxo de Dados

No `AddMediaForm.js`, os dados digitados pelo usuário são armazenados temporariamente em estados locais com `useState`.

Exemplo:

```js
const [title, setTitle] = useState('');
const [genre, setGenre] = useState('');
const [rating, setRating] = useState('');
const [imageUri, setImageUri] = useState('');
```

Cada campo do formulário usa Two-Way Binding:

```jsx
<TextInput
  value={title}
  onChangeText={setTitle}
/>
```

Quando o usuário toca em **Salvar**, o formulário chama a função `onSave`, que foi recebida por props:

```js
onSave({
  title,
  genre,
  rating: parsedRating,
  imageUri,
});
```

Essa função chega até o `App.js`, onde é tratada por `handleSubmitMedia`.

O componente filho não altera diretamente o array de mídias. Ele apenas envia os dados para o componente pai por meio de uma função.

## Diagrama do fluxo

```text
TextInput
   ↓
useState local no AddMediaForm
   ↓
handleSave()
   ↓
onSave(mediaData)
   ↓
CatalogScreen repassa a callback
   ↓
App.js executa handleSubmitMedia(mediaData)
   ↓
setMedias()
   ↓
React renderiza novamente
   ↓
FlatList recebe a lista atualizada
   ↓
MediaCard aparece no catálogo
```

Esse fluxo é chamado de Bottom-Up porque o dado sai do componente filho e sobe para o componente pai por meio de uma função passada via props.

---

# Q2: Sobre FlatList vs ScrollView

Usei `FlatList` na tela de catálogo porque ela é adequada para listas de dados.

A lista de mídias pode crescer, então a renderização precisa ser mais eficiente.

A `FlatList` trabalha com o conceito de virtualização de listas. Isso significa que ela renderiza apenas os itens necessários para a tela, em vez de manter todos os itens visíveis ao mesmo tempo.

A `ScrollView` foi usada na tela de detalhes porque a tela de detalhes não é uma lista grande. Ela mostra um único conteúdo contínuo:

- imagem;
- título;
- gênero;
- nota;
- status;
- campo de anotações.

Se eu usasse `ScrollView` para uma lista com 500 itens, o app poderia tentar renderizar todos os cards de uma vez, aumentando consumo de memória e causando lentidão.

Se eu usasse `FlatList` na tela de detalhes, seria desnecessário, porque não existe uma coleção grande de itens para virtualizar.

Conceito técnico relacionado: virtualização de listas.

---

# Q3: Sobre Modal

A propriedade que controla a visibilidade do `Modal` é:

```jsx
visible={modalVisible}
```

Essa propriedade recebe um valor booleano:

```js
true  // modal aberto
false // modal fechado
```

O estado foi declarado no componente pai `App.js`:

```js
const [modalVisible, setModalVisible] = useState(false);
```

O estado ficou no `App.js` porque ele é o dono do fluxo principal do app.

Ele precisa saber se o modal está aberto para:

- adicionar uma nova mídia;
- editar uma mídia existente;
- fechar o formulário;
- limpar o estado de edição.

O `CatalogScreen` apenas recebe `modalVisible` e as funções de abrir/fechar por props.

---

# Q4: Sobre Imutabilidade

O trecho exato que remove uma mídia da lista usa `Array.filter()`:

```js
setMedias((currentMedias) =>
  currentMedias.filter((media) => media.id !== id)
);
```

Não se deve usar `array.splice()` ou `delete array[i]` porque essas abordagens mutam o array original.

No React Native, o estado deve ser tratado de forma imutável. Quando usamos `filter()`, criamos um novo array, e isso permite que o React perceba a mudança e renderize a interface novamente.

Se o array fosse alterado diretamente, a referência do estado poderia continuar igual. Nesse caso, a interface poderia não atualizar corretamente ou apresentar comportamento inconsistente.

---

# Q5: Sobre Depuração

Durante o desenvolvimento com Expo, os `console.log()` aparecem principalmente no terminal onde o servidor do Expo está rodando.

O projeto foi iniciado com:

```bash
npx expo start
```

Quando foi necessário limpar cache, usei:

```bash
npx expo start -c
```

Também é possível inspecionar logs e erros pelo menu de desenvolvimento do Expo/React Native no dispositivo.

Em versões atuais, o fluxo mais comum é abrir o menu de desenvolvimento e usar a opção de depuração JavaScript disponível no ambiente. Em alguns materiais ou versões anteriores, essa opção aparece como depuração remota no Chrome.

## Diferença entre Red Box e Yellow Box

### Red Box

É um erro crítico.

Normalmente quebra a execução da tela ou impede o app de funcionar corretamente.

Exemplo real encontrado:

```text
ReferenceError: Property 'normalizeText' doesn't exist
```

### Yellow Box

É um aviso.

Normalmente indica uso depreciado, comportamento suspeito ou problema potencial, mas não necessariamente impede o app de continuar funcionando.

---

# Q6: Pergunta-Armadilha de Arquitetura

O trecho apresentado no enunciado tem vários problemas arquiteturais e de boas práticas.

---

## Problema 1: Tudo concentrado no `App.js`

O código mistura:

- estado;
- formulário;
- lista;
- card;
- estilos;
- lógica de cadastro.

Isso dificulta manutenção, leitura e reaproveitamento.

## Correção

Separar responsabilidades:

```text
App.js
components/MediaCard.js
components/AddMediaForm.js
components/EmptyState.js
screens/CatalogScreen.js
screens/DetailScreen.js
```

---

## Problema 2: Uso de array comum em vez de estado

O código usa algo como:

```js
let filmes = [];
```

Isso é errado porque variáveis comuns não disparam renderização no React.

## Correção

Usar `useState`:

```js
const [medias, setMedias] = useState([]);
```

---

## Problema 3: Uso de variável comum para input

O código usa uma variável comum para guardar o texto digitado.

Isso é ruim porque o campo não fica sincronizado com o estado da interface.

## Correção

Usar estado local:

```js
const [title, setTitle] = useState('');
```

E Two-Way Binding:

```jsx
<TextInput
  value={title}
  onChangeText={setTitle}
/>
```

---

## Problema 4: Componente declarado dentro de outro componente

O exemplo declara `MeuCard` dentro do `App.js`.

Isso é ruim porque o componente é recriado a cada renderização e não fica reutilizável.

## Correção

Criar um arquivo próprio:

```text
components/MediaCard.js
```

---

## Problema 5: Estilos inline fixos

O exemplo usa estilos diretamente no JSX:

```jsx
<View style={{ padding: 10, margin: 5, backgroundColor: 'blue' }}>
```

Isso dificulta manutenção e reaproveitamento.

## Correção

Usar `StyleSheet.create()` dentro de cada componente:

```js
const styles = StyleSheet.create({
  card: {
    padding: 10,
    margin: 5,
  },
});
```

---

## Problema 6: Uso de `ScrollView` para lista

O exemplo usa `ScrollView` para listar vários itens.

Isso é inadequado para listas grandes porque pode renderizar todos os itens de uma vez.

## Correção

Usar `FlatList`:

```jsx
<FlatList
  data={medias}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => (
    <MediaCard media={item} />
  )}
/>
```

---

## Problema 7: Falta de imutabilidade

Ao adicionar ou remover itens, o array não deve ser mutado diretamente.

## Correção para adicionar

```js
setMedias((currentMedias) => [...currentMedias, mediaToAdd]);
```

## Correção para remover

```js
setMedias((currentMedias) =>
  currentMedias.filter((media) => media.id !== id)
);
```

---

## Versão corrigida conceitualmente

```jsx
import { useState } from 'react';
import CatalogScreen from './screens/CatalogScreen';

export default function App() {
  const [medias, setMedias] = useState([]);

  function handleAddMedia(mediaData) {
    const mediaToAdd = {
      id: Date.now(),
      title: mediaData.title.trim(),
      genre: mediaData.genre.trim(),
      rating: Number(mediaData.rating),
      watched: false,
      notes: '',
    };

    setMedias((currentMedias) => [...currentMedias, mediaToAdd]);
  }

  function handleDeleteMedia(id) {
    setMedias((currentMedias) =>
      currentMedias.filter((media) => media.id !== id)
    );
  }

  return (
    <CatalogScreen
      medias={medias}
      onAddMedia={handleAddMedia}
      onDeleteMedia={handleDeleteMedia}
    />
  );
}
```

Essa versão melhora a arquitetura porque:

- o estado fica centralizado no `App.js`;
- a lista é atualizada com imutabilidade;
- o card vira componente separado;
- a tela de catálogo fica separada;
- o código fica mais organizado e fácil de testar;
- o fluxo de dados fica claro entre pai e filhos.
