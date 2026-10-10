/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReturnStep2Component } from './returnStep2.component';

describe('ReturnStep2Component', () => {
  let component: ReturnStep2Component;
  let fixture: ComponentFixture<ReturnStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
