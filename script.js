/* =========================
   GUARDIÃO DIGITAL
   SCRIPT.JS
========================= */

/* =========================
   DICAS DE SEGURANÇA
========================= */

const securityTips = [
    "Nunca compartilhe códigos de verificação recebidos por SMS.",
    "Bancos não solicitam senha completa por telefone ou WhatsApp.",
    "Desconfie de mensagens que exigem decisões imediatas.",
    "Sempre confirme pedidos de dinheiro por outro canal.",
    "Antes de clicar em um link, verifique cuidadosamente o endereço.",
    "Não envie documentos pessoais sem confirmar a identidade do solicitante.",
    "Golpistas costumam explorar medo, urgência ou curiosidade.",
    "Desconfie de ofertas boas demais para serem verdade.",
    "Mantenha a verificação em duas etapas ativada sempre que possível.",
    "Nunca informe senhas por mensagens ou redes sociais."
];

const tipElement = document.getElementById("securityTip");

if (tipElement) {
    const randomTip =
        securityTips[Math.floor(Math.random() * securityTips.length)];

    tipElement.textContent = randomTip;
}

/* =========================
   ELEMENTOS
========================= */

const analyzeBtn = document.getElementById("analyzeBtn");
const messageInput = document.getElementById("messageInput");

const result = document.getElementById("result");

const scoreValue = document.getElementById("scoreValue");
const riskLevel = document.getElementById("riskLevel");

const signalsList = document.getElementById("signalsList");
const explanations = document.getElementById("explanations");

/* =========================
   REGRAS
========================= */

const categories = [
    {
        name: "Urgência",
        score: 15,
        explanation:
            "Mensagens fraudulentas costumam criar sensação de urgência para incentivar decisões rápidas sem tempo para verificação.",

        keywords: [
            "urgente",
            "imediatamente",
            "agora mesmo",
            "última chance",
            "ultimo aviso",
            "último aviso",
            "responda agora",
            "ação necessária",
            "acao necessaria",
            "prazo final",
            "não perca",
            "nao perca",
            "evite bloqueio",
            "evite suspensão",
            "evite suspensao",
            "regularize agora",
            "confirme imediatamente",
            "clique agora"
        ]
    },

    {
        name: "Ameaças",
        score: 20,
        explanation:
            "Golpistas frequentemente utilizam ameaças para provocar medo e reduzir a capacidade crítica da vítima.",

        keywords: [
            "conta bloqueada",
            "conta suspensa",
            "cpf irregular",
            "processo judicial",
            "multa pendente",
            "acesso suspenso",
            "restrição no cpf",
            "restricao no cpf",
            "pendência financeira",
            "pendencia financeira",
            "cancelamento automático",
            "cancelamento automatico",
            "problema na conta",
            "dados comprometidos"
        ]
    },

    {
        name: "Solicitação de Dados",
        score: 25,
        explanation:
            "Empresas legítimas raramente solicitam senhas ou informações sensíveis por mensagens.",

        keywords: [
            "informe sua senha",
            "confirme sua senha",
            "atualize seus dados",
            "confirme seus dados",
            "envie seu cpf",
            "envie seu rg",
            "código de verificação",
            "codigo de verificacao",
            "token de acesso",
            "dados bancários",
            "dados bancarios",
            "dados pessoais"
        ]
    },

    {
        name: "PIX",
        score: 20,
        explanation:
            "Transferências instantâneas são frequentemente utilizadas por golpistas devido à dificuldade de recuperação dos valores.",

        keywords: [
            "pix",
            "chave pix",
            "transferência pix",
            "transferencia pix",
            "estorno pix",
            "pagamento via pix",
            "pagamento pendente",
            "envie o comprovante",
            "faça a transferência",
            "faca a transferencia"
        ]
    },

    {
        name: "Promessas Exageradas",
        score: 15,
        explanation:
            "Ofertas muito vantajosas ou premiações inesperadas devem ser verificadas cuidadosamente.",

        keywords: [
            "você ganhou",
            "voce ganhou",
            "foi sorteado",
            "prêmio garantido",
            "premio garantido",
            "recompensa exclusiva",
            "dinheiro fácil",
            "dinheiro facil",
            "renda garantida",
            "bônus especial",
            "bonus especial",
            "saque disponível",
            "saque disponivel",
            "liberação imediata",
            "liberacao imediata"
        ]
    }
];

/* =========================
   DETECÇÃO DE LINKS
========================= */

function containsSuspiciousLink(text) {

    const patterns = [
        "http://",
        "https://",
        "bit.ly",
        "tinyurl",
        "t.co",
        "goo.gl",
        "rebrand.ly"
    ];

    return patterns.some(pattern =>
        text.includes(pattern)
    );
}

/* =========================
   CLASSIFICAÇÃO
========================= */

function getRisk(score) {

    if (score <= 30) {
        return {
            text:
                "🟢 Baixo Risco — Mensagem com poucos sinais normalmente associados a golpes.",
            className:
                "low-risk"
        };
    }

    if (score <= 60) {
        return {
            text:
                "🟡 Atenção — A mensagem apresenta alguns elementos frequentemente utilizados em tentativas de fraude.",
            className:
                "medium-risk"
        };
    }

    return {
        text:
            "🔴 Alto Risco — A mensagem contém diversos padrões comuns em golpes digitais e merece verificação cuidadosa.",
        className:
            "high-risk"
        };
}

/* =========================
   ANALISAR
========================= */

analyzeBtn.addEventListener("click", () => {

    const text =
        messageInput.value
            .toLowerCase()
            .trim();

    if (!text) {

        alert(
            "Cole uma mensagem para realizar a análise."
        );

        return;
    }

    let score = 0;

    let foundSignals = [];

    let foundExplanations = [];

    /* =========================
       CATEGORIAS
    ========================= */

    categories.forEach(category => {

        const found = category.keywords.some(keyword =>
            text.includes(keyword)
        );

        if (found) {

            score += category.score;

            foundSignals.push(
                `${category.name} (+${category.score})`
            );

            foundExplanations.push(
                category.explanation
            );
        }
    });

    /* =========================
       LINKS
    ========================= */

    if (containsSuspiciousLink(text)) {

        score += 15;

        foundSignals.push(
            "Links ou encurtadores (+15)"
        );

        foundExplanations.push(
            "Links podem direcionar usuários para páginas falsas que imitam instituições legítimas."
        );
    }

    /* =========================
       RESULTADO
    ========================= */

    const risk = getRisk(score);

    scoreValue.textContent = score;

    riskLevel.innerHTML = `
        <div class="${risk.className}">
            ${risk.text}
        </div>
    `;

    /* =========================
       SINAIS
    ========================= */

    signalsList.innerHTML = "";

    if (foundSignals.length === 0) {

        signalsList.innerHTML =
            "<li>Nenhum padrão de risco identificado pelas regras atuais.</li>";

    } else {

        foundSignals.forEach(signal => {

            const li =
                document.createElement("li");

            li.textContent = signal;

            signalsList.appendChild(li);
        });
    }

    /* =========================
       EXPLICAÇÕES
    ========================= */

    explanations.innerHTML = "";

    if (foundExplanations.length === 0) {

        explanations.innerHTML = `
            <p>
                A mensagem não apresentou padrões previamente
                cadastrados no sistema.
            </p>

            <p>
                Isso não garante que a mensagem seja legítima.
                Continue verificando remetentes, links e pedidos
                de informações pessoais.
            </p>
        `;

    } else {

        foundExplanations.forEach(explanation => {

            const paragraph =
                document.createElement("p");

            paragraph.textContent =
                explanation;

            paragraph.style.marginBottom =
                "15px";

            explanations.appendChild(paragraph);
        });
    }

    /* =========================
       MOSTRAR RESULTADO
    ========================= */

    result.classList.remove("hidden");

    result.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

/* =========================
   ENTER + CTRL
========================= */

messageInput.addEventListener("keydown", event => {

    if (
        event.ctrlKey &&
        event.key === "Enter"
    ) {

        analyzeBtn.click();
    }
});

/* =========================
   NAVEGAÇÃO SUAVE EXTRA
========================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

        anchor.addEventListener(
            "click",
            function (e) {

                e.preventDefault();

                const target =
                    document.querySelector(
                        this.getAttribute("href")
                    );

                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            }
        );
    });

/* =========================
   FIM
========================= */