class Cupom {
    constructor(id, codigo, desconto, afiliadoId = null, afiliadoNome = '') {
        this.id = id;
        this.codigo = codigo;
        this.desconto = desconto;
        this.afiliadoId = afiliadoId;
        this.afiliadoNome = afiliadoNome;
    }
}

class CupomService {
    constructor() {
        this.urlCupons = 'data/cupons.json';
        this.urlAfiliados = 'data/afiliados.json';
        this.cupons = [];
        this.afiliados = [];
    }

    async carregarDados() {
        try {
            const [cuponsResponse, afiliadosResponse] = await Promise.all([
                fetch(this.urlCupons),
                fetch(this.urlAfiliados)
            ]);

            this.cupons = await cuponsResponse.json();
            this.afiliados = await afiliadosResponse.json();
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
            this.cupons = [];
            this.afiliados = [];
        }
    }

    async criarCupom(cupom) {
        cupom.id = this.cupons.length > 0 ? Math.max(...this.cupons.map(c => c.id)) + 1 : 1;
        this.cupons.push(cupom);
        await this.sincronizarDados();
    }

    async distribuirCupom(cupomId, afiliadoId) {
        const cupom = this.cupons.find(c => c.id === cupomId);
        const afiliado = this.afiliados.find(a => a.id === afiliadoId);

        if (cupom && afiliado) {
            cupom.afiliadoId = afiliado.id;
            cupom.afiliadoNome = afiliado.nome;
            await this.sincronizarDados();
            return true;
        }
        return false;
    }

    async sincronizarDados() {
        
        console.log('Dados de cupons atualizados:', JSON.stringify(this.cupons, null, 2));
    }
}

class CupomUI {
    constructor() {
        this.cupomService = new CupomService();
        this.form = document.getElementById('cupom-form');
        this.selectCupom = document.getElementById('select-cupom');
        this.selectAfiliado = document.getElementById('select-afiliado');
        this.btnDistribuir = document.getElementById('btn-distribuir');
        this.tabelaBody = document.querySelector('#tabela-cupons tbody');

        this.init();
    }

    async init() {
        await this.cupomService.carregarDados();
        this.renderizarSelects();
        this.renderizarTabela();
        this.addEventListeners();
    }

    renderizarSelects() {
        this.selectAfiliado.innerHTML = '<option value="" disabled selected>Selecione um afiliado</option>';
        this.cupomService.afiliados.forEach(afiliado => {
            const option = document.createElement('option');
            option.value = afiliado.id;
            option.textContent = afiliado.nome;
            this.selectAfiliado.appendChild(option);
        });

        this.selectCupom.innerHTML = '<option value="" disabled selected>Selecione um cupom</option>';
        const cuponsNaoDistribuidos = this.cupomService.cupons.filter(c => !c.afiliadoId);
        cuponsNaoDistribuidos.forEach(cupom => {
            const option = document.createElement('option');
            option.value = cupom.id;
            option.textContent = cupom.codigo;
            this.selectCupom.appendChild(option);
        });
    }

    renderizarTabela() {
        this.tabelaBody.innerHTML = '';
        this.cupomService.cupons.forEach(cupom => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cupom.id}</td>
                <td>${cupom.codigo}</td>
                <td>${cupom.desconto}%</td>
                <td>${cupom.afiliadoNome || 'Não Distribuído'}</td>
            `;
            this.tabelaBody.appendChild(row);
        });
    }

    addEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleCriarCupom(e));
        this.btnDistribuir.addEventListener('click', () => this.handleDistribuirCupom());
    }

    handleCriarCupom(e) {
        e.preventDefault();
        const codigo = document.getElementById('codigo').value;
        const desconto = parseFloat(document.getElementById('desconto').value);

        if (codigo && desconto) {
            const novoCupom = new Cupom(null, codigo, desconto);
            this.cupomService.criarCupom(novoCupom).then(() => {
                this.renderizarSelects();
                this.renderizarTabela();
                this.form.reset();
            });
        }
    }

    handleDistribuirCupom() {
        const cupomId = parseInt(this.selectCupom.value);
        const afiliadoId = parseInt(this.selectAfiliado.value);

        if (cupomId && afiliadoId) {
            this.cupomService.distribuirCupom(cupomId, afiliadoId).then(sucesso => {
                if (sucesso) {
                    alert('Cupom distribuído com sucesso!');
                    this.renderizarSelects();
                    this.renderizarTabela();
                } else {
                    alert('Falha na distribuição. Verifique os dados.');
                }
            });
        } else {
            alert('Por favor, selecione um cupom e um afiliado.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CupomUI();
});