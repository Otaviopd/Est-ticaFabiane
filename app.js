// Sistema Estética Fabiane Procópio - Gestão Completa
// Armazenamento local usando localStorage

class EsteticaFabianeSystem {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.loadInitialData();
        this.updateDashboard();
        this.renderClientes();
        this.renderServicos();
        this.renderProdutos();
        this.renderAgendamentos();
        this.updateRelatorios();
        this.setupEventListeners();
    }

    // ===== GERENCIAMENTO DE DADOS =====
    
    // Clientes
    getClientes() {
        return JSON.parse(localStorage.getItem('fabiane_clientes') || '[]');
    }

    saveClientes(clientes) {
        localStorage.setItem('fabiane_clientes', JSON.stringify(clientes));
    }

    addCliente(cliente) {
        const clientes = this.getClientes();
        cliente.id = Date.now().toString();
        cliente.createdAt = new Date().toISOString();
        clientes.push(cliente);
        this.saveClientes(clientes);
        return cliente;
    }

    updateCliente(id, updates) {
        const clientes = this.getClientes();
        const index = clientes.findIndex(c => c.id === id);
        if (index !== -1) {
            clientes[index] = { ...clientes[index], ...updates };
            this.saveClientes(clientes);
        }
    }

    deleteCliente(id) {
        const clientes = this.getClientes();
        const filtered = clientes.filter(c => c.id !== id);
        this.saveClientes(filtered);
    }

    // Serviços
    getServicos() {
        return JSON.parse(localStorage.getItem('fabiane_servicos') || '[]');
    }

    saveServicos(servicos) {
        localStorage.setItem('fabiane_servicos', JSON.stringify(servicos));
    }

    addServico(servico) {
        const servicos = this.getServicos();
        servico.id = Date.now().toString();
        servico.createdAt = new Date().toISOString();
        servico.active = true;
        servicos.push(servico);
        this.saveServicos(servicos);
        return servico;
    }

    updateServico(id, updates) {
        const servicos = this.getServicos();
        const index = servicos.findIndex(s => s.id === id);
        if (index !== -1) {
            servicos[index] = { ...servicos[index], ...updates };
            this.saveServicos(servicos);
        }
    }

    deleteServico(id) {
        const servicos = this.getServicos();
        const filtered = servicos.filter(s => s.id !== id);
        this.saveServicos(filtered);
    }

    // Agendamentos
    getAgendamentos() {
        return JSON.parse(localStorage.getItem('fabiane_agendamentos') || '[]');
    }

    saveAgendamentos(agendamentos) {
        localStorage.setItem('fabiane_agendamentos', JSON.stringify(agendamentos));
    }

    addAgendamento(agendamento) {
        const agendamentos = this.getAgendamentos();
        agendamento.id = Date.now().toString();
        agendamento.createdAt = new Date().toISOString();
        agendamento.status = 'agendado';
        agendamentos.push(agendamento);
        this.saveAgendamentos(agendamentos);
        return agendamento;
    }

    updateAgendamento(id, updates) {
        const agendamentos = this.getAgendamentos();
        const index = agendamentos.findIndex(a => a.id === id);
        if (index !== -1) {
            agendamentos[index] = { ...agendamentos[index], ...updates };
            this.saveAgendamentos(agendamentos);
        }
    }

    deleteAgendamento(id) {
        const agendamentos = this.getAgendamentos();
        const filtered = agendamentos.filter(a => a.id !== id);
        this.saveAgendamentos(filtered);
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

    renderClientes() {
        const clientes = this.getClientes();
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

    renderServicos() {
        const servicos = this.getServicos();
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

    renderAgendamentos() {
        const agendamentos = this.getAgendamentos();
        const clientes = this.getClientes();
        const servicos = this.getServicos();
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

    renderProdutos() {
        const produtos = this.getProdutos();
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

    updateDashboard() {
        const clientes = this.getClientes();
        const agendamentos = this.getAgendamentos();
        const servicos = this.getServicos();
        
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
        this.renderProximosAgendamentos();
    }

    renderProximosAgendamentos() {
        const agendamentos = this.getAgendamentos();
        const clientes = this.getClientes();
        const servicos = this.getServicos();
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

    updateRelatorios() {
        const clientes = this.getClientes();
        const agendamentos = this.getAgendamentos();
        const servicos = this.getServicos();
        const produtos = this.getProdutos();

        document.getElementById('relatorio-clientes').textContent = clientes.length;
        document.getElementById('relatorio-agendamentos').textContent = agendamentos.filter(a => a.status === 'realizado').length;
        document.getElementById('relatorio-servicos').textContent = servicos.filter(s => s.active).length;
        document.getElementById('relatorio-produtos').textContent = produtos.length;
    }

    // ===== NAVEGAÇÃO =====

    showPage(pageId) {
        // Esconder todas as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Remover classe active de todos os links
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });

        // Mostrar página selecionada
        document.getElementById(pageId + '-page').classList.add('active');
        
        // Adicionar classe active ao link correspondente
        event.target.classList.add('active');

        // Atualizar dados baseado na página
        switch(pageId) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'clientes':
                this.renderClientes();
                this.updateClienteSelect();
                break;
            case 'agendamentos':
                this.renderAgendamentos();
                break;
            case 'servicos':
                this.renderServicos();
                break;
            case 'produtos':
                this.renderProdutos();
                break;
            case 'relatorios':
                this.updateRelatorios();
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

    updateClienteSelect() {
        const clientes = this.getClientes();
        const select = document.querySelector('select[name="clienteId"]');
        
        if (select) {
            select.innerHTML = '<option value="">Selecione uma cliente</option>' +
                clientes.map(cliente => 
                    `<option value="${cliente.id}">${cliente.nome}</option>`
                ).join('');
        }
    }

    updateServicoSelect() {
        const servicos = this.getServicos();
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
    
    showPage(pageId) {
        // Esconder todas as páginas
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.add('hidden'));
        
        // Mostrar página selecionada
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            this.currentPage = pageId;
            
            // Se for calendário, renderizar
            if (pageId === 'calendario') {
                this.renderCalendar();
            }
        }
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
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendar();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendar();
            });
        }
    }
    
    renderCalendar() {
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
        const agendamentos = this.getAgendamentos();
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

    // ===== NOTIFICAÇÕES =====

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

    loadInitialData() {
        if (this.getServicos().length === 0) {
            this.initExampleData();
        }
    }

    initExampleData() {
        // Serviços específicos da Fabiane
        const servicosExemplo = [
            {
                nome: 'Método Joana Medrado 2.0',
                categoria: 'Estética Avançada',
                duracao: 90,
                preco: 180.00,
                descricao: 'Método exclusivo de rejuvenescimento facial'
            },
            {
                nome: 'Estética Cosmetológica',
                categoria: 'Facial',
                duracao: 60,
                preco: 120.00,
                descricao: 'Tratamento facial completo com cosméticos profissionais'
            },
            {
                nome: 'Flaciall',
                categoria: 'Facial',
                duracao: 45,
                preco: 100.00,
                descricao: 'Tratamento para flacidez facial'
            },
            {
                nome: 'P.O 360 JM/Kinésio',
                categoria: 'Corporal',
                duracao: 120,
                preco: 200.00,
                descricao: 'Protocolo completo de modelagem corporal'
            },
            {
                nome: 'Limpeza de Pele',
                categoria: 'Facial',
                duracao: 60,
                preco: 80.00,
                descricao: 'Limpeza profunda da pele facial'
            },
            {
                nome: 'Drenagem Linfática',
                categoria: 'Corporal',
                duracao: 60,
                preco: 90.00,
                descricao: 'Massagem para drenagem linfática'
            },
            {
                nome: 'Massagem Relax',
                categoria: 'Relaxamento',
                duracao: 50,
                preco: 70.00,
                descricao: 'Massagem relaxante e terapêutica'
            }
        ];

        servicosExemplo.forEach(servico => this.addServico(servico));

        // Clientes de exemplo
        const clientesExemplo = [
            {
                nome: 'Ana Paula Silva',
                telefone: '(11) 99999-1111',
                email: 'ana.paula@email.com',
                dataNascimento: '1985-03-15',
                endereco: 'Rua das Flores, 123 - Centro',
                observacoes: 'Pele sensível, evitar produtos com álcool'
            },
            {
                nome: 'Mariana Santos',
                telefone: '(11) 88888-2222',
                email: 'mariana.santos@email.com',
                dataNascimento: '1990-07-22',
                endereco: 'Av. Principal, 456 - Jardins',
                observacoes: 'Cliente VIP, preferência por horários da manhã'
            }
        ];

        clientesExemplo.forEach(cliente => this.addCliente(cliente));

        // Produtos de exemplo
        const produtosExemplo = [
            {
                nome: 'Sérum Vitamina C',
                categoria: 'Cosméticos',
                quantidade: 15,
                estoqueMinimo: 5,
                preco: 89.90,
                descricao: 'Sérum antioxidante para tratamento facial'
            },
            {
                nome: 'Creme Hidratante Facial',
                categoria: 'Cosméticos',
                quantidade: 8,
                estoqueMinimo: 10,
                preco: 65.00,
                descricao: 'Hidratante para todos os tipos de pele'
            },
            {
                nome: 'Máscara de Argila',
                categoria: 'Tratamento',
                quantidade: 20,
                estoqueMinimo: 8,
                preco: 45.00,
                descricao: 'Máscara purificante para peles oleosas'
            }
        ];

        produtosExemplo.forEach(produto => this.addProduto(produto));
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
function exportRelatoriGeral() {
    try {
        const wb = XLSX.utils.book_new();
        
        // Dados do dashboard
        const stats = esteticaFabiane.getDashboardStats();
        const dashboardData = [
            ['Relatório Geral - Estética Fabiane Procópio'],
            ['Data:', new Date().toLocaleDateString('pt-BR')],
            [''],
            ['ESTATÍSTICAS GERAIS'],
            ['Total de Clientes:', stats.totalClientes],
            ['Total de Agendamentos:', stats.totalAgendamentos],
            ['Total de Serviços:', stats.totalServicos],
            ['Total de Produtos:', stats.totalProdutos],
            [''],
            ['RESUMO FINANCEIRO'],
            ['Receita Total (Estimada):', 'R$ ' + stats.receitaTotal.toFixed(2)]
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(dashboardData);
        
        // Aplicar estilos
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = XLSX.utils.encode_cell({c: C, r: R});
                if (!ws[cell_address]) continue;
                
                if (R === 0) { // Título
                    ws[cell_address].s = {
                        font: { bold: true, sz: 16, color: { rgb: "E91E63" } },
                        alignment: { horizontal: "center" }
                    };
                } else if (R === 3 || R === 9) { // Seções
                    ws[cell_address].s = {
                        font: { bold: true, sz: 12, color: { rgb: "E91E63" } },
                        fill: { fgColor: { rgb: "FCE4EC" } }
                    };
                }
            }
        }
        
        ws['!cols'] = [{ width: 30 }, { width: 20 }];
        
        XLSX.utils.book_append_sheet(wb, ws, "Relatório Geral");
        XLSX.writeFile(wb, `Relatorio_Geral_Estetica_Fabiane_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        esteticaFabiane.showNotification('Relatório geral exportado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao exportar relatório:', error);
        esteticaFabiane.showNotification('Erro ao exportar relatório. Verifique se a biblioteca XLSX está carregada.', 'error');
    }
}

function exportRelatorioDetalhado() {
    try {
        const wb = XLSX.utils.book_new();
        
        // Planilha de Clientes
        const clientes = esteticaFabiane.getData('clientes');
        const clientesData = [
            ['CLIENTES'],
            ['Nome', 'Telefone', 'Email', 'Data de Nascimento', 'Endereço'],
            ...clientes.map(cliente => [
                cliente.nome,
                cliente.telefone,
                cliente.email,
                cliente.dataNascimento,
                cliente.endereco
            ])
        ];
        
        const wsClientes = XLSX.utils.aoa_to_sheet(clientesData);
        wsClientes['!cols'] = [{ width: 25 }, { width: 15 }, { width: 30 }, { width: 15 }, { width: 40 }];
        XLSX.utils.book_append_sheet(wb, wsClientes, "Clientes");
        
        // Planilha de Agendamentos
        const agendamentos = esteticaFabiane.getData('agendamentos');
        const agendamentosData = [
            ['AGENDAMENTOS'],
            ['Cliente', 'Serviço', 'Data', 'Horário', 'Status', 'Observações'],
            ...agendamentos.map(agendamento => [
                agendamento.cliente,
                agendamento.servico,
                agendamento.data,
                agendamento.horario,
                agendamento.status,
                agendamento.observacoes || ''
            ])
        ];
        
        const wsAgendamentos = XLSX.utils.aoa_to_sheet(agendamentosData);
        wsAgendamentos['!cols'] = [{ width: 25 }, { width: 30 }, { width: 12 }, { width: 10 }, { width: 15 }, { width: 40 }];
        XLSX.utils.book_append_sheet(wb, wsAgendamentos, "Agendamentos");
        
        // Planilha de Serviços
        const servicos = esteticaFabiane.getData('servicos');
        const servicosData = [
            ['SERVIÇOS'],
            ['Nome', 'Descrição', 'Preço', 'Duração'],
            ...servicos.map(servico => [
                servico.nome,
                servico.descricao,
                'R$ ' + servico.preco.toFixed(2),
                servico.duracao + ' min'
            ])
        ];
        
        const wsServicos = XLSX.utils.aoa_to_sheet(servicosData);
        wsServicos['!cols'] = [{ width: 30 }, { width: 50 }, { width: 15 }, { width: 15 }];
        XLSX.utils.book_append_sheet(wb, wsServicos, "Serviços");
        
        // Planilha de Produtos
        const produtos = esteticaFabiane.getData('produtos');
        const produtosData = [
            ['PRODUTOS'],
            ['Nome', 'Categoria', 'Preço', 'Estoque', 'Fornecedor'],
            ...produtos.map(produto => [
                produto.nome,
                produto.categoria,
                'R$ ' + produto.preco.toFixed(2),
                produto.estoque,
                produto.fornecedor
            ])
        ];
        
        const wsProdutos = XLSX.utils.aoa_to_sheet(produtosData);
        wsProdutos['!cols'] = [{ width: 30 }, { width: 20 }, { width: 15 }, { width: 10 }, { width: 25 }];
        XLSX.utils.book_append_sheet(wb, wsProdutos, "Produtos");
        
        // Aplicar estilos aos cabeçalhos
        [wsClientes, wsAgendamentos, wsServicos, wsProdutos].forEach(ws => {
            const range = XLSX.utils.decode_range(ws['!ref']);
            for (let C = range.s.c; C <= range.e.c; ++C) {
                // Título (linha 0)
                const titleCell = XLSX.utils.encode_cell({c: C, r: 0});
                if (ws[titleCell]) {
                    ws[titleCell].s = {
                        font: { bold: true, sz: 14, color: { rgb: "E91E63" } },
                        alignment: { horizontal: "center" },
                        fill: { fgColor: { rgb: "FCE4EC" } }
                    };
                }
                
                // Cabeçalho (linha 1)
                const headerCell = XLSX.utils.encode_cell({c: C, r: 1});
                if (ws[headerCell]) {
                    ws[headerCell].s = {
                        font: { bold: true, color: { rgb: "FFFFFF" } },
                        fill: { fgColor: { rgb: "E91E63" } },
                        alignment: { horizontal: "center" }
                    };
                }
            }
        });
        
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
    esteticaFabiane.initializeExampleData();
    
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