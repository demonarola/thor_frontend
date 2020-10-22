import { AutoUnsubscribe, ConditionalPipe } from 'projects/nvl-shared/src/public-api';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { DialogService } from 'dialog-service';
import { ModulesFilter } from './hw_modules.filter';
import { NotifyService } from '../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { OverviewPageTemplate } from '../overview-page.template';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-modules',
  templateUrl: './hw_modules.component.html'
})
export class HwModulesComponent extends OverviewPageTemplate<any, ModulesFilter> implements OnInit {
  conditionalPipe = new ConditionalPipe();

  users$: Observable<any>;

  userId: number;

  columns = [
    { name: 'name', prop: 'name', nonResponsive: true, minWidth: 200 },
    { name: 'module-id', prop: 'module_id' },
    { name: 'user-fullname', prop: 'user_name' },
    { name: 'show-on-map', prop: 'show_on_map', pipe: this.conditionalPipe, maxWidth: 200, cellClass: 'text-center', headerClass: 'text-center' },
    { name: 'active', prop: 'active', pipe: this.conditionalPipe, maxWidth: 200, cellClass: 'text-center', headerClass: 'text-center' }
  ];

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected notifyService: NotifyService,
    protected dialogService: DialogService,
    protected translateService: TranslateService,
    public authenticationService: AuthenticationService
  ) {
    super(
      environment.api.path.hw_modules,
      environment.scopes.hw_modules,
      restClientService,
      ModulesFilter,
      router,
      notifyService,
      dialogService,
      translateService,
      authenticationService
    );
  }
  ngOnInit() {
    this.subscribeToFilterChange();
    this.users$ = this.restClientService.get(environment.api.path.dropdown.user_management);
  }

  onUserSelectChange($event) {
    this.serviceFilter.user_id = $event;
    this.fetch();
  }
}
