import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { environment } from 'projects/admin/src/environments/environment';
import { NotifyService } from '../../service/notify/notify.service';
import { ActiveActionModel } from '../../page/map-dashboard/active-action.model';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { AutoUnsubscribe } from 'projects/nvl-shared/src/public-api';

@AutoUnsubscribe()
@Component({
  selector: 'app-map-point-dialog',
  templateUrl: './map-point-dialog.component.html',
  styleUrls: ['./map-point-dialog.component.scss']
})
export class MapPointDialogComponent implements OnDestroy {
  data: any;
  vehicleData: any;
  actions: any[];
  name: string;
  hw_module_id: any;

  pollSubscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public parentData: any,
    public dialogRef: MatDialogRef<MapPointDialogComponent>,
    private restClientService: RestClientService,
    private notifyService: NotifyService,
  ) {
    this.initData(parentData);
    this.poll();
  }

  slide($event, action) {
    const model = new ActiveActionModel();

    model.hw_action_id = action.hw_action_id;
    model.name = action.name;
    model.hw_module_id = this.hw_module_id;
    model.value = `${$event.checked}`;

    action.disabled = true;

    this.restClientService.post(environment.api.path.command, model).subscribe(
      response => {
        if (response.success) {
          this.notifyService.successSave();
        } else {
          this.notifyService.error(response.message);
        }
      }
    );
  }

  click($event, action) {
    const model = new ActiveActionModel();

    model.hw_action_id = action.hw_action_id;
    model.name = action.name;
    model.hw_module_id = this.hw_module_id;

    action.disabled = true;

    this.restClientService.post(environment.api.path.command, model).subscribe(
      response => {
        if (response.success) {
          this.notifyService.successExecute();
        } else {
          this.notifyService.error(response.message);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.pollSubscription.unsubscribe();
  }

  private initData(parentData: any) {
    this.data = parentData.properties.data;
    this.vehicleData = parentData.properties.vehicle_data;
    this.actions = parentData.properties.vehicle_data.action_list.sort((a, b) => (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0));
    this.name = parentData.properties.vehicle_name;
    this.hw_module_id = parentData.properties.hw_module_id;
  }

  private poll() {
    this.pollSubscription = interval(environment.action_poll_interval)
      .pipe(
        startWith(0),
        switchMap(() => this.restClientService.get(`${environment.api.path.module_position.point}/${this.hw_module_id}`))
      )
      .subscribe(res => {
        this.actions = res.data.features[0].vehicle_data.action_list.sort((a, b) => (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0));
      });
  }

}


