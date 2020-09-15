import { Component, Type, ViewChild, ChangeDetectionStrategy, Directive } from '@angular/core';
import { ComponentFixture, async, TestBed} from '@angular/core/testing';
import * as axe from 'axe-core';
import { NxActionComponent } from './action.component';
import { NxActionModule } from './action.module';

// For better readablity here, We can safely ignore some conventions in our specs
// tslint:disable:component-class-suffix

@Directive()
abstract class ActionTest {
  selected: boolean;
  expandable: boolean;
  expanded: boolean;
  @ViewChild(NxActionComponent) actionInstance: NxActionComponent;
}

describe(NxActionComponent.name, () => {
  let fixture: ComponentFixture<ActionTest>;
  let testInstance: ActionTest;
  let actionInstance: NxActionComponent;
  let actionElement: HTMLElement;

  function createTestComponent(component: Type<ActionTest>) {
    fixture = TestBed.createComponent(component);
    fixture.detectChanges();
    testInstance = fixture.componentInstance;
    actionInstance = testInstance.actionInstance;
    actionElement = fixture.nativeElement.querySelector('[nxAction]');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasicAction,
        DefaultAction
      ],
      imports: [
        NxActionModule
      ]
    }).compileComponents();
  }));

  describe('basic', () => {
    beforeEach(() => {
      createTestComponent(BasicAction);
    });

    it('creates the action', async(() => {
      expect(actionInstance).toBeTruthy();
    }));

    it('default action includes the bem block element', async(() => {
      expect(actionElement.classList.contains('nx-action')).toBeTruthy();
    }));

    it('is not selected', () => {
      expect(actionElement.classList.contains('is-selected')).toBeFalsy();
    });

    it('is not expandable', () => {
      expect(actionElement.classList.contains('is-expandable')).toBeFalsy();
    });

    it('is not expanded', () => {
      expect(actionElement.classList.contains('is-expanded')).toBeFalsy();
    });

    describe('selected action', () => {
      beforeEach(() => {
        testInstance.selected = true;
        fixture.detectChanges();
      });

      it('is selected', () => {
        expect(actionElement.classList.contains('is-selected')).toBeTruthy();
      });
    });

    describe('expandable action', () => {
      beforeEach(() => {
        testInstance.expandable = true;
        fixture.detectChanges();
      });

      it('is expandable', () => {
        expect(actionElement.classList.contains('is-expandable')).toBeTruthy();
      });
    });

    describe('expanded action', () => {
      beforeEach(() => {
        testInstance.expandable = true;
        testInstance.expanded = true;
        fixture.detectChanges();
      });

      it('is expanded', () => {
        expect(actionElement.classList.contains('is-expanded')).toBeTruthy();
      });
    });
  });

  describe('programatic', () => {
    beforeEach(() => {
      createTestComponent(DefaultAction);
    });

    describe('selected action', () => {
      beforeEach(() => {
        actionInstance.selected = true;
        fixture.detectChanges();
      });

      it('is selected', () => {
        expect(actionElement.classList.contains('is-selected')).toBeTruthy();
      });
    });

    describe('expandable action', () => {
      beforeEach(() => {
        actionInstance.expandable = true;
        fixture.detectChanges();
      });

      it('is expandable', () => {
        expect(actionElement.classList.contains('is-expandable')).toBeTruthy();
      });
    });

    describe('expanded action', () => {
      beforeEach(() => {
        actionInstance.expandable = true;
        actionInstance.expanded = true;
        fixture.detectChanges();
      });

      it('is expanded', () => {
        expect(actionElement.classList.contains('is-expanded')).toBeTruthy();
      });
    });
  });

  describe('a11y', () => {
    it('has no accessibility violations', function(done) {
      createTestComponent(BasicAction);

      axe.run(fixture.nativeElement, {},  (error: Error, results: axe.AxeResults) => {
        const violationMessages = results.violations.map(item => item.description).join('\n');
        if (violationMessages.length) {
          expect(violationMessages).toBeFalsy();
        }
        done();
      });
    });
  });
});

@Component({
  template: `
    <a nxAction>
      example action
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class DefaultAction extends ActionTest { }

@Component({
  template: `
    <a nxAction [expandable]="expandable" [expanded]="expanded" [selected]="selected">
      example action
    </a>
  `
})
class BasicAction extends ActionTest { }
