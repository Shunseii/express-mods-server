import { AuthChecker } from "type-graphql";

import { Context } from "../types";

const authChecker: AuthChecker<Context> = ({ context }, roles) => {
  return !!context.req.session.userId;
};

export default authChecker;
