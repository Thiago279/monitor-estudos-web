App

├── Home
│      ├── SessionCard
│      ├── DailyTimeline
│      └── Header
│
├── Materias
│      ├── Lista
│      └── Formulário
│
├── Estatisticas
│      ├── Diária
│      ├── Semanal
│      └── Período
│
└── Shared
       ├── Button
       ├── Card
       ├── Modal
       └── Loader

## Pagina inicial (home)

+------------------------------------------------------+
|  Terça, 04/08/2026                     1h22m         |
+------------------------------------------------------+

 Python                         1:22:13

 (+) Iniciar nova sessão

--------------------------------------------------------

                    gráfico do dia

## Estatisticas

Hoje
Semana
Mês
Período Personalizado

Tempo por matéria

██████ Java
████ Angular
██ Git

Tempo total

32h


## Page layout

+--------------------------------------------+

Header

+-----------+--------------------------------+

Sidebar     Conteúdo (RouterOutlet)

+-----------+--------------------------------+


## Estrutur final

src/app

core/
│
├── services/
├── models/
└── config/

layout/
│
├── header/
├── sidebar/
└── page-layout/

shared/
│
├── components/
├── directives/
└── pipes/

features/
│
├── home/
│   └── pages/
│       └── home/
│
├── materias/
│   └── pages/
│       └── materias-list/
│
├── sessoes/
│   └── pages/
│       └── sessoes/
│
└── estatisticas/
    └── pages/
        └── estatisticas/

app.component.*
app.config.ts
app.routes.ts

# Roadmap

## MVP

- [ ] Estrutura Angular
- [ ] Layout principal
- [ ] Routing
- [ ] CRUD Matérias
- [ ] Sessões
- [ ] Timeline diária
- [ ] Estatísticas