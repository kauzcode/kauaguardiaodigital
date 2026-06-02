# 🛡️ Guardião Digital

Uma plataforma educativa voltada para conscientização e prevenção contra golpes digitais.

O Guardião Digital auxilia usuários na identificação de sinais frequentemente encontrados em mensagens fraudulentas recebidas por WhatsApp, SMS, e-mail, Instagram, Facebook, Telegram e outras plataformas digitais.

---

## Objetivo

Promover educação digital e ajudar usuários a reconhecer padrões comuns utilizados por golpistas, incentivando hábitos mais seguros na internet.

O projeto não utiliza inteligência artificial nem realiza consultas externas. Toda a análise é feita localmente no navegador do usuário através de regras transparentes de pontuação.

---

## Funcionalidades

- Análise local de mensagens suspeitas
- Sistema de pontuação baseado em padrões de risco
- Classificação por nível de risco
- Explicações educativas para cada sinal encontrado
- Dicas de segurança aleatórias
- Conteúdo educativo sobre golpes digitais
- Interface responsiva para computadores e celulares
- Funcionamento offline após carregamento

---

## Categorias Analisadas

### Urgência

Exemplos:

- urgente
- responda agora
- última chance
- prazo final

### Ameaças

Exemplos:

- conta bloqueada
- processo judicial
- CPF irregular

### Solicitação de Dados

Exemplos:

- informe sua senha
- envie seu CPF
- código de verificação

### PIX

Exemplos:

- chave PIX
- transferência PIX
- envie o comprovante

### Promessas Exageradas

Exemplos:

- você ganhou
- prêmio garantido
- dinheiro fácil

### Links Suspeitos

Detecção de:

- http://
- https://
- bit.ly
- tinyurl
- t.co
- goo.gl

---

## Classificação de Risco

### 🟢 Baixo Risco

0 a 30 pontos

Mensagem com poucos sinais normalmente associados a golpes.

### 🟡 Atenção

31 a 60 pontos

A mensagem apresenta alguns elementos frequentemente utilizados em tentativas de fraude.

### 🔴 Alto Risco

61 pontos ou mais

A mensagem contém diversos padrões comuns em golpes digitais e merece verificação cuidadosa.

---

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript Vanilla

Sem:

- APIs externas
- Banco de dados
- Login
- Frameworks

---

## Estrutura do Projeto

```text
Guardiao-Digital/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## Como Executar

1. Baixe os arquivos do projeto.
2. Abra o arquivo `index.html`.
3. Cole uma mensagem suspeita.
4. Clique em **Analisar**.

Não é necessário instalar dependências.

---

## Aviso

O Guardião Digital é uma ferramenta educativa.

Os resultados apresentados servem para conscientização e aprendizado, não substituindo sistemas profissionais de segurança, investigações ou verificações oficiais.

Sempre confirme informações diretamente com instituições e canais oficiais.

---

## Autor

**Kauã Lima**

Projeto desenvolvido para fins educacionais e de conscientização sobre segurança digital.

© 2026 - Guardião Digital
