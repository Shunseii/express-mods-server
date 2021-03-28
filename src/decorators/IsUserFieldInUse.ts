import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

import { User } from "../entities/User";

@ValidatorConstraint({ async: true })
export class IsUserFieldInUseConstraint
  implements ValidatorConstraintInterface {
  validate(fieldValue: string, args: ValidationArguments) {
    return User.findOne({ where: { [args.property]: fieldValue } }).then(
      (user) => {
        if (user) return false;

        return true;
      }
    );
  }

  defaultMessage(args: ValidationArguments) {
    return "This $property is already in use.";
  }
}

export function IsUserFieldInUse(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserFieldInUseConstraint,
    });
  };
}
