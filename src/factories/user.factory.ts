import { define } from "typeorm-seeding";

import { User } from "../entities/User";

define<User, {}>(User, (faker) => {
  const user = new User();

  user.email = faker.internet.email(
    faker.name.firstName(),
    faker.name.lastName(),
    "gmail"
  );
  user.username = faker.internet.userName();
  user.password = "123456";

  return user;
});
