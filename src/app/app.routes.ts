import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/pages/home/home.component';
import { MateriasListComponent } from './features/materias/pages/materias-list/materias-list.component';
import { SessoesComponent } from './features/sessoes/pages/sessoes/sessoes.component';
import { EstatisticasComponent } from './features/estatisticas/pages/estatisticas/estatisticas.component';

export const routes: Routes = [

    {
    path: '',
    component: HomeComponent
    },
    {
        path: 'materias',
        component: MateriasListComponent
    },
    {
        path: 'sessoes',
        component: SessoesComponent
    },
    {
        path: 'estatisticas',
        component: EstatisticasComponent
    }
];
