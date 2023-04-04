import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsPasswordValid(property?: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) {
            this.error = 'Empty password';
            return false;
          }
          
          const passwordRegExp = [
            [new RegExp(/^.{8,}/).test(value)],
            [new RegExp(/^(?=.*[!@#$%^&*])/).test(value)],
            [new RegExp(/^(?=.*\d)/).test(value)],
            [new RegExp(/^(?=.*[A-Z])/).test(value)],
          ];
        
          const test_password: boolean = passwordRegExp
            .map(function (x) {
              return x[0];
            })
            .reduce(function (sum, next) {
              return sum && next;
            }, true) as boolean;

          if (!test_password) {
            this.error = 'Password is too weak: It must have 8 characters minimum, a symbol, a number and an uppercase letter';
            return false;
          }
          return true;
        },
        defaultMessage(): string {
          return this.error || 'Something went wrong';
        }
      },
    });
  };
}