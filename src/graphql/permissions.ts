import { rule, shield, deny } from 'graphql-shield';
import { MercuriusContext } from 'mercurius';

const isAuthenticated = rule({ cache: 'contextual' })(
  (_, __, ctx: MercuriusContext) => {
    return ctx.user !== null;
  },
);

export default shield(
  {
    Query: {
      findFirstFeedItems: isAuthenticated,
      findManyFeedItems: isAuthenticated,
      findManyGuilds: isAuthenticated,
    },
    FeedItems: isAuthenticated,
    Guilds: isAuthenticated,
    Users: isAuthenticated,
  },
  {
    fallbackRule: deny,
  },
);
