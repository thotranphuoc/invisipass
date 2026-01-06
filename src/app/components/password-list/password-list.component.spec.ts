import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordListComponent } from './password-list.component';

describe('PasswordList', () => {
  let component: PasswordListComponent;
  let fixture: ComponentFixture<PasswordListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
