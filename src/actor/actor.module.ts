import { Module } from '@nestjs/common';
import { ActorController } from './actor.controller';
import { ActorService } from './actor.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { ActorModel } from './actor.model';

@Module({
  controllers: [ActorController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ActorModel,
        schemaOptions: {
          collection: 'Actor',
        },
      },
    ]),
  ],
  providers: [ActorService],
})
export class ActorModule {}
