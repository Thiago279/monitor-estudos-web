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
- CORS configured in Spring Boot (`http://localhost:8080/monitor-estudos`).
- Rendered dynamic `materias` list in component template using control flow.
- Built interactive CRUD operations for `materias` using Angular Reactive Forms.
- Implemented UI request state management (`carregando`, `mensagemSucesso`, and `mensagemErro`) across feature components.
- Implemented reactive `DELETE` and `PUT` operations updating state in local memory without page reload.
- Integrated `SessaoEstudoResponse` and `SessaoEstudoRequest` DTOs matching backend Spring Boot contract.
- Built `SessaoEstudoService` handling HTTP requests for study session management.
- Developed `sessoes` list view rendering historical sessions as interactive UI cards.
- Implemented session state detection identifying active (`EM_ANDAMENTO`) sessions using array search logic (`dataFim === null`).
- Built manual historical session entry form using Angular Reactive Forms and HTML5 `datetime-local` input elements.

## Notes
- Integrated Standalone Component with backend endpoint `http://localhost:8080/monitor-estudos/materias`.
- Created feature structure under `src/app/features/materias`:
  - `Materia` model interface matching backend DTO properties (`id`, `titulo`, `cor`).
  - `MateriaService` encapsulating HTTP requests via `HttpClient`.
- Utilized Angular 17+ control flow syntax (`@for` with `track materia.id`, `@if`, and `@empty`) in templates.
- Subscribed to `Observable` in `ngOnInit` lifecycle hook to store API response in component state.
- Implemented `ReactiveFormsModule` with `FormGroup`, `FormControl`, and `Validators` (`required`, `minLength(3)`).
- Bound HTML forms using `[formGroup]`, `formControlName`, and `(ngSubmit)` event handling.
- Leveraged TypeScript utility type `Omit<Materia, 'id'>` in `MateriaService` to decouple request payload structure from response entities.
- Managed user feedback and button states dynamically using component state properties (`carregando`, `mensagemErro`, `mensagemSucesso`).
- Handled HTTP 204 No Content responses from `DELETE` requests using RxJS/Array `.filter()` for array manipulation in local memory state.
- Modeled `SessaoEstudoResponse` and `SessaoEstudoRequest` interfaces to support flat DTO structures returned by Spring Boot.
- Formatted `LocalDateTime` string outputs seamlessly in template using Angular's native `DatePipe` (`dd/MM/yyyy HH:mm`).
- Utilized JavaScript Array `.find()` in component logic to derive active session status without introducing redundant backend fields.
- Formatted manual entry timestamps using native browser `<input type="datetime-local">` rendering ISO-8601 strings compatible with Java backend requirements.

## Problems

- Encountered CORS policy block from backend until CORS headers were properly set on Spring Boot controllers.
- Addressed asynchronous race condition during initial state load by coupling active session check (`.find()`) strictly within the `SessaoEstudoService` subscription callback.
