import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

import { User } from "../entities/User";

@ValidatorConstraint({ async: true })
export class UserFieldExistsConstraint implements ValidatorConstraintInterface {
  validate(fieldValue: string, args: ValidationArguments) {
    return User.findOne({ where: { [args.property]: fieldValue } }).then(
      (user) => {
        if (!user) return false;

        return true;
      }
    );
  }

  defaultMessage() {
    return "This $property does not exist.";
  }
}

export function UserFieldExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UserFieldExistsConstraint,
    });
  };
}
