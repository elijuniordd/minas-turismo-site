const API_URL = 'http://localhost:3000/cidades'; 
const formCadastro = document.getElementById('formCadastroDestinacao');
const corpoTabela = document.getElementById('corpoTabelaDestinacoes');
const mensagemStatus = document.getElementById('mensagemStatus');

let idEmEdicao = null;

async function fetchDestinacoes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erro ao buscar destinações: ${response.statusText}`);
        }
        const destinacoes = await response.json();
        renderTabela(destinacoes);
    } catch (error) {
        console.error(error);
        mensagemStatus.textContent = `Erro ao carregar dados: ${error.message}`;
        mensagemStatus.style.color = 'red';
    }
}

function renderTabela(destinacoes) {
    corpoTabela.innerHTML = '';

    if (destinacoes.length === 0) {
        const linhaVazia = corpoTabela.insertRow();
        const celulaVazia = linhaVazia.insertCell();
        celulaVazia.colSpan = 5;
        celulaVazia.textContent = 'Nenhuma destinação cadastrada ainda.';
        celulaVazia.style.textAlign = 'center';
        return;
    }

    destinacoes.forEach(dest => {
        const linha = corpoTabela.insertRow();

        linha.insertCell().textContent = dest.id;
        const tdNomeCidade = linha.insertCell();
        tdNomeCidade.textContent = dest.nomeCidade;
        tdNomeCidade.setAttribute('data-label', 'Cidade:');

        const tdRegiao = linha.insertCell();
        tdRegiao.textContent = dest.regiaoMinas || 'N/A';
        tdRegiao.setAttribute('data-label', 'Região:');

        const tdLugarPrincipal = linha.insertCell();
        tdLugarPrincipal.textContent = dest.nomeLugar || 'N/A';
        tdLugarPrincipal.setAttribute('data-label', 'Lugar Principal:');

        const celulaAcoes = linha.insertCell();
        celulaAcoes.setAttribute('data-label', 'Ações:');

        const btnEditar = document.createElement('button');
        btnEditar.className = 'btn-action btn-edit';
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => carregarParaEdicao(dest);
        celulaAcoes.appendChild(btnEditar);

        const btnExcluir = document.createElement('button');
        btnExcluir.className = 'btn-action btn-delete';
        btnExcluir.textContent = 'Excluir';
        btnExcluir.onclick = () => excluirDestinacao(dest.id);
        celulaAcoes.appendChild(btnExcluir);
    });
}

formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();

    const destinacaoData = {
        nomeCidade: document.getElementById('nomeCidade').value,
        estadoCidade: document.getElementById('estadoCidade').value,
        regiaoMinas: document.getElementById('regiaoMinas').value,
        descricaoCidade: document.getElementById('descricaoCidade').value,
        urlFotoCidade: document.getElementById('urlFotoCidade').value,
        nomeLugar: document.getElementById('nomeLugar').value,
        tipoLugar: document.getElementById('tipoLugar').value,
        descricaoLugar: document.getElementById('descricaoLugar').value,
        urlFotoLugar: document.getElementById('urlFotoLugar').value,
    };

    let url = API_URL;
    let method = 'POST';

    if (idEmEdicao) {
        url = `${API_URL}/${idEmEdicao}`;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(destinacaoData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao ${idEmEdicao ? 'atualizar' : 'cadastrar'} destinação: ${response.statusText}`);
        }

        mensagemStatus.textContent = `Destinação ${idEmEdicao ? 'atualizada' : 'cadastrada'} com sucesso!`;
        mensagemStatus.style.color = 'green';
        formCadastro.reset();
        idEmEdicao = null;
        document.querySelector('.btn-submit').textContent = 'Cadastrar Destinação';
        fetchDestinacoes();
    } catch (error) {
        console.error(error);
        mensagemStatus.textContent = error.message;
        mensagemStatus.style.color = 'red';
    }

    setTimeout(() => { mensagemStatus.textContent = ''; }, 5000);
});

function carregarParaEdicao(destinacao) {
    idEmEdicao = destinacao.id;

    document.getElementById('nomeCidade').value = destinacao.nomeCidade || '';
    document.getElementById('estadoCidade').value = destinacao.estadoCidade || 'MG';
    document.getElementById('regiaoMinas').value = destinacao.regiaoMinas || '';
    document.getElementById('descricaoCidade').value = destinacao.descricaoCidade || '';
    document.getElementById('urlFotoCidade').value = destinacao.urlFotoCidade || '';
    document.getElementById('nomeLugar').value = destinacao.nomeLugar || '';
    document.getElementById('tipoLugar').value = destinacao.tipoLugar || '';
    document.getElementById('descricaoLugar').value = destinacao.descricaoLugar || '';
    document.getElementById('urlFotoLugar').value = destinacao.urlFotoLugar || '';

    document.querySelector('.btn-submit').textContent = 'Salvar Alterações';
    window.scrollTo(0, formCadastro.offsetTop);
    document.getElementById('nomeCidade').focus();
}

async function excluirDestinacao(id) {
    if (!confirm('Tem certeza que deseja excluir esta destinação?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Erro ao excluir destinação: ${response.statusText}`);
        }
        mensagemStatus.textContent = 'Destinação excluída com sucesso!';
        mensagemStatus.style.color = 'green';
        fetchDestinacoes();
    } catch (error) {
        console.error(error);
        mensagemStatus.textContent = `Erro ao excluir: ${error.message}`;
        mensagemStatus.style.color = 'red';
    }
    setTimeout(() => { mensagemStatus.textContent = ''; }, 3000);
}

document.addEventListener('DOMContentLoaded', fetchDestinacoes);