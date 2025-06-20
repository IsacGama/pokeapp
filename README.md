
# 📱 Pokédex App - Ionic Angular

Uma Pokédex moderna feita com **Angular Standalone Components** e **Ionic Framework**, consumindo a **PokéAPI**. A aplicação permite listar, buscar, filtrar por tipo e visualizar detalhes completos de cada Pokémon.

---

## 🚀 Tecnologias Utilizadas

- **Angular (Standalone Components)**
- **Ionic Framework**
- **RxJS (forkJoin)**
- **HttpClient Angular**
- **Lazy Load Images (ng-lazyload-image)**
- **PokéAPI (https://pokeapi.co/)**

---

## 📸 Screenshots

| Home com Filtro por Tipo | Busca por Nome | Página de Detalhes |
|--------------------------|----------------|--------------------|
| ![Home](./screenshots/home.png) | ![Search](./screenshots/search.png) | ![Details](./screenshots/details.png) |

*(Se quiser, tu mesmo tira os prints e salva numa pastinha `screenshots` dentro do projeto, viu?)*

---

## 🎯 Funcionalidades

✅ Listagem de todos os Pokémons (geração dinâmica de +1000 pokémons)  
✅ Filtro por **Tipo de Pokémon** usando o `<ion-segment>`  
✅ Busca por **nome** com `<ion-searchbar>`  
✅ Página de **Detalhes** de cada Pokémon  
✅ Exibição de **habilidades**, **altura**, **peso**, **estatísticas**, e **tipos**  
✅ Barra de progresso para os **stats**, com cores indicando o valor  
✅ Requisições paralelas com **forkJoin** para performance topada  

---

## 🧱 Arquitetura

A aplicação segue uma estrutura baseada em **componentização standalone**, sem o uso de módulos tradicionais do Angular.

- **Roteamento** feito por `app.routes.ts`
- **Bootstrapping** com `bootstrapApplication`
- **Componentes**: `HomePage`, `DetailsPage`, `AppComponent`
- **Serviço**: `PokemonService` para comunicação com a PokéAPI

---

## ⚙️ Instalação e Execução

1. **Clonar o repositório:**

```bash
git clone https://github.com/seu-usuario/pokedex-app.git
cd pokedex-app
```

2. **Instalar dependências:**

```bash
npm install
```

3. **Rodar localmente:**

```bash
ionic serve
```

---

## 🌐 Endpoints principais usados da PokéAPI

- Listagem de Pokémons:  
`https://pokeapi.co/api/v2/pokemon?limit=...&offset=...`

- Tipos de Pokémon:  
`https://pokeapi.co/api/v2/type/`

- Detalhes de Pokémon:  
`https://pokeapi.co/api/v2/pokemon/{id | name}`

- Detalhes de habilidades:  
`https://pokeapi.co/api/v2/ability/{name}`

---

## 🎨 Estilo e Design

- Paleta de cores inspirada nas **tipagens dos Pokémons**  
- Uso de **ícones Ionic** para melhorar a experiência visual  
- Feedback visual com **loadings animados (spinner Pokébola)**  
- Layout **responsivo** e otimizado tanto pra **mobile** quanto **desktop**

---

## 🤓 Boas práticas aplicadas

- Angular Standalone sem módulos
- Organização por feature folder
- Serviços desacoplados
- Lazy Loading de imagens
- Tipagem com TypeScript
- Uso de **forkJoin** pra chamadas paralelas de API
- CSS isolado por página (`home.page.scss`, `details.page.scss`)

---

## 👨‍💻 Autor

Isac Dias  
Estudante de Engenharia de Software   

---