// Sistema Estética Fabiane Procópio - Gestão Completa
// Integração com API PostgreSQL no Render

// Configurações
const config = {
    api: {
        baseUrl: 'https://estetica-fabiane-api.onrender.com/api',
        timeout: 30000
    },
    app: {
        name: 'Estética Fabiane Procópio',
        version: '2.0.0',
        description: 'Sistema de Gestão para Estética Facial e Corporal'
    },
    development: {
        useLocalStorageFallback: true,
        enableDebugLogs: true
    }
};

// =====================================================
// CAMADA DE COMUNICAÇÃO COM A API
// =====================================================
class ApiService {
    constructor() {
        this.baseUrl = config.api.baseUrl;
        this.timeout = config.api.timeout;
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: this.timeout
        };

        const requestOptions = { ...defaultOptions, ...options };

        try {
            console.log(`🌐 Fazendo requisição para: ${url}`);
            const response = await fetch(url, requestOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`✅ Resposta recebida:`, data);
            return data;
        } catch (error) {
            console.error(`❌ Erro na requisição para ${endpoint}:`, error);
            
            // Fallback para localStorage se API não estiver disponível
            if (config.development.useLocalStorageFallback) {
                console.warn('⚠️ API indisponível, usando localStorage como fallback');
                return this.handleLocalStorageFallback(endpoint, options);
            }
            
            throw error;
        }
    }

    handleLocalStorageFallback(endpoint, options) {
        const method = options.method || 'GET';
        
        if (endpoint.includes('/clients')) {
            return this.handleClientsFallback(method, options, endpoint);
        } else if (endpoint.includes('/services')) {
            return this.handleServicesFallback(method, options, endpoint);
        } else if (endpoint.includes('/appointments')) {
            return this.handleAppointmentsFallback(method, options, endpoint);
        } else if (endpoint.includes('/products')) {
            return this.handleProductsFallback(method, options, endpoint);
        }
        
        return { data: [], error: 'Endpoint não suportado no fallback' };
    }

    // Fallbacks para localStorage
    handleClientsFallback(method, options, endpoint) {
        const clientes = JSON.parse(localStorage.getItem('fabiane_clientes') || '[]');
        
        if (method === 'GET') {
            return { data: clientes };
        } else if (method === 'POST') {
            const novoCliente = JSON.parse(options.body);
            novoCliente.id = Date.now();
            clientes.push(novoCliente);
            localStorage.setItem('fabiane_clientes', JSON.stringify(clientes));
            return { data: novoCliente };
        }
        
        return { data: clientes };
    }

    handleServicesFallback(method, options, endpoint) {
        const servicos = JSON.parse(localStorage.getItem('fabiane_servicos') || '[]');
        
        if (method === 'GET') {
            return { data: servicos };
        }
        
        return { data: servicos };
    }

    handleAppointmentsFallback(method, options, endpoint) {
        const agendamentos = JSON.parse(localStorage.getItem('fabiane_agendamentos') || '[]');
        
        if (method === 'GET') {
            return { data: agendamentos };
        } else if (method === 'POST') {
            const novoAgendamento = JSON.parse(options.body);
            novoAgendamento.id = Date.now();
            agendamentos.push(novoAgendamento);
            localStorage.setItem('fabiane_agendamentos', JSON.stringify(agendamentos));
            return { data: novoAgendamento };
        }
        
        return { data: agendamentos };
    }

    handleProductsFallback(method, options, endpoint) {
        const produtos = JSON.parse(localStorage.getItem('fabiane_produtos') || '[]');
        
        if (method === 'GET') {
            return { data: produtos };
        } else if (method === 'POST') {
            const novoProduto = JSON.parse(options.body);
            novoProduto.id = Date.now();
            produtos.push(novoProduto);
            localStorage.setItem('fabiane_produtos', JSON.stringify(produtos));
            return { data: novoProduto };
        }
        
        return { data: produtos };
    }

    // =====================================================
    // MÉTODOS PARA CLIENTES
    // =====================================================
    async getClientes() {
        return await this.makeRequest('/clients');
    }

    async createCliente(cliente) {
        return await this.makeRequest('/clients', {
            method: 'POST',
            body: JSON.stringify(cliente)
        });
    }

    async updateCliente(id, updates) {
        return await this.makeRequest(`/clients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async deleteCliente(id) {
        return await this.makeRequest(`/clients/${id}`, {
            method: 'DELETE'
        });
    }

    // =====================================================
    // MÉTODOS PARA SERVIÇOS
    // =====================================================
    async getServicos() {
        return await this.makeRequest('/services');
    }

    async createServico(servico) {
        return await this.makeRequest('/services', {
            method: 'POST',
            body: JSON.stringify(servico)
        });
    }

    async updateServico(id, updates) {
        return await this.makeRequest(`/services/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async deleteServico(id) {
        return await this.makeRequest(`/services/${id}`, {
            method: 'DELETE'
        });
    }

    // =====================================================
    // MÉTODOS PARA AGENDAMENTOS
    // =====================================================
    async getAgendamentos() {
        return await this.makeRequest('/appointments');
    }

    async createAgendamento(agendamento) {
        return await this.makeRequest('/appointments', {
            method: 'POST',
            body: JSON.stringify(agendamento)
        });
    }

    async updateAgendamento(id, updates) {
        return await this.makeRequest(`/appointments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async deleteAgendamento(id) {
        return await this.makeRequest(`/appointments/${id}`, {
            method: 'DELETE'
        });
    }

    // =====================================================
    // MÉTODOS PARA PRODUTOS
    // =====================================================
    async getProdutos() {
        return await this.makeRequest('/products');
    }

    async createProduto(produto) {
        return await this.makeRequest('/products', {
            method: 'POST',
            body: JSON.stringify(produto)
        });
    }

    async updateProduto(id, updates) {
        return await this.makeRequest(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async deleteProduto(id) {
        return await this.makeRequest(`/products/${id}`, {
            method: 'DELETE'
        });
    }
}

// Instância global do serviço de API
const apiService = new ApiService();

class EsteticaFabianeSystem {
    constructor() {
        this.currentPage = 'dashboard';
        this.loading = false;
        this.init();
    }

    async init() {
        try {
            this.showLoading(true);
            console.log('🚀 Inicializando Sistema Estética Fabiane...');
            
            // Carrega os dados da API
            await this.loadInitialData();
            
            // Atualiza a interface
            await this.updateDashboard();
            await this.renderClientes();
            await this.renderServicos();
            await this.renderProdutos();
            await this.renderAgendamentos();
            await this.updateRelatorios();
            
            this.setupEventListeners();
            this.setupNavigation();
            console.log('✅ Sistema inicializado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao inicializar o sistema:', error);
            this.showNotification('Erro ao carregar os dados. Tente recarregar a página.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // ===== GERENCIAMENTO DE DADOS =====
    
    // Clientes
    async getClientes() {
        try {
            const response = await apiService.getClientes();
            return response.data || [];
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            return JSON.parse(localStorage.getItem('fabiane_clientes') || '[]');
        }
    }

    async addCliente(cliente) {
        try {
            this.showLoading(true);
            const response = await apiService.createCliente(cliente);
            this.showNotification('Cliente adicionado com sucesso!', 'success');
            await this.renderClientes();
            await this.updateDashboard();
            return response.data;
        } catch (error) {
            console.error('Erro ao adicionar cliente:', error);
            this.showNotification('Erro ao adicionar cliente', 'error');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    async updateCliente(id, updates) {
        try {
            this.showLoading(true);
            await apiService.updateCliente(id, updates);
            this.showNotification('Cliente atualizado com sucesso!', 'success');
            await this.renderClientes();
            await this.updateDashboard();
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            this.showNotification('Erro ao atualizar cliente', 'error');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    async deleteCliente(id) {
        try {
            this.showLoading(true);
            await apiService.deleteCliente(id);
            this.showNotification('Cliente removido com sucesso!', 'success');
            await this.renderClientes();
            await this.updateDashboard();
        } catch (error) {
            console.error('Erro ao remover cliente:', error);
            this.showNotification('Erro ao remover cliente', 'error');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    // Serviços
    async getServicos() {
        try {
            const response = await apiService.getServicos();
            return response.data || [];
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
            return JSON.parse(localStorage.getItem('fabiane_servicos') || '[]');
        }
    }

    async addServico(servico) {
        try {
            this.showLoading(true);
            const response = await apiService.createServico(servico);
            this.showNotification('Serviço adicionado com sucesso!', 'success');
            await this.renderServicos();
            return response.data;
        } catch (error) {
            console.error('Erro ao adicionar serviço:', error);
            this.showNotification('Erro ao adicionar serviço', 'error');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    async updateServico(id, updates) {
        try {
            this.showLoading(true);
            await apiService.updateServico(id, updates);
            this.showNotification('Serviço atualizado com sucesso!', 'success');
            await this.renderServicos();
        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            this.showNotification('Erro ao atualizar serviço', 'error');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    async deleteServico(id) {
        try {
            this.showLoading(true);
            await apiService.deleteServico(id);
            this.showNotification('Serviço removido com sucesso!', 'success');
            await this.renderServicos();
        } catch (error) {
            console.error('Erro ao remover serviço:', error);
            this.showNotification('Erro ao remover serviço', 'error');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    // Produtos
    async getProdutos() {
        try {
            const response = await apiService.getProdutos();
            return response.data || [];
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            return JSON.parse(localStorage.getItem('fabiane_produtos') || '[]');
        }
    }

    async addProduto(produto) {
        try {
            this.showLoading(true);
            produto.createdAt = new Date().toISOString();
            produto.estoqueAtual = produto.estoqueAtual || 0;
            const response = await apiService.createProduto(produto);
            const novoProduto = response.data;
            this.showNotification('Produto adicionado com sucesso!', 'success');
            await this.renderProdutos();
            return novoProduto;
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            this.showNotification('Erro ao adicionar produto', 'error');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    async updateProduto(id, updates) {
        try {
            this.showLoading(true);
            await apiService.updateProduto(id, updates);
            this.showNotification('Produto atualizado com sucesso!', 'success');
            await this.renderProdutos();
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            this.showNotification('Erro ao atualizar produto', 'error');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    async deleteProduto(id) {
        try {
            this.showLoading(true);
            await apiService.deleteProduto(id);
            this.showNotification('Produto removido com sucesso!', 'success');
            await this.renderProdutos();
        } catch (error) {
            console.error('Erro ao remover produto:', error);
            this.showNotification('Erro ao remover produto', 'error');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    deleteServico(id) {
        const servicos = this.getServicos();
        const filtered = servicos.filter(s => s.id !== id);
        this.saveServicos(filtered);
    }

    // Agendamentos
    async getAgendamentos() {
        try {
            const response = await apiService.getAgendamentos();
            return response.data || [];
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
            this.showNotification('Erro ao carregar agendamentos', 'error');
            return [];
        }
    }

    async addAgendamento(agendamento) {
        try {
            this.showLoading(true);
            agendamento.createdAt = new Date().toISOString();
            agendamento.status = 'agendado';
            const response = await apiService.createAgendamento(agendamento);
            const novoAgendamento = response.data;
            this.showNotification('Agendamento realizado com sucesso!', 'success');
            await this.renderAgendamentos();
            await this.updateDashboard();
            return novoAgendamento;
        } catch (error) {
            console.error('Erro ao adicionar agendamento:', error);
            this.showNotification('Erro ao adicionar agendamento', 'error');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    async updateAgendamento(id, updates) {
        try {
            this.showLoading(true);
            await apiService.updateAgendamento(id, updates);
            this.showNotification('Agendamento atualizado com sucesso!', 'success');
            await this.renderAgendamentos();
            await this.updateDashboard();
        } catch (error) {
            console.error('Erro ao atualizar agendamento:', error);
            this.showNotification('Erro ao atualizar agendamento', 'error');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    async deleteAgendamento(id) {
        try {
            this.showLoading(true);
            await apiService.deleteAgendamento(id);
            this.showNotification('Agendamento removido com sucesso!', 'success');
            await this.renderAgendamentos();
            await this.updateDashboard();
        } catch (error) {
            console.error('Erro ao remover agendamento:', error);
            this.showNotification('Erro ao remover agendamento', 'error');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    // Produtos
    getProdutos() {
        return JSON.parse(localStorage.getItem('fabiane_produtos') || '[]');
    }

    saveProdutos(produtos) {
        localStorage.setItem('fabiane_produtos', JSON.stringify(produtos));
    }

    addProduto(produto) {
        const produtos = this.getProdutos();
        produto.id = Date.now().toString();
        produto.createdAt = new Date().toISOString();
        produtos.push(produto);
        this.saveProdutos(produtos);
        return produto;
    }

    updateProduto(id, updates) {
        const produtos = this.getProdutos();
        const index = produtos.findIndex(p => p.id === id);
        if (index !== -1) {
            produtos[index] = { ...produtos[index], ...updates };
            this.saveProdutos(produtos);
        }
    }

    deleteProduto(id) {
        const produtos = this.getProdutos();
        const filtered = produtos.filter(p => p.id !== id);
        this.saveProdutos(filtered);
    }

    // ===== RENDERIZAÇÃO =====

    async renderClientes() {
        const clientes = await this.getClientes();
        const tbody = document.getElementById('clientes-table');

        if (clientes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        Nenhuma cliente cadastrada
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = clientes.map(cliente => {
            const ultimoAtendimento = this.getUltimoAtendimento(cliente.id);
            return `
                <tr>
                    <td>${cliente.nome}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.email || 'Não informado'}</td>
                    <td>${ultimoAtendimento || 'Nunca'}</td>
                    <td>
                        <button class="btn btn-outline" onclick="editCliente('${cliente.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline" onclick="deleteClienteConfirm('${cliente.id}')" style="margin-left: 0.5rem;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    async renderServicos() {
        const servicos = await this.getServicos();
        const tbody = document.getElementById('servicos-table');

        if (servicos.length === 0) {
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
                <td>${servico.nome}</td>
                <td>${servico.categoria}</td>
                <td>${servico.duracao} min</td>
                <td>${this.formatCurrency(servico.preco)}</td>
                <td>
                    <span class="status ${servico.active ? 'active' : 'inactive'}">
                        ${servico.active ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-outline" onclick="editServico('${servico.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline" onclick="deleteServicoConfirm('${servico.id}')" style="margin-left: 0.5rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async renderAgendamentos() {
        const agendamentos = await this.getAgendamentos();
        const clientes = await this.getClientes();
        const servicos = await this.getServicos();
        const tbody = document.getElementById('agendamentos-table');

        if (agendamentos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        Nenhum agendamento cadastrado
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = agendamentos.map(agendamento => {
            const cliente = clientes.find(c => c.id === agendamento.clienteId);
            const servico = servicos.find(s => s.id === agendamento.servicoId);
            
            return `
                <tr>
                    <td>${this.formatDateTime(agendamento.data, agendamento.horario)}</td>
                    <td>${cliente ? cliente.nome : 'Cliente não encontrado'}</td>
                    <td>${servico ? servico.nome : 'Serviço não encontrado'}</td>
                    <td>
                        <span class="status ${agendamento.status}">
                            ${this.getStatusLabel(agendamento.status)}
                        </span>
                    </td>
                    <td>${servico ? this.formatCurrency(servico.preco) : 'N/A'}</td>
                    <td>
                        <button class="btn btn-outline" onclick="editAgendamento('${agendamento.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline" onclick="deleteAgendamentoConfirm('${agendamento.id}')" style="margin-left: 0.5rem;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    async renderProdutos() {
        const produtos = await this.getProdutos();
        const tbody = document.getElementById('produtos-table');

        if (produtos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        Nenhum produto cadastrado
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = produtos.map(produto => {
            const status = this.getStockStatus(produto);
            return `
                <tr>
                    <td>${produto.nome}</td>
                    <td>${produto.categoria}</td>
                    <td>${produto.quantidade}</td>
                    <td>${this.formatCurrency(produto.preco)}</td>
                    <td>
                        <span class="status ${status}">
                            ${this.getStockLabel(status)}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-outline" onclick="editProduto('${produto.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline" onclick="deleteProdutoConfirm('${produto.id}')" style="margin-left: 0.5rem;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // ===== FUNÇÕES AUXILIARES =====

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatDateTime(date, time) {
        const dateObj = new Date(date + 'T' + time);
        return dateObj.toLocaleString('pt-BR');
    }

    getStatusLabel(status) {
        const labels = {
            'agendado': 'Agendado',
            'confirmado': 'Confirmado',
            'realizado': 'Realizado',
            'cancelado': 'Cancelado'
        };
        return labels[status] || status;
    }

    getStockStatus(produto) {
        if (produto.quantidade === 0) return 'out';
        if (produto.quantidade <= produto.estoqueMinimo) return 'low';
        return 'ok';
    }

    getStockLabel(status) {
        const labels = {
            'ok': 'Estoque OK',
            'low': 'Estoque Baixo',
            'out': 'Sem Estoque'
        };
        return labels[status] || status;
    }

    getUltimoAtendimento(clienteId) {
        const agendamentos = this.getAgendamentos();
        const atendimentos = agendamentos
            .filter(a => a.clienteId === clienteId && a.status === 'realizado')
            .sort((a, b) => new Date(b.data) - new Date(a.data));
        
        if (atendimentos.length > 0) {
            return this.formatDateTime(atendimentos[0].data, atendimentos[0].horario);
        }
        return null;
    }

    // ===== DASHBOARD =====

    async updateDashboard() {
        const clientes = await this.getClientes();
        const agendamentos = await this.getAgendamentos();
        const servicos = await this.getServicos();
        
        // Agendamentos de hoje
        const hoje = new Date().toISOString().split('T')[0];
        const agendamentosHoje = agendamentos.filter(a => a.data === hoje);
        
        // Receita do mês
        const mesAtual = new Date().getMonth();
        const anoAtual = new Date().getFullYear();
        const receitaMes = agendamentos
            .filter(a => {
                const dataAgendamento = new Date(a.data);
                return dataAgendamento.getMonth() === mesAtual && 
                       dataAgendamento.getFullYear() === anoAtual &&
                       a.status === 'realizado';
            })
            .reduce((total, agendamento) => {
                const servico = servicos.find(s => s.id === agendamento.servicoId);
                return total + (servico ? servico.preco : 0);
            }, 0);

        // Serviços realizados
        const servicosRealizados = agendamentos.filter(a => a.status === 'realizado').length;

        // Atualizar elementos
        document.getElementById('total-clientes').textContent = clientes.length;
        document.getElementById('agendamentos-hoje').textContent = agendamentosHoje.length;
        document.getElementById('receita-mes').textContent = this.formatCurrency(receitaMes);
        document.getElementById('servicos-realizados').textContent = servicosRealizados;

        // Próximos agendamentos
        await this.renderProximosAgendamentos();
    }

    async renderProximosAgendamentos() {
        const agendamentos = await this.getAgendamentos();
        const clientes = await this.getClientes();
        const servicos = await this.getServicos();
        const container = document.getElementById('proximos-agendamentos');
        
        const hoje = new Date();
        const proximosAgendamentos = agendamentos
            .filter(a => new Date(a.data) >= hoje && a.status === 'agendado')
            .sort((a, b) => new Date(a.data + 'T' + a.horario) - new Date(b.data + 'T' + b.horario))
            .slice(0, 5);

        if (proximosAgendamentos.length === 0) {
            container.innerHTML = `
                <p style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                    Nenhum agendamento próximo
                </p>
            `;
            return;
        }

        container.innerHTML = proximosAgendamentos.map(agendamento => {
            const cliente = clientes.find(c => c.id === agendamento.clienteId);
            const servico = servicos.find(s => s.id === agendamento.servicoId);
            
            return `
                <div style="padding: 1rem; border-left: 3px solid var(--primary-pink); margin-bottom: 1rem; background: var(--light-pink);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${cliente ? cliente.nome : 'Cliente não encontrado'}</strong><br>
                            <span style="color: var(--text-secondary);">${servico ? servico.nome : 'Serviço não encontrado'}</span>
                        </div>
                        <div style="text-align: right;">
                            <div>${this.formatDateTime(agendamento.data, agendamento.horario)}</div>
                            <div style="color: var(--primary-pink); font-weight: 600;">
                                ${servico ? this.formatCurrency(servico.preco) : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    async updateRelatorios() {
        const clientes = await this.getClientes();
        const agendamentos = await this.getAgendamentos();
        const servicos = await this.getServicos();
        const produtos = await this.getProdutos();

        document.getElementById('relatorio-clientes').textContent = clientes.length;
        document.getElementById('relatorio-agendamentos').textContent = agendamentos.filter(a => a.status === 'realizado').length;
        document.getElementById('relatorio-servicos').textContent = servicos.filter(s => s.active).length;
        document.getElementById('relatorio-produtos').textContent = produtos.length;
    }

    // ===== NAVEGAÇÃO =====

    async showPage(pageId) {
        console.log(`📄 Navegando para página: ${pageId}`);
        
        // Esconder todas as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });

        // Remover classe active de todos os links
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });

        // Mostrar página selecionada
        const targetPage = document.getElementById(pageId + '-page');
        if (targetPage) {
            targetPage.classList.remove('hidden');
            console.log(`✅ Página ${pageId} ativada`);
        } else {
            console.error(`❌ Página ${pageId}-page não encontrada`);
        }
        
        // Adicionar classe active ao link correspondente
        const targetLink = document.querySelector(`[data-page="${pageId}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }

        // Atualizar página atual
        this.currentPage = pageId;

        // Atualizar dados baseado na página
        switch(pageId) {
            case 'dashboard':
                await this.updateDashboard();
                break;
            case 'clientes':
                await this.renderClientes();
                await this.updateClienteSelect();
                break;
            case 'agendamentos':
                await this.renderAgendamentos();
                break;
            case 'servicos':
                await this.renderServicos();
                break;
            case 'produtos':
                await this.renderProdutos();
                break;
            case 'calendario':
                await this.renderCalendar();
                break;
            case 'relatorios':
                await this.updateRelatorios();
                break;
        }
    }

    // ===== MODAIS =====

    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        
        // Atualizar selects se necessário
        if (modalId === 'agendamento-modal') {
            this.updateClienteSelect();
            this.updateServicoSelect();
        }
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        
        // Limpar formulário
        const form = document.querySelector(`#${modalId} form`);
        if (form) {
            form.reset();
        }
    }

    async updateClienteSelect() {
        const clientes = await this.getClientes();
        const select = document.querySelector('select[name="clienteId"]');
        
        if (select) {
            select.innerHTML = '<option value="">Selecione uma cliente</option>' +
                clientes.map(cliente => 
                    `<option value="${cliente.id}">${cliente.nome}</option>`
                ).join('');
        }
    }

    async updateServicoSelect() {
        const servicos = await this.getServicos();
        const select = document.querySelector('select[name="servicoId"]');
        
        if (select) {
            select.innerHTML = '<option value="">Selecione um serviço</option>' +
                servicos.filter(s => s.active).map(servico => 
                    `<option value="${servico.id}">${servico.nome} - ${this.formatCurrency(servico.preco)}</option>`
                ).join('');
        }
    }

    // ===== NAVEGAÇÃO =====
    
    setupNavigation() {
        // Configurar navegação do menu lateral
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-page');
                this.showPage(targetPage);
                
                // Atualizar classe ativa
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    // ===== CALENDÁRIO =====
    
    initCalendar() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.setupCalendarEvents();
    }
    
    setupCalendarEvents() {
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', async () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                await this.renderCalendar();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', async () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                await this.renderCalendar();
            });
        }
    }
    
    async renderCalendar() {
        const calendarTitle = document.getElementById('calendar-title');
        const calendarDays = document.getElementById('calendar-days');
        
        if (!calendarTitle || !calendarDays) return;
        
        // Atualizar título
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        calendarTitle.textContent = `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        
        // Limpar dias
        calendarDays.innerHTML = '';
        
        // Obter primeiro dia do mês e último dia
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // Obter agendamentos do mês
        const agendamentos = await this.getAgendamentos();
        const today = new Date();
        
        // Gerar 42 dias (6 semanas)
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            // Verificar se é do mês atual
            if (date.getMonth() !== this.currentDate.getMonth()) {
                dayElement.classList.add('other-month');
            }
            
            // Verificar se é hoje
            if (date.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
            
            // Número do dia
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = date.getDate();
            dayElement.appendChild(dayNumber);
            
            // Agendamentos do dia
            const dayAppointments = document.createElement('div');
            dayAppointments.className = 'day-appointments';
            
            const dateStr = date.toISOString().split('T')[0];
            const dayAgendamentos = agendamentos.filter(ag => ag.data === dateStr);
            
            dayAgendamentos.forEach(agendamento => {
                const dot = document.createElement('div');
                dot.className = `appointment-dot ${agendamento.status.toLowerCase()}`;
                dot.title = `${agendamento.horario} - ${agendamento.cliente} - ${agendamento.servico}`;
                dayAppointments.appendChild(dot);
            });
            
            dayElement.appendChild(dayAppointments);
            
            // Evento de clique
            dayElement.addEventListener('click', () => {
                this.selectCalendarDate(date);
            });
            
            calendarDays.appendChild(dayElement);
        }
    }
    
    selectCalendarDate(date) {
        // Remover seleção anterior
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Selecionar nova data
        this.selectedDate = date;
        
        // Encontrar e marcar o dia selecionado
        const dayElements = document.querySelectorAll('.calendar-day');
        dayElements.forEach(dayEl => {
            const dayNumber = parseInt(dayEl.querySelector('.day-number').textContent);
            const dayDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), dayNumber);
            
            if (dayDate.toDateString() === date.toDateString() && 
                !dayEl.classList.contains('other-month')) {
                dayEl.classList.add('selected');
            }
        });
        
        // Abrir modal de agendamento com data pré-selecionada
        this.openAgendamentoModal(date);
    }
    
    openAgendamentoModal(date) {
        const modal = document.getElementById('agendamento-modal');
        const dateInput = document.querySelector('#agendamento-modal input[name="data"]');
        
        if (modal && dateInput) {
            // Pré-preencher data
            const dateStr = date.toISOString().split('T')[0];
            dateInput.value = dateStr;
            
            // Abrir modal
            modal.classList.add('active');
        }
    }

    // ===== EVENT LISTENERS =====

    setupEventListeners() {
        // Formulário de cliente
        document.getElementById('cliente-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const cliente = Object.fromEntries(formData);
            
            this.addCliente(cliente);
            this.closeModal('cliente-modal');
            this.renderClientes();
            this.showNotification('Cliente cadastrada com sucesso!', 'success');
        });

        // Formulário de agendamento
        document.getElementById('agendamento-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const agendamento = Object.fromEntries(formData);
            
            this.addAgendamento(agendamento);
            this.closeModal('agendamento-modal');
            this.renderAgendamentos();
            this.showNotification('Agendamento criado com sucesso!', 'success');
        });

        // Formulário de serviço
        document.getElementById('servico-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const servico = Object.fromEntries(formData);
            
            this.addServico(servico);
            this.closeModal('servico-modal');
            this.renderServicos();
            this.showNotification('Serviço cadastrado com sucesso!', 'success');
        });

        // Formulário de produto
        document.getElementById('produto-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const produto = Object.fromEntries(formData);
            
            this.addProduto(produto);
            this.closeModal('produto-modal');
            this.renderProdutos();
            this.showNotification('Produto cadastrado com sucesso!', 'success');
        });
    }

    // ===== NOTIFICAÇÕES E LOADING =====

    showLoading(show = true) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'flex' : 'none';
        } else if (show) {
            // Criar elemento de loading se não existir
            const loading = document.createElement('div');
            loading.id = 'loading';
            loading.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Carregando...</p>
                </div>
            `;
            loading.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            `;
            document.body.appendChild(loading);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
            ${message}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // ===== DADOS INICIAIS =====

    async loadInitialData() {
        try {
            // Verifica se já existem dados no banco de dados
            const clientes = await this.getClientes();
            if (clientes.length === 0) {
                await this.initializeExampleData();
            }
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            this.showNotification('Erro ao carregar dados iniciais', 'error');
        }
    }

    async initializeExampleData() {
        try {
            // Serviços específicos da Fabiane
            const servicosExemplo = [
                {
                    nome: 'Método Joana Medrado 2.0',
                    descricao: 'Método exclusivo de tratamento facial',
                    categoria: 'Estética Avançada',
                    duracao: 90,
                    preco: 250.00,
                    ativo: true
                },
                {
                    nome: 'Estética Cosmetológica',
                    descricao: 'Tratamento facial completo com cosméticos profissionais',
                    categoria: 'Facial',
                    duracao: 60,
                    preco: 120.00,
                    ativo: true
                },
                {
                    nome: 'Flaciall',
                    descricao: 'Técnica de harmonização facial',
                    categoria: 'Estética Avançada',
                    duracao: 90,
                    preco: 200.00,
                    ativo: true
                },
                {
                    nome: 'P.O 360 JM/Kinésio',
                    descricao: 'Pós-operatório com técnicas de drenagem linfática',
                    categoria: 'Pós-operatório',
                    duracao: 60,
                    preco: 150.00,
                    ativo: true
                },
                {
                    nome: 'Limpeza de Pele',
                    descricao: 'Limpeza profunda com extração de cravos e impurezas',
                    categoria: 'Facial',
                    duracao: 60,
                    preco: 100.00,
                    ativo: true
                },
                {
                    nome: 'Drenagem Linfática',
                    descricao: 'Massagem para redução de inchaço e retenção de líquidos',
                    categoria: 'Corporal',
                    duracao: 60,
                    preco: 120.00,
                    ativo: true
                },
                {
                    nome: 'Massagem Relax',
                    descricao: 'Massagem relaxante para alívio do estresse e tensões',
                    categoria: 'Corporal',
                    duracao: 60,
                    preco: 100.00,
                    ativo: true
                }
            ];

            // Adicionar serviços ao banco de dados
            for (const servico of servicosExemplo) {
                await this.addServico(servico);
            }

            // Clientes de exemplo
            const clientesExemplo = [
                {
                    nome: 'Ana Paula Silva',
                    telefone: '(11) 99999-1111',
                    email: 'ana.paula@email.com',
                    dataNascimento: '1985-03-15',
                    endereco: 'Rua das Flores, 123 - Centro',
                    observacoes: 'Pele sensível, evitar produtos com álcool',
                    genero: 'Feminino'
                },
                {
                    nome: 'Carlos Eduardo',
                    telefone: '(11) 98888-2222',
                    email: 'carlos.eduardo@email.com',
                    dataNascimento: '1990-07-22',
                    endereco: 'Av. Paulista, 1000 - Bela Vista',
                    observacoes: 'Faz tratamento para acne',
                    genero: 'Masculino'
                }
            ];

            // Adicionar clientes ao banco de dados
            for (const cliente of clientesExemplo) {
                await this.addCliente(cliente);
            }

            // Exemplo de produtos
            const produtosExemplo = [
                {
                    nome: 'Creme Hidratante Facial',
                    descricao: 'Hidratante para pele seca',
                    categoria: 'Cuidados com o Rosto',
                    preco: 89.90,
                    custo: 45.00,
                    estoque: 15,
                    estoqueMinimo: 5
                },
                {
                    nome: 'Protetor Solar FPS 60',
                    descricao: 'Proteção UVA/UVB',
                    categoria: 'Proteção Solar',
                    preco: 129.90,
                    custo: 65.00,
                    estoque: 20,
                    estoqueMinimo: 10
                }
            ];

            // Adicionar produtos ao banco de dados
            for (const produto of produtosExemplo) {
                await this.addProduto(produto);
            }

            this.showNotification('Dados iniciais carregados com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao inicializar dados de exemplo:', error);
            this.showNotification('Erro ao carregar dados iniciais', 'error');
        }
    }

    // ===== FUNÇÕES PARA RELATÓRIOS =====

    async getDashboardStats() {
        const clientes = await this.getClientes();
        const agendamentos = await this.getAgendamentos();
        const servicos = await this.getServicos();
        const produtos = await this.getProdutos();
        
        // Calcular receita total dos agendamentos realizados
        const receitaTotal = agendamentos
            .filter(a => a.status === 'realizado')
            .reduce((total, agendamento) => {
                const servico = servicos.find(s => s.id === agendamento.servicoId);
                return total + (servico ? servico.preco : 0);
            }, 0);
        
        return {
            totalClientes: clientes.length,
            totalAgendamentos: agendamentos.length,
            totalServicos: servicos.length,
            totalProdutos: produtos.length,
            receitaTotal: receitaTotal
        };
    }

    async getExportData(tipo) {
        switch(tipo) {
            case 'geral':
                return {
                    clientes: await this.getClientes(),
                    agendamentos: await this.getAgendamentos(),
                    servicos: await this.getServicos(),
                    produtos: await this.getProdutos()
                };
            case 'detalhado':
                return {
                    resumo: await this.getDashboardStats(),
                    clientes: await this.getClientes(),
                    agendamentos: await this.getAgendamentos(),
                    servicos: await this.getServicos(),
                    produtos: await this.getProdutos()
                };
            default:
                return {};
        }
    }

    async getData(type) {
        switch(type) {
            case 'clientes':
                return await this.getClientes();
            case 'agendamentos':
                const agendamentos = await this.getAgendamentos();
                const clientes = await this.getClientes();
                const servicos = await this.getServicos();
                return agendamentos.map(agendamento => {
                    const cliente = clientes.find(c => c.id === agendamento.clienteId);
                    const servico = servicos.find(s => s.id === agendamento.servicoId);
                    return {
                        ...agendamento,
                        cliente: cliente ? cliente.nome : 'Cliente não encontrado',
                        servico: servico ? servico.nome : 'Serviço não encontrado'
                    };
                });
            case 'servicos':
                return await this.getServicos();
            case 'produtos':
                const produtos = await this.getProdutos();
                return produtos.map(produto => ({
                    ...produto,
                    estoque: produto.quantidade,
                    fornecedor: produto.fornecedor || 'Não informado'
                }));
            default:
                return [];
        }
    }

    async renderDashboard() {
        await this.updateDashboard();
    }
}

// ===== FUNÇÕES GLOBAIS =====

let esteticaFabiane;

// Inicializar sistema
document.addEventListener('DOMContentLoaded', () => {
    esteticaFabiane = new EsteticaFabianeSystem();
});

// Navegação
function showPage(pageId) {
    esteticaFabiane.showPage(pageId);
}

// Modais
function openModal(modalId) {
    esteticaFabiane.openModal(modalId);
}

function closeModal(modalId) {
    esteticaFabiane.closeModal(modalId);
}

// Funções de exclusão com confirmação
function deleteClienteConfirm(id) {
    if (confirm('Tem certeza que deseja excluir esta cliente?')) {
        esteticaFabiane.deleteCliente(id);
        esteticaFabiane.renderClientes();
        esteticaFabiane.showNotification('Cliente excluída com sucesso!', 'success');
    }
}

function deleteServicoConfirm(id) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        esteticaFabiane.deleteServico(id);
        esteticaFabiane.renderServicos();
        esteticaFabiane.showNotification('Serviço excluído com sucesso!', 'success');
    }
}

function deleteAgendamentoConfirm(id) {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
        esteticaFabiane.deleteAgendamento(id);
        esteticaFabiane.renderAgendamentos();
        esteticaFabiane.showNotification('Agendamento excluído com sucesso!', 'success');
    }
}

function deleteProdutoConfirm(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        esteticaFabiane.deleteProduto(id);
        esteticaFabiane.renderProdutos();
        esteticaFabiane.showNotification('Produto excluído com sucesso!', 'success');
    }
}

// Exportação de relatórios
async function exportarRelatorioGeral() {
    try {
        const dados = await esteticaFabiane.getExportData('geral');
        
        // Dados do dashboard
        const stats = esteticaFabiane.getDashboardStats();
        const currentDate = new Date().toLocaleDateString('pt-BR');
        const currentTime = new Date().toLocaleTimeString('pt-BR');
        
        const dashboardData = [
            ['🌸 ESTÉTICA FABIANE PROCÓPIO 🌸'],
            ['Relatório Geral de Gestão'],
            [''],
            ['📅 Data de Geração:', currentDate],
            ['⏰ Horário:', currentTime],
            [''],
            ['📊 ESTATÍSTICAS GERAIS'],
            ['👥 Total de Clientes:', stats.totalClientes],
            ['📅 Total de Agendamentos:', stats.totalAgendamentos],
            ['💆‍♀️ Total de Serviços:', stats.totalServicos],
            ['📦 Total de Produtos:', stats.totalProdutos],
            [''],
            ['💰 RESUMO FINANCEIRO'],
            ['💵 Receita Total Realizada:', 'R$ ' + stats.receitaTotal.toFixed(2).replace('.', ',')],
            [''],
            ['🏢 Estética Fabiane Procópio - Beleza & Bem-estar'],
            ['📱 Sistema de Gestão Integrado']
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(dashboardData);
        
        // Aplicar estilos personalizados
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = XLSX.utils.encode_cell({c: C, r: R});
                if (!ws[cell_address]) continue;
                
                // Título principal
                if (R === 0) {
                    ws[cell_address].s = {
                        font: { bold: true, sz: 18, color: { rgb: "FFFFFF" } },
                        alignment: { horizontal: "center", vertical: "center" },
                        fill: { fgColor: { rgb: "E91E63" } },
                        border: {
                            top: { style: "thick", color: { rgb: "AD1457" } },
                            bottom: { style: "thick", color: { rgb: "AD1457" } },
                            left: { style: "thick", color: { rgb: "AD1457" } },
                            right: { style: "thick", color: { rgb: "AD1457" } }
                        }
                    };
                }
                // Subtítulo
                else if (R === 1) {
                    ws[cell_address].s = {
                        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
                        alignment: { horizontal: "center", vertical: "center" },
                        fill: { fgColor: { rgb: "F06292" } },
                        border: {
                            top: { style: "medium", color: { rgb: "E91E63" } },
                            bottom: { style: "medium", color: { rgb: "E91E63" } },
                            left: { style: "medium", color: { rgb: "E91E63" } },
                            right: { style: "medium", color: { rgb: "E91E63" } }
                        }
                    };
                }
                // Seções (Estatísticas e Financeiro)
                else if (R === 6 || R === 12) {
                    ws[cell_address].s = {
                        font: { bold: true, sz: 12, color: { rgb: "E91E63" } },
                        alignment: { horizontal: "left", vertical: "center" },
                        fill: { fgColor: { rgb: "FCE4EC" } },
                        border: {
                            top: { style: "medium", color: { rgb: "E91E63" } },
                            bottom: { style: "medium", color: { rgb: "E91E63" } },
                            left: { style: "medium", color: { rgb: "E91E63" } },
                            right: { style: "medium", color: { rgb: "E91E63" } }
                        }
                    };
                }
                // Dados
                else if (R >= 7 && R <= 10 || R === 13) {
                    ws[cell_address].s = {
                        font: { sz: 11, color: { rgb: "2D2D2D" } },
                        alignment: { horizontal: "left", vertical: "center" },
                        fill: { fgColor: { rgb: "FFFFFF" } },
                        border: {
                            top: { style: "thin", color: { rgb: "E0E0E0" } },
                            bottom: { style: "thin", color: { rgb: "E0E0E0" } },
                            left: { style: "thin", color: { rgb: "E0E0E0" } },
                            right: { style: "thin", color: { rgb: "E0E0E0" } }
                        }
                    };
                    
                    // Destacar valores numéricos
                    if (ws[cell_address].v && typeof ws[cell_address].v === 'string' && ws[cell_address].v.includes('R$')) {
                        ws[cell_address].s.font.bold = true;
                        ws[cell_address].s.font.color = { rgb: "E91E63" };
                    }
                }
                // Informações da empresa (rodapé)
                else if (R >= 15) {
                    ws[cell_address].s = {
                        font: { italic: true, sz: 10, color: { rgb: "666666" } },
                        alignment: { horizontal: "center", vertical: "center" },
                        fill: { fgColor: { rgb: "F8F8F8" } }
                    };
                }
                // Data e hora
                else if (R === 3 || R === 4) {
                    ws[cell_address].s = {
                        font: { sz: 10, color: { rgb: "666666" } },
                        alignment: { horizontal: "left", vertical: "center" }
                    };
                    
                    if (C === 1) {
                        ws[cell_address].s.font.bold = true;
                        ws[cell_address].s.font.color = { rgb: "E91E63" };
                    }
                }
            }
        }
        
        // Configurar larguras das colunas
        ws['!cols'] = [{ width: 35 }, { width: 25 }];
        
        // Configurar altura das linhas
        ws['!rows'] = [
            { hpt: 25 }, // Título
            { hpt: 20 }, // Subtítulo
            { hpt: 15 }, // Espaço
            { hpt: 15 }, // Data
            { hpt: 15 }, // Hora
            { hpt: 15 }, // Espaço
            { hpt: 20 }, // Seção
            { hpt: 18 }, // Dados
            { hpt: 18 }, // Dados
            { hpt: 18 }, // Dados
            { hpt: 18 }, // Dados
            { hpt: 15 }, // Espaço
            { hpt: 20 }, // Seção
            { hpt: 18 }, // Dados
            { hpt: 15 }, // Espaço
            { hpt: 15 }, // Rodapé
            { hpt: 15 }  // Rodapé
        ];
        
        XLSX.utils.book_append_sheet(wb, ws, "Relatório Geral");
        XLSX.writeFile(wb, `Relatorio_Geral_Estetica_Fabiane_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        esteticaFabiane.showNotification('Relatório geral exportado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao exportar relatório:', error);
        esteticaFabiane.showNotification('Erro ao exportar relatório. Verifique se a biblioteca XLSX está carregada.', 'error');
    }
}

async function exportarRelatorioDetalhado() {
    try {
        const dados = await esteticaFabiane.getExportData('detalhado');
        const currentDate = new Date().toLocaleDateString('pt-BR');
        
        // Função para aplicar estilos personalizados
        function applyCustomStyles(ws, sheetTitle, iconEmoji) {
            const range = XLSX.utils.decode_range(ws['!ref']);
            
            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cell_address = XLSX.utils.encode_cell({c: C, r: R});
                    if (!ws[cell_address]) continue;
                    
                    // Título da planilha (linha 0)
                    if (R === 0) {
                        ws[cell_address].s = {
                            font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
                            alignment: { horizontal: "center", vertical: "center" },
                            fill: { fgColor: { rgb: "E91E63" } },
                            border: {
                                top: { style: "thick", color: { rgb: "AD1457" } },
                                bottom: { style: "thick", color: { rgb: "AD1457" } },
                                left: { style: "thick", color: { rgb: "AD1457" } },
                                right: { style: "thick", color: { rgb: "AD1457" } }
                            }
                        };
                    }
                    // Cabeçalhos das colunas (linha 1)
                    else if (R === 1) {
                        ws[cell_address].s = {
                            font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
                            alignment: { horizontal: "center", vertical: "center" },
                            fill: { fgColor: { rgb: "F06292" } },
                            border: {
                                top: { style: "medium", color: { rgb: "E91E63" } },
                                bottom: { style: "medium", color: { rgb: "E91E63" } },
                                left: { style: "thin", color: { rgb: "E91E63" } },
                                right: { style: "thin", color: { rgb: "E91E63" } }
                            }
                        };
                    }
                    // Dados (linhas 2+)
                    else if (R >= 2) {
                        const isEvenRow = (R % 2 === 0);
                        ws[cell_address].s = {
                            font: { sz: 10, color: { rgb: "2D2D2D" } },
                            alignment: { horizontal: "left", vertical: "center" },
                            fill: { fgColor: { rgb: isEvenRow ? "FFFFFF" : "FCE4EC" } },
                            border: {
                                top: { style: "thin", color: { rgb: "E0E0E0" } },
                                bottom: { style: "thin", color: { rgb: "E0E0E0" } },
                                left: { style: "thin", color: { rgb: "E0E0E0" } },
                                right: { style: "thin", color: { rgb: "E0E0E0" } }
                            }
                        };
                        
                        // Destacar valores monetários
                        if (ws[cell_address].v && typeof ws[cell_address].v === 'string' && ws[cell_address].v.includes('R$')) {
                            ws[cell_address].s.font.bold = true;
                            ws[cell_address].s.font.color = { rgb: "E91E63" };
                        }
                    }
                }
            }
            
            // Configurar altura das linhas
            ws['!rows'] = [
                { hpt: 25 }, // Título
                { hpt: 20 }, // Cabeçalho
                ...Array(range.e.r - 1).fill({ hpt: 16 }) // Dados
            ];
        }
        
        // Planilha de Clientes
        const clientes = esteticaFabiane.getData('clientes');
        const clientesData = [
            ['👥 CLIENTES - ESTÉTICA FABIANE PROCÓPIO'],
            ['Nome', 'Telefone', 'Email', 'Data de Nascimento', 'Endereço'],
            ...clientes.map(cliente => [
                cliente.nome || 'Não informado',
                cliente.telefone || 'Não informado',
                cliente.email || 'Não informado',
                cliente.dataNascimento || 'Não informado',
                cliente.endereco || 'Não informado'
            ])
        ];
        
        const wsClientes = XLSX.utils.aoa_to_sheet(clientesData);
        wsClientes['!cols'] = [{ width: 25 }, { width: 18 }, { width: 30 }, { width: 18 }, { width: 40 }];
        applyCustomStyles(wsClientes, 'CLIENTES', '👥');
        XLSX.utils.book_append_sheet(wb, wsClientes, "👥 Clientes");
        
        // Planilha de Agendamentos
        const agendamentos = esteticaFabiane.getData('agendamentos');
        const agendamentosData = [
            ['📅 AGENDAMENTOS - ESTÉTICA FABIANE PROCÓPIO'],
            ['Cliente', 'Serviço', 'Data', 'Horário', 'Status', 'Observações'],
            ...agendamentos.map(agendamento => [
                agendamento.cliente || 'Não informado',
                agendamento.servico || 'Não informado',
                agendamento.data || 'Não informado',
                agendamento.horario || 'Não informado',
                agendamento.status || 'Não informado',
                agendamento.observacoes || ''
            ])
        ];
        
        const wsAgendamentos = XLSX.utils.aoa_to_sheet(agendamentosData);
        wsAgendamentos['!cols'] = [{ width: 25 }, { width: 30 }, { width: 12 }, { width: 10 }, { width: 15 }, { width: 40 }];
        applyCustomStyles(wsAgendamentos, 'AGENDAMENTOS', '📅');
        XLSX.utils.book_append_sheet(wb, wsAgendamentos, "📅 Agendamentos");
        
        // Planilha de Serviços
        const servicos = esteticaFabiane.getData('servicos');
        const servicosData = [
            ['💆‍♀️ SERVIÇOS - ESTÉTICA FABIANE PROCÓPIO'],
            ['Nome', 'Categoria', 'Descrição', 'Preço', 'Duração (min)'],
            ...servicos.map(servico => [
                servico.nome || 'Não informado',
                servico.categoria || 'Não informado',
                servico.descricao || 'Não informado',
                'R$ ' + (servico.preco ? servico.preco.toFixed(2).replace('.', ',') : '0,00'),
                servico.duracao ? servico.duracao + ' min' : 'Não informado'
            ])
        ];
        
        const wsServicos = XLSX.utils.aoa_to_sheet(servicosData);
        wsServicos['!cols'] = [{ width: 30 }, { width: 20 }, { width: 50 }, { width: 15 }, { width: 15 }];
        applyCustomStyles(wsServicos, 'SERVIÇOS', '💆‍♀️');
        XLSX.utils.book_append_sheet(wb, wsServicos, "💆‍♀️ Serviços");
        
        // Planilha de Produtos
        const produtos = esteticaFabiane.getData('produtos');
        const produtosData = [
            ['📦 PRODUTOS - ESTÉTICA FABIANE PROCÓPIO'],
            ['Nome', 'Categoria', 'Preço Unit.', 'Estoque', 'Estoque Mín.', 'Fornecedor'],
            ...produtos.map(produto => [
                produto.nome || 'Não informado',
                produto.categoria || 'Não informado',
                'R$ ' + (produto.preco ? produto.preco.toFixed(2).replace('.', ',') : '0,00'),
                produto.estoque || produto.quantidade || 0,
                produto.estoqueMinimo || 'Não definido',
                produto.fornecedor || 'Não informado'
            ])
        ];
        
        const wsProdutos = XLSX.utils.aoa_to_sheet(produtosData);
        wsProdutos['!cols'] = [{ width: 30 }, { width: 20 }, { width: 15 }, { width: 10 }, { width: 12 }, { width: 25 }];
        applyCustomStyles(wsProdutos, 'PRODUTOS', '📦');
        XLSX.utils.book_append_sheet(wb, wsProdutos, "📦 Produtos");
        
        // Planilha de Resumo
        const stats = esteticaFabiane.getDashboardStats();
        const resumoData = [
            ['🌸 RESUMO EXECUTIVO - ESTÉTICA FABIANE PROCÓPIO'],
            ['Indicador', 'Valor'],
            ['📅 Data do Relatório', currentDate],
            ['👥 Total de Clientes', stats.totalClientes],
            ['📅 Total de Agendamentos', stats.totalAgendamentos],
            ['💆‍♀️ Total de Serviços', stats.totalServicos],
            ['📦 Total de Produtos', stats.totalProdutos],
            ['💰 Receita Total Realizada', 'R$ ' + stats.receitaTotal.toFixed(2).replace('.', ',')],
            [''],
            ['🏢 Estética Fabiane Procópio'],
            ['📍 Beleza & Bem-estar'],
            ['📱 Sistema de Gestão Integrado']
        ];
        
        const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
        wsResumo['!cols'] = [{ width: 35 }, { width: 25 }];
        applyCustomStyles(wsResumo, 'RESUMO', '🌸');
        XLSX.utils.book_append_sheet(wb, wsResumo, "🌸 Resumo");
        
        XLSX.writeFile(wb, `Relatorio_Detalhado_Estetica_Fabiane_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        esteticaFabiane.showNotification('Relatório detalhado exportado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao exportar relatório detalhado:', error);
        esteticaFabiane.showNotification('Erro ao exportar relatório. Verifique se a biblioteca XLSX está carregada.', 'error');
    }
}

// Fechar modais clicando fora
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Inicialização do sistema quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema da Estética Fabiane carregando...');
    
    // Criar instância do sistema
    window.esteticaFabiane = new EsteticaFabianeSystem();
    
    // Configurar navegação primeiro
    esteticaFabiane.setupNavigation();
    
    // Inicializar calendário
    esteticaFabiane.initCalendar();
    
    // Inicializar dados de exemplo se não existirem
    if (esteticaFabiane.getServicos().length === 0) {
        esteticaFabiane.initializeExampleData();
    }
    
    // Renderizar todas as páginas
    esteticaFabiane.renderDashboard();
    esteticaFabiane.renderClientes();
    esteticaFabiane.renderAgendamentos();
    esteticaFabiane.renderServicos();
    esteticaFabiane.renderProdutos();
    
    // Mostrar dashboard por padrão
    esteticaFabiane.showPage('dashboard');
    
    console.log('Sistema da Estética Fabiane carregado com sucesso!');
});
