import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ChangeDetectorRef,
  AfterContentInit,
  OnDestroy,
  ContentChildren,
  QueryList,
  Optional,
  Self,
  OnInit,
  ContentChild,
  ViewChild,
  ElementRef,
  DoCheck,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  NgForm,
  FormGroupDirective,
  FormControl
} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { NxLabelComponent } from '@aposin/ng-aquila/base';
import { ErrorStateMatcher } from '@aposin/ng-aquila/utils';

let nextId = 0;

export class NxCheckboxChangeEvent {
  constructor(
    /** The checked value of the checkbox. */
    public checked: boolean,
    /** The value of the checkbox. */
    public value: string,
    /** The component instance of the checkbox which emitted the change event. */
    public checkbox: NxCheckboxComponent
  ) { }
}

export class NxCheckboxGroupChangeEvent {
  constructor(
  /** The value of the checkbox group. An array containing all checked checkbox values. */
  public value: string[],
  /** The component instance of the checkbox group. */
  public checkboxGroup: NxCheckboxGroupComponent
  ) {}
}

/** Size of the label. */
export type NxCheckboxLabelSize = 'small' | 'large';

@Component({
  selector: 'nx-checkbox-group',
  templateUrl: 'checkbox-group.component.html',
  styleUrls: ['checkbox-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nx-checkbox-group]': 'true',
    '[class.nx-checkbox-group--negative]': 'negative',
    '[attr.id]': 'id',
    '[attr.required]': 'required',
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-labelledby]': 'this._label?.id  || null',
    '[attr.role]': '"group"',
  }
})
export class NxCheckboxGroupComponent implements ControlValueAccessor, AfterContentInit, OnDestroy, DoCheck {
  @ContentChildren(forwardRef(() => NxCheckboxComponent), { descendants: true }) _checkboxes: QueryList<NxCheckboxComponent>;

  @ContentChild(forwardRef(() => NxLabelComponent))
   _label: NxLabelComponent;

  readonly _stateChanges = new Subject<void>();
  errorState: boolean = false;
  @Output() selectionChange: EventEmitter<NxCheckboxGroupChangeEvent> = new EventEmitter<NxCheckboxGroupChangeEvent>();

  private _id: string = `nx-checkbox-group-${nextId++}`;
  /** Sets the Id of the checkbox group. */
  @Input()
  set id(value: string) {
    if (this._id !== value) {
      this._id = value;
      this._changeDetectorRef.markForCheck();
    }
  }

  get id(): string {
    return this._id;
  }

  private _name: string;
  /** Sets the name of the checkboxes inside the nx-checkbox-group. */
  @Input()
  set name(value: string) {
    this._name = value;
    this._changeDetectorRef.markForCheck();
  }

  get name(): string {
    return this._name;
  }

  private _disabled: boolean = false;

  /** Disables all checkboxes inside the nx-checkbox-group. */
  @Input()
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    if (this._label) {
      this._label.disabled = this._disabled;
    }
    this._stateChanges.next();
  }

  get disabled(): boolean {
    return this._disabled;
  }

  private _negative: boolean = false;
  /** Set the negative styles for all the checkboxes inside the nx-checkbox-group */
  @Input()
  set negative(value: boolean) {
    this._negative = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
    this._stateChanges.next();
  }

  get negative(): boolean {
    return this._negative;
  }

  private _labelSize: NxCheckboxLabelSize;
  /** Sets the label size of the checkboxes inside the group */
  @Input()
  set labelSize(value: NxCheckboxLabelSize) {
    this._labelSize = value;
    this._stateChanges.next();
  }

  get labelSize(): NxCheckboxLabelSize {
    return this._labelSize;
  }

  /** Whether the nx-checkbox-group are required. */
  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }

  private _required: boolean;

  private _value: any[];

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _errorStateMatcher: ErrorStateMatcher,
    @Optional() private _parentForm: NgForm,
    @Optional() private _parentFormGroup: FormGroupDirective,
    @Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this._updateSelectedCheckboxFromValue();
    });

    this._checkboxes.changes.subscribe(() => {
      this._value = this._checkboxes.filter(checkbox => checkbox.checked).map(cb => cb.value);

      if (this.ngControl) {
        this.ngControl.control.setValue(this._value);
      }
      this._updateSelectedCheckboxFromValue();
    });
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }
  }

  ngOnDestroy() {
    this._stateChanges.complete();
  }

  writeValue(value: any): void {
    if (this._value !== value) {
      this._value = value;
      this._updateSelectedCheckboxFromValue();
    }
  }

  registerOnChange(fn: (value: any) => void) {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private _onChange: (value: any) => void = () => { };

  private _onTouched: () => any = () => { };

  private _updateSelectedCheckboxFromValue(): void {
    if (this._checkboxes && this._checkboxes.length && !!this._value && this._value.length) {
      this._checkboxes.map(checkbox => {
        checkbox.checked = this._value.indexOf(checkbox.value) !== -1;
      });
    }
  }

  /** @docs-private */
  change(value) {
    const checkedCheckboxValues = this._checkboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    this._onChange(checkedCheckboxValues);

    if (this._onTouched) {
      this._onTouched();
    }

    this.selectionChange.emit(new NxCheckboxGroupChangeEvent(checkedCheckboxValues, this));
  }

  /** Checkbox instances in the checkbox group. */
  get checkboxes(): NxCheckboxComponent[] {
    return this._checkboxes.toArray();
  }

   /** @docs-private */
   updateErrorState() {
    const oldState = this.errorState;
    const parent = this._parentFormGroup || this._parentForm;
    const control = this.ngControl ? this.ngControl.control as FormControl : null;
    const newState = this._errorStateMatcher.isErrorState(control, parent);

    if (newState !== oldState) {
      this.errorState = newState;
      this._changeDetectorRef.markForCheck();
    }
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_negative: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;
}

@Component({
  selector: 'nx-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nx-checkbox]': 'true',
    '[class.disabled]': 'disabled',
    '[class.nx-checkbox--label-large]': 'labelSize === "large"',
    '[class.nx-checkbox--label-small]': 'labelSize === "small"',
    '[class.nx-checkbox--negative]': 'negative',
    '[class.has-error]': '_controlInvalid() || null',
    '[attr.required]': 'required',
    '[attr.aria-invalid]': '_controlInvalid() || null',
  }
})

export class NxCheckboxComponent implements ControlValueAccessor, OnDestroy, OnInit {
  private _parentChangeSubscription: Subscription;
  private _id: string = (nextId++).toString();
  private _disabled: boolean = false;
  private _negative: boolean = false;
  private _labelSize: NxCheckboxLabelSize = 'small';
  private _checked = false;
  private _name: string = null;

  /** @docs-private */
  @ViewChild('checkboxLabelWrapper', { static: true }) _checkboxLabelWrapper: ElementRef;

  /**
   * Id of the checkbox.
   *
   * If not set, the checkbox gets an incremented value by default.
   */
  @Input()
  set id(value: string) {
    if (value !== this._id) {
      this._id = value;
      this._changeDetectorRef.markForCheck();
    }
  }

  get id() {
    return `nx-checkbox-${this._id}`;
  }

  /** Name of the checkbox. */
  @Input()
  set name(name: string) {
    this._name = name;
  }

  get name(): string {
    return (this.checkboxGroup && this.checkboxGroup.name) ? this.checkboxGroup.name : this._name;
  }

  /** Whether the checkbox is disabled. */
  @Input()
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this._changeDetectorRef.markForCheck();
    }
  }

  get disabled(): boolean {
    return (this.checkboxGroup && this.checkboxGroup.disabled) ? this.checkboxGroup.disabled : this._disabled;
  }

  /**
   * Sets the label size of the checkbox. Default value: small
   */
  @Input()
  set labelSize(value: NxCheckboxLabelSize) {
    this._labelSize = value;
    this._changeDetectorRef.markForCheck();
  }

  get labelSize(): NxCheckboxLabelSize {
    return (this.checkboxGroup && this.checkboxGroup.labelSize) ? this.checkboxGroup.labelSize : this._labelSize;
  }

  /**
   * Whether the checkbox has negative styling.
   */
  @Input()
  set negative(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._negative) {
      this._negative = newValue;
      this._changeDetectorRef.markForCheck();
    }
  }

  get negative(): boolean {
    return (this.checkboxGroup && this.checkboxGroup.negative) ? this.checkboxGroup.negative : this._negative;
  }

  /** Whether the checkbox is checked. */
  @Input()
  set checked(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._checked) {
      if (this._indeterminate) {
        this._setIndeterminate(false);
      }
      this._setChecked(newValue);
    }
  }

  get checked() {
    return this._checked;
  }

  private _indeterminate = false;

  /** Whether the checkbox is indeterminated. */
  @Input()
  set indeterminate(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    if (this._indeterminate !== newValue) {
      if (this._checked) {
        this._setChecked(false);
      }
      this._setIndeterminate(newValue);
    }
    this._changeDetectorRef.markForCheck();
  }

  get indeterminate() {
    return this._indeterminate;
  }

  /** Whether the checkbox is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }

  private _required: boolean;

  /** Sets the value of the checkbox. Default value is the checked status. */
  @Input()
  get value(): string {
    return this._value ? this._value : this.checked.toString();
  }

  set value(value: string) {
    this._value = value;
    this._changeDetectorRef.markForCheck();
  }

  private _value: string;

  /** An event emitted when the indeterminate value has changed */
  @Output()
  indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  /** An event emitted when the checked value has changed.
   *
   * Emits the boolean checked value of the changed checkbox.
   */
  @Output()
  checkedChange = new EventEmitter<boolean>(false);

  /** An event emitted when the checked value has changed.
   *
   * Emits a NxCheckboxChangeEvent.
   */
  @Output()
  checkboxChange: EventEmitter<NxCheckboxChangeEvent> = new EventEmitter<NxCheckboxChangeEvent>();

  /** @docs-private */
  get labelHasContent() {
    return !!this._checkboxLabelWrapper.nativeElement.innerHTML.trim();
  }

  /** @docs-private
   * Callback for when the content of the label has changed.
   */
  labelContentChanged() {
    this._changeDetectorRef.detectChanges();
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _errorStateMatcher: ErrorStateMatcher,
    @Optional() public checkboxGroup: NxCheckboxGroupComponent,
    @Self() @Optional() public ngControl: NgControl,
    @Optional() private _parentForm: NgForm,
    @Optional() private _parentFormGroup: FormGroupDirective
  ) {

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  /** @docs-private */
  _controlInvalid(): boolean {

    const parent = this._parentFormGroup || this._parentForm;
    let control = null;

    if (this.checkboxGroup && this.checkboxGroup.ngControl) {
      control = this.checkboxGroup.ngControl;
    } else {
      control = this.ngControl ? this.ngControl.control as FormControl : null;
    }

    return this._errorStateMatcher.isErrorState(control, parent);
  }

  ngOnInit() {
    if (this.checkboxGroup) {
      this.name = this.checkboxGroup.name;
      // when relevant properties of the parent like name and disabled change
      // we need to let change detection know that the template needs an update
      this._parentChangeSubscription = this.checkboxGroup._stateChanges.subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });
    }
  }

  ngOnDestroy() {
    if (this._parentChangeSubscription) {
      this._parentChangeSubscription.unsubscribe();
    }
  }

  private _setIndeterminate(value: boolean) {
    this._indeterminate = value;
    this.indeterminateChange.emit(this._indeterminate);
    this._changeDetectorRef.markForCheck();
  }

  private _setChecked(value: boolean) {
    this._checked = value;
    this._changeDetectorRef.markForCheck();
  }

  /** Toggles the checked state of the checkbox. */
  public toggle() {
    this.checked = !this.checked;
    this.onChangeCallback(this.checked);
    if (this.checkboxGroup !== null) {
      this.checkboxGroup.change(this);
    }
  }

  writeValue(value: any): void {
    if (value === null) {
      value = false;
    }
    if (value !== this.checked) {
      this.checked = value;
    }
  }

  private onChangeCallback = (_: any) => { };

  registerOnChange(onChange: any): void {
    this.onChangeCallback = onChange;
  }

  private onTouchedCallback = () => { };

  registerOnTouched(onTouched: any): void {
    this.onTouchedCallback = onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /** @docs-private */
  touch() {
    this.onTouchedCallback();
  }

  /** @docs-private */
  _onInputClick(event): void {
    // stop the propagation of the native click on the checkbox input so that a click is not triggered twice
    event.stopPropagation();
    if (!this.disabled) {
      this.toggle();
      this.checkedChange.emit(this._checked);
      this.checkboxChange.emit(this._createChangeEvent(this._checked));
    }
  }

  /**@docs-private */
  private _createChangeEvent(checkedValue: boolean): NxCheckboxChangeEvent {
    const event = new NxCheckboxChangeEvent(checkedValue, this.value, this);
    event.checked = checkedValue;
    event.value = this.value;
    event.checkbox = this;
    return event;
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_negative: BooleanInput;
  static ngAcceptInputType_checked: BooleanInput;
  static ngAcceptInputType_indeterminate: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;
}
