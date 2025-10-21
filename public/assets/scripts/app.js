async function renderizarDetalhes() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id"); 
    const container = document.getElementById('detalhes');

    if (!id && container) {
        container.innerHTML = "<p>ID da cidade não fornecido na URL.</p>";
        return;
    }
    if (!container) {
        console.error("Elemento com ID 'detalhes' não encontrado.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/cidades/${id}`); 

        if (!response.ok) {
            throw new Error(`Erro ao buscar cidade: ${response.statusText}`);
        }

        const cidade = await response.json(); 

        if (cidade) {
            
            const imagemDefault = 'https://picsum.photos/700/400?sig=3'; 

            const cidadeHTML = `
                <section class="detalhes-cidade">
                    <h2>${cidade.nome} - ${cidade.estado}</h2>
                    <img src="${cidade.imagem || imagemDefault}" alt="Imagem de ${cidade.nome}" class="imagem-detalhe">
                    <p><strong>População:</strong> ${cidade.populacao ? cidade.populacao.toLocaleString() : 'N/A'} habitantes</p>
                    <h3>Pontos Turísticos:</h3>
                    <ul>
                        ${cidade.lugares && cidade.lugares.length > 0
                            ? cidade.lugares.map(lugar => `<li><strong>${lugar.nome}:</strong> ${lugar.descricao}</li>`).join('')
                            : '<li>Nenhum ponto turístico cadastrado.</li>'
                        }
                    </ul>
                </section>
            `;
            container.innerHTML = cidadeHTML;
        } else {
            container.innerHTML = "<p>Cidade não encontrada.</p>";
        }
    } catch (error) {
        console.error("Falha ao renderizar detalhes da cidade:", error);
        container.innerHTML = "<p>Não foi possível carregar os detalhes da cidade. Verifique o console para mais informações.</p>";
    }
}


async function inicializar() {
    const paginaAtual = window.location.pathname;
    if (paginaAtual.includes("index.html")) {
       
        await renderizarCards(); 
    } else if (paginaAtual.includes("detalhes.html")) {
        await renderizarDetalhes();
    }
}


async function renderizarCards() {
    const containerCards = document.getElementById('cards-container'); 
    if (!containerCards) return;

    try {
        const response = await fetch('http://localhost:3000/cidades');
        if (!response.ok) {
            throw new Error(`Erro ao buscar cidades: ${response.statusText}`);
        }
        const cidades = await response.json();

        let cardsHTML = '';
        if (cidades && cidades.length > 0) {
            cidades.forEach(cidade => {
                const imagemDefaultCard = 'https://picsum.photos/300/200?sig=' + cidade.id;
                cardsHTML += `
                    <div class="card">
                        <img src="${cidade.imagem || imagemDefaultCard}" alt="Imagem de ${cidade.nome}">
                        <h3>${cidade.nome}</h3>
                        <p>${cidade.estado}</p>
                        <a href="detalhes.html?id=${cidade.id}">Ver detalhes</a>
                    </div>
                `;
            });
        } else {
            cardsHTML = '<p>Nenhuma cidade encontrada.</p>';
        }
        containerCards.innerHTML = cardsHTML;

    } catch (error) {
        console.error("Falha ao renderizar cards:", error);
        containerCards.innerHTML = "<p>Não foi possível carregar as cidades.</p>";
    }
}


inicializar();