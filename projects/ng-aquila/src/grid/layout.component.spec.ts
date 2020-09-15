import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Component, ViewChild, Type, Directive } from '@angular/core';
import { NxLayoutComponent } from './layout.component';
import { NxGridModule } from './grid.module';

// tslint:disable:component-class-suffix

@Directive()
abstract class DirectiveTest {
    @ViewChild(NxLayoutComponent) layoutInstance: NxLayoutComponent;
}

describe('NxLayoutDirective', () => {

    let fixture: ComponentFixture<DirectiveTest>;
    let testInstance: DirectiveTest;
    let divInstance: NxLayoutComponent;
    let divNativeElement: HTMLButtonElement;

    function createTestComponent(component: Type<DirectiveTest>) {
      fixture = TestBed.createComponent(component);
      fixture.detectChanges();
      testInstance = fixture.componentInstance;
      divInstance = testInstance.layoutInstance;
      divNativeElement = <HTMLButtonElement>fixture.nativeElement.querySelector('div');
    }

    function getClassesCreated(component: Type<DirectiveTest>): String {
        createTestComponent(component);
        return sortedClassNames(divNativeElement);
    }

    function sortedClassNames(element: Element): String {
      return element.className.split(' ').sort().join(' ');
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [ BasicLayout,
                          BasicGridLayout,
                          BasicGridLayoutClassTest,
                          BasicNoGutters,
                          BasicMaxWidth,
                          BasicCombinate,
                          Basic2Combinate,
                          BasicCompleteReverse,
                          DynamicLayout
        ],
          imports: [ NxGridModule ]
        })
        .compileComponents();
      }
    ));

    it('should test with input nxLayout="grid"', () => {
        expect(getClassesCreated(BasicGridLayout)).toEqual('nx-grid');
    });

    it('should test with input nxLayout="grid" and class="test"', () => {
        expect(getClassesCreated(BasicGridLayoutClassTest)).toEqual('nx-grid test');
    });

    it('should test with input nxLayout="grid nogutters"', () => {
        expect(getClassesCreated(BasicNoGutters)).toEqual('nx-grid nx-grid--no-gutters');
    });

    it('should test with input nxLayout="grid maxwidth"', () => {
        expect(getClassesCreated(BasicMaxWidth)).toEqual('nx-grid nx-grid--max-width');
    });

    it('should test with input "grid" maxwidth nogutters', () => {
        expect(getClassesCreated(BasicCombinate)).toEqual('nx-grid nx-grid--max-width nx-grid--no-gutters');
    });

    it('should test with input "grid" nogutters maxwidth', () => {
        expect(getClassesCreated(Basic2Combinate)).toEqual('nx-grid nx-grid--max-width nx-grid--no-gutters');
    });

    it('should test with input nogutters grid maxwidth', () => {
        expect(getClassesCreated(BasicCompleteReverse))
            .toEqual('nx-grid nx-grid--max-width nx-grid--no-gutters');
    });

    it('should update class names after input change', () => {
      createTestComponent(DynamicLayout);
      (testInstance as DynamicLayout).layout = 'grid nogutters';
      fixture.detectChanges();
      expect(sortedClassNames(divNativeElement)).toEqual('nx-grid nx-grid--no-gutters');
    });
});

  @Component( {
    template: `<div nxLayout=''></div> `
  }) class BasicLayout extends DirectiveTest {}

  @Component( {
    template: `<div nxLayout='grid'></div> `
  }) class BasicGridLayout extends DirectiveTest {}

  @Component( {
    template: `<div nxLayout='grid' class='test'></div> `
  }) class BasicGridLayoutClassTest extends DirectiveTest {}

  @Component( {
    template: `<div nxLayout='grid nogutters'></div> `
  }) class BasicNoGutters extends DirectiveTest {}

  @Component( {
    template: `<div nxLayout='grid maxwidth'></div> `
  }) class BasicMaxWidth extends DirectiveTest {}

  @Component( {
    template: `<div nxLayout='grid maxwidth nogutters'></div> `
  }) class BasicCombinate extends DirectiveTest {}

  @Component( {
    template: `<div nxLayout='grid nogutters maxwidth'></div> `
  }) class Basic2Combinate extends DirectiveTest {}

  @Component( {
    template: `<div nxLayout='maxwidth grid nogutters' ></div> `
  }) class BasicCompleteReverse extends DirectiveTest {}

  @Component( {
    template: `<div [nxLayout]='layout' ></div> `
  }) class DynamicLayout extends DirectiveTest {
    layout = 'grid';
  }
