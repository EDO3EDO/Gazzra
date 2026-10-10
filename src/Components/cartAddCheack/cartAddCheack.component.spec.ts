/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CartAddCheackComponent } from './cartAddCheack.component';

describe('CartAddCheackComponent', () => {
  let component: CartAddCheackComponent;
  let fixture: ComponentFixture<CartAddCheackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartAddCheackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartAddCheackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
