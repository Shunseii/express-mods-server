import { ValidationArguments } from "class-validator";

export const TOO_SHORT = ({ constraints }: ValidationArguments) =>
  `Must be at least ${constraints[0]} ${
    constraints[0] > 1 ? "characters" : "character"
  }.`;

export const TOO_LONG = ({ constraints }: ValidationArguments) =>
  `Must be at most ${constraints[0]} characters.`;

export const INVALID_EMAIL = (args: ValidationArguments) =>
  `This is not a valid email`;

export const INVALID_LENGTH = (args: ValidationArguments) => {
  const { value, constraints } = args;

  if (value.length < constraints[0]) {
    return TOO_SHORT({ ...args, constraints: [constraints[0]] });
  } else {
    return TOO_LONG({ ...args, constraints: [constraints[1]] });
  }
};
