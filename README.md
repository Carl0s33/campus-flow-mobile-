Campus Flow Mobile 📱

## Visão Geral do Projeto

O **Campus Flow Mobile** é o cliente frontend do ecossistema Campus Flow, desenvolvido em React Native e Expo. Ele atua como um organizador acadêmico completo e centralizado, focado em reduzir a carga cognitiva diária e otimizar a rotina universitária, especialmente desenhado para lidar com grades curriculares densas como a de Análise e Desenvolvimento de Sistemas (TADS).

> **Aviso de Ecossistema:** Este repositório contém apenas o aplicativo Mobile. Para a infraestrutura de backend e banco de dados, consulte o repositório irmão: [Campus Flow API](https://github.com/carl0s33/campus-flow-api)

Atualmente, este repositório abriga a aplicação em seu estágio de Produto Mínimo Viável (MVP). Os dados operam em memória (in-memory) via *seed data*, servindo como uma demonstração funcional dos fluxos de interface antes da integração total com a API.

## Arquitetura e Navegação

Utilizamos uma arquitetura modular orientada a arquivos, impulsionada pelo **Expo Router**. O código base reside inteiramente no diretório `frontend/`.

### Estrutura de Roteamento
A navegação combina um `Root Stack` (para formulários e modais) e um `Tab Navigator` (navegação principal).

*   **Tabs Principais (`app/(tabs)/`):**
    1.  **Início (`index.tsx`):** Dashboard contextual (aula atual, tarefas urgentes).
    2.  **Horário (`calendario.tsx`):** Organização dos blocos de aulas da semana.
    3.  **Matérias (`disciplinas.tsx`):** Gestão de disciplinas, faltas e progresso.
    4.  **Tarefas (`agenda.tsx`):** Lista de entregáveis ordenados por prazo.
*   **Modais de Formulário (`app/`):** Criação e edição (`nova-disciplina`, `novo-horario`, `nova-tarefa`, `nova-prova`).

## Pilha Tecnológica (Tech Stack)

*   **Framework:** React Native + Expo.
*   **Roteamento:** Expo Router.
*   **Linguagem:** TypeScript (Strict Mode).
*   **Gerenciamento de Estado:** Zustand.
*   **Notificações:** Expo Notifications.
*   **Ícones:** Lucide Icons.

## Sistema de Design e Tematização

*   **Design Tokens:** Paleta, tipografia e espaçamentos centralizados em `src/constants/theme.ts`.
*   **Tema Dinâmico:** Suporte nativo à alternância entre modo Claro e Escuro em tempo de execução via `useTheme.tsx`.

## Configuração e Execução Local

### Pré-requisitos
*   Node.js (LTS).
*   Dispositivo físico com "Expo Go" ou emulador configurado.

### Passos
1.  Clone este repositório.
2.  Navegue até o diretório do app:
    ```bash
    cd frontend
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```
4.  Inicie o Metro Bundler:
    ```bash
    npm run start
    ```
5.  Pressione `a` para Android, `i` para iOS, ou escaneie o QR Code com o app Expo Go.

## Próximos Passos (Roadmap)
*   **Integração REST:** Conectar a store do Zustand aos endpoints do [Campus Flow API].
*   **Persistência Local:** Transição para SQLite para suporte offline-first.

---
*Licença contida no arquivo LICENSE do repositório.*
