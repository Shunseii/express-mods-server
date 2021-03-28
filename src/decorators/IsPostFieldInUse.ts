import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

import { Post } from "../entities/Post";

@ValidatorConstraint({ async: true })
export class IsPostFieldInUseConstraint
  implements ValidatorConstraintInterface {
  validate(fieldValue: string, args: ValidationArguments) {
    return Post.findOne({ where: { [args.property]: fieldValue } }).then(
      (post) => {
        if (post) return false;

        return true;
      }
    );
  }

  defaultMessage(args: ValidationArguments) {
    return "This $property is already in use.";
  }
}

export function IsPostFieldInUse(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPostFieldInUseConstraint,
    });
  };
}
