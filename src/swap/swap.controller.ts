import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { SwapService } from './swap.service';
import { CreateSwapDto } from './dto/create-swap.dto';

@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Post('/create-swap')
  create(@Body() createSwapDto: CreateSwapDto) {
    return this.swapService.create(createSwapDto);
  }

  @Get('/my-current-status')
  findAll(@Req() req: Request) {
    const authHeader = req.headers['authorization'] as string;
    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException(
        'Authorization header missing or malformed',
      );
    }
    return this.swapService.myCurrentStatus(authHeader);
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
