import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtMiddleware } from './jwt.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new JwtMiddleware().use);
  await app.listen(3000);
}
bootstrap();
