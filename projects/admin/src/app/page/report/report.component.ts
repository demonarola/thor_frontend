import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe, ConditionalPipe, DateTimestamp, Page, PageRequest, TimestampPipe } from 'projects/nvl-shared/src/public-api';
import { Observable, from } from 'rxjs';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { BigScreenService } from 'angular-bigscreen';
import { DatePipe } from '@angular/common';
import { MapComponent } from 'projects/nvl-shared/src/lib/component/map/map.component';
import { MapService } from 'projects/nvl-shared/src/lib/service/map/map.service';
import { Report } from './report.model';
import { ReportFilter } from './report.filter';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { SelectionType } from '@swimlane/ngx-datatable';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

declare let L;

const DROPDOWN_PATHS = environment.api.path.dropdown;

@AutoUnsubscribe()
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent extends MapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('reportMap', { static: null })
  elementRef: ElementRef;

  SelectionType = SelectionType;

  conditionalPipe = new ConditionalPipe();
  dateTimestampPipe = new DateTimestamp();

  users$: Observable<any>;
  objects$: Observable<any>;

  filter: ReportFilter;
  report: Report;

  pageRequest: PageRequest = new PageRequest(1, 5);
  page: Page<Report>;
  loader = false;

  featureGroupPoint;
  featureGroupLine;

  rows = [];

  columns = [
    { name: 'coordinates', prop: 'geom.coordinates' },
    { name: 'speed', prop: 'meta_information.speed' },
    { name: 'event-time', prop: 'event_time', pipe: this.dateTimestampPipe },
    { name: 'in-geofence', prop: 'in_geofence', pipe: this.conditionalPipe, cellClass: 'text-center', headerClass: 'text-center' },
  ];

  translate = (tag: string) => this.translateService.instant(tag);

  constructor(
    private restClientService: RestClientService,
    private translateService: TranslateService,
    public authenticationService: AuthenticationService,
    protected mapService: MapService,
    protected bigScreenService: BigScreenService,
    protected router: Router,
    private datePipe: DatePipe,
  ) {
    super(bigScreenService, mapService);
    this.filter = new ReportFilter(this.datePipe);
  }

  ngOnInit() {
    this.users$ = this.restClientService.get(DROPDOWN_PATHS.user_management);

    if (!this.authenticationService.checkPermission('report', 'filter_users')) {
      this.objects$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.traceable_object);
    }
  }

  ngAfterViewInit() {
    this.init();
  }

  ngOnDestroy() {
  }

  resetFilters() {
    this.filter = new ReportFilter(this.datePipe);
    this.report = null;
    this.featureGroupPoint.clearLayers();
  }

  onUserSelectChange($event) {
    this.filter.dateTo = null;
    this.filter.dateFrom = null;
    this.report = null;
    this.page = null;
    this.filter.traceableObjectId = null;

    let options;

    if ($event !== null && $event !== undefined) {
      options = `?user_id=${$event}`;
    }

    this.objects$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.traceable_object, options);
  }

  onTraceableObjectSelectChange($event) {
    this.filter.dateTo = null;
    this.filter.dateFrom = null;
    this.report = null;
    this.page = null;
    this.getTripInfo();
  }

  onDateFromChange($event) {
    this.filter.dateTo = null;
    this.page = null;
  }

  onDateToChange($event) {
    this.filter.dateTo = $event;
    this.setFirstPage();
  }

  setPage(pageNumber: number) {
    this.pageRequest.page = pageNumber;
    this.fetch();
  }

  changePageSize(size) {
    this.pageRequest = new PageRequest(1, size);
    this.setFirstPage();
  }

  setFirstPage() {
    this.setPage(1);
  }

  selectedRow($event) {
    const coordinates = $event.selected[0]
      .geom
      .coordinates;

    this.featureGroupPoint.clearLayers();

    const marker = L.marker(coordinates).addTo(this.featureGroupPoint);

    this.map.setView(this.featureGroupPoint.getBounds().getCenter(), environment.zoomLevel.reportMarker);
  }

  private init() {
    this.createMap();
    this.addLayers(
      [
        'open-street-maps',
        'open-sea-maps',
        'graticule',
        'scalebar'
      ]
    );
    this.addScalebarButton();
    this.addExpandButton();

    this.featureGroupPoint = L.featureGroup().addTo(this.map);
    this.featureGroupLine = L.featureGroup().addTo(this.map);
  }

  private getTripInfo() {
    if (this.featureGroupLine !== undefined) {
      this.featureGroupLine.clearLayers();
    }

    this.restClientService.get(environment.api.path.trip_info, `?${this.filter.toHttpParams().toString()}`).subscribe(
      response => {
        if (response.success) {
          this.report = response.data;
        }
      }
    );
  }

  private fetch() {
    this.loader = true;
    this.getTripInfo();

    this.restClientService.get(environment.api.path.report, `?page=${this.pageRequest.page}&size=${this.pageRequest.size}&${this.filter.toHttpParams().toString()}`).subscribe(
      response => {
        this.page = response.data;

        if (response !== null && response !== undefined && response.data !== null && response.data !== undefined) {
          this.rows = response.data.content;
        }

        if (this.rows === undefined) { this.rows = []; }

        this.loader = false;
      }
    );

    this.restClientService.get(`${environment.api.path.module_position.line}`, `?${this.filter.toLineHttpParams().toString()}`).subscribe(
      response => {
        if (response.data.features !== undefined && Array.isArray(response.data.features)) {
          this.mapService.addPolyLinesToFeatureGroup(response.data.features, this.featureGroupLine);
        } else if (response.data.features !== undefined) {
          this.mapService.addPolyLinesToFeatureGroup([response.data.features], this.featureGroupLine);
        }
      }
    );
  }

}
