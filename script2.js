const inputTexto = document.querySelector("#input-texto");
const selectPrioridade = document.querySelector("#select-prioridade");
const btnAdicionar = document.querySelector("#btn-adicionar");
const listaLembretes = document.querySelector("#lista-lembretes");
const msgErro = document.querySelector("#msg-erro");
const btnTheme = document.querySelector("#btn-dark-mode");

const PRIORIDADE_PADRAO = "baixa";

document.addEventListener("DOMContentLoaded", () => {
  carregarLembretes();
  carregarTema();
});

function alternarTema() {
  const isDarkMode = document.body.classList.toggle("dark-mode");

  localStorage.setItem("dark-mode", isDarkMode);

  btnTheme.textContent = isDarkMode ? "☀️" : "🌙";
}

function carregarTema() {
  const temaSalvo = localStorage.getItem("dark-mode");

  if (temaSalvo === "true") {
    document.body.classList.add("dark-mode");
    btnTheme.textContent = "☀️";
  } else {
    btnTheme.textContent = " 🌙";
  }
}

// ==========================================
//   LOCAL STORAGE
// ==========================================

function obterLembretesSalvos() {
  return JSON.parse(localStorage.getItem("lembretes")) || [];
}

function salvarLembretes(lembretes) {
  localStorage.setItem("lembretes", JSON.stringify(lembretes));

  console.log(
    "IDs salvos no localStorage:",
    lembretes.map((lembrete) => lembrete.ID_Lembrete),
  );
}

// ================================================
// FIM LOCAL STORAGE
// ================================================

// ========================================
// ADICIONAR LEMBRETE
// ========================================

function adicionarLembrete() {
  const texto = inputTexto.value;
  const prioridade = selectPrioridade.value || PRIORIDADE_PADRAO;

  // Verifica se o campo está vazio assim quando o usuário digitar
  if (texto === "") {
    msgErro.textContent = "Por favor, digite a descrição de lembrete!";

    inputTexto.focus();

    return;
  }

  msgErro.textContent = "";

  // Cria o novo lembrete

  const novoLembrete = {
    ID_Lembrete: Date.now(),
    Descricao: texto,
    Prioridade: prioridade,
  };

  // Busca os lembretes existentes
  const lembretes = obterLembretesSalvos();

  // Adiciona o novo lembrete
  lembretes.push(novoLembrete);

  // Salva no localStorage
  salvarLembretes(lembretes);

  // Mostra no console.log
  console.log("Novo lembrete adicionado:", novoLembrete);
  console.log("ID do novo lembrete:", novoLembrete.ID_Lembrete);
  console.log("Descrição:", novoLembrete.Descricao);
  console.log("Prioridade:", novoLembrete.Prioridade);

  // Cria o card na tela imediatamente
  const card = criarCardLembrete(novoLembrete);

  listaLembretes.appendChild(card);

  // Limpa o campo
  inputTexto.value = "";

  // Volta a prioridade para Baixa
  selectPrioridade.value = PRIORIDADE_PADRAO;

  // Coloca o cursor novamente no campo

  inputTexto.focus();
}

// ============================================
// FIM ADCIONAR LEMBRETE
// ========================================

function criarCardLembrete(lembrete) {
  const card = document.createElement("div");

  card.classList.add("card-item", lembrete.Prioridade);

  const infoWrapper = document.createElement("div");

  const paragrafo = document.createElement("p");

  const strong = document.createElement("strong");

  strong.textContent = lembrete.Descricao;

  paragrafo.appendChild(strong);

  const pequeno = document.createElement("small");

  pequeno.textContent = `Prioridade: ${lembrete.Prioridade.toUpperCase()}`;

  infoWrapper.append(paragrafo, pequeno);

  const btnDeletar = document.createElement("button");

  btnDeletar.type = "button";

  btnDeletar.classList.add("btn-deletar");

  btnDeletar.textContent = "Excluir";

  btnDeletar.setAttribute(
    "aria-label",
    `Excluir lembrete: ${lembrete.Descricao}`,
  );

  btnDeletar.addEventListener("click", () => {
    deletarLembreteDoStorage(lembrete.ID_Lembrete);

    card.remove();
  });

  card.append(infoWrapper, btnDeletar);

  return card;
}

function deletarLembreteDoStorage(id) {
  let lembretes = obterLembretesSalvos();
  lembretes = lembretes.filter((lembrete) => lembrete.ID_Lembrete !== id);
  salvarLembretes(lembretes);

  // Adicione essa linha abaixo:
  carregarLembretes();
}

function carregarLembretes() {
  listaLembretes.innerHTML = "";

  const lembretes = obterLembretesSalvos();
  lembretes.forEach((lembrete) => {
    const card = criarCardLembrete(lembrete);
    listaLembretes.appendChild(card);
  });
}

btnTheme.addEventListener("click", alternarTema);

btnAdicionar.addEventListener("click", adicionarLembrete);

inputTexto.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    evento.preventDefault();
    adicionarLembrete();
  }
});

inputTexto.addEventListener("input", () => {
  if (msgErro.textContent) msgErro.textContent = "";
});
