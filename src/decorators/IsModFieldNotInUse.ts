import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

import { Mod } from "../entities/Mod";

@ValidatorConstraint({ async: true })
export class IsModFieldNotInUseConstraint
  implements ValidatorConstraintInterface
{
  validate(fieldValue: string, args: ValidationArguments) {
    return Mod.findOne({ where: { [args.property]: fieldValue } }).then(
      (mod) => {
        if (mod) return false;

        return true;
      }
    );
  }

  defaultMessage() {
    return "This $property already exists.";
  }
}

export function IsModFieldNotInUse(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsModFieldNotInUseConstraint,
    });
  };
}
