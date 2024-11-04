import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GptFileUploaderComponent } from './gpt-file-uploader.component';

describe('GptFileUploaderComponent', () => {
  let component: GptFileUploaderComponent;
  let fixture: ComponentFixture<GptFileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GptFileUploaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GptFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
