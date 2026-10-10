/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CartPoPupComponent } from './cartPoPup.component';

describe('CartPoPupComponent', () => {
  let component: CartPoPupComponent;
  let fixture: ComponentFixture<CartPoPupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartPoPupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartPoPupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
