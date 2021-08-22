import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class ActionType {
  @Field()
  id: number;

  @Field()
  code: string;

  @Field()
  name: string;

  @Field()
  cooldown: number;

  @Field()
  createdAt: string;
}

export default ActionType;
