document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("formLoja");
  const tabela = document.querySelector("#tabelaLojas tbody");
  const lojaIdInput = document.getElementById("lojaId");
  const dataPath = "data/lojas.json";

  const getLojas = () => JSON.parse(localStorage.getItem("lojasAfiliadas") || "[]");
  const setLojas = (lojas) => localStorage.setItem("lojasAfiliadas", JSON.stringify(lojas));

  async function carregarLojas() {
    let lojas = getLojas();
    if (lojas.length === 0) {
      try {
        const response = await fetch(dataPath);
        lojas = await response.json();
        setLojas(lojas);
      } catch (error) {
        console.error("Erro ao carregar lojas.json:", error);
      }
    }
    renderLojas();
  }

  function renderLojas() {
    const lojas = getLojas();
    tabela.innerHTML = "";

    if (lojas.length === 0) {
      tabela.innerHTML = `<tr><td colspan="8" style="text-align:center;color:gray;">Nenhuma loja cadastrada</td></tr>`;
      return;
    }

    lojas.forEach((loja, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${loja.id}</td>
        <td>${loja.nome}</td>
        <td>${loja.filial}</td>
        <td>${loja.endereco}</td>
        <td>${loja.servicos}</td>
        <td>${loja.responsavel}</td>
        <td>${loja.contato}</td>
        <td>
          <button class="btn-editar" onclick="editarLoja(${i})">Editar</button>
          <button class="btn-excluir" onclick="excluirLoja(${i})">Excluir</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const lojas = getLojas();

    const loja = {
      id: lojaIdInput.value ? parseInt(lojaIdInput.value) : Date.now(),
      nome: document.getElementById("nomeLoja").value.trim(),
      filial: document.getElementById("filial").value.trim(),
      endereco: document.getElementById("endereco").value.trim(),
      servicos: document.getElementById("servicos").value.trim(),
      responsavel: document.getElementById("responsavel").value.trim(),
      contato: document.getElementById("contato").value.trim()
    };

    if (lojaIdInput.value) {
      const index = lojas.findIndex(l => l.id === parseInt(lojaIdInput.value));
      lojas[index] = loja;
    } else {
      lojas.push(loja);
    }

    setLojas(lojas);
    form.reset();
    lojaIdInput.value = "";
    renderLojas();
  });

  window.editarLoja = (index) => {
    const loja = getLojas()[index];
    lojaIdInput.value = loja.id;
    document.getElementById("nomeLoja").value = loja.nome;
    document.getElementById("filial").value = loja.filial;
    document.getElementById("endereco").value = loja.endereco;
    document.getElementById("servicos").value = loja.servicos;
    document.getElementById("responsavel").value = loja.responsavel;
    document.getElementById("contato").value = loja.contato;
  };

  window.excluirLoja = (index) => {
    if (confirm("Deseja realmente excluir esta loja?")) {
      const lojas = getLojas();
      lojas.splice(index, 1);
      setLojas(lojas);
      renderLojas();
    }
  };

  await carregarLojas();
});
