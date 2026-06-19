# Diário de Depuração: StreamIF

Este documento registra problemas reais encontrados durante o desenvolvimento do StreamIF, a causa identificada, a solução aplicada e o aprendizado técnico de cada caso.

---

## Ambiente de desenvolvimento

- Sistema: Windows
- Projeto: React Native com Expo
- Execução: Expo Go
- Linguagem: JavaScript

Comando principal:

```bash
npx expo start
```

Com cache limpo:

```bash
npx expo start -c
```

---

# Bug 1: `ReferenceError: Property 'normalizeText' doesn't exist`

## Tipo de problema

Red Box.

## Mensagem observada

```text
ReferenceError: Property 'normalizeText' doesn't exist
```

## Contexto

O erro apareceu depois de alterações na lógica de busca e normalização de texto.

O app tentava executar uma função chamada `normalizeText`, mas essa função não estava mais definida com esse nome.

## Causa identificada

Durante a refatoração, a função de normalização de texto foi renomeada para `sanitizeText`, mas algumas chamadas antigas ainda continuaram usando `normalizeText`.

Isso gerou inconsistência entre os arquivos e fez o React Native tentar chamar uma função inexistente.

## Correção aplicada

Foi feita uma busca global no projeto pelo nome antigo:

```text
normalizeText
```

Todas as ocorrências foram substituídas por:

```text
sanitizeText
```

A função final ficou padronizada assim:

```js
function sanitizeText(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
```

## Aprendizado

Ao renomear uma função utilitária, é necessário verificar todas as referências no projeto.

Em React Native, uma referência quebrada costuma gerar Red Box porque impede a execução correta da tela.

---

# Bug 2: Imagens dos exemplos dependiam da internet

## Tipo de problema

Problema de confiabilidade visual durante a apresentação.

## Contexto

Na primeira versão, os filmes carregados pelo botão **Carregar exemplo** usavam URLs externas para exibir imagens.

Exemplo do problema:

```js
imageUri: 'https://upload.wikimedia.org/...',
```

## Causa identificada

As imagens dependiam de conexão com a internet.

Em uma apresentação escolar, isso poderia causar falha visual caso o Wi-Fi estivesse lento, bloqueado ou indisponível.

## Correção aplicada

As imagens foram salvas localmente dentro do projeto:

```text
assets/posters/
├── interestelar.jpg
├── breaking-bad.jpg
├── cidade-de-deus.jpg
└── todo-mundo-em-panico.jpg
```

Depois, os exemplos passaram a usar `require()`:

```js
imageSource: require('./assets/posters/interestelar.jpg')
```

Também foi necessário adaptar `MediaCard.js` e `DetailScreen.js` para aceitar dois tipos de imagem:

```js
imageSource // imagem local salva no projeto
imageUri    // imagem escolhida pelo usuário
```

A função usada para resolver a imagem ficou assim:

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

## Aprendizado

Para dados de demonstração importantes, assets locais deixam o projeto mais previsível e evitam falhas durante a apresentação.

---

# Bug 3: Risco de apagar mídia acidentalmente

## Tipo de problema

Problema de usabilidade.

## Contexto

Na primeira versão da exclusão, o usuário tocava no botão de lixeira e o item era removido imediatamente.

## Causa identificada

Excluir diretamente é perigoso em interface mobile, porque o usuário pode tocar sem querer em um botão pequeno.

## Correção aplicada

Foi adicionado `Alert.alert()` antes da remoção definitiva:

```js
Alert.alert(
  'Excluir mídia?',
  `Deseja excluir "${mediaToDelete.title}" do catálogo?`,
  [
    {
      text: 'Cancelar',
      style: 'cancel',
    },
    {
      text: 'Excluir',
      style: 'destructive',
      onPress: () => {
        setMedias((currentMedias) =>
          currentMedias.filter((media) => media.id !== id)
        );
      },
    },
  ]
);
```

## Aprendizado

Ações destrutivas devem pedir confirmação para evitar perda acidental de dados.

---

# Bug 4: Expo exibindo versão antiga após alteração

## Tipo de problema

Problema de cache durante desenvolvimento.

## Contexto

Após algumas alterações em componentes, o app ainda parecia executar uma versão anterior do código.

Isso gerava confusão porque o arquivo já havia sido corrigido, mas a tela ainda mostrava comportamento antigo.

## Causa identificada

O Metro Bundler/Expo pode manter cache de versões anteriores durante o desenvolvimento.

## Correção aplicada

O servidor Expo foi reiniciado com cache limpo:

```bash
npx expo start -c
```

Em alguns momentos, também foi necessário encerrar o servidor com `Ctrl + C` e iniciar novamente.

## Aprendizado

Quando uma alteração parece correta no código, mas não aparece no app, limpar o cache é uma etapa importante de depuração.

---

# Red Box vs Yellow Box

## Red Box

É um erro crítico.

Normalmente impede a tela ou o app de funcionar corretamente.

Exemplo real encontrado:

```text
ReferenceError: Property 'normalizeText' doesn't exist
```

## Yellow Box

É um aviso.

Normalmente indica uso depreciado, comportamento suspeito ou problema potencial, mas não impede necessariamente o app de continuar rodando.

---

# Conclusão

Durante o desenvolvimento, os principais problemas envolveram:

- referência a função inexistente;
- dependência de internet para imagens;
- risco de exclusão acidental;
- cache do Expo durante testes.

As correções melhoraram a estabilidade, a confiabilidade visual, a usabilidade e a previsibilidade do app durante a apresentação.
