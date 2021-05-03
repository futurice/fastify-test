import { rule, shield } from 'graphql-shield';
import { MercuriusContext } from 'mercurius';

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx: MercuriusContext, info) => {
    console.log('HERE');
    return true;
  },
);

export default shield(
  {
    // TODO
  },
  {
    fallbackRule: isAuthenticated,
  },
);
