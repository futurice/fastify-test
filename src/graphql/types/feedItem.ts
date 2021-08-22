import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class FeedItem {
  @Field()
  uuid: string;

  @Field()
  text?: string;

  @Field({ description: 'Image content url' })
  image?: string;
}

export default FeedItem;
