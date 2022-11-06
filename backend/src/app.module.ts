import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "src/prisma.service";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { PostsModule } from './posts/posts.module';
import * as path from "path";

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      // いったん、playground は有効にしておく
      playground: true,
      // 自動生成されるスキーマのファイルを指定する
      autoSchemaFile: path.join(process.cwd(), "src/schema.gql"),
    }),
    PostsModule,
  ],
})
export class AppModule {}
