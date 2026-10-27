// ==========================================================================
// Seletores de Elementos do DOM
// ==========================================================================
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');

const STORAGE_KEY = 'meu_dia_tarefas';

// ==========================================================================
// Funções do LocalStorage (Persistência de Dados)
// ==========================================================================

/**
 * Obtém a lista de tarefas armazenada no LocalStorage.
 * @returns {Array<{id: number, text: string}>} Lista de tarefas
 */
function getTasksFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Salva a lista de tarefas atualizada no LocalStorage.
 * @param {Array<{id: number, text: string}>} tasks 
 */
function saveTasksToStorage(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ==========================================================================
// Funções de Renderização na Interface
// ==========================================================================

/**
 * Renderiza todas as tarefas na tela a partir do LocalStorage.
 */
function renderTasks() {
    const tasks = getTasksFromStorage();

    // Limpa a lista atual no DOM
    taskList.innerHTML = '';

    // Alterna a visibilidade da mensagem de lista vazia
    if (tasks.length === 0) {
        emptyMessage.style.display = 'block';
        return;
    } else {
        emptyMessage.style.display = 'none';
    }

    // Cria os elementos para cada tarefa
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Excluir';
        deleteBtn.setAttribute('aria-label', `Excluir tarefa: ${task.text}`);

        // Evento de exclusão ao clicar no botão vermelho
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// ==========================================================================
// Funções de Ações (Adicionar e Excluir)
// ==========================================================================

/**
 * Adiciona uma nova tarefa à lista e ao LocalStorage.
 */
function addTask() {
    const taskText = taskInput.value.trim();

    // Validação: se o campo estiver vazio, exibe alerta
    if (taskText === '') {
        alert('Por favor, digite uma tarefa antes de adicionar!');
        taskInput.focus();
        return;
    }

    const tasks = getTasksFromStorage();

    // Cria um novo objeto de tarefa com ID único
    const newTask = {
        id: Date.now() + Math.random(),
        text: taskText
    };

    tasks.push(newTask);
    saveTasksToStorage(tasks);

    // Limpa o campo de entrada e renderiza novamente
    taskInput.value = '';
    taskInput.focus();
    renderTasks();
}

/**
 * Exclui uma tarefa com base em seu ID único.
 * @param {number} taskId 
 */
function deleteTask(taskId) {
    const tasks = getTasksFromStorage();
    const updatedTasks = tasks.filter(task => task.id !== taskId);

    saveTasksToStorage(updatedTasks);
    renderTasks();
}

// ==========================================================================
// Inicialização e Event Listeners
// ==========================================================================

// Evento de clique no botão 'Adicionar'
addBtn.addEventListener('click', addTask);

// Permite adicionar tarefa pressionando a tecla 'Enter'
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Carrega as tarefas salvas quando o documento for carregado
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    taskInput.focus();
});

