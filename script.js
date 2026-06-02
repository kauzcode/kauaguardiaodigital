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
    const index = Math.floor(Math.random() * securityTips.length);
    tipElement.textContent = securityTips[index];
}

const analyzeBtn = document.getElementById("analyzeBtn");
const messageInput = document.getElementById("messageInput");
const result = document.getElementById("result");
const scoreValue = document.getElementById("scoreValue");
const riskLevel = document.getElementById("riskLevel");
const signalsList = document.getElementById("signalsList");
const explanations = document.getElementById("explanations");

const categories = [
    {
        name: "Urgência",
        score: 15,
        explanation: "Mensagens falsas costumam usar pressa para fazer a pessoa agir sem pensar muito.",
        keywords: [
            "urgente", "imediatamente", "agora mesmo", "última chance", "ultimo aviso",
            "último aviso", "responda agora", "ação necessária", "acao necessaria",
            "prazo final", "não perca", "nao perca", "evite bloqueio",
            "evite suspensão", "evite suspensao", "regularize agora",
            "confirme imediatamente", "clique agora"
        ]
    },
    {
        name: "Ameaças",
        score: 20,
        explanation: "Ameaças de bloqueio, multa ou suspensão são usadas para assustar e acelerar a resposta.",
        keywords: [
            "conta bloqueada", "conta suspensa", "cpf irregular", "processo judicial",
            "multa pendente", "acesso suspenso", "restrição no cpf", "restricao no cpf",
            "pendência financeira", "pendencia financeira", "cancelamento automático",
            "cancelamento automatico", "problema na conta", "dados comprometidos"
        ]
    },
    {
        name: "Pedido de dados",
        score: 25,
        explanation: "Senha, token, código de verificação e documentos pessoais não devem ser enviados por mensagem.",
        keywords: [
            "informe sua senha", "confirme sua senha", "atualize seus dados",
            "confirme seus dados", "envie seu cpf", "envie seu rg",
            "código de verificação", "codigo de verificacao", "token de acesso",
            "dados bancários", "dados bancarios", "dados pessoais"
        ]
    },
    {
        name: "PIX",
        score: 20,
        explanation: "Pagamentos por PIX são rápidos e, em muitos casos, difíceis de recuperar depois do envio.",
        keywords: [
            "pix", "chave pix", "transferência pix", "transferencia pix", "estorno pix",
            "pagamento via pix", "pagamento pendente", "envie o comprovante",
            "faça a transferência", "faca a transferencia"
        ]
    },
    {
        name: "Promessa exagerada",
        score: 15,
        explanation: "Prêmios, sorteios e dinheiro fácil sem motivo claro merecem verificação antes de qualquer ação.",
        keywords: [
            "você ganhou", "voce ganhou", "foi sorteado", "prêmio garantido",
            "premio garantido", "recompensa exclusiva", "dinheiro fácil",
            "dinheiro facil", "renda garantida", "bônus especial", "bonus especial",
            "saque disponível", "saque disponivel", "liberação imediata",
            "liberacao imediata"
        ]
    }
];

function hasLink(text) {
    const links = ["http://", "https://", "bit.ly", "tinyurl", "t.co", "goo.gl", "rebrand.ly"];
    return links.some(item => text.includes(item));
}

function getRisk(score) {
    if (score <= 30) {
        return {
            text: "🟢 Baixo Risco — poucos sinais comuns de golpe foram encontrados.",
            className: "low-risk"
        };
    }

    if (score <= 60) {
        return {
            text: "🟡 Atenção — a mensagem tem alguns pontos que merecem cuidado.",
            className: "medium-risk"
        };
    }

    return {
        text: "🔴 Alto Risco — há vários sinais comuns em tentativas de golpe.",
        className: "high-risk"
    };
}

analyzeBtn.addEventListener("click", () => {
    const text = messageInput.value.toLowerCase().trim();

    if (!text) {
        alert("Campo vazio.");
        return;
    }

    let score = 0, foundSignals = [], foundExplanations = [];

    categories.forEach(category => {
        const found = category.keywords.some(keyword => text.includes(keyword));

        if (found) {
            score += category.score;
            foundSignals.push(`${category.name} (+${category.score})`);
            foundExplanations.push(category.explanation);
        }
    });

    if (hasLink(text)) {
        score += 15;
        foundSignals.push("Link ou encurtador (+15)");
        foundExplanations.push("Links em mensagens podem levar para páginas falsas parecidas com sites conhecidos.");
    }

    const risk = getRisk(score);

    scoreValue.textContent = score;
    riskLevel.innerHTML = `<div class="${risk.className}">${risk.text}</div>`;

    signalsList.innerHTML = "";

    if (foundSignals.length === 0) {
        signalsList.innerHTML = "<li>Nenhum sinal cadastrado foi encontrado nessa mensagem.</li>";
    } else {
        foundSignals.forEach(signal => {
            const item = document.createElement("li");
            item.textContent = signal;
            signalsList.appendChild(item);
        });
    }

    explanations.innerHTML = "";

    if (foundExplanations.length === 0) {
        explanations.innerHTML = `
            <p>Nenhum padrão de risco foi encontrado pelas regras atuais.</p>
            <p>Mesmo assim, confira remetente, links, pedidos de dados e qualquer cobrança inesperada.</p>
        `;
    } else {
        foundExplanations.forEach(text => {
            const p = document.createElement("p");
            p.textContent = text;
            p.style.marginBottom = "15px";
            explanations.appendChild(p);
        });
    }

    result.classList.remove("hidden");
    result.scrollIntoView({ behavior: "smooth", block: "start" });
});

messageInput.addEventListener("keydown", event => {
    if (event.ctrlKey && event.key === "Enter") analyzeBtn.click();
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();

        const area = document.querySelector(link.getAttribute("href"));
        if (area) area.scrollIntoView({ behavior: "smooth" });
    });
});
