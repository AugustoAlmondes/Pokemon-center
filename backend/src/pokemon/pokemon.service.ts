import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(private prisma: PrismaService) {}

  async create(createPokemonDto: CreatePokemonDto, userId: string) {
    return this.prisma.pokemon.create({
      data: {
        ...createPokemonDto,
        createdBy: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.pokemon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { id },
    });
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }
    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    // Check if exists
    await this.findOne(id);
    
    return this.prisma.pokemon.update({
      where: { id },
      data: updatePokemonDto,
    });
  }

  async remove(id: string) {
    // Check if exists
    await this.findOne(id);

    return this.prisma.pokemon.delete({
      where: { id },
    });
  }
}
