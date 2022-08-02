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
import { ExcludeDto } from './dtos/exclude.dto';
import { InviteDto } from './dtos/invite.dto';
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

  @Get()
  @UseGuards(AuthGuard)
  async readMyWorks(@CurrentUser() user: User) {
    return await this.workService.readMyWorks(+user.id);
  }

  @Get(':page')
  async allWorks(@Param('page') page: string) {
    return await this.workService.allWorks(+page);
  }

  @Get('loggedin/:page')
  @UseGuards(AuthGuard)
  async allWorksForLogin(
    @Param('page') page: string,
    @CurrentUser() user: User,
  ) {
    return await this.workService.allWorksForLogin(+page, user);
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

  @Get('my/:page')
  @UseGuards(AuthGuard)
  async myWorks(@CurrentUser() user: User, @Param('page') page: string) {
    return await this.workService.myWorks(user.id, +page);
  }

  @Get('my/detail/:workId')
  @UseGuards(AuthGuard)
  async myWork(@CurrentUser() user: User, @Param('workId') workId: string) {
    return await this.workService.myWork(user.id, +workId);
  }

  @Get('my/participated-work/:page')
  @UseGuards(AuthGuard)
  async participantedWorks(
    @CurrentUser() user: User,
    @Param('page') page: string,
  ) {
    return await this.workService.participantedWorks(+user.id, +page);
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

  @Get('detail/:workId')
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

  @Post('invite')
  @UseGuards(AuthGuard)
  async inviteToWork(@Body() body: InviteDto) {
    return await this.workService.inviteToWork(body);
  }

  @Post('exclude')
  @UseGuards(AuthGuard)
  async excludeFromWork(@Body() body: ExcludeDto) {
    return await this.workService.excludeFromWork(body);
  }
}
