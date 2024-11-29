export interface Mod {
  modGen: number;
  mod: string;
  name: string;
}
export type Mods = Record<string, Mod>;

export interface ModFormatsDataEntry {
  tier: string;
}
export type ModFormatsData = Record<string, ModFormatsDataEntry>;

export interface ModAbility {
  name: string;
  desc: string;
  shortDesc: string;
  isNonstandard: any;
}
export type ModAbilities = Record<string, ModAbility>;

export interface ModItem {
  name: string;
  desc: string;
  shortDesc: string;
  isNonstandard: any;
}
export type ModItems = Record<string, ModItem>;

export interface ModMove {
  name: string;
  desc: string;
  shortDesc: string;
  type: string;
  category: string;
  flags: Record<string, number>;
  target: string;
  recoil?: [number, number];
  hasCrashDamage?: boolean;
  mindBlownRecoil?: boolean;
  struggleRecoil?: boolean;
  willCrit?: boolean;
  drain?: [number, number];
  priority?: number;
  ignoreDefensive?: boolean;
  overrideOffensiveStat?: string;
  overrideDefensiveStat?: string;
  overrideOffensivePokemon?: string;
  overrideDefensivePokemon?: string;
  breaksProtect?: boolean;
  isZ?: string;
  isMax?: boolean;
  multihit?: number | number[];
  multiaccuracy?: boolean;
  basePower: number;
  secondary?: any;
  secondaries?: any;
  isNonstandard: any;
}
export type ModMoves = Record<string, ModMove>;

export interface ModSpecies {
  num: number;
  name: string;
  types: string[];
  baseStats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  abilities: {
    0: string;
    1?: string;
    H?: string;
    S?: string;
  };
  weightkg: number;
  prevo?: string;
  baseSpecies?: string;
  otherFormes?: string[];
}
export type ModPokedex = Record<string, ModSpecies>;

export interface ModType {
  damageTaken: Record<string, number>;
}
export type ModTypechart = Record<string, ModType>;
