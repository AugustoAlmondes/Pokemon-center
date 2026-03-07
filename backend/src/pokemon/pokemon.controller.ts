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
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pokemon')
export class PokemonController {

  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto, @Req() req: any) {
    return this.pokemonService.create(createPokemonDto, req.user.userId);
  }


  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(id, updatePokemonDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(id);
  }
}
