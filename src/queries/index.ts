import * as user from './user-queries';
import * as action from './action-queries';
import * as actionType from './action-type-queries';
import * as feedItem from './feed-item-queries';
import * as comment from './comment-queries';

export interface Queries {
  user: typeof user;
  action: typeof action;
  actionType: typeof actionType;
  feedItem: typeof feedItem;
  comment: typeof comment;
}

export default {
  user,
  action,
  actionType,
  feedItem,
  comment,
}