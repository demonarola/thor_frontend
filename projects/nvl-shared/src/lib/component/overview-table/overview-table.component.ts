import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Page, PageRequest } from '../../model/page.model';

import { SelectionType } from '@swimlane/ngx-datatable';

const ROW_SIZE = 60;

@Component({
  selector: 'nvl-overview-table',
  templateUrl: './overview-table.component.html',
  styleUrls: ['./overview-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OverviewTableComponent<T> implements OnInit {
  @ViewChild('table', { static: false }) table: any;

  expanded: any = {};
  rowHeight: number;

  @Input()
  deleteEnabled = true;

  @Input()
  editEnabled = true;

  @Input()
  columns: [];

  @Input()
  rows: [];

  @Input()
  loader: false;

  @Input()
  page: Page<T>;

  @Input()
  pageRequest: PageRequest;

  availablePageSizeList = [5, 10, 20, 30, 40, 50];

  @Output()
  changePage = new EventEmitter<number>();

  @Output()
  changePageSize = new EventEmitter<number>();

  @Output()
  deleteEntity = new EventEmitter<number>();

  @Output()
  navigateToEdit = new EventEmitter<number>();

  @Output()
  actionListAction = new EventEmitter<any>();

  @Output()
  selectRow = new EventEmitter<any>();

  @Input()
  selectionType: SelectionType = null;

  selected = [];

  constructor() { }

  executeAction(row, action) {
    this.actionListAction.emit({ row, action });
  }

  ngOnInit() {
    this.rowHeight = (this.columns.length + 1) * ROW_SIZE;
  }

  onNavigateToEditClick(value) {
    this.navigateToEdit.emit(value);
  }

  onDeleteEntityClick(value: number) {
    this.deleteEntity.emit(value);
  }

  onPageChange(pageNumber: number) {
    this.rows = null;
    this.changePage.emit(pageNumber);
  }

  onPageSizeChange(size: number) {
    this.changePageSize.emit(size);
  }

  getValue(row, column) {
    let value = row[column.prop];
    if (column.pipe !== null && column.pipe !== undefined && value !== null) {
      value = column.pipe.transform(value);
    }

    return value;
  }

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    if (window.innerWidth > 900) {
      this.rowHeight = 0;
    } else {
      this.rowHeight = (this.columns.length + 1) * ROW_SIZE;
    }
  }

  onDetailToggle($event) {
  }

  onSelect($event) {
    this.selectRow.emit($event);
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

}
