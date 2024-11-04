import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GptFormControlFileUploaderComponent } from './gpt-form-control-file-uploader.component';

describe('GptFormControlFileUploaderComponent', () => {
  let component: GptFormControlFileUploaderComponent;
  let fixture: ComponentFixture<GptFormControlFileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GptFormControlFileUploaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GptFormControlFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
