
/* ================================= */
/* FILTROS, PESQUISA E ORDENAÇÃO */
/* ================================= */

const botoes = document.querySelectorAll(".categoria");
const viaturas = document.querySelectorAll(".cartao");
const pesquisa = document.querySelector("#pesquisaViatura");
const ordenarPreco = document.querySelector("#ordenarPreco");
const listaViaturas = document.querySelector(".lista-viaturas");

if (listaViaturas && pesquisa && ordenarPreco) {

    let filtroSelecionado = "todos";

    // Guardar a ordem original
    const ordemOriginal = Array.from(
        listaViaturas.querySelectorAll(".cartao")
    );

    // Mostrar as viaturas
    function atualizarViaturas() {

        const textoPesquisa = pesquisa.value.toLowerCase();

        viaturas.forEach(viatura => {

            const categoria = viatura.getAttribute("data-categoria");
            const nome = viatura.querySelector("h3").textContent.toLowerCase();

            const correspondeCategoria =
                filtroSelecionado === "todos" ||
                categoria === filtroSelecionado;

            const correspondePesquisa =
                nome.includes(textoPesquisa);

            viatura.style.display =
                correspondeCategoria && correspondePesquisa
                ? "block"
                : "none";

        });
    }

    // Filtros
    botoes.forEach(botao => {

        botao.addEventListener("click", function() {

            filtroSelecionado = this.getAttribute("data-filtro");

            botoes.forEach(b => b.classList.remove("ativa"));

            this.classList.add("ativa");

            atualizarViaturas();

        });

    });

    // Pesquisa
    pesquisa.addEventListener("input", atualizarViaturas);

    // Ordenação
    ordenarPreco.addEventListener("change", function() {

        const cartoes = Array.from(
            listaViaturas.querySelectorAll(".cartao")
        );

        if (this.value === "menor") {

            cartoes.sort((a, b) => {
                const precoA = parseFloat(a.querySelector("p").textContent);
                const precoB = parseFloat(b.querySelector("p").textContent);
                return precoA - precoB;
            });

        } else if (this.value === "maior") {

            cartoes.sort((a, b) => {
                const precoA = parseFloat(a.querySelector("p").textContent);
                const precoB = parseFloat(b.querySelector("p").textContent);
                return precoB - precoA;
            });

        } else {

            cartoes.splice(0, cartoes.length, ...ordemOriginal);

        }

        cartoes.forEach(cartao => {
            listaViaturas.appendChild(cartao);
        });

        atualizarViaturas();

    });

}



/* ================================= */
/* CALCULADORA DE RESERVAS */
/* ================================= */

const formReserva = document.querySelector("#formReserva");

if (formReserva) {

    const viatura = document.querySelector("#viatura");
    const levantamento = document.querySelector("#dataLevantamento");
    const devolucao = document.querySelector("#dataDevolucao");
    const precoTotal = document.querySelector("#precoTotal");
    const localReserva = document.querySelector("#localReserva");

    // RECEBER DADOS DA PESQUISA DA PÁGINA INICIAL

const parametros = new URLSearchParams(window.location.search);

const localRecebido = parametros.get("local");
const levantamentoRecebido = parametros.get("levantamento");
const devolucaoRecebida = parametros.get("devolucao");

if (localRecebido) {
    localReserva.value = localRecebido;
}

if (levantamentoRecebido) {
    levantamento.value = levantamentoRecebido;
}

if (devolucaoRecebida) {
    devolucao.value = devolucaoRecebida;
}

    // Impedir datas anteriores a hoje
    const hoje = new Date();
    hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());

    const dataAtual = hoje.toISOString().split("T")[0];

    levantamento.min = dataAtual;
    devolucao.min = dataAtual;

    // Calcular o preço
    function calcularPreco() {

        if (!viatura.value || !levantamento.value || !devolucao.value) {
            precoTotal.textContent = "0,00 €";
            return;
        }

        const dataInicio = new Date(levantamento.value + "T00:00:00");
        const dataFim = new Date(devolucao.value + "T00:00:00");

        const diferenca = dataFim - dataInicio;
        const dias = diferenca / (1000 * 60 * 60 * 24);

        if (dias <= 0) {
            precoTotal.textContent = "Data inválida";
            return;
        }

        const precoDiario = Number(viatura.value);
        const total = dias * precoDiario;

        precoTotal.textContent =
            total.toFixed(2).replace(".", ",") + " €";
    }

    // SELECIONAR AUTOMATICAMENTE A VIATURA
   
    const precoRecebido = parametros.get("viatura");

    if (precoRecebido) {
        viatura.value = precoRecebido;
        calcularPreco();
    }

    // Atualizar a data mínima de devolução
    levantamento.addEventListener("change", function() {

        devolucao.min = levantamento.value;

        if (devolucao.value && devolucao.value <= levantamento.value) {
            devolucao.value = "";
        }

        calcularPreco();
    });

    // Recalcular quando mudar a viatura ou a devolução
    viatura.addEventListener("change", calcularPreco);
    devolucao.addEventListener("change", calcularPreco);

    // Impedir envio com datas inválidas
    formReserva.addEventListener("submit", function(event) {

        event.preventDefault();

        if (!viatura.value || !levantamento.value || !devolucao.value) {
            alert("Preencha todos os campos da reserva.");
            return;
        }

        const inicio = new Date(levantamento.value + "T00:00:00");
        const fim = new Date(devolucao.value + "T00:00:00");

        if (fim <= inicio) {
            alert("A data de devolução deve ser posterior à data de levantamento.");
            return;
        }

        calcularPreco();

        alert("Reserva preenchida com sucesso! O pedido ainda não foi enviado para um servidor.");

    });

}


/* ================================= */
/* FORMULÁRIO DE CONTACTOS */
/* ================================= */

const formContacto = document.querySelector("#formContacto");

if (formContacto) {

    formContacto.addEventListener("submit", function(event) {

        event.preventDefault();

        const nome = document.querySelector("#nomeContacto").value;
        const email = document.querySelector("#emailContacto").value;
        const assunto = document.querySelector("#assuntoContacto").value;
        const mensagem = document.querySelector("#mensagemContacto").value;

        if (!nome || !email || !assunto || !mensagem) {

            alert("Por favor, preencha todos os campos.");

            return;
        }

        alert("Obrigado pelo seu contacto! A sua mensagem foi preenchida com sucesso.");

        formContacto.reset();

    });

}


/* ================================= */
/* MENU DE NAVEGAÇÃO MOBILE */
/* ================================= */

const botaoMenu = document.querySelector("#botaoMenu");
const menuNavegacao = document.querySelector("#menuNavegacao");

if (botaoMenu && menuNavegacao) {

    botaoMenu.addEventListener("click", function() {
        menuNavegacao.classList.toggle("menu-aberto");
    });

    window.addEventListener("resize", function() {

        if (window.innerWidth > 768) {
            menuNavegacao.classList.remove("menu-aberto");
        }

    });

}


/* ================================= */
/* PESQUISA DE VIATURAS NA PÁGINA INICIAL */
/* ================================= */

const formPesquisa = document.querySelector("#formPesquisa");

if (formPesquisa) {

    const local = document.querySelector("#localLevantamento");
    const levantamento = document.querySelector("#dataLevantamento");
    const devolucao = document.querySelector("#dataDevolucao");

    // Impedir a escolha de datas anteriores a hoje
    const hoje = new Date();
    hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());

    const dataAtual = hoje.toISOString().split("T")[0];

    levantamento.min = dataAtual;
    devolucao.min = dataAtual;

    // Atualizar a data mínima de devolução
    levantamento.addEventListener("change", function() {

        devolucao.min = levantamento.value;

        if (devolucao.value && devolucao.value <= levantamento.value) {
            devolucao.value = "";
        }

    });

    // Executar a pesquisa
    formPesquisa.addEventListener("submit", function(event) {

        event.preventDefault();

        const nomeLocal = local.value.trim();

        if (!nomeLocal || !levantamento.value || !devolucao.value) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        if (devolucao.value <= levantamento.value) {
            alert("A data de devolução deve ser posterior à data de levantamento.");
            return;
        }

        // Preparar os dados da pesquisa
        const parametros = new URLSearchParams();

        parametros.set("local", nomeLocal);
        parametros.set("levantamento", levantamento.value);
        parametros.set("devolucao", devolucao.value);

        // Encaminhar para a página de reservas
        window.location.href = "reservas.html?" + parametros.toString();

    });

}

