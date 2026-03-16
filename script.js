/**
 * PROJETO: Gerenciador de Tarefas
 * REQUISITOS ATENDIDOS: Cadastro, Consulta, LocalStorage, Edição e Exclusão.
 */

// 1. INICIALIZAÇÃO: Busca dados no LocalStorage ou inicia array vazio [cite: 52]
let listaTarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

const formulario = document.querySelector('#task-form');
const container = document.querySelector('#lista-tarefas');
const campoBusca = document.querySelector('#busca');
const inputIndex = document.querySelector('#task-index');
const tituloForm = document.querySelector('#form-title');
const btnSubmit = document.querySelector('#btn-submit');

// 2. FUNÇÃO DE RENDERIZAÇÃO: Atualização dinâmica da interface (DOM) [cite: 117]
function renderizarTarefas(listaParaExibir = listaTarefas) {
    container.innerHTML = "";

    // Validação: Exibir mensagem caso não haja tarefas 
    if (listaParaExibir.length === 0) {
        container.innerHTML = `<p class="msg-vazia">Nenhuma tarefa encontrada.</p>`;
        return;
    }

    listaParaExibir.forEach((tarefa) => {
        const indexReal = listaTarefas.indexOf(tarefa);
        
        let classePrioridade = "";
        if (tarefa.prioridade === "Alta") classePrioridade = "prioridade-alta";
        else if (tarefa.prioridade === "Média") classePrioridade = "prioridade-media";
        else if (tarefa.prioridade === "Baixa") classePrioridade = "prioridade-baixa";

        // Criação dinâmica dos elementos via Template Literals [cite: 78]
        container.innerHTML += `
            <div class="tarefa-card ${classePrioridade}">
                <h3>${tarefa.titulo}</h3>
                <p>${tarefa.descricao}</p>
                <p><strong>Prazo:</strong> ${tarefa.data}</p>
                <p><strong>Status:</strong> 
                    <button class="btn-status" onclick="alternarStatus(${indexReal})">${tarefa.status}</button>
                </p>
                <div class="acoes-card">
                    <button class="btn-editar" onclick="prepararEdicao(${indexReal})">Editar</button>
                    <button class="btn-excluir" onclick="excluirTarefa(${indexReal})">Excluir</button>
                </div>
            </div>
        `;
    });
}

// 3. CADASTRO E EDIÇÃO: Lógica para salvar ou atualizar dados [cite: 33, 49]
formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const tarefaDados = {
        titulo: document.querySelector('#titulo').value.trim(),
        descricao: document.querySelector('#descricao').value.trim(),
        data: document.querySelector('#data').value,
        prioridade: document.querySelector('#prioridade').value,
        status: document.querySelector('#status').value
    };

    // Validação simples para impedir campos vazios [cite: 51]
    if (!tarefaDados.titulo || !tarefaDados.descricao) return;

    const index = parseInt(inputIndex.value);

    if (index === -1) {
        listaTarefas.push(tarefaDados); // Novo cadastro
    } else {
        listaTarefas[index] = tarefaDados; // Edição de existente 
    }

    salvarESincronizar();
    cancelarEdicao();
});

// 4. FUNCIONALIDADES ADICIONAIS: Editar, Excluir e Status [cite: 48, 49, 50]
window.prepararEdicao = (index) => {
    const tarefa = listaTarefas[index];
    document.querySelector('#titulo').value = tarefa.titulo;
    document.querySelector('#descricao').value = tarefa.descricao;
    document.querySelector('#data').value = tarefa.data;
    document.querySelector('#prioridade').value = tarefa.prioridade;
    document.querySelector('#status').value = tarefa.status;
    
    inputIndex.value = index;
    tituloForm.innerText = "Editando Tarefa";
    btnSubmit.innerText = "Salvar Alterações";
    document.querySelector('#btn-cancel').style.display = "inline-block";
};

window.cancelarEdicao = () => {
    formulario.reset();
    inputIndex.value = "-1";
    tituloForm.innerText = "Nova Tarefa";
    btnSubmit.innerText = "Cadastrar Tarefa";
    document.querySelector('#btn-cancel').style.display = "none";
};

window.excluirTarefa = (index) => {
    if(confirm("Deseja realmente excluir esta tarefa?")) {
        listaTarefas.splice(index, 1);
        salvarESincronizar();
    }
};

window.alternarStatus = (index) => {
    listaTarefas[index].status = listaTarefas[index].status === "Pendente" ? "Concluída" : "Pendente";
    salvarESincronizar();
};

// 5. BUSCA: Pesquisar tarefas pelo título [cite: 43]
campoBusca.addEventListener('input', () => {
    const termo = campoBusca.value.toLowerCase();
    const filtradas = listaTarefas.filter(t => t.titulo.toLowerCase().includes(termo));
    renderizarTarefas(filtradas);
});

// 6. PERSISTÊNCIA: Salva no LocalStorage e atualiza a tela [cite: 89]
function salvarESincronizar() {
    localStorage.setItem("tarefas", JSON.stringify(listaTarefas));
    renderizarTarefas();
}

// Inicializa a listagem ao abrir a página [cite: 87]
renderizarTarefas();