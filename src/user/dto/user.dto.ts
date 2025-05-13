export class CreateUserDto {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
  
    address: {
      streetNo: string;
      streetName: string;
      city: string;
      state: string;
      postCode: string;
    };
  }
  