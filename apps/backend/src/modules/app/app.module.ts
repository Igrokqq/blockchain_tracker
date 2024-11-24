import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/modules/common.module';
import TrackerModule from '../tracker/tracker.module';

@Module({
  imports: [CommonModule, TrackerModule],
  controllers: [],
  providers: []
})
export class AppModule {}
