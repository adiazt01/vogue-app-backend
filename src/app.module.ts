import { Module } from '@nestjs/common';
import { envs } from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesModule } from './modules/modules.module';
import { CommonModule } from './common/common.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      graphiql: true,
    }),
    MongooseModule.forRoot(envs.MONGO_URL, {}),
    ModulesModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
