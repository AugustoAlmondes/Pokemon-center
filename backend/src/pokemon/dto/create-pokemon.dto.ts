import { IsInt, IsNotEmpty, IsString, Min, Max, IsOptional } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsInt()
  @Min(1)
  @Max(100)
  level: number;

  @IsInt()
  @Min(1)
  hp: number;

  @IsInt()
  @Min(1)
  pokedexNumber: number;
}
