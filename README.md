Com certeza! Ter um `README.md` bem estruturado é o cartão de visitas do seu repositório, especialmente para um projeto de TCC. Ele mostra profissionalismo e organização para quem for avaliar seu código.

Copie todo o conteúdo abaixo e cole dentro do arquivo `README.md` na raiz do seu projeto (se o arquivo não existir, é só criar).

```markdown
# 📱 CampusFlow

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

O **CampusFlow** é um aplicativo móvel projetado para centralizar e organizar a rotina acadêmica de estudantes. Ao invés de ser apenas uma agenda, o CampusFlow atua como um painel pessoal contextual: ele cruza o dia e a hora atuais com a grade curricular do aluno, respondendo instantaneamente o que está acontecendo agora, o que vem a seguir e o que está pendente.

Este projeto é parte do Trabalho de Conclusão de Curso (TCC) focado na melhoria da usabilidade e organização na rotina de estudantes.

---

## 🎯 O Problema e a Solução

**O Problema:** Estudantes utilizam diversas ferramentas fragmentadas para gerenciar sua vida acadêmica (portal da faculdade, Google Calendar, planners de papel, grupos de WhatsApp). Essa fragmentação gera perda de prazos, ansiedade e dificuldade em ter uma visão clara do dia.

**A Solução:** Um aplicativo que centraliza a grade horária, os prazos de trabalhos e as datas de provas em uma única tela inteligente, que se adapta ao momento atual do aluno.

---

## ✨ Funcionalidades (V1 - MVP)

- **🏠 Tela Inicial Contextual:** Resumo inteligente do dia, mostrando a próxima aula, horários do dia, trabalhos e provas iminentes.
- **📚 Gestão de Disciplinas:** Cadastro das matérias do semestre.
- **🕒 Grade Horária:** Cadastro dos dias, horários e salas de cada disciplina.
- **📝 Gestão de Trabalhos e Provas:** Cadastro de atividades avaliativas com controle de prazos e vencimentos.
- **💾 Persistência Local:** Funcionamento 100% offline utilizando SQLite.

---

## 🛠️ Tecnologias Utilizadas

- **Mobile:** React Native
- **Framework:** Expo
- **Roteamento:** Expo Router
- **Linguagem:** TypeScript
- **Banco de Dados Local:** SQLite (Expo SQLite)

---

## 🚀 Como executar o projeto localmente

Siga os passos abaixo para rodar o CampusFlow na sua máquina:

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [Git](https://git-scm.com/)
- Aplicativo **Expo Go** instalado no seu celular (Android ou iOS) ou um Emulador configurado no PC.

### 2. Clonando o repositório
Abra o terminal e execute:
```bash
git clone [https://github.com/SEU_USUARIO/campus-flow.git](https://github.com/SEU_USUARIO/campus-flow.git)
cd campus-flow

```

### 3. Instalando as dependências

```bash
npm install

```

### 4. Rodando o aplicativo

```bash
npx expo start

```

Após executar este comando, um QR Code aparecerá no terminal.

* **No celular:** Abra o app Expo Go e escaneie o QR Code.
* **No PC:** Pressione `a` para abrir no emulador Android ou `i` para o simulador iOS.

---

## 📂 Arquitetura do Projeto

O projeto está organizado da seguinte forma:

```text
campus-flow/
│
├── app/                  # Rotas e Telas do aplicativo (Expo Router)
├── components/           # Componentes visuais reutilizáveis (Cards, Botões)
├── database/             # Configurações do SQLite, queries e repositórios
├── types/                # Definições de tipagem do TypeScript
├── utils/                # Funções auxiliares e formatação de dados
└── assets/               # Imagens, ícones e fontes

```

---

## 📊 Pesquisa e Avaliação (TCC)

Como parte da pesquisa acadêmica, o CampusFlow será avaliado por um grupo focal de estudantes. A metodologia inclui a aplicação do questionário **SUS (System Usability Scale)** para medir quantitativamente a usabilidade da aplicação, além de análises qualitativas sobre a percepção de organização e redução de ansiedade com relação aos prazos acadêmicos.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://www.google.com/search?q=LICENSE) para mais detalhes.

---

*Desenvolvido com ☕ e muito código para o TCC.*

```

```
