import { rule, shield } from 'graphql-shield';
import { MercuriusContext } from 'mercurius';

const isAuthenticated = rule({ cache: 'contextual' })(
  (_, __, ctx: MercuriusContext) => {
    return ctx.user !== null;
  },
);

export default shield(
  {},
  {
    fallbackRule: isAuthenticated,
  },
);
