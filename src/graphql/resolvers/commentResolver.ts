import { Resolver, Arg, Mutation, InputType, Ctx, Field } from 'type-graphql';
import { Comments } from '@generated/type-graphql/models';
import { Max } from 'class-validator';
import { MercuriusContext } from 'mercurius';

@InputType()
class CommentCreateInput {
  @Field()
  feedItemId: number;

  @Field()
  @Max(500)
  text: string;
}

Resolver(of => Comments);
export class CommentCreateResolver {
  @Mutation(() => Comments)
  createComment(
    @Arg('data', type => CommentCreateInput) data: CommentCreateInput,
    @Ctx() { prisma, user }: MercuriusContext,
  ): Promise<Comments> {
    return prisma.comments.create({
      data: {
        text: data.text,
        user: {
          connect: {
            id: user!.id,
          },
        },
        feedItem: {
          connect: {
            id: data.feedItemId,
          },
        },
      },
    });
  }
}
