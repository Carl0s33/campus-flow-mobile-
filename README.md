 Campus Flow Mobile

## Visão Geral do Projeto

O **Campus Flow Mobile** é uma aplicação desenvolvida em React Native e Expo, projetada para atuar como um organizador acadêmico completo e centralizado. O objetivo principal do aplicativo é fornecer aos estudantes universitários um painel contextual que unifica o gerenciamento de horários, acompanhamento de disciplinas, registro de tarefas e fluxo de avaliações (provas). 

A interface de usuário foi inteiramente localizada para o idioma Português, focando na usabilidade e na redução da carga cognitiva do estudante durante o semestre letivo. Atualmente, este repositório abriga o frontend da aplicação em seu estágio de Produto Mínimo Viável (MVP). Os dados são mantidos exclusivamente em memória (in-memory) através de informações pré-carregadas (seed data), servindo como uma demonstração totalmente funcional dos fluxos de interface, sem persistência remota ou uso de banco de dados local (SQLite) nesta versão.

## Arquitetura e Navegação

O aplicativo adota uma arquitetura modular moderna orientada a arquivos, utilizando o **Expo Router** como motor de roteamento. A raiz do repositório é intencionalmente minimalista, concentrando o código da aplicação dentro do diretório `frontend/`.

### Estrutura de Roteamento
A navegação é estruturada em uma hierarquia que combina um `Root Stack` para fluxos de interrupção (formulários e modais) e um `Tab Navigator` para a navegação principal da interface.

*   **Navegação Principal (Tabs):** Localizada em `app/(tabs)/_layout.tsx`, divide o núcleo da aplicação em quatro visualizações primárias:
    1.  **Início (`index.tsx`):** Dashboard contextual, exibindo a aula atual, próximas tarefas e resumo do dia.
    2.  **Horário (`calendario.tsx`):** Grade curricular e organização dos blocos de aulas da semana.
    3.  **Matérias (`disciplinas.tsx`):** Gestão das disciplinas cursadas, controle de faltas e progresso.
    4.  **Tarefas (`agenda.tsx`):** Lista de entregáveis, trabalhos e provas com ordenação por prazo.
*   **Telas de Formulário (Modais):** Telas de criação e edição sobrepostas à navegação principal.
    *   `nova-disciplina.tsx`
    *   `novo-horario.tsx`
    *   `nova-tarefa.tsx`
    *   `nova-prova.tsx`

## Pilha Tecnológica (Tech Stack)

A stack foi selecionada para priorizar a velocidade de desenvolvimento multiplataforma, tipagem estática e performance fluida.

*   **Framework Mobile:** React Native (renderização nativa) envelopado pelo ecossistema Expo.
*   **Roteamento:** Expo Router (File-based routing).
*   **Linguagem:** TypeScript configurado em Strict Mode para máxima segurança de tipagem (`tsconfig.json`).
*   **Gerenciamento de Estado:** Zustand (escolhido por sua API minimalista e ausência de boilerplate estrutural).
*   **Notificações:** Expo Notifications para agendamento local.
*   **Iconografia:** Lucide Icons.

## Gerenciamento de Estado Global

Toda a lógica de negócios e persistência volátil da interface é centralizada no hook `useCampusStore.ts`, operando sob a biblioteca Zustand. 

### Entidades do Domínio
A store global rastreia e gerencia as seguintes árvores de dados:
*   `disciplines`: Catálogo de matérias (incluindo constantes para grades como TADS).
*   `schedules`: Blocos de tempo e alocações semanais.
*   `tasks`: Tarefas e atividades com prazos.
*   `exams`: Avaliações e testes agendados.
*   `userName` e `matricula`: Dados de identificação do usuário logado na sessão.

### Ciclo de Vida dos Dados
*   **Ações:** O estado fornece operações no padrão CRUD (Create, Read, Update, Delete) para cada uma das entidades listadas acima.
*   **Comportamento Atual:** Como arquitetura MVP, os dados são gerados via processo de "seed" na inicialização. Não há persistência permanente entre reinicializações do aplicativo.

## Sistema de Design e Tematização

A aplicação implementa um sistema de design customizado (Design System) com suporte robusto a temas dinâmicos (Claro/Escuro).

*   **Design Tokens:** As definições de paleta de cores, espaçamentos e tipografia estão centralizadas de forma estrita em `src/constants/theme.ts`.
*   **Injeção de Tema:** A alternância de tema em tempo de execução (runtime) é gerenciada pelo contexto provido em `useTheme.tsx`.
*   **Controle de Interface:** Componentes globais, como a `TopAppBar`, são sensíveis ao tema e fornecem ao usuário o controle (toggle) para alternar o modo de visualização livremente.

## Módulos e Componentes Essenciais

O repositório é construído sob forte reaproveitamento de componentes e separação de responsabilidades lógicas.

### Componentes UI Compartilhados (`src/components/`)
*   `TopAppBar.tsx`: Barra de navegação superior com ações de usuário e toggle de tema.
*   `NowHappeningCard.tsx`: Card de destaque analítico (exibe a aula ou evento ocorrendo no exato momento).
*   `PomodoroModal.tsx`: Ferramenta integrada de produtividade e foco temporal para estudos.
*   `ScreenHeader.tsx`, `FormInput.tsx`, `PrimaryButton.tsx`: Blocos fundamentais para a padronização visual.

### Utilitários de Domínio (`src/utils/`)
*   `dateHelpers.ts`: Concentra a lógica complexa de formatação de datas de entrega, cálculos de tempo e análise de progresso de aulas.
*   `scheduleHelpers.ts`: Algoritmos responsáveis por mesclar (merge) blocos de horários adjacentes pertencentes à mesma disciplina, otimizando a visualização na grade.

### Módulo de Notificações (`src/hooks/useNotifications.ts`)
Gerencia o engajamento e alertas locais do usuário:
*   Requerimento e validação de permissões no sistema operacional (iOS/Android).
*   Criação de Canais de Notificação (Android Channels).
*   Lembretes de aulas e alertas de limites de faltas.
*   *Aviso:* No modo atual de demonstração (MVP), os gatilhos (triggers) estão configurados para respostas rápidas (ex: 5 segundos) a fim de facilitar testes de interface.

## Configuração de Ambiente e Execução

O projeto é mantido sob um processo de execução simples, dispensando configuração de infraestrutura de compilação local complexa através do Expo.

### Pré-requisitos do Sistema
*   Node.js (LTS recomendado).
*   Gerenciador de pacotes NPM ou Yarn.
*   Dispositivo móvel com o aplicativo "Expo Go" instalado, ou emuladores (Android Studio / Xcode) devidamente configurados.

### Passos para Inicialização

1.  Clone este repositório para o seu ambiente local.
2.  Navegue até o diretório raiz do frontend:
    ```bash
    cd frontend
    ```
3.  Instale todas as dependências requeridas pelo manifesto:
    ```bash
    npm install
    ```
4.  Inicie o servidor de desenvolvimento do Expo (Metro Bundler):
    ```bash
    npm run start
    ```
5.  A partir do terminal interativo do Expo, utilize os atalhos:
    *   Pressione `a` para executar no emulador Android.
    *   Pressione `i` para executar no simulador iOS.
    *   Escaneie o código QR exibido no terminal com o aplicativo Expo Go no seu smartphone físico.

## Limitações Conhecidas e Próximos Passos (Roadmap)

Sendo a versão frontend inicial, as seguintes integrações estão no roteiro de evolução arquitetural:

*   **Integração de Backend RESTful:** A aplicação atualmente não implementa chamadas remotas de API (ex: via Axios ou Fetch). O código do backend (API) reside em um repositório separado (`campus-flow-api`). A conexão cliente-servidor será implementada nas próximas iterações.
*   **Persistência de Dados Local/Remota:** Substituição do estado in-memory por sincronização com banco de dados remoto ou armazenamento offline-first (ex: SQLite genérico via Expo SQLite ou WatermelonDB).
*   **Pipeline de CI/CD:** Implementação de workflows estruturados (ex: GitHub Actions) e configuração do Expo Application Services (eas.json) para automação de builds e testes.
*   **Fluxo de Provas:** O formulário `nova-prova` encontra-se roteado, mas a orquestração completa e rastreabilidade visual a partir das abas principais ainda está em desenvolvimento.

## Licença

Este projeto é mantido sob os termos e condições especificados no arquivo `LICENSE` contido na raiz do repositório.
