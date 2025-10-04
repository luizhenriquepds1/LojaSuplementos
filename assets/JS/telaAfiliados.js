class Afiliado {
    constructor(id, nome, telefone, email, produto, comissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.produto = produto;
        this.comissao = comissao;
    }
}

class AfiliadoService {
    constructor() {
        this.url = 'data/afiliados.json';
        this.afiliados = [];
    }

    async carregarAfiliados() {
        try {
            const response = await fetch(this.url);
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados dos afiliados.');
            }
            this.afiliados = await response.json();
        } catch (error) {
            console.error(error);
            this.afiliados = []; // Se falhar, inicializa como array vazio
        }
    }

    async salvarAfiliado(afiliado) {
        if (!afiliado.id) {
            // Novo afiliado
            afiliado.id = this.afiliados.length > 0 ? Math.max(...this.afiliados.map(a => a.id)) + 1 : 1;
            this.afiliados.push(afiliado);
        } else {
            // Edição
            const index = this.afiliados.findIndex(a => a.id === afiliado.id);
            if (index !== -1) {
                this.afiliados[index] = afiliado;
            }
        }
        await this.sincronizarDados();
    }

    async excluirAfiliado(id) {
        this.afiliados = this.afiliados.filter(afiliado => afiliado.id !== id);
        await this.sincronizarDados();
    }

    async sincronizarDados() {
        // Simulação de salvar no arquivo JSON.
        // Em um ambiente real, você faria uma requisição POST/PUT para um backend.
        // Por ser um projeto local, simulamos a atualização.
        // O código abaixo não salva no arquivo físico, pois JS do navegador não tem acesso ao sistema de arquivos.
        // Ele apenas atualiza o estado interno da aplicação.
        console.log('Dados atualizados:', JSON.stringify(this.afiliados, null, 2));
    }
}

class AfiliadoUI {
    constructor() {
        this.form = document.getElementById('afiliado-form');
        this.tabelaBody = document.querySelector('#tabela-afiliados tbody');
        this.afiliadoService = new AfiliadoService();
        this.afiliadoService.carregarAfiliados().then(() => this.renderizarTabela());

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.tabelaBody.addEventListener('click', (e) => this.handleTabelaClick(e));
    }

    renderizarTabela() {
        this.tabelaBody.innerHTML = '';
        this.afiliadoService.afiliados.forEach(afiliado => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${afiliado.id}</td>
                <td>${afiliado.nome}</td>
                <td>${afiliado.telefone}</td>
                <td>${afiliado.email}</td>
                <td>${afiliado.produto}</td>
                <td>${afiliado.comissao}%</td>
                <td>
                    <button class="btn-editar" data-id="${afiliado.id}">Editar</button>
                    <button class="btn-excluir" data-id="${afiliado.id}">Excluir</button>
                </td>
            `;
            this.tabelaBody.appendChild(row);
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const id = document.getElementById('afiliado-id').value;
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;
        const produto = document.getElementById('produto').value;
        const comissao = parseFloat(document.getElementById('comissao').value);

        const afiliado = new Afiliado(id ? parseInt(id) : null, nome, telefone, email, produto, comissao);

        this.afiliadoService.salvarAfiliado(afiliado).then(() => {
            this.renderizarTabela();
            this.form.reset();
            document.getElementById('afiliado-id').value = '';
        });
    }

    handleTabelaClick(e) {
        if (e.target.classList.contains('btn-editar')) {
            const id = parseInt(e.target.dataset.id);
            const afiliado = this.afiliadoService.afiliados.find(a => a.id === id);
            if (afiliado) {
                document.getElementById('afiliado-id').value = afiliado.id;
                document.getElementById('nome').value = afiliado.nome;
                document.getElementById('telefone').value = afiliado.telefone;
                document.getElementById('email').value = afiliado.email;
                document.getElementById('produto').value = afiliado.produto;
                document.getElementById('comissao').value = afiliado.comissao;
            }
        } else if (e.target.classList.contains('btn-excluir')) {
            const id = parseInt(e.target.dataset.id);
            if (confirm('Tem certeza que deseja excluir este afiliado?')) {
                this.afiliadoService.excluirAfiliado(id).then(() => this.renderizarTabela());
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AfiliadoUI();
});