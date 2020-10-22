import { Inject, LOCALE_ID, OnDestroy, ViewChild } from '@angular/core';
import { Page, PageRequest, ServiceFilter } from 'projects/nvl-shared/src/public-api';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { AuthenticationService } from '../security/service/authentication/authentication.service';
import { DialogService } from 'dialog-service';
import { NgForm } from '@angular/forms';
import { NotifyService } from '../service/notify/notify.service';
import { RestClientService } from '../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

// TODO move to nvl shared
export abstract class OverviewPageTemplate<T, F extends ServiceFilter> implements OnDestroy {

    @ViewChild('filterForm', { static: true }) filterForm: NgForm;

    page: Page<T>;
    serviceFilter: F;
    pageRequest: PageRequest = new PageRequest(1, 10);
    rows = [];
    loader = false;

    createPermission = false;
    editPermission = false;
    deletePermission = false;
    defaultViewPermission = false;

    protected $ngDestroyed = new Subject();

    translate = (tag: string) => this.translateService.instant(tag);

    constructor(
        private path: string,
        private scope: string,
        protected restClientService: RestClientService,
        private filterType: new () => F,
        protected router: Router,
        protected notifyService: NotifyService,
        protected dialogService: DialogService,
        protected translateService: TranslateService,
        public authenticationService: AuthenticationService,
        protected initFirstPage: boolean = true
    ) {
        this.initFilter(filterType);
        this.setFirstPage(initFirstPage);
        this.checkPermissions();
    }

    private initFilter(filterType) {
        if (filterType !== null) {
            this.serviceFilter = new this.filterType();
        }
    }

    ngOnDestroy() {
        this.$ngDestroyed.next();
        this.$ngDestroyed.complete();
    }

    checkPermissions() {
        this.createPermission = this.authenticationService.checkPermission(this.scope, 'create');
        this.editPermission = this.authenticationService.checkPermission(this.scope, 'update');
        this.deletePermission = this.authenticationService.checkPermission(this.scope, 'delete');
        this.defaultViewPermission = this.authenticationService.checkPermission(this.scope, 'default_view');
    }

    changePageSize(size) {
        this.pageRequest = new PageRequest(1, size);
        this.setFirstPage();
    }

    setFirstPage(initFirstPage = true) {
        if (initFirstPage) {
            this.setPage(1);
        }
    }

    setPage(pageNumber: number) {
        this.pageRequest.page = pageNumber;
        this.fetch();
    }

    fetch() {
        this.loader = true;
        this.restClientService.get(this.path, `?page=${this.pageRequest.page}&size=${this.pageRequest.size}&${this.serviceFilter.toHttpParams().toString()}`).subscribe(
            response => {
                this.page = response.data;
                this.rows = response.data.content;

                if (this.rows === undefined) { this.rows = []; }
                this.loader = false;
            }
        );
    }

    subscribeToFilterChange() {
        if (this.filterForm) {
            this.filterForm.valueChanges.pipe(takeUntil(this.$ngDestroyed), debounceTime(400), distinctUntilChanged((a, b) => {
                return JSON.stringify(a) === JSON.stringify(b);
            })).subscribe(() => {
                // only start a new search if form has changed to avoid going to first page after loading filters from store
                // after filters change, start from first page and filter results
                if (this.filterForm.dirty) {
                    this.setFirstPage();
                }
            });
        }
    }

    resetFilters() {
        this.filterForm.reset();
        this.fetch();
    }

    add() {
        this.router.navigate([`${this.router.url}/add`]);
    }

    edit(event) {
        this.router.navigate([`${this.router.url}/edit/${event.id}`]);
    }

    delete(event) {
        this.dialogService.withConfirm(`${this.translate('delete-confirm')}[${event.id}]`).pipe().subscribe(
            (confirm) => {
                if (confirm) {
                    this.doDelete(event.id);
                }
            }
        );
    }

    private doDelete(id) {
        this.restClientService.delete(this.path, id).subscribe(
            response => {
                if (response.success) {
                    this.notifyService.successDelete();
                    this.serviceFilter = new this.filterType();
                    this.setFirstPage();
                } else {
                    this.notifyService.error(response.message);
                }
            }
        );
    }
}