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
if (campoDica) {
    campoDica.textContent = dicasDoRodape[Math.floor(Math.random() * dicasDoRodape.length)];
}

const botaoAnalise = document.getElementById("analyzeBtn");
const caixaMensagem = document.getElementById("messageInput");
const areaResultado = document.getElementById("result");
const campoPontuacao = document.getElementById("scoreValue");
const campoRisco = document.getElementById("riskLevel");
const listaSinais = document.getElementById("signalsList");
const blocoExplicacao = document.getElementById("explanations");

const termosGolpe = {
    pressa: {
        peso: 15,
        nome: "Pressa na mensagem",
        texto: "A mensagem tenta fazer você agir rápido demais.",
        palavras: [
            "urgente", "imediatamente", "agora mesmo", "ultima chance", "última chance",
            "ultimo aviso", "último aviso", "responda agora", "prazo final",
            "clique agora", "regularize agora", "nao perca", "não perca"
        ]
    },

    medo: {
        peso: 25,
        nome: "Ameaça ou bloqueio",
        texto: "Golpes costumam usar medo de bloqueio, multa ou problema na conta.",
        palavras: [
            "conta bloqueada", "conta suspensa", "cpf irregular", "processo judicial",
            "multa pendente", "acesso suspenso", "restricao no cpf", "restrição no cpf",
            "pendencia financeira", "pendência financeira", "dados comprometidos"
        ]
    },

    documentos: {
        peso: 35,
        nome: "Pedido de dados sensíveis",
        texto: "Senha, CPF, token e código de verificação não devem ser enviados por mensagem.",
        palavras: [
            "informe sua senha", "confirme sua senha", "atualize seus dados",
            "confirme seus dados", "envie seu cpf", "envie seu rg", "codigo de verificacao",
            "código de verificação", "token de acesso", "dados bancarios",
            "dados bancários", "dados pessoais"
        ]
    },

    dinheiroRapido: {
        peso: 25,
        nome: "PIX ou transferência",
        texto: "Transferências rápidas aumentam o risco de prejuízo se a mensagem for falsa.",
        palavras: [
            "pix", "chave pix", "transferencia pix", "transferência pix", "estorno pix",
            "pagamento via pix", "pagamento pendente", "envie o comprovante",
            "faca a transferencia", "faça a transferência"
        ]
    },

    premio: {
        peso: 30,
        nome: "Prêmio ou vantagem inesperada",
        texto: "Promessa de prêmio, sorteio ou dinheiro sem contexto é sinal forte de alerta.",
        palavras: [
            "voce ganhou", "você ganhou", "ganhou", "sorteado", "foi sorteado",
            "premio", "prêmio", "recompensa", "bonus", "bônus",
            "dinheiro facil", "dinheiro fácil", "renda garantida",
            "saque disponivel", "saque disponível", "liberacao imediata", "liberação imediata"
        ]
    }
};

function textoBaseadoNaMensagem(valor) {
    return valor
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function temTermo(mensagem, grupo) {
    return grupo.some(palavra => mensagem.includes(textoBaseadoNaMensagem(palavra)));
}

function mensagemTemLink(mensagem) {
    const encurtadores = ["bit.ly", "tinyurl", "t.co", "goo.gl", "rebrand.ly", "encurtador.com"];
    return mensagem.includes("http://") || mensagem.includes("https://") || encurtadores.some(link => mensagem.includes(link));
}

function temValorEmDinheiro(mensagem) {
    return /r\$\s?\d+|\d+\s?(reais|real)|\d+\s?mil|\d+[.,]\d{2}/i.test(mensagem);
}

function pareceGritado(textoOriginal) {
    const letras = textoOriginal.replace(/[^a-zA-ZÀ-ÿ]/g, "");
    if (letras.length < 12) return false;

    const maiusculas = letras.replace(/[^A-ZÀ-Ý]/g, "");
    return maiusculas.length / letras.length >= 0.75;
}

function calcularNivel(pontos) {
    if (pontos <= 20) {
        return {
            classe: "low-risk",
            mensagem: "🟢 Baixo Risco — poucos sinais comuns de golpe foram encontrados."
        };
    }

    if (pontos <= 49) {
        return {
            classe: "medium-risk",
            mensagem: "🟡 Atenção — há sinais que precisam ser verificados."
        };
    }

    if (pontos <= 79) {
        return {
            classe: "medium-risk",
            mensagem: "🟠 Suspeito — a mensagem junta elementos comuns em golpes."
        };
    }

    return {
        classe: "high-risk",
        mensagem: "🔴 Alto Risco — vários sinais fortes apareceram na análise."
    };
}

function adicionarSinal(lista, explicacoes, nome, pontos, texto) {
    lista.push(`${nome} (+${pontos})`);
    explicacoes.push(texto);
}

function analisarMensagemRecebida() {
    const original = caixaMensagem.value.trim();
    const mensagem = textoBaseadoNaMensagem(original);

    if (!mensagem) {
        alert("Campo vazio.");
        return;
    }

    let pontos = 0;
    const sinais = [];
    const explicacoes = [];

    Object.keys(termosGolpe).forEach(chave => {
        const regra = termosGolpe[chave];

        if (temTermo(mensagem, regra.palavras)) {
            pontos += regra.peso;
            adicionarSinal(sinais, explicacoes, regra.nome, regra.peso, regra.texto);
        }
    });

    const achouLink = mensagemTemLink(mensagem);
    const achouValor = temValorEmDinheiro(mensagem);
    const achouPremio = temTermo(mensagem, termosGolpe.premio.palavras);
    const achouPix = temTermo(mensagem, termosGolpe.dinheiroRapido.palavras);
    const achouDado = temTermo(mensagem, ["cpf", "senha", "token", "codigo", "código"]);

    if (achouLink) {
        pontos += 20;
        adicionarSinal(sinais, explicacoes, "Link na mensagem", 20, "Links recebidos por mensagem podem levar para páginas falsas.");
    }

    if (achouValor) {
        pontos += 15;
        adicionarSinal(sinais, explicacoes, "Valor em dinheiro", 15, "Valores em dinheiro aumentam o risco quando aparecem junto de prêmio, cobrança ou transferência.");
    }

    if (pareceGritado(original)) {
        pontos += 10;
        adicionarSinal(sinais, explicacoes, "Texto em caixa alta", 10, "Texto em caixa alta costuma ser usado para chamar atenção e pressionar resposta.");
    }

    if (achouPremio && achouValor) {
        pontos += 25;
        adicionarSinal(sinais, explicacoes, "Prêmio envolvendo dinheiro", 25, "Promessa de dinheiro inesperado é um padrão bastante comum em golpe.");
    }

    if (achouPremio && achouLink) {
        pontos += 25;
        adicionarSinal(sinais, explicacoes, "Prêmio com link", 25, "Premiação acompanhada de link externo merece verificação cuidadosa.");
    }

    if (achouDado && achouLink) {
        pontos += 25;
        adicionarSinal(sinais, explicacoes, "Dado sensível com link", 25, "Pedido de dado pessoal junto com link é um sinal forte de risco.");
    }

    if (achouPix && temTermo(mensagem, ["agora", "urgente", "rapido", "rápido", "imediatamente"])) {
        pontos += 20;
        adicionarSinal(sinais, explicacoes, "Pagamento com pressa", 20, "Pressa para pagamento é comum em fraude financeira.");
    }

    mostrarResultado(pontos, sinais, explicacoes);
}

function mostrarResultado(pontos, sinais, explicacoes) {
    const risco = calcularNivel(pontos);

    campoPontuacao.textContent = pontos;
    campoRisco.innerHTML = `<div class="${risco.classe}">${risco.mensagem}</div>`;

    listaSinais.innerHTML = "";
    if (sinais.length === 0) {
        listaSinais.innerHTML = "<li>Nenhum sinal cadastrado foi encontrado nessa mensagem.</li>";
    } else {
        sinais.forEach(sinal => {
            const item = document.createElement("li");
            item.textContent = sinal;
            listaSinais.appendChild(item);
        });
    }

    blocoExplicacao.innerHTML = "";
    if (explicacoes.length === 0) {
        blocoExplicacao.innerHTML = `
            <p>Nenhum padrão de risco foi encontrado pelas regras atuais.</p>
            <p>Mesmo assim, confira remetente, links, pedidos de dados e qualquer cobrança inesperada.</p>
        `;
    } else {
        explicacoes.forEach(frase => {
            const p = document.createElement("p");
            p.textContent = frase;
            p.style.marginBottom = "15px";
            blocoExplicacao.appendChild(p);
        });
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
