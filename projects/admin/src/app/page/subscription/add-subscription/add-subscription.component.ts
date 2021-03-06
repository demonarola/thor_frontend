import { Component, OnInit } from '@angular/core';

import { AddPageTemplate } from '../../add-page.template';
import { AutoUnsubscribe } from 'projects/nvl-shared/src/lib/decorator/autounsubscribe.decorator';
import { NotifyService } from '../../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { Subscription } from '../subscription.model';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.component.html'
})
export class AddSubscriptionComponent extends AddPageTemplate<Subscription> implements OnInit {

  users$: Observable<any>;
  rebateFixed$: Observable<any>;
  rebatePercentage$: Observable<any>;
  subscriptions$: Observable<any>;

  rebateType = 'fixed';

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected notifyService: NotifyService,
    protected translateService: TranslateService
  ) {
    super(
      environment.api.path.subscription,
      restClientService,
      router,
      notifyService,
      translateService
    );

    this.model = new Subscription();
  }

  ngOnInit() {
    this.users$ = this.restClientService.get(environment.api.path.dropdown.user_management);
    this.rebateFixed$ = this.restClientService.get(environment.api.path.dropdown.rebate_fixed);
    this.rebatePercentage$ = this.restClientService.get(environment.api.path.dropdown.rebate_percentage);
    this.subscriptions$ = this.restClientService.get(environment.api.path.dropdown.subscription_model);
  }

  onRebateValChange(value: string) {
    this.rebateType = value;
  }
}
