import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/modules/common.module';
import TrackerModule from '../tracker/tracker.module';
import UserModule from '../user/user.module';

@Module({
  imports: [CommonModule, UserModule, TrackerModule],
  controllers: [],
  providers: []
})
export class AppModule {}
