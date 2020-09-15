import { Directive, Input, QueryList, ContentChildren, Optional, isDevMode, EventEmitter, Output } from '@angular/core';
import { NxComparisonTableRowDirective } from './comparison-table-row.directive';
import { NxTableContentElement } from './table-content-element.directive';
import { NxComparisonTableRowGroupBase } from './comparison-table-row-group-base';
import { NumberInput, coerceNumberProperty, coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { NxToggleSectionBase } from './toggle-section/toggle-section-base';

@Directive({
  selector: '[nxComparisonTableRowGroup]',
  providers: [
    { provide: NxTableContentElement, useExisting: NxComparisonTableRowGroupDirective },
    { provide: NxComparisonTableRowGroupBase, useExisting: NxComparisonTableRowGroupDirective }
  ],
})
export class NxComparisonTableRowGroupDirective extends NxComparisonTableRowGroupBase implements NxTableContentElement {
  /** @docs-private */
  @ContentChildren(NxComparisonTableRowDirective) rows: QueryList<NxComparisonTableRowDirective>;

  /**
   * Sets the label of the expandable area that is shown when the row group is collapsed.
   *
   * The label property is deprecated. Please use labelCollapsed instead.
   *
   * @deprecated
   * @deletion-target 10.0.0
   */
  @Input()
  set label(newValue: string) {
    if (newValue !== this._labelCollapsed) {
      this._labelCollapsed = newValue;
      if (isDevMode()) {
        console.warn('Warning: The label property is deprecated. Use labelCollapsed instead');
      }
    }
  }
  get label(): string {
    return this._labelCollapsed;
  }

  private _labelCollapsed: string = 'More services';

  /**
   * Sets the label of the expandable area that is shown when the row group is collapsed.
   *
   * If the deprecated `label` is set, this value is taken instead.
   * This will be removed in v11.0.0.
   */
  @Input()
  set labelCollapsed(newValue: string) {
    if (newValue !== this._labelCollapsed) {
      this._labelCollapsed = newValue;
    }
  }
  get labelCollapsed(): string {
    return this._labelCollapsed;
  }

  private _labelExpanded: string = 'Less services';

  /** Sets the label of the expandable area that is shown when the row group is expanded. */
  @Input()
  set labelExpanded(newValue: string) {
    if (newValue !== this._labelExpanded) {
      this._labelExpanded = newValue;
    }
  }
  get labelExpanded(): string {
    return this._labelExpanded;
  }

  _visibleRows: number = 5;

  /** Sets the number of rows that are visible when loading the component. Default: 5. */
  @Input()
  set visibleRows(value: number) {
    const newValue = coerceNumberProperty(value);
    if (newValue !== this._visibleRows) {
      this._visibleRows = newValue;
    }
  }
  get visibleRows(): number {
    return this._visibleRows;
  }

  _isExpanded: boolean = false;

  /** Sets the expanded state of the row group */
  @Input()
  set isExpanded(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._isExpanded) {
      this._isExpanded = newValue;
    }
  }

  get isExpanded(): boolean {
    return this._isExpanded;
  }

  /** An event emitted every time the expanded state of the group changes */
  @Output() isExpandedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    @Optional() private _toggleSection: NxToggleSectionBase
  ) {
    super();
  }

  _isPartOfToggleSection(): boolean {
    return (this._toggleSection) ? true : false;
  }

  _handleIsExpandedChange(value: boolean) {
    this.isExpanded = value;
    this.isExpandedChange.emit(this.isExpanded);
  }

  static ngAcceptInputType_visibleRows: NumberInput;
  static ngAcceptInputType_isExpanded: BooleanInput;
}
