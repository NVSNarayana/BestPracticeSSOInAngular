import { Routes } from '@angular/router';
import * as R from '.';
import { Constants } from '../models';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: Constants.Path.home },
    { path: Constants.Path.home, pathMatch: 'full', component: R.HomeComponent },
    { path: Constants.Path.home + "/:Id", pathMatch: 'full', component: R.HomeComponent },
    { path: Constants.Path.correlation, pathMatch: 'full', component: R.CorrelationComponent },

    { path: Constants.Path.unauthorized, pathMatch: 'full', component: R.UnauthorizedComponent },
    { path: Constants.Path.error, pathMatch: 'full', component: R.ErrorComponent },
    { path: '**', pathMatch: 'full', component: R.PageNotFoundComponent }
];