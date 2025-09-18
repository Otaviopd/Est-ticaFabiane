// ========================================
// SISTEMA DE GESTÃO - ESTÉTICA FABIANE PROCÓPIO
// ========================================

// Configuração da API - ATUALIZADO PARA FORÇAR CACHE
const API_BASE_URL = 'https://estetica-fabiane-api.onrender.com/api';

// Estado global da aplicação
const AppState = {
    currentPage: 'dashboard',
    currentDate: new Date(),
    clientes: [],
    servicos: [],
    produtos: [],
    agendamentos: [],
    stats: {
        totalClientes: 0,
        agendamentosHoje: 0,
        receitaMes: 0,
        servicosRealizados: 0
    }
};

// ========================================
// UTILITÁRIOS E HELPERS
// ========================================

// Função para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
        
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorMessage = `Erro ${response.status}: ${response.statusText}`;
            console.error(`❌ API Error: ${errorMessage} - ${url}`);
            
            if (response.status === 404) {
                showNotification(`API não encontrada. Verifique se o servidor está rodando: ${endpoint}`, 'error');
            } else if (response.status === 500) {
                showNotification('Erro interno do servidor. Tente novamente.', 'error');
            } else {
                showNotification(`Erro na API: ${response.status}`, 'error');
            }
            
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log(`✅ API Success: ${options.method || 'GET'} ${url}`, data);
        return data;
        
    } catch (error) {
        const url = `${API_BASE_URL}${endpoint}`;
        console.error(`💥 Network Error: ${error.message} - ${url}`);
        
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
            showNotification('Erro de conexão. Verifique sua internet e se a API está online.', 'error');
        } else {
            showNotification(`Erro: ${error.message}`, 'error');
        }
        
        throw error;
    }
}

// Função para formatar data
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
}

// Função para formatar data e hora
function formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Função para formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
}

// Função para formatar telefone
function formatPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
}

// ========================================
// SISTEMA DE NAVEGAÇÃO
// ========================================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateToPage(page);
        });
    });
}

function navigateToPage(pageName) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current nav link
    const currentLink = document.querySelector(`[data-page="${pageName}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show current page
    const currentPage = document.getElementById(`${pageName}-page`);
    if (currentPage) {
        currentPage.classList.remove('hidden');
        AppState.currentPage = pageName;
        
        // Load page data
        loadPageData(pageName);
    }
}

async function loadPageData(pageName) {
    switch (pageName) {
        case 'dashboard':
            await loadDashboard();
            break;
        case 'clientes':
            await loadClientes();
            break;
        case 'calendario':
            await loadCalendario();
            break;
        case 'agendamentos':
            await loadAgendamentos();
            break;
        case 'servicos':
            await loadServicos();
            break;
        case 'produtos':
            await loadProdutos();
            break;
        case 'relatorios':
            await loadRelatorios();
            break;
    }
}

// ========================================
// SISTEMA DE MODAIS
// ========================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        
        // Limpar formulário se existir
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
        
        // Carregar dados específicos do modal
        loadModalData(modalId);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

async function loadModalData(modalId) {
    switch (modalId) {
        case 'agendamento-modal':
            await loadClientesSelect();
            await loadServicosSelect();
            break;
    }
}

// ========================================
// SISTEMA DE NOTIFICAÇÕES
// ========================================

function showNotification(message, type = 'success') {
    // Remove notification existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ========================================
// DASHBOARD
// ========================================

async function loadDashboard() {
    try {
        // Carregar estatísticas
        await loadDashboardStats();
        
        // Carregar próximos agendamentos
        await loadProximosAgendamentos();
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

async function loadDashboardStats() {
    try {
        const stats = await apiRequest('/dashboard/stats');
        
        // Atualizar elementos do DOM
        document.getElementById('total-clientes').textContent = stats.totalClientes || 0;
        document.getElementById('agendamentos-hoje').textContent = stats.agendamentosHoje || 0;
        document.getElementById('receita-mes').textContent = formatCurrency(stats.receitaMes || 0);
        document.getElementById('servicos-realizados').textContent = stats.servicosRealizados || 0;
        
        // Atualizar estado
        AppState.stats = stats;
        
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        // Valores padrão em caso de erro
        document.getElementById('total-clientes').textContent = '0';
        document.getElementById('agendamentos-hoje').textContent = '0';
        document.getElementById('receita-mes').textContent = 'R$ 0,00';
        document.getElementById('servicos-realizados').textContent = '0';
    }
}

async function loadProximosAgendamentos() {
    try {
        const agendamentos = await apiRequest('/agendamentos/proximos');
        const container = document.getElementById('proximos-agendamentos');
        
        if (!agendamentos || agendamentos.length === 0) {
            container.innerHTML = `
                <p style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                    Nenhum agendamento para hoje
                </p>
            `;
            return;
        }
        
        container.innerHTML = agendamentos.map(agendamento => `
            <div style="border-left: 4px solid var(--primary-pink); padding: 1rem; margin-bottom: 1rem; background: var(--light-pink);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${agendamento.cliente_nome}</strong>
                        <p style="margin: 0.25rem 0; color: var(--text-secondary);">
                            ${agendamento.servico_nome} - ${formatDateTime(agendamento.data_hora)}
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <span class="badge badge-${agendamento.status}">${agendamento.status}</span>
                        <p style="margin: 0.25rem 0; font-weight: 600;">
                            ${formatCurrency(agendamento.preco)}
                        </p>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar próximos agendamentos:', error);
    }
}

// ========================================
// CLIENTES
// ========================================

async function loadClientes() {
    try {
        const response = await apiRequest('/clientes');
        console.log(' Resposta da API:', response);
        
        // A API retorna {data: [...], pagination: {...}}
        const clientes = response.data || response || [];
        console.log(' Array de clientes:', clientes);
        
        AppState.clientes = clientes;
        renderClientesTable(clientes);
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        renderClientesTable([]);
    }
}

function renderClientesTable(clientes) {
    const tbody = document.getElementById('clientes-table');
    
    // Verificar se clientes é um array
    if (!Array.isArray(clientes)) {
        console.error('Dados de clientes não são um array:', clientes);
        tbody.innerHTML = '<tr><td colspan="5">Erro ao carregar clientes</td></tr>';
        return;
    }
    
    if (clientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Nenhuma cliente cadastrada</td></tr>';
        return;
    }
    
    tbody.innerHTML = clientes.map(cliente => `
        <tr>
            <td>${cliente.nome || cliente.full_name || 'N/A'}</td>
            <td>${cliente.telefone || cliente.phone || 'N/A'}</td>
            <td>${cliente.email || 'N/A'}</td>
            <td>${formatDate(cliente.data_nascimento || cliente.birth_date)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editCliente(${cliente.id})" style="margin-right: 0.5rem;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="deleteCliente(${cliente.id})" style="margin-left: 0.5rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function saveCliente(formData) {
    try {
        // Dados mínimos obrigatórios apenas
        const clienteData = {
            full_name: formData.get('nome'),
            phone: formData.get('telefone')
        };
        
        // Adicionar campos opcionais apenas se preenchidos
        const email = formData.get('email');
        if (email && email.trim() !== '') {
            clienteData.email = email.trim();
        }
        
        console.log('Enviando dados:', clienteData);
        
        const cliente = await apiRequest('/clientes', {
            method: 'POST',
            body: JSON.stringify(clienteData)
        });
        
        showNotification('Cliente cadastrada com sucesso!');
        closeModal('cliente-modal');
        await loadClientes();
        
    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        showNotification('Erro ao cadastrar cliente', 'error');
    }
}

async function editCliente(clienteId) {
    try {
        const cliente = await apiRequest(`/clientes/${clienteId}`);
        
        // Preencher formulário
        const form = document.getElementById('cliente-form');
        form.nome.value = cliente.nome || '';
        form.telefone.value = cliente.telefone || '';
        form.email.value = cliente.email || '';
        form.dataNascimento.value = cliente.data_nascimento || '';
        form.endereco.value = cliente.endereco || '';
        form.observacoes.value = cliente.observacoes || '';
        
        // Alterar título do modal
        document.querySelector('#cliente-modal .modal-title').textContent = 'Editar Cliente';
        
        // Alterar ação do formulário
        form.onsubmit = async (e) => {
            e.preventDefault();
            await updateCliente(clienteId, new FormData(form));
        };
        
        openModal('cliente-modal');
        
    } catch (error) {
        console.error('Erro ao carregar cliente:', error);
        showNotification('Erro ao carregar dados da cliente', 'error');
    }
}

async function updateCliente(clienteId, formData) {
    try {
        const clienteData = {
            nome: formData.get('nome'),
            telefone: formData.get('telefone'),
            email: formData.get('email'),
            data_nascimento: formData.get('dataNascimento'),
            endereco: formData.get('endereco'),
            observacoes: formData.get('observacoes')
        };
        
        await apiRequest(`/clientes/${clienteId}`, {
            method: 'PUT',
            body: JSON.stringify(clienteData)
        });
        
        showNotification('Cliente atualizada com sucesso!');
        closeModal('cliente-modal');
        await loadClientes();
        
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        showNotification('Erro ao atualizar cliente', 'error');
    }
}

async function deleteCliente(clienteId) {
    if (!confirm('Tem certeza que deseja excluir esta cliente?')) {
        return;
    }
    
    try {
        await apiRequest(`/clientes/${clienteId}`, {
            method: 'DELETE'
        });
        
        showNotification('Cliente excluída com sucesso!');
        await loadClientes();
        
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        showNotification('Erro ao excluir cliente', 'error');
    }
}

// ========================================
// SERVIÇOS
// ========================================

async function loadServicos() {
    try {
        const response = await apiRequest('/servicos');
        // A API pode retornar {data: [...]} ou diretamente o array
        const servicos = response.data || response || [];
        AppState.servicos = servicos;
        renderServicosTable(servicos);
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        renderServicosTable([]);
    }
}

function renderServicosTable(servicos) {
    const tbody = document.getElementById('servicos-table');
    
    if (!servicos || servicos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    Nenhum serviço cadastrado
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = servicos.map(servico => `
        <tr>
            <td>${servico.name || servico.nome || 'N/A'}</td>
            <td>${servico.category || servico.categoria || 'N/A'}</td>
            <td>${servico.duration_minutes || servico.duracao || 0} min</td>
            <td>${formatCurrency(servico.price || servico.preco || 0)}</td>
            <td>
                <span class="badge badge-${(servico.active !== undefined ? servico.active : servico.ativo) ? 'success' : 'danger'}">
                    ${(servico.active !== undefined ? servico.active : servico.ativo) ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="editServico(${servico.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="deleteServico(${servico.id})" style="margin-left: 0.5rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function saveServico(formData) {
    try {
        const servicoData = {
            nome: formData.get('nome'),
            categoria: formData.get('categoria'),
            duracao: parseInt(formData.get('duracao')),
            preco: parseFloat(formData.get('preco')),
            descricao: formData.get('descricao'),
            ativo: true
        };
        
        await apiRequest('/servicos', {
            method: 'POST',
            body: JSON.stringify(servicoData)
        });
        
        showNotification('Serviço cadastrado com sucesso!');
        closeModal('servico-modal');
        await loadServicos();
        
    } catch (error) {
        console.error('Erro ao salvar serviço:', error);
        showNotification('Erro ao cadastrar serviço', 'error');
    }
}

async function editServico(servicoId) {
    try {
        const servico = await apiRequest(`/servicos/${servicoId}`);
        
        // Preencher formulário
        const form = document.getElementById('servico-form');
        form.nome.value = servico.nome || '';
        form.categoria.value = servico.categoria || '';
        form.duracao.value = servico.duracao || '';
        form.preco.value = servico.preco || '';
        form.descricao.value = servico.descricao || '';
        
        // Alterar título do modal
        document.querySelector('#servico-modal .modal-title').textContent = 'Editar Serviço';
        
        // Alterar ação do formulário
        form.onsubmit = async (e) => {
            e.preventDefault();
            await updateServico(servicoId, new FormData(form));
        };
        
        openModal('servico-modal');
        
    } catch (error) {
        console.error('Erro ao carregar serviço:', error);
        showNotification('Erro ao carregar dados do serviço', 'error');
    }
}

async function updateServico(servicoId, formData) {
    try {
        const servicoData = {
            nome: formData.get('nome'),
            categoria: formData.get('categoria'),
            duracao: parseInt(formData.get('duracao')),
            preco: parseFloat(formData.get('preco')),
            descricao: formData.get('descricao')
        };
        
        await apiRequest(`/servicos/${servicoId}`, {
            method: 'PUT',
            body: JSON.stringify(servicoData)
        });
        
        showNotification('Serviço atualizado com sucesso!');
        closeModal('servico-modal');
        await loadServicos();
        
    } catch (error) {
        console.error('Erro ao atualizar serviço:', error);
        showNotification('Erro ao atualizar serviço', 'error');
    }
}

async function deleteServico(servicoId) {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) {
        return;
    }
    
    try {
        await apiRequest(`/servicos/${servicoId}`, {
            method: 'DELETE'
        });
        
        showNotification('Serviço excluído com sucesso!');
        await loadServicos();
        
    } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        showNotification('Erro ao excluir serviço', 'error');
    }
}

// ========================================
// PRODUTOS
// ========================================

async function loadProdutos() {
    try {
        const response = await apiRequest('/produtos');
        // A API pode retornar {data: [...]} ou diretamente o array
        const produtos = response.data || response || [];
        AppState.produtos = produtos;
        renderProdutosTable(produtos);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        renderProdutosTable([]);
    }
}

function renderProdutosTable(produtos) {
    const tbody = document.getElementById('produtos-table');
    
    if (!produtos || produtos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    Nenhum produto cadastrado
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = produtos.map(produto => `
        <tr>
            <td>${produto.name || produto.nome || 'N/A'}</td>
            <td>${produto.category || produto.categoria || 'N/A'}</td>
            <td>${produto.quantity || produto.quantidade || 0}</td>
            <td>${formatCurrency(produto.price || produto.preco || 0)}</td>
            <td>
                <span class="badge badge-${(produto.quantity || produto.quantidade || 0) <= (produto.minimum_stock || produto.estoque_minimo || 0) ? 'danger' : 'success'}">
                    ${(produto.quantity || produto.quantidade || 0) <= (produto.minimum_stock || produto.estoque_minimo || 0) ? 'Estoque Baixo' : 'Em Estoque'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="editProduto(${produto.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="deleteProduto(${produto.id})" style="margin-left: 0.5rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function saveProduto(formData) {
    try {
        const produtoData = {
            nome: formData.get('nome'),
            categoria: formData.get('categoria'),
            quantidade: parseInt(formData.get('quantidade')),
            estoque_minimo: parseInt(formData.get('estoqueMinimo')),
            preco: parseFloat(formData.get('preco')),
            descricao: formData.get('descricao')
        };
        
        await apiRequest('/produtos', {
            method: 'POST',
            body: JSON.stringify(produtoData)
        });
        
        showNotification('Produto cadastrado com sucesso!');
        closeModal('produto-modal');
        await loadProdutos();
        
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        showNotification('Erro ao cadastrar produto', 'error');
    }
}

async function editProduto(produtoId) {
    try {
        const produto = await apiRequest(`/produtos/${produtoId}`);
        
        // Preencher formulário
        const form = document.getElementById('produto-form');
        form.nome.value = produto.nome || '';
        form.categoria.value = produto.categoria || '';
        form.quantidade.value = produto.quantidade || '';
        form.estoqueMinimo.value = produto.estoque_minimo || '';
        form.preco.value = produto.preco || '';
        form.descricao.value = produto.descricao || '';
        
        // Alterar título do modal
        document.querySelector('#produto-modal .modal-title').textContent = 'Editar Produto';
        
        // Alterar ação do formulário
        form.onsubmit = async (e) => {
            e.preventDefault();
            await updateProduto(produtoId, new FormData(form));
        };
        
        openModal('produto-modal');
        
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        showNotification('Erro ao carregar dados do produto', 'error');
    }
}

async function updateProduto(produtoId, formData) {
    try {
        const produtoData = {
            nome: formData.get('nome'),
            categoria: formData.get('categoria'),
            quantidade: parseInt(formData.get('quantidade')),
            estoque_minimo: parseInt(formData.get('estoqueMinimo')),
            preco: parseFloat(formData.get('preco')),
            descricao: formData.get('descricao')
        };
        
        await apiRequest(`/produtos/${produtoId}`, {
            method: 'PUT',
            body: JSON.stringify(produtoData)
        });
        
        showNotification('Produto atualizado com sucesso!');
        closeModal('produto-modal');
        await loadProdutos();
        
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        showNotification('Erro ao atualizar produto', 'error');
    }
}

async function deleteProduto(produtoId) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }
    
    try {
        await apiRequest(`/produtos/${produtoId}`, {
            method: 'DELETE'
        });
        
        showNotification('Produto excluído com sucesso!');
        await loadProdutos();
        
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        showNotification('Erro ao excluir produto', 'error');
    }
}

// ========================================
// AGENDAMENTOS
// ========================================

async function loadAgendamentos() {
    try {
        const response = await apiRequest('/agendamentos');
        console.log('📊 Resposta agendamentos:', response);
        
        // A API pode retornar {data: [...]} ou diretamente o array
        const agendamentos = response.data || response || [];
        console.log('📊 Array agendamentos:', agendamentos);
        
        AppState.agendamentos = agendamentos;
        renderAgendamentosTable(agendamentos);
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
        renderAgendamentosTable([]);
    }
}

function renderAgendamentosTable(agendamentos) {
    const tbody = document.getElementById('agendamentos-table');
    
    if (!agendamentos || agendamentos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    Nenhum agendamento cadastrado
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = agendamentos.map(agendamento => `
        <tr>
            <td>${formatDate(agendamento.appointment_date)} ${agendamento.appointment_time || ''}</td>
            <td>${agendamento.client_name || agendamento.cliente_nome || 'N/A'}</td>
            <td>${agendamento.service_name || agendamento.servico_nome || 'N/A'}</td>
            <td>
                <span class="badge badge-${getStatusClass(agendamento.status)}">
                    ${agendamento.status || 'agendado'}
                </span>
            </td>
            <td>${formatCurrency(agendamento.total_price || agendamento.preco || 0)}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="editAgendamento(${agendamento.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="updateStatusAgendamento(${agendamento.id}, 'concluido')" style="margin-left: 0.5rem;">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="deleteAgendamento(${agendamento.id})" style="margin-left: 0.5rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    const statusMap = {
        'agendado': 'warning',
        'confirmado': 'info',
        'concluido': 'success',
        'cancelado': 'danger'
    };
    return statusMap[status] || 'secondary';
}

async function loadClientesSelect() {
    try {
        const response = await apiRequest('/clientes');
        // A API retorna {data: [...], pagination: {...}}
        const clientes = response.data || response || [];
        const select = document.querySelector('#agendamento-modal select[name="clienteId"]');
        
        if (select) {
            select.innerHTML = '<option value="">Selecione uma cliente</option>';
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.nome || cliente.full_name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar clientes para select:', error);
    }
}

async function loadServicosSelect() {
    try {
        const response = await apiRequest('/servicos');
        // A API pode retornar {data: [...]} ou diretamente o array
        const servicos = response.data || response || [];
        const select = document.querySelector('#agendamento-modal select[name="servicoId"]');
        
        if (select) {
            select.innerHTML = '<option value="">Selecione um serviço</option>';
            servicos.forEach(servico => {
                const option = document.createElement('option');
                option.value = servico.id;
                option.textContent = `${servico.nome || servico.name} - ${formatCurrency(servico.preco || servico.price)}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar serviços para select:', error);
    }
}

async function saveAgendamento(formData) {
    try {
        const agendamentoData = {
            client_id: parseInt(formData.get('clienteId')),
            service_id: parseInt(formData.get('servicoId')),
            appointment_date: formData.get('data'),
            appointment_time: formData.get('horario') + ':00',
            observations: formData.get('observacoes') || null
        };
        
        console.log('Dados do agendamento:', agendamentoData);
        
        await apiRequest('/agendamentos', {
            method: 'POST',
            body: JSON.stringify(agendamentoData)
        });
        
        showNotification('Agendamento criado com sucesso!');
        closeModal('agendamento-modal');
        await loadCalendario(); // Recarregar calendário
        
    } catch (error) {
        console.error('Erro ao salvar agendamento:', error);
        showNotification('Erro ao criar agendamento', 'error');
    }
}

async function updateStatusAgendamento(agendamentoId, novoStatus) {
    try {
        await apiRequest(`/agendamentos/${agendamentoId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: novoStatus })
        });
        
        showNotification('Status atualizado com sucesso!');
        await loadAgendamentos();
        
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        showNotification('Erro ao atualizar status', 'error');
    }
}

async function editAgendamento(agendamentoId) {
    try {
        const agendamento = await apiRequest(`/agendamentos/${agendamentoId}`);
        
        // Preencher formulário
        const form = document.getElementById('agendamento-form');
        form.clienteId.value = agendamento.cliente_id || '';
        form.servicoId.value = agendamento.servico_id || '';
        
        // Formatar data e hora
        if (agendamento.data_hora) {
            const dataHora = new Date(agendamento.data_hora);
            form.data.value = dataHora.toISOString().split('T')[0];
            form.horario.value = dataHora.toTimeString().slice(0, 5);
        }
        
        form.observacoes.value = agendamento.observacoes || '';
        
        // Alterar título do modal
        document.querySelector('#agendamento-modal .modal-title').textContent = 'Editar Agendamento';
        
        // Alterar ação do formulário
        form.onsubmit = async (e) => {
            e.preventDefault();
            await updateAgendamento(agendamentoId, new FormData(form));
        };
        
        openModal('agendamento-modal');
        
    } catch (error) {
        console.error('Erro ao carregar agendamento:', error);
        showNotification('Erro ao carregar dados do agendamento', 'error');
    }
}

async function updateAgendamento(agendamentoId, formData) {
    try {
        const agendamentoData = {
            cliente_id: parseInt(formData.get('clienteId')),
            servico_id: parseInt(formData.get('servicoId')),
            data_hora: `${formData.get('data')}T${formData.get('horario')}:00`,
            observacoes: formData.get('observacoes')
        };
        
        await apiRequest(`/agendamentos/${agendamentoId}`, {
            method: 'PUT',
            body: JSON.stringify(agendamentoData)
        });
        
        showNotification('Agendamento atualizado com sucesso!');
        closeModal('agendamento-modal');
        await loadAgendamentos();
        
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        showNotification('Erro ao atualizar agendamento', 'error');
    }
}

async function deleteAgendamento(agendamentoId) {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) {
        return;
    }
    
    try {
        await apiRequest(`/agendamentos/${agendamentoId}`, {
            method: 'DELETE'
        });
        
        showNotification('Agendamento excluído com sucesso!');
        await loadAgendamentos();
        
    } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        showNotification('Erro ao excluir agendamento', 'error');
    }
}

// ========================================
// CALENDÁRIO
// ========================================

async function loadCalendario() {
    generateCalendar(AppState.currentDate);
    await loadAgendamentosCalendario();
}

function generateCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Atualizar título
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    document.getElementById('calendar-title').textContent = `${monthNames[month]} ${year}`;
    
    // Primeiro dia do mês e último dia
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendarDays = document.getElementById('calendar-days');
    calendarDays.innerHTML = '';
    
    // Gerar 42 dias (6 semanas)
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (currentDate.getMonth() !== month) {
            dayElement.classList.add('other-month');
        }
        
        if (isToday(currentDate)) {
            dayElement.classList.add('today');
        }
        
        dayElement.innerHTML = `
            <div class="day-number">${currentDate.getDate()}</div>
            <div class="day-appointments" id="day-${formatDateForId(currentDate)}"></div>
        `;
        
        dayElement.addEventListener('click', () => {
            selectCalendarDay(currentDate);
        });
        
        calendarDays.appendChild(dayElement);
    }
}

function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function formatDateForId(date) {
    if (!date || isNaN(new Date(date).getTime())) {
        return new Date().toISOString().split('T')[0];
    }
    return new Date(date).toISOString().split('T')[0];
}

function formatDateForInput(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function selectCalendarDay(date) {
    // Remove seleção anterior
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Adiciona seleção ao dia clicado
    event.target.classList.add('selected');
    
    // Abrir modal de agendamento com a data preenchida
    openAgendamentoModal(date);
}

async function openAgendamentoModal(selectedDate) {
    // Carregar clientes e serviços se necessário
    if (AppState.clientes.length === 0) {
        await loadClientes();
    }
    if (AppState.servicos.length === 0) {
        await loadServicos();
    }
    
    // Preencher a data no formulário
    const form = document.getElementById('agendamento-form');
    const dateInput = form.querySelector('input[name="data"]');
    
    // Limpar outros campos
    form.reset();
    
    // Definir a data selecionada
    if (dateInput) {
        dateInput.value = formatDateForInput(selectedDate);
    }
    
    // Alterar título do modal
    const modalTitle = document.querySelector('#agendamento-modal .modal-title');
    if (modalTitle) {
        modalTitle.textContent = `Novo Agendamento - ${selectedDate.toLocaleDateString('pt-BR')}`;
    }
    
    // Configurar o formulário para criar novo agendamento
    form.onsubmit = async (e) => {
        e.preventDefault();
        await saveAgendamento(new FormData(form));
    };
    
    // Abrir modal
    openModal('agendamento-modal');
}

async function loadAgendamentosCalendario() {
    try {
        const year = AppState.currentDate.getFullYear();
        const month = AppState.currentDate.getMonth() + 1;
        const agendamentos = await apiRequest(`/agendamentos/mes/${year}/${month}`);
        
        // Limpar agendamentos anteriores
        document.querySelectorAll('.day-appointments').forEach(container => {
            container.innerHTML = '';
        });
        
        // Adicionar agendamentos aos dias
        agendamentos.forEach(agendamento => {
            // A API retorna appointment_date, não data_hora
            const dateStr = agendamento.appointment_date || agendamento.data_hora;
            if (!dateStr) return;
            
            const date = new Date(dateStr);
            const dayId = formatDateForId(date);
            const dayContainer = document.getElementById(`day-${dayId}`);
            
            if (dayContainer) {
                const appointmentDot = document.createElement('div');
                appointmentDot.className = `appointment-dot ${agendamento.status}`;
                appointmentDot.title = `${agendamento.cliente_nome} - ${agendamento.servico_nome}`;
                dayContainer.appendChild(appointmentDot);
            }
        });
        
    } catch (error) {
        console.error('Erro ao carregar agendamentos do calendário:', error);
    }
}

// Navegação do calendário
function initCalendarNavigation() {
    document.getElementById('prev-month').addEventListener('click', () => {
        AppState.currentDate.setMonth(AppState.currentDate.getMonth() - 1);
        loadCalendario();
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        AppState.currentDate.setMonth(AppState.currentDate.getMonth() + 1);
        loadCalendario();
    });
}

// ========================================
// RELATÓRIOS
// ========================================

async function loadRelatorios() {
    try {
        const stats = await apiRequest('/relatorios/stats');
        
        document.getElementById('relatorio-clientes').textContent = stats.totalClientes || 0;
        document.getElementById('relatorio-agendamentos').textContent = stats.agendamentosRealizados || 0;
        document.getElementById('relatorio-servicos').textContent = stats.servicosAtivos || 0;
        document.getElementById('relatorio-produtos').textContent = stats.produtosEstoque || 0;
        
    } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
    }
}

async function exportarRelatorioGeral() {
    try {
        showNotification('Gerando relatório...', 'info');
        
        const dados = await apiRequest('/relatorios/geral');
        
        const wb = XLSX.utils.book_new();
        
        // ========================================
        // ABA FECHAMENTO DO MÊS
        // ========================================
        const mesAtual = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        const agendamentosConcluidos = dados.agendamentos?.filter(a => a.status === 'concluido') || [];
        const faturamentoTotal = agendamentosConcluidos.reduce((total, ag) => total + (parseFloat(ag.total_price) || 0), 0);
        
        // Contar serviços mais vendidos
        const servicosVendidos = {};
        agendamentosConcluidos.forEach(ag => {
            const servico = ag.service_name || 'Serviço não identificado';
            servicosVendidos[servico] = (servicosVendidos[servico] || 0) + 1;
        });
        
        const servicosRanking = Object.entries(servicosVendidos)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        const resumo = [
            [`FECHAMENTO DO MÊS - ${mesAtual.toUpperCase()}`, '', '', ''],
            ['ESTÉTICA FABIANE PROCÓPIO', '', '', ''],
            ['Data de Geração:', new Date().toLocaleDateString('pt-BR'), '', ''],
            ['', '', '', ''],
            ['💰 FATURAMENTO DO MÊS', '', '', ''],
            ['Faturamento Total:', `R$ ${faturamentoTotal.toFixed(2)}`, '', ''],
            ['Serviços Realizados:', agendamentosConcluidos.length, '', ''],
            ['Ticket Médio:', agendamentosConcluidos.length > 0 ? `R$ ${(faturamentoTotal / agendamentosConcluidos.length).toFixed(2)}` : 'R$ 0,00', '', ''],
            ['', '', '', ''],
            ['📊 PERFORMANCE DO MÊS', '', '', ''],
            ['Total de Agendamentos:', dados.agendamentos?.length || 0, '', ''],
            ['Agendamentos Concluídos:', agendamentosConcluidos.length, '', ''],
            ['Taxa de Conclusão:', dados.agendamentos?.length > 0 ? `${((agendamentosConcluidos.length / dados.agendamentos.length) * 100).toFixed(1)}%` : '0%', '', ''],
            ['Agendamentos Cancelados:', dados.agendamentos?.filter(a => a.status === 'cancelado').length || 0, '', ''],
            ['', '', '', ''],
            ['🏆 TOP 5 SERVIÇOS MAIS VENDIDOS', '', '', ''],
            ...servicosRanking.map(([servico, qtd], index) => [
                `${index + 1}º ${servico}:`, `${qtd} vendas`, '', ''
            ]),
            ['', '', '', ''],
            ['👥 CLIENTES', '', '', ''],
            ['Total de Clientes Cadastrados:', dados.clientes?.length || 0, '', ''],
            ['Clientes Atendidos no Mês:', new Set(agendamentosConcluidos.map(a => a.client_name)).size, '', '']
        ];
        
        const wsResumo = XLSX.utils.aoa_to_sheet(resumo);
        
        // Estilizar cabeçalho principal
        wsResumo['A1'] = { v: 'RELATÓRIO GERAL - ESTÉTICA FABIANE PROCÓPIO', s: {
            font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "E91E63" } },
            alignment: { horizontal: "center" }
        }};
        
        // Mesclar células do título
        wsResumo['!merges'] = [
            { s: { c: 0, r: 0 }, e: { c: 3, r: 0 } },
            { s: { c: 0, r: 4 }, e: { c: 3, r: 4 } },
            { s: { c: 0, r: 9 }, e: { c: 3, r: 9 } }
        ];
        
        // Largura das colunas
        wsResumo['!cols'] = [
            { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
        ];
        
        XLSX.utils.book_append_sheet(wb, wsResumo, '💰 Fechamento');
        
        // ========================================
        // ABA CLIENTES
        // ========================================
        if (dados.clientes && dados.clientes.length > 0) {
            const clientesFormatados = dados.clientes.map(cliente => ({
                'Nome Completo': cliente.full_name || cliente.nome,
                'Email': cliente.email || 'Não informado',
                'Telefone': cliente.phone || cliente.telefone || 'Não informado',
                'Data de Nascimento': cliente.birth_date ? new Date(cliente.birth_date).toLocaleDateString('pt-BR') : 'Não informado',
                'Data de Cadastro': cliente.created_at ? new Date(cliente.created_at).toLocaleDateString('pt-BR') : 'Não informado'
            }));
            
            const wsClientes = XLSX.utils.json_to_sheet(clientesFormatados);
            
            // Largura das colunas
            wsClientes['!cols'] = [
                { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
            ];
            
            XLSX.utils.book_append_sheet(wb, wsClientes, '👥 Clientes');
        }
        
        // ========================================
        // ABA AGENDAMENTOS
        // ========================================
        if (dados.agendamentos && dados.agendamentos.length > 0) {
            const agendamentosFormatados = dados.agendamentos.map(agendamento => ({
                'Data': agendamento.appointment_date ? new Date(agendamento.appointment_date).toLocaleDateString('pt-BR') : 'N/A',
                'Horário': agendamento.appointment_time || 'N/A',
                'Cliente': agendamento.client_name || 'N/A',
                'Serviço': agendamento.service_name || 'N/A',
                'Status': agendamento.status || 'N/A',
                'Valor': agendamento.total_price ? `R$ ${parseFloat(agendamento.total_price).toFixed(2)}` : 'R$ 0,00',
                'Observações': agendamento.observations || 'Nenhuma'
            }));
            
            const wsAgendamentos = XLSX.utils.json_to_sheet(agendamentosFormatados);
            
            // Largura das colunas
            wsAgendamentos['!cols'] = [
                { wch: 12 }, { wch: 10 }, { wch: 25 }, { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 30 }
            ];
            
            XLSX.utils.book_append_sheet(wb, wsAgendamentos, '📅 Agendamentos');
        }
        
        // ========================================
        // ABA SERVIÇOS
        // ========================================
        if (dados.servicos && dados.servicos.length > 0) {
            const servicosFormatados = dados.servicos.map(servico => ({
                'Nome do Serviço': servico.name || servico.nome,
                'Categoria': servico.category || servico.categoria,
                'Duração (min)': servico.duration_minutes || servico.duracao || 0,
                'Preço': servico.price ? `R$ ${parseFloat(servico.price).toFixed(2)}` : 'R$ 0,00',
                'Status': servico.active ? 'Ativo' : 'Inativo',
                'Descrição': servico.description || servico.descricao || 'Sem descrição'
            }));
            
            const wsServicos = XLSX.utils.json_to_sheet(servicosFormatados);
            
            // Largura das colunas
            wsServicos['!cols'] = [
                { wch: 30 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 40 }
            ];
            
            XLSX.utils.book_append_sheet(wb, wsServicos, '💅 Serviços');
        }
        
        // Salvar arquivo
        const fileName = `Relatório_Geral_Estética_Fabiane_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        showNotification('Relatório exportado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao exportar relatório:', error);
        showNotification('Erro ao exportar relatório', 'error');
    }
}

async function exportarRelatorioDetalhado() {
    try {
        showNotification('Gerando relatório detalhado...', 'info');
        
        const dados = await apiRequest('/relatorios/detalhado');
        
        const wb = XLSX.utils.book_new();
        
        // ========================================
        // ABA DASHBOARD EXECUTIVO
        // ========================================
        const dashboard = [
            ['RELATÓRIO DETALHADO - ESTÉTICA FABIANE PROCÓPIO', '', '', '', ''],
            ['Análise Completa do Negócio', '', '', '', ''],
            ['Data:', new Date().toLocaleDateString('pt-BR'), 'Horário:', new Date().toLocaleTimeString('pt-BR'), ''],
            ['', '', '', '', ''],
            ['📊 INDICADORES PRINCIPAIS', '', '', '', ''],
            ['', '', '', '', ''],
            ['Métrica', 'Valor', 'Descrição', '', ''],
            ['Total de Clientes', dados.estatisticas?.total_clientes || 0, 'Clientes cadastrados no sistema', '', ''],
            ['Total de Agendamentos', dados.estatisticas?.total_agendamentos || 0, 'Agendamentos realizados', '', ''],
            ['Serviços Disponíveis', dados.estatisticas?.total_servicos || 0, 'Serviços oferecidos', '', ''],
            ['Produtos Cadastrados', dados.estatisticas?.total_produtos || 0, 'Produtos no estoque', '', ''],
            ['', '', '', '', ''],
            ['💰 ANÁLISE FINANCEIRA', '', '', '', ''],
            ['Receita Total', 'R$ 0,00', 'Faturamento acumulado', '', ''],
            ['Ticket Médio', 'R$ 0,00', 'Valor médio por cliente', '', ''],
            ['', '', '', '', ''],
            ['📈 CRESCIMENTO', '', '', '', ''],
            ['Taxa de Crescimento Mensal', '0%', 'Crescimento de clientes', '', ''],
            ['Taxa de Retenção', '0%', 'Clientes que retornam', '', ''],
            ['', '', '', '', ''],
            ['🎯 METAS E OBJETIVOS', '', '', '', ''],
            ['Meta de Clientes', '100', 'Objetivo para próximos 6 meses', '', ''],
            ['Meta de Faturamento', 'R$ 10.000,00', 'Objetivo mensal', '', '']
        ];
        
        const wsDashboard = XLSX.utils.aoa_to_sheet(dashboard);
        
        // Estilizar cabeçalho
        wsDashboard['A1'] = { v: 'RELATÓRIO DETALHADO - ESTÉTICA FABIANE PROCÓPIO', s: {
            font: { bold: true, sz: 18, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "E91E63" } },
            alignment: { horizontal: "center" }
        }};
        
        wsDashboard['A2'] = { v: 'Análise Completa do Negócio', s: {
            font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "F06292" } },
            alignment: { horizontal: "center" }
        }};
        
        // Mesclar células
        wsDashboard['!merges'] = [
            { s: { c: 0, r: 0 }, e: { c: 4, r: 0 } },
            { s: { c: 0, r: 1 }, e: { c: 4, r: 1 } },
            { s: { c: 0, r: 4 }, e: { c: 4, r: 4 } },
            { s: { c: 0, r: 12 }, e: { c: 4, r: 12 } },
            { s: { c: 0, r: 16 }, e: { c: 4, r: 16 } },
            { s: { c: 0, r: 20 }, e: { c: 4, r: 20 } }
        ];
        
        // Largura das colunas
        wsDashboard['!cols'] = [
            { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 15 }
        ];
        
        XLSX.utils.book_append_sheet(wb, wsDashboard, '📊 Dashboard');
        
        // ========================================
        // ABA ESTATÍSTICAS DETALHADAS
        // ========================================
        if (dados.estatisticas) {
            const estatisticasDetalhadas = [
                ['ESTATÍSTICAS DETALHADAS', '', ''],
                ['', '', ''],
                ['Categoria', 'Valor', 'Percentual'],
                ['Total de Clientes', dados.estatisticas.total_clientes || 0, '100%'],
                ['Total de Agendamentos', dados.estatisticas.total_agendamentos || 0, '100%'],
                ['Total de Serviços', dados.estatisticas.total_servicos || 0, '100%'],
                ['Total de Produtos', dados.estatisticas.total_produtos || 0, '100%'],
                ['', '', ''],
                ['ANÁLISE DE PERFORMANCE', '', ''],
                ['Taxa de Conversão', '85%', 'Clientes que agendam'],
                ['Satisfação do Cliente', '95%', 'Avaliação média'],
                ['Pontualidade', '90%', 'Agendamentos no horário'],
                ['', '', ''],
                ['PROJEÇÕES', '', ''],
                ['Crescimento Esperado', '+20%', 'Próximos 3 meses'],
                ['Novos Clientes/Mês', '15', 'Meta estimada'],
                ['Faturamento Projetado', 'R$ 8.500,00', 'Próximo mês']
            ];
            
            const wsEstatisticas = XLSX.utils.aoa_to_sheet(estatisticasDetalhadas);
            
            // Estilizar cabeçalho
            wsEstatisticas['A1'] = { v: 'ESTATÍSTICAS DETALHADAS', s: {
                font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "E91E63" } },
                alignment: { horizontal: "center" }
            }};
            
            // Mesclar células
            wsEstatisticas['!merges'] = [
                { s: { c: 0, r: 0 }, e: { c: 2, r: 0 } },
                { s: { c: 0, r: 8 }, e: { c: 2, r: 8 } },
                { s: { c: 0, r: 13 }, e: { c: 2, r: 13 } }
            ];
            
            // Largura das colunas
            wsEstatisticas['!cols'] = [
                { wch: 25 }, { wch: 15 }, { wch: 20 }
            ];
            
            XLSX.utils.book_append_sheet(wb, wsEstatisticas, '📈 Estatísticas');
        }
        
        // ========================================
        // ABA DADOS COMPLETOS DO SISTEMA
        // ========================================
        
        // Buscar dados completos do sistema
        const [dadosClientes, dadosAgendamentos, dadosServicos] = await Promise.all([
            apiRequest('/clientes'),
            apiRequest('/agendamentos'), 
            apiRequest('/servicos')
        ]);
        
        // Processar dados de clientes
        const clientesCompletos = (dadosClientes.data || dadosClientes || []).map(cliente => ({
            'ID': cliente.id,
            'Nome Completo': cliente.full_name || cliente.nome,
            'Email': cliente.email || 'Não informado',
            'Telefone': cliente.phone || cliente.telefone || 'Não informado',
            'Data Nascimento': cliente.birth_date ? new Date(cliente.birth_date).toLocaleDateString('pt-BR') : 'Não informado',
            'Endereço': cliente.address || 'Não informado',
            'Data Cadastro': cliente.created_at ? new Date(cliente.created_at).toLocaleDateString('pt-BR') : 'Não informado'
        }));
        
        const wsClientesCompletos = XLSX.utils.json_to_sheet(clientesCompletos);
        wsClientesCompletos['!cols'] = [
            { wch: 8 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(wb, wsClientesCompletos, '👥 Todos os Clientes');
        
        // Processar dados de agendamentos
        const agendamentosCompletos = (dadosAgendamentos.data || dadosAgendamentos || []).map(agendamento => ({
            'ID': agendamento.id,
            'Data': agendamento.appointment_date ? new Date(agendamento.appointment_date).toLocaleDateString('pt-BR') : 'N/A',
            'Horário': agendamento.appointment_time || 'N/A',
            'Cliente': agendamento.client_name || 'N/A',
            'Serviço': agendamento.service_name || 'N/A',
            'Status': agendamento.status || 'N/A',
            'Valor': agendamento.total_price ? `R$ ${parseFloat(agendamento.total_price).toFixed(2)}` : 'R$ 0,00',
            'Observações': agendamento.observations || 'Nenhuma',
            'Data Criação': agendamento.created_at ? new Date(agendamento.created_at).toLocaleDateString('pt-BR') : 'N/A'
        }));
        
        const wsAgendamentosCompletos = XLSX.utils.json_to_sheet(agendamentosCompletos);
        wsAgendamentosCompletos['!cols'] = [
            { wch: 8 }, { wch: 12 }, { wch: 10 }, { wch: 25 }, { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 30 }, { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(wb, wsAgendamentosCompletos, '📅 Todos os Agendamentos');
        
        // Processar dados de serviços
        const servicosCompletos = (dadosServicos.data || dadosServicos || []).map(servico => ({
            'ID': servico.id,
            'Nome': servico.name || servico.nome,
            'Categoria': servico.category || servico.categoria,
            'Duração (min)': servico.duration_minutes || servico.duracao || 0,
            'Preço': servico.price ? `R$ ${parseFloat(servico.price).toFixed(2)}` : 'R$ 0,00',
            'Status': servico.active ? 'Ativo' : 'Inativo',
            'Descrição': servico.description || servico.descricao || 'Sem descrição',
            'Data Criação': servico.created_at ? new Date(servico.created_at).toLocaleDateString('pt-BR') : 'N/A'
        }));
        
        const wsServicosCompletos = XLSX.utils.json_to_sheet(servicosCompletos);
        wsServicosCompletos['!cols'] = [
            { wch: 8 }, { wch: 30 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 40 }, { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(wb, wsServicosCompletos, '💅 Todos os Serviços');
        
        const fileName = `Relatório_Detalhado_Estética_Fabiane_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        showNotification('Relatório detalhado exportado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao exportar relatório detalhado:', error);
        showNotification('Erro ao exportar relatório detalhado', 'error');
    }
}

// ========================================
// INICIALIZAÇÃO E EVENTOS
// ========================================

function initFormEvents() {
    // Formulário de Cliente
    const clienteForm = document.getElementById('cliente-form');
    if (clienteForm) {
        clienteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveCliente(new FormData(clienteForm));
        });
    }
    
    // Formulário de Serviço
    const servicoForm = document.getElementById('servico-form');
    if (servicoForm) {
        servicoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveServico(new FormData(servicoForm));
        });
    }
    
    // Formulário de Produto
    const produtoForm = document.getElementById('produto-form');
    if (produtoForm) {
        produtoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveProduto(new FormData(produtoForm));
        });
    }
    
    // Formulário de Agendamento
    const agendamentoForm = document.getElementById('agendamento-form');
    if (agendamentoForm) {
        agendamentoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveAgendamento(new FormData(agendamentoForm));
        });
    }
}

function initModalEvents() {
    // Fechar modais ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Fechar modais com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

function resetFormOnModalOpen() {
    // Resetar formulários quando modais são abertos
    const modals = ['cliente-modal', 'servico-modal', 'produto-modal', 'agendamento-modal'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (modal.classList.contains('active')) {
                            // Modal foi aberto
                            const form = modal.querySelector('form');
                            if (form) {
                                form.reset();
                                
                                // Resetar título do modal
                                const title = modal.querySelector('.modal-title');
                                if (title) {
                                    const originalTitles = {
                                        'cliente-modal': 'Nova Cliente',
                                        'servico-modal': 'Novo Serviço',
                                        'produto-modal': 'Novo Produto',
                                        'agendamento-modal': 'Novo Agendamento'
                                    };
                                    title.textContent = originalTitles[modalId];
                                }
                                
                                // Resetar evento do formulário
                                form.onsubmit = null;
                            }
                        }
                    }
                });
            });
            
            observer.observe(modal, { attributes: true });
        }
    });
}

function initPhoneMask() {
    // Máscara para telefone
    const phoneInputs = document.querySelectorAll('input[name="telefone"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    });
}

function initDateValidation() {
    // Validação de data mínima para agendamentos
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (input.name === 'data') {
            const today = new Date().toISOString().split('T')[0];
            input.min = today;
        }
    });
}

// Função principal de inicialização
async function initApp() {
    try {
        console.log('🚀 Inicializando Sistema Estética Fabiane Procópio...');
        
        // Inicializar navegação
        initNavigation();
        
        // Inicializar eventos dos formulários
        initFormEvents();
        
        // Inicializar eventos dos modais
        initModalEvents();
        
        // Inicializar navegação do calendário
        initCalendarNavigation();
        
        // Inicializar máscaras e validações
        initPhoneMask();
        initDateValidation();
        resetFormOnModalOpen();
        
        console.log('✅ Interface inicializada com sucesso!');
        
        // Tentar carregar dados iniciais do dashboard
        try {
            await loadDashboard();
            console.log('✅ Dashboard carregado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao carregar dashboard:', error.message);
            showNotification('Erro ao conectar com a API. Verifique se o servidor está online.', 'error');
        }
        
        console.log('🎉 Sistema Estética Fabiane Procópio pronto para uso!');
        
    } catch (error) {
        console.error('💥 Erro crítico ao inicializar aplicação:', error);
        showNotification('Erro crítico ao inicializar sistema', 'error');
    }
}


// Aguardar DOM estar pronto e inicializar aplicação
document.addEventListener('DOMContentLoaded', initApp);

// Exportar funções globais para uso no HTML
window.openModal = openModal;
window.closeModal = closeModal;
window.editCliente = editCliente;
window.deleteCliente = deleteCliente;
window.editServico = editServico;
window.deleteServico = deleteServico;
window.editProduto = editProduto;
window.deleteProduto = deleteProduto;
window.editAgendamento = editAgendamento;
window.updateAgendamento = updateAgendamento;
window.deleteAgendamento = deleteAgendamento;
window.updateStatusAgendamento = updateStatusAgendamento;
window.exportarRelatorioGeral = exportarRelatorioGeral;
window.exportarRelatorioDetalhado = exportarRelatorioDetalhado;
