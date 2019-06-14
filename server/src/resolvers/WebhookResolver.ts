import { Service } from "typedi";
import { Resolver, Query, Authorized, Arg, ID, ArgsType, Field, Args, Mutation } from "type-graphql";
import { Webhook } from "../models/Webhook";
import { WebhookService } from "../services/WebhookService";
import { ObjectID } from "mongodb";

@ArgsType()
class WebhooksArgs {
  @Field(type => ID)
  userId: ObjectID;

  @Field(type => ID)
  serverId: ObjectID;
}

@ArgsType()
class CreateWebhookArgs {
  @Field()
  name: string;

  @Field()
  url: string;

  @Field(type => ID)
  server: string;

  @Field(type => ID)
  creator: string;

}

@Service()
@Resolver(of => Webhook)
export class WebhookResolver {
  constructor(private readonly webhookService: WebhookService) {}

  @Authorized()
  @Query(returns => [Webhook])
  async webhooks(@Args() { userId, serverId}: WebhooksArgs): Promise<Array<Webhook>> {
    return this.webhookService.getForUserAndServer(userId, serverId);
  }

  @Authorized()
  @Mutation(returns => Webhook)
  async createWebhook(@Args() params: CreateWebhookArgs): Promise<Webhook> {
    return this.webhookService.create(params);
  }
}
