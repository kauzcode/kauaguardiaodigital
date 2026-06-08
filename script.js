const dicasDoRodape = [
    "Nunca compartilhe códigos de verificação recebidos por SMS.",
    "Banco não pede senha completa por WhatsApp.",
    "Pedido de dinheiro com pressa precisa ser confirmado fora da conversa.",
    "Antes de clicar, olhe o endereço do link com calma.",
    "Se a mensagem parece boa demais, desconfie.",
    "Código de login é pessoal. Não envie para ninguém.",
    "Print da conversa ajuda caso você precise pedir orientação depois."
];

const campoDica = document.getElementById("securityTip");
if (campoDica) campoDica.textContent = dicasDoRodape[Math.floor(Math.random() * dicasDoRodape.length)];

const botaoAnalise = document.getElementById("analyzeBtn");
const caixaMensagem = document.getElementById("messageInput");
const areaResultado = document.getElementById("result");
const campoPontuacao = document.getElementById("scoreValue");
const campoRisco = document.getElementById("riskLevel");
const listaSinais = document.getElementById("signalsList");
const blocoExplicacao = document.getElementById("explanations");
const termosDetectados = document.getElementById("detectedTerms");

const termosGolpe = {
    pressa: {
        peso: 15,
        nome: "Pressa na mensagem",
        texto: "A mensagem tenta fazer você agir rápido demais.",
        palavras: [
            "urgente", "imediatamente", "agora mesmo", "ultima chance", "última chance",
            "ultimo aviso", "último aviso", "responda agora", "prazo final", "clique agora",
            "regularize agora", "nao perca", "não perca", "acesse agora", "resgate agora",
            "libere agora", "confirme agora", "validar agora", "24 horas", "em ate 24h",
            "evite bloqueio", "acao necessaria", "ação necessária"
        ]
    },

    medo: {
        peso: 25,
        nome: "Ameaça ou bloqueio",
        texto: "Golpes costumam usar medo de bloqueio, multa ou problema na conta.",
        palavras: [
            "conta bloqueada", "conta suspensa", "cpf irregular", "processo judicial",
            "multa pendente", "acesso suspenso", "restricao no cpf", "restrição no cpf",
            "pendencia financeira", "pendência financeira", "dados comprometidos",
            "cartao bloqueado", "cartão bloqueado", "compra suspeita", "tentativa de acesso",
            "sua conta sera bloqueada", "seu cpf sera negativado", "bloqueio imediato",
            "suspensao da conta", "suspensão da conta", "divida ativa", "dívida ativa"
        ]
    },

    documentos: {
        peso: 35,
        nome: "Pedido de dados sensíveis",
        texto: "Senha, CPF, token e código de verificação não devem ser enviados por mensagem.",
        palavras: [
            "informe sua senha", "confirme sua senha", "atualize seus dados",
            "confirme seus dados", "envie seu cpf", "envie seu rg", "codigo de verificacao",
            "código de verificação", "token de acesso", "dados bancarios", "dados bancários",
            "dados pessoais", "numero do cartao", "número do cartão", "cvv", "codigo sms",
            "código sms", "selfie com documento", "foto do documento", "validar identidade",
            "senha de acesso", "codigo de seguranca", "código de segurança"
        ]
    },

    dinheiroRapido: {
        peso: 25,
        nome: "PIX ou transferência",
        texto: "Transferências rápidas aumentam o risco de prejuízo se a mensagem for falsa.",
        palavras: [
            "pix", "chave pix", "transferencia pix", "transferência pix", "estorno pix",
            "pagamento via pix", "pagamento pendente", "envie o comprovante",
            "faca a transferencia", "faça a transferência", "comprovante pix",
            "taxa de liberacao", "taxa de liberação", "deposito antecipado", "depósito antecipado",
            "pagamento antecipado", "mande o pix", "faz um pix", "valor pendente"
        ]
    },

    premio: {
        peso: 30,
        nome: "Prêmio ou vantagem inesperada",
        texto: "Promessa de prêmio, sorteio ou dinheiro sem contexto é sinal forte de alerta.",
        palavras: [
            "voce ganhou", "você ganhou", "ganhou", "premiado", "parabens", "parabéns",
            "sorteado", "foi sorteado", "premio", "prêmio", "recompensa", "bonus", "bônus",
            "dinheiro facil", "dinheiro fácil", "renda garantida", "saque disponivel",
            "saque disponível", "liberacao imediata", "liberação imediata", "resgatar premio",
            "resgatar prêmio", "beneficio liberado", "benefício liberado", "saldo disponível",
            "saldo disponivel", "oferta exclusiva", "presente especial"
        ]
    },

    banco: {
        peso: 20,
        nome: "Falso banco ou instituição",
        texto: "Mensagens que fingem ser de banco precisam ser conferidas apenas em canais oficiais.",
        palavras: [
            "banco central", "nubank", "itau", "itaú", "bradesco", "santander", "caixa",
            "banco do brasil", "inter", "picpay", "mercado pago", "serasa", "receita federal",
            "gov.br", "agencia bancaria", "agência bancária", "central de seguranca",
            "central de segurança"
        ]
    }
};

function normalizar(txt) {
    return txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function acharTermos(mensagem, lista) {
    return lista.filter(palavra => mensagem.includes(normalizar(palavra)));
}

function temValorEmDinheiro(mensagem) {
    return /r\$\s?\d+|\d+\s?(reais|real)|\d+\s?mil|\d+[.,]\d{2}/i.test(mensagem);
}

function mensagemTemLink(mensagem) {
    return mensagem.includes("http://") ||
        mensagem.includes("https://") ||
        ["bit.ly", "tinyurl", "t.co", "goo.gl", "rebrand.ly", ".click", ".top"].some(x => mensagem.includes(x));
}

function pareceGritado(original) {
    const letras = original.replace(/[^a-zA-ZÀ-ÿ]/g, "");
    if (letras.length < 12) return false;

    const maiusculas = letras.replace(/[^A-ZÀ-Ý]/g, "");
    return maiusculas.length / letras.length >= 0.75;
}

function nivel(pontos) {
    if (pontos <= 20) return {
        classe: "low-risk",
        mensagem: "🟢 Baixo Risco — poucos sinais comuns de golpe foram encontrados."
    };

    if (pontos <= 49) return {
        classe: "medium-risk",
        mensagem: "🟡 Atenção — há sinais que precisam ser verificados."
    };

    if (pontos <= 79) return {
        classe: "medium-risk",
        mensagem: "🟠 Suspeito — a mensagem junta elementos comuns em golpes."
    };

    return {
        classe: "high-risk",
        mensagem: "🔴 Alto Risco — vários sinais fortes apareceram na análise."
    };
}

function add(lista, explicacoes, nome, pontos, texto) {
    lista.push(`${nome} (+${pontos})`);
    explicacoes.push(texto);
}

function analisarMensagemRecebida() {
    const original = caixaMensagem.value.trim();
    const mensagem = normalizar(original);

    if (!mensagem) {
        alert("Campo vazio.");
        return;
    }

    let pontos = 0;
    const sinais = [];
    const explicacoes = [];
    const detectados = [];

    Object.keys(termosGolpe).forEach(chave => {
        const regra = termosGolpe[chave];
        const achados = acharTermos(mensagem, regra.palavras);

        if (achados.length) {
            pontos += regra.peso;
            add(sinais, explicacoes, regra.nome, regra.peso, regra.texto);
            detectados.push(...achados);
        }
    });

    const link = mensagemTemLink(mensagem);
    const valor = temValorEmDinheiro(mensagem);
    const premio = acharTermos(mensagem, termosGolpe.premio.palavras).length > 0;
    const pix = acharTermos(mensagem, termosGolpe.dinheiroRapido.palavras).length > 0;
    const dado = ["cpf", "senha", "token", "codigo", "código", "cartao", "cartão"].some(t => mensagem.includes(normalizar(t)));

    if (link) {
        pontos += 20;
        add(sinais, explicacoes, "Link na mensagem", 20, "Links recebidos por mensagem podem levar para páginas falsas.");
        detectados.push("link");
    }

    if (valor) {
        pontos += 15;
        add(sinais, explicacoes, "Valor em dinheiro", 15, "Valores em dinheiro aumentam o risco quando aparecem junto de prêmio, cobrança ou transferência.");
        detectados.push("valor em dinheiro");
    }

    if (pareceGritado(original)) {
        pontos += 10;
        add(sinais, explicacoes, "Texto em caixa alta", 10, "Texto em caixa alta costuma ser usado para chamar atenção.");
        detectados.push("caixa alta");
    }

    if (premio && valor) {
        pontos += 25;
        add(sinais, explicacoes, "Prêmio envolvendo dinheiro", 25, "Promessa de dinheiro inesperado é um padrão comum em golpe.");
    }

    if (premio && link) {
        pontos += 25;
        add(sinais, explicacoes, "Prêmio com link", 25, "Premiação acompanhada de link externo merece verificação cuidadosa.");
    }

    if (dado && link) {
        pontos += 25;
        add(sinais, explicacoes, "Dado sensível com link", 25, "Pedido de dado pessoal junto com link é um sinal forte de risco.");
    }

    if (pix && acharTermos(mensagem, ["agora", "urgente", "rapido", "rápido", "imediatamente"]).length) {
        pontos += 20;
        add(sinais, explicacoes, "Pagamento com pressa", 20, "Pressa para pagamento é comum em fraude financeira.");
    }

    mostrarResultado(pontos, sinais, explicacoes, detectados);
}

function mostrarResultado(pontos, sinais, explicacoes, detectados) {
    const risco = nivel(pontos);

    campoPontuacao.textContent = pontos;
    campoRisco.innerHTML = `<div class="${risco.classe}">${risco.mensagem}</div>`;

    listaSinais.innerHTML = sinais.length
        ? sinais.map(s => `<li>${s}</li>`).join("")
        : "<li>Nenhum sinal cadastrado foi encontrado nessa mensagem.</li>";

    blocoExplicacao.innerHTML = explicacoes.length
        ? explicacoes.map(e => `<p style="margin-bottom:15px">${e}</p>`).join("")
        : "<p>Nenhum padrão de risco foi encontrado pelas regras atuais.</p><p>Mesmo assim, confira remetente, links, pedidos de dados e qualquer cobrança inesperada.</p>";

    if (termosDetectados) {
        const unicos = [...new Set(detectados)].slice(0, 18);

        termosDetectados.innerHTML = unicos.length
            ? unicos.map(t => `<span class="detected-tag">${t}</span>`).join("")
            : "<span class='detected-tag'>Nenhum termo específico</span>";
    }

    areaResultado.classList.remove("hidden");
    areaResultado.scrollIntoView({ behavior: "smooth", block: "start" });
}

botaoAnalise.addEventListener("click", analisarMensagemRecebida);

caixaMensagem.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "Enter") analisarMensagemRecebida();
});

document.querySelectorAll('a[href^="#"]').forEach(itemMenu => {
    itemMenu.addEventListener("click", e => {
        e.preventDefault();

        const destino = document.querySelector(itemMenu.getAttribute("href"));
        if (destino) destino.scrollIntoView({ behavior: "smooth" });
    });
});
