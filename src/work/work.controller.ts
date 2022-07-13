import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateDto } from './dtos/create.dto';
import { UpdateDto } from './dtos/update.dto';
import { WorkService } from './work.service';

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@CurrentUser() user: User, @Body() body: CreateDto) {
    return await this.workService.create(user.id, body);
  }

  @Post('update')
  @UseGuards(AuthGuard)
  async update(@CurrentUser() user: User, @Body() body: UpdateDto) {
    return await this.workService.update(user.id, body);
  }

  @Delete('delete/:workId')
  @UseGuards(AuthGuard)
  async delete(@CurrentUser() user: User, @Param('workId') workId: string) {
    console.log('asdfasdklfjasdlfkasd', workId);
    return await this.workService.delete(user.id, +workId);
  }

  @Get()
  async allWorks() {
    return await this.workService.allWorks();
  }

  @Get('my')
  @UseGuards(AuthGuard)
  async myWorks(@CurrentUser() user: User) {
    return await this.workService.myWorks(user.id);
  }

  @Get('my/:workId')
  @UseGuards(AuthGuard)
  async myWork(@CurrentUser() user: User, @Param('workId') workId: string) {
    return await this.workService.myWork(user.id, +workId);
  }

  @Get('my/:workId/:state')
  @UseGuards(AuthGuard)
  async altState(
    @CurrentUser() user: User,
    @Param('workId') workId: string,
    @Param('state') state: string,
  ) {
    return await this.workService.altState(user.id, +workId, state);
  }

  @Get('search')
  @UseGuards(AuthGuard)
  async searchWorks(
    @CurrentUser() user: User,
    @Query('query') query: string,
    @Query('page') page: string,
  ) {
    return await this.workService.searchWorks(user.id, +page, query);
  }

  @Get('/:workId')
  @UseGuards(AuthGuard)
  async findWorkById(
    @CurrentUser() user: User,
    @Param('workId') workId: string,
  ) {
    return await this.workService.findWorkById(user.id, +workId);
  }

  @Get('/:workId/comments')
  async commentsOfWork(@Param('workId') workId: string) {
    return await this.workService.commentsOfWork(+workId);
  }
}
