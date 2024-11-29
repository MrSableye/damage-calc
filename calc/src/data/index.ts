import type * as I from './interface';

import {Abilities} from './abilities';
import {Items} from './items';
import {Moves} from './moves';
import {Species} from './species';
import {Types} from './types';
import {Natures} from './natures';

export const Generations: I.Generations = new (class {
  get(gen: I.GenerationNum, mod?: string) {
    return new Generation(gen, mod);
  }
})();

class Generation implements I.Generation {
  num: I.GenerationNum;
  mod?: string;

  abilities: Abilities;
  items: Items;
  moves: Moves;
  species: Species;
  types: Types;
  natures: Natures;

  constructor(num: I.GenerationNum, mod?: string) {
    this.num = num;
    this.mod = mod;

    this.abilities = new Abilities(num, mod);
    this.items = new Items(num, mod);
    this.moves = new Moves(num, mod);
    this.species = new Species(num, mod);
    this.types = new Types(num, mod);
    this.natures = new Natures();
  }
}
