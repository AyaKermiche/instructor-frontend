import { TestBed } from '@angular/core/testing';

import { InstructorplanningService } from './instructorplanning.service';

describe('InstructorplanningService', () => {
  let service: InstructorplanningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructorplanningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
