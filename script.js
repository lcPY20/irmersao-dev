// Aguarda o carregamento completo do DOM para executar o script.
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA O MODO ESCURO (DARK MODE) ---

    const themeToggleButton = document.createElement('button');
    themeToggleButton.id = 'theme-toggle';

    const header = document.querySelector('header');
    header.prepend(themeToggleButton); // Adiciona o botão no início do cabeçalho.

    // Ícones SVG minimalistas para sol e lua
    const sunIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color);">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    `;

    const moonIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color);">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    `;

    // Função para atualizar o ícone e o estado do tema
    const updateTheme = () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeToggleButton.innerHTML = isDarkMode ? sunIcon : moonIcon;
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    };

    // Verifica a preferência do usuário no localStorage ao carregar a página
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    updateTheme(); // Define o ícone correto no carregamento

    // Adiciona o evento de clique ao botão
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        updateTheme();
    });


    // --- LÓGICA EXISTENTE PARA BUSCA ---

// Seleciona o elemento HTML onde os cards serão inseridos.
let cardContainer = document.querySelector(".card-container");

// Inicializa um array vazio que irá armazenar os dados carregados do arquivo JSON.
let dados = [];

// Seleciona o elemento de input (campo de texto) usado para a busca.
let inputBusca = document.querySelector("#input-busca");

// Adiciona um "escutador de eventos" ao campo de busca que é acionado sempre que uma tecla é pressionada.
inputBusca.addEventListener('keydown', (event) => {
    // Verifica se a tecla pressionada foi a tecla "Enter".
    if (event.key === 'Enter') {
        // Se for "Enter", chama a função que inicia o processo de busca.
        iniciarBusca();
    }
});

// Seleciona o botão de busca pelo seu ID.
let btnBusca = document.querySelector("#botao-busca");

// Adiciona um "escutador de eventos" de clique ao botão.
// Quando o botão for clicado, a função iniciarBusca será chamada.
btnBusca.addEventListener('click', iniciarBusca);

// Seleciona o botão da biblioteca pelo seu ID.
let btnBiblioteca = document.querySelector("#botao-biblioteca");

// Adiciona um "escutador de eventos" de clique ao botão da biblioteca.
btnBiblioteca.addEventListener('click', mostrarTudo);

// Define uma função assíncrona para buscar e mostrar todos os dados.
async function mostrarTudo() {
    // Verifica se o array 'dados' está vazio. Se estiver, os dados do JSON ainda não foram carregados.
    if (dados.length === 0) {
        // 'fetch' busca o arquivo 'data.json'. 'await' pausa a execução até que o arquivo seja baixado.
        let resposta = await fetch("data.json");
        // '.json()' converte a resposta da rede em um objeto/array JavaScript.
        dados = await resposta.json();
    }

    // Chama a função para criar e exibir os cards na tela, passando todos os dados carregados.
    renderizarCards(dados);
}

// Define uma função assíncrona para buscar e filtrar os dados.
// "async" permite o uso da palavra-chave "await" dentro dela, para lidar com operações que levam tempo (como carregar um arquivo).
async function iniciarBusca() {
    // Verifica se o array 'dados' está vazio. Se estiver, significa que os dados do arquivo JSON ainda não foram carregados.
    if (dados.length === 0) {
        // 'fetch' busca o arquivo 'data.json'. 'await' pausa a execução até que o arquivo seja baixado.
        let resposta = await fetch("data.json");
        // '.json()' converte a resposta da rede (que é texto) em um objeto/array JavaScript. 'await' pausa até a conversão terminar.
        dados = await resposta.json();
    }

    // Pega o valor digitado no campo de busca.
    // '.trim()' remove espaços em branco do início e do fim.
    // '.toLowerCase()' converte todo o texto para minúsculas para garantir que a busca não diferencie maiúsculas de minúsculas.
    let termoBusca = inputBusca.value.trim().toLowerCase();

    // Se o termo de busca estiver vazio, limpa os resultados e interrompe a função.
    if (termoBusca === "") {
        // Limpa o container de cards para não exibir nada.
        cardContainer.innerHTML = "";
        return; // Encerra a execução da função aqui.
    }

    // '.filter()' cria um novo array com todos os elementos que passam no teste implementado pela função fornecida.
    let dadosFiltrados = dados.filter(dado => {
        // Para cada 'dado' no array, converte seu 'nome' para minúsculas e verifica se ele '.includes()' (contém) o 'termoBusca'.
        return dado.nome.toLowerCase().includes(termoBusca);
    });

    // Chama a função para criar e exibir os cards na tela, passando apenas os dados que foram filtrados.
    renderizarCards(dadosFiltrados);
}

// Define a função responsável por criar o HTML dos cards e exibi-los na página.
function renderizarCards(dados) {
    // Limpa todo o conteúdo HTML de dentro do 'cardContainer'. Isso é importante para remover resultados de buscas anteriores.
    cardContainer.innerHTML = ""; 

    // Inicia um loop 'for...of' para passar por cada objeto 'dado' dentro do array 'dados' (que foi filtrado).
    for (let dado of dados) {
        // Cria um novo elemento HTML <article> na memória.
        let article = document.createElement("article");
        // Adiciona a classe "card" ao elemento <article>, para que ele receba os estilos definidos no CSS.
        article.classList.add("card");
        // Define o conteúdo HTML interno do <article> usando um template string.
        // Isso insere dinamicamente os valores de 'nome', 'ano', 'descricao' e 'link' do objeto 'dado' atual.
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p>${dado.data_criacao}</p>
        <p>${dado.descricao}</p>
        <a href="${dado.link}" target="_blank">Saiba mais</a>
        `
        // Adiciona o elemento <article> recém-criado como um filho do 'cardContainer', tornando-o visível na página.
        cardContainer.appendChild(article);
    }
}

});