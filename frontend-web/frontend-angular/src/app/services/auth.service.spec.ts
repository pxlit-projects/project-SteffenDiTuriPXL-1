import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let sessionStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    // Create a spy object for sessionStorage methods
    sessionStorageSpy = jasmine.createSpyObj('sessionStorage', ['getItem', 'setItem', 'removeItem']);
    
    // Configure TestBed to use the spy for sessionStorage
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Storage, useValue: sessionStorageSpy }  // Provide the spy as a mock for sessionStorage
      ]
    });

    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    // Clear sessionStorage and reset the spy after each test
    sessionStorageSpy.setItem.calls.reset();
    sessionStorageSpy.getItem.calls.reset();
  });


  it('should retrieve user from sessionStorage if it exists', () => {
    const user = { username: 'testuser', role: 'admin' };

    // Simulate that the user is already stored in sessionStorage
    sessionStorageSpy.getItem.and.returnValue(JSON.stringify(user));  // Mock the return value of getItem

    const result = authService.getUser();

    // Verify the user is correctly retrieved from sessionStorage
    expect(result).toEqual(user);
  });

});
