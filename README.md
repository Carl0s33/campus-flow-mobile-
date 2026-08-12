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

## 📸 Screenshots

*(Adicione aqui algumas imagens ou um GIF do seu aplicativo rodando. Exemplo de código abaixo:)*
<!-- <div style="display: flex; gap: 10px;">
  <img src="./assets/print-tela-inicial.png" width="200">
  <img src="./assets/print-materias.png" width="200">
</div> -->

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
git clone [https://github.com/Carl0s33/campus-flow.git](https://github.com/Carl0s33/campus-flow.git)
cd campus-flow
