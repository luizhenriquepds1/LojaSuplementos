
const map = L.map('map').setView([-8.05, -34.9], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


async function carregarAfiliados() {
  try {
    const response = await fetch('data/afiliados.json');
    const afiliados = await response.json();

    let totalVendas = 0;
    const lista = document.getElementById('listaAfiliados');

    afiliados.forEach(a => {
      
      const valorVendas = Math.floor(Math.random() * 5000) + 500;
      totalVendas += valorVendas;

      
      const div = document.createElement('div');
      div.classList.add('afiliado');
      div.innerHTML = `
        <strong>${a.nome}</strong><br>
        Produto: ${a.produto}<br>
        Vendas: R$ ${valorVendas}<br>
        Comissão: ${a.comissao}%<br>
        Email: ${a.email}
      `;
      lista.appendChild(div);

      
      const lat = -8.05 + (Math.random() * 0.1 - 0.05);
      const lng = -34.9 + (Math.random() * 0.1 - 0.05);
      L.marker([lat, lng]).addTo(map).bindPopup(`<b>${a.nome}</b><br>${a.produto}`);
    });

    document.getElementById('valorTotal').innerText = 
      `Valor total mensal: R$ ${totalVendas.toLocaleString('pt-BR')}`;
  } catch (err) {
    console.error("Erro ao carregar afiliados:", err);
  }
}

carregarAfiliados();

const ctxBarra = document.getElementById('graficoBarra');
new Chart(ctxBarra, {
  type: 'bar',
  data: {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [{
      label: 'Vendas (R$)',
      data: [400, 600, 800, 1200],
      backgroundColor: 'rgba(212, 232, 110, 0.8)'
    }]
  }
});

const ctxLinha = document.getElementById('graficoLinha');
new Chart(ctxLinha, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr'],
    datasets: [{
      label: 'Tendência de Vendas',
      data: [500, 700, 900, 1200],
      borderColor: '#D4E86E',
      backgroundColor: 'rgba(212, 232, 110, 0.3)',
      fill: true
    }]
  }
});
