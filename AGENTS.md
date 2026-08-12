# AGENTS.md — Agent Guidelines & System Instructions

This document defines the rules, architecture, code style, and execution workflows for AI agents and developer tools working on the **CampusFlow** codebase.

---

## 1. Project Overview & Stack

* **Name:** CampusFlow
* **Type:** Cross-platform Mobile Application (iOS & Android)
* **Domain:** Student Academic Routine Centralizer (TCC Research Project)
* **Framework:** React Native + Expo (Expo Router for file-based navigation)
* **Language:** TypeScript (Strict Mode)
* **Database:** Local SQLite (`expo-sqlite`)
* **UI Architecture:** Light Theme (Default), Clean Architecture, Modular Components

---

## 2. Mandatory Coding Directives

### Directives on Formatting & Clean Code

1. **Zero Comments Policy:** Do not write explanatory inline comments or block comments. Code must be completely self-documenting through clear, explicit naming of variables, functions, and components. Remove dead/commented-out code.
2. **Strict TypeScript:** Never use `any` or `unknown` without explicit narrowing. Define type interfaces in `types/` for all entities, component props, and database records.
3. **Single Responsibility Principle (SRP):**
* `app/`: Pure routing and layout assembly.
* `components/`: Pure UI components and local view styling. No direct DB queries or data-fetching logic.
* `hooks/`: State management, side effects, and bridges between UI and DB.
* `database/repositories/`: Execution of raw SQL commands and returning typed objects.


4. **No Hardcoded Colors/Styles:** Always import design tokens from `constants/theme.ts`. Do not write raw hex colors inside components.

---

## 3. Architecture & Folder Structure

```text
campus-flow/
├── app/                    # Expo Router file-based navigation
│   ├── (tabs)/             # Tab navigation (index, calendario, disciplinas, agenda)
│   ├── _layout.tsx         # Root layout configuration
│   ├── nova-disciplina.tsx # Action modals/screens
│   ├── nova-tarefa.tsx
│   └── nova-prova.tsx
├── components/             # Presentational components
│   ├── common/             # Buttons, inputs, badges
│   ├── cards/              # TaskCard, ExamCard, ClassCard
│   └── layout/             # Screen headers, wrappers
├── database/               # SQLite layer
│   ├── client.ts           # DB instance initialization
│   ├── schema.ts           # DDL queries (CREATE TABLE)
│   └── repositories/       # Isolated repository objects per entity
├── hooks/                  # Custom React Hooks
├── services/               # Pure utility functions (date calculation, status checkers)
├── constants/              # Theme, colors, typography, layout tokens
└── types/                  # Global TypeScript type declarations

```

---

## 4. Code Standards & Patterns

### Component Blueprint

```tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../../constants/theme';
import { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onPress: (id: string) => void;
}

export function TaskCard({ task, onPress }: TaskCardProps) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(task.id)}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.date}>{task.dueDate}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

```

### Naming Conventions

* **Components:** `PascalCase` (e.g., `ExamCard.tsx`, `PrimaryButton.tsx`)
* **Custom Hooks:** `camelCase` starting with `use` (e.g., `useDisciplines.ts`)
* **Repositories:** `camelCase` with `Repository` suffix (e.g., `disciplineRepository.ts`)
* **Types / Interfaces:** `PascalCase` without `I` or `T` prefixes (e.g., `Discipline`, `Exam`)
* **Constants:** `SNAKE_CASE_UPPER` (e.g., `PRIMARY_COLOR`, `TABLE_NAMES`)

---

## 5. Agent Task Execution Workflow

When fulfilling a user prompt or building a feature:

1. **Verify Interfaces:** First check or create the required types in `types/`.
2. **Implement DB Operations:** Create or extend the repository in `database/repositories/`.
3. **Build Business Hook:** Implement state management in `hooks/`.
4. **Construct UI:** Build pure presentational components in `components/`.
5. **Assemble Screen:** Mount everything together inside the route file under `app/`.
6. **Linting Check:** Ensure no unused imports, no missing props, no comments, and strictly clean code.