import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SwapService } from './swap.service';
import { CreateSwapDto } from './dto/create-swap.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Post('/create-swap')
  create(@Body() createSwapDto: CreateSwapDto) {
    return this.swapService.create(createSwapDto);
  }
  @UseGuards(AuthGuard)
  @Get('/my-current-status')
  findAll(@Req() req: Request ,@Body() data:{status:string}) {
    return this.swapService.myCurrentStatus(req, data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.swapService.findOne(+id);
  }

  @Patch('status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'accepted' | 'rejected' | 'pending',
  ) {
    return this.swapService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.swapService.remove(+id);
  }
}
