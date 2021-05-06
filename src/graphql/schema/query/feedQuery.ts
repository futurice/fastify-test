import { GraphQLNonNull, GraphQLList, GraphQLFieldConfig } from 'graphql';
import feedItem from '../models/feedItem';
import { Sort } from '../models/enums';

const feedQuery: GraphQLFieldConfig<{}, unknown, any> = {
  args: {
    sort: {
      type: Sort,
    },
  },
  type: new GraphQLNonNull(new GraphQLList(feedItem)),
};

export default feedQuery;
