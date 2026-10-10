/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClientChatComponent } from './clientChat.component';

describe('ClientChatComponent', () => {
  let component: ClientChatComponent;
  let fixture: ComponentFixture<ClientChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
