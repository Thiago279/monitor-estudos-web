# Development Log — Monitor Estudos Web

Registro dos principais aprendizados, decisões e milestones do desenvolvimento do frontend Angular do Monitor Estudos.

O objetivo deste arquivo não é documentar todo o código do projeto, mas registrar a evolução do aprendizado e decisões importantes durante a construção da aplicação.

---

## 2026-08 — Estrutura inicial e fundamentos do Angular

### Contexto

O frontend do Monitor Estudos está sendo desenvolvido em um repositório separado do backend:

`monitor-estudos-web`

O backend permanece no repositório `monitor-estudos`.

O objetivo é construir uma aplicação Angular real que consuma a API Spring Boot existente.

---

## Estrutura inicial

Foi criada uma organização baseada em features:

```text
src/app/
├── core/
├── shared/
├── features/
│   ├── home/
│   ├── materias/
│   ├── sessoes/
│   └── estatisticas/
├── layout/
│   └── page-layout/
├── app.component.*
├── app.config.ts
└── app.routes.ts

```

# Devlog

## Semana 1

- Initial angular structure created
- main layout (sidebar , headbar , content) and routing done.
- Active index sidebar.


### Aprendizados
- Componentes são responsáveis pela interface.
- Services concentram comunicação com APIs.
- `Observable` representa um fluxo assíncrono.
- `subscribe()` permite observar esse fluxo.

### Próximo objetivo
- forms and post materias

## Semana 02

## DONE
- Implemented Angular HttpClient integration to consume backend API.
- CORS configured in springboot.
- Rendered dynamic `materias` list in component template using control flow.

## Notes
- Integrated Standalone Component with backend endpoint `http://localhost:8080/monitor-estudos/materias`.
- Created feature structure under `src/app/features/materias`:
  - `Materia` model interface matching backend DTO properties (`id`, `titulo`, `cor`).
  - `MateriaService` encapsulating HTTP requests via `HttpClient`.
- Utilized Angular 17+ control flow syntax (`@for` with `track materia.id` and `@empty`) in `materias-list.component.html`.
- Subscribed to `Observable` in `ngOnInit` lifecycle hook to store API response in component state.

## Problems

- Encountered CORS policy block from backend until CORS headers were properly set on Spring Boot.

