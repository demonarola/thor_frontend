import { RouterModule, Routes } from '@angular/router';

import { AddModuleComponent } from './page/hv_modules/add-module/add-module.component';
//import { AddRebateComponent } from './page/rebate/add-rebate/add-rebate.component';
import{ AddRentComponent} from './page/rent/add-rent/add-rent.component'; 
//import { AddSubscriptionComponent } from './page/subscription/add-subscription/add-subscription.component';
import { AddSupportComponent } from './page/support/add-support/add-support.component';
import { AddUserComponent } from './page/user-management/add-user/add-user.component';
import { AddVehiclesComponent } from './page/vehicles/add-vehicles/add-vehicles.component';
import { AuthGuard } from './security/guards/auth.guard';
import { ConsoleComponent } from './page/console/console.component';
import { CoreComponent } from './page/core/core.component';
import { EditModuleComponent } from './page/hv_modules/edit-module/edit-module.component';
//import { EditRebateComponent } from './page/rebate/edit-rebate/edit-rebate.component';
import{ EditRentComponent} from './page/rent/edit-rent/edit-rent.component'; 
//import { EditSubscriptionComponent } from './page/subscription/edit-subscription/edit-subscription.component';
import { EditSupportComponent } from './page/support/edit-support/edit-support.component';
import { EditUserComponent } from './page/user-management/edit-user/edit-user.component';
import { EditVehiclesComponent } from './page/vehicles/edit-vehicles/edit-vehicles.component';
import { HwModulesComponent } from './page/hv_modules/hv_modules.component';
import { LocationComponent } from './page/locations/location/location.component';
import { LocationsComponent } from './page/locations/locations.component';
import { LoginComponent } from './page/login/login.component';
import { MapDashboardComponent } from './page/map-dashboard/map-dashboard.component';
import { NgModule } from '@angular/core';
//import { RebateComponent } from './page/rebate/rebate.component';
import { ReportComponent } from './page/report/report.component';
import { RentComponent} from './page/rent/rent.component'; 
//import { SubscriptionComponent } from './page/subscription/subscription.component';
import { SupportComponent } from './page/support/support.component';
import { UserManagementComponent } from './page/user-management/user-management.component';
import { UserProfileComponent } from './page/user-profile/user-profile.component';
import { VehiclesComponent } from './page/vehicles/vehicles.component';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'map',
        component: MapDashboardComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Map' },
      },
      {
        path: 'vehicles',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Vehicles' },
        children: [
          {
            path: '',
            component: VehiclesComponent,
          },
          {
            path: 'add',
            component: AddVehiclesComponent,
            data: { breadcrumb: 'Add' },
          },
          {
            path: 'edit/:id',
            component: EditVehiclesComponent,
            data: { breadcrumb: 'Edit' },
          },
        ]
      },
      {
        path: 'console',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Console' },
        component: ConsoleComponent
      },
      {
        path: 'report',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Report' },
        component: ReportComponent
      },
      {
        path: 'locations',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Locations' },
        children: [
          {
            path: '',
            component: LocationsComponent
          },
          {
            path: 'add',
            component: LocationComponent,
            data: {
              breadcrumb: 'Add',
              type: 'ADD'
            },
          },
          {
            path: 'edit/:id',
            component: LocationComponent,
            data: {
              breadcrumb: 'Edit',
              type: 'EDIT'
            },
          },
        ]
      },
      {
        path: 'modules',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Modules' },
        children: [
          {
            path: '',
            component: HwModulesComponent,
          },
          {
            path: 'add',
            component: AddModuleComponent,
            data: { breadcrumb: 'Add' },
          },
          {
            path: 'edit/:id',
            component: EditModuleComponent,
            data: { breadcrumb: 'Edit' },
          },
        ]
      },/*
      {
        path: 'subscription',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Subscription' },
        children: [
          {
            path: '',
            component: SubscriptionComponent,
          },
          {
            path: 'add',
            component: AddSubscriptionComponent,
            data: { breadcrumb: 'Add' },
          },
          {
            path: 'edit/:id',
            component: EditSubscriptionComponent,
            data: { breadcrumb: 'Edit' },
          },
        ]
      },*/
      {
        path: 'support',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Support' },
        children: [
          {
            path: '',
            component: SupportComponent,
          },
          {
            path: 'add',
            component: AddSupportComponent,
            data: { breadcrumb: 'Add' },
          },
          {
            path: 'edit/:id',
            component: EditSupportComponent,
            data: { breadcrumb: 'Edit' },
          },
        ]
      },
      {
        path: 'rent',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Rent' },
        children: [
          {
            path: '',
            component: RentComponent,
          },
          {
            path: 'add',
            component: AddRentComponent,
            data: { breadcrumb: 'Add' },
          },
          {
            path: 'edit/:id',
            component: EditRentComponent,
            data: { breadcrumb: 'Edit' },
          },
        ]
      },
      
      /*
      {
        path: 'rebate',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Rebate' },
        children: [
          {
            path: '',
            component: RebateComponent,
          },
          {
            path: 'add',
            component: AddRebateComponent,
            data: { breadcrumb: 'Add' },
          },
          {
            path: 'edit/:id',
            component: EditRebateComponent,
            data: { breadcrumb: 'Edit' },
          },
        ]
      },*/
      {
        path: 'user-management',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'User management' },
        children: [
          {
            path: '',
            component: UserManagementComponent,
          },
          {
            path: 'add',
            component: AddUserComponent,
            data: { breadcrumb: 'Add' },
          },
          {
            path: 'edit/:id',
            component: EditUserComponent,
            data: { breadcrumb: 'Edit' },
          },
        ]
      },
      {
        path: 'user',
        component: UserProfileComponent,
        data: { breadcrumb: 'User profile' },
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

