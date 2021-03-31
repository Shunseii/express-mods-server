import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

import { User } from "../entities/User";

@ValidatorConstraint({ async: true })
export class IsUserFieldNotInUseConstraint
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
    return "This $property already exists.";
  }
}

export function IsUserFieldNotInUse(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserFieldNotInUseConstraint,
    });
  };
}
