import type {ModMove, ModSpecies, ModTypechart} from './types';

const toID = (text: any): string => ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');

export const convertModSpecies = (modSpecies: ModSpecies): any => ({
  name: modSpecies.name,
  types: modSpecies.types,
  bs: {
    hp: modSpecies.baseStats.hp,
    at: modSpecies.baseStats.atk,
    df: modSpecies.baseStats.def,
    sa: modSpecies.baseStats.spa,
    sd: modSpecies.baseStats.spd,
    sp: modSpecies.baseStats.spe,
  },
  weightkg: modSpecies.weightkg,
  nfe: !!modSpecies.prevo,
  otherFormes: modSpecies.otherFormes,
  baseSpecies: modSpecies.baseSpecies,
  abilities: {0: modSpecies.abilities[0]},
});

export const convertModMove = (modMove: ModMove): any => ({
  name: modMove.name,
  type: modMove.type,
  category: modMove.category,
  secondaries: !!(modMove.secondary || modMove.secondaries),
  target: modMove.target,
  recoil: modMove.recoil,
  hasCrashDamage: modMove.hasCrashDamage,
  mindBlownRecoil: modMove.mindBlownRecoil,
  struggleRecoil: modMove.struggleRecoil,
  willCrit: modMove.willCrit,
  drain: modMove.drain,
  priority: modMove.priority,
  ignoreDefensive: modMove.ignoreDefensive,
  overrideOffensiveStat: modMove.overrideOffensiveStat,
  overrideDefensiveStat: modMove.overrideOffensiveStat,
  overrideOffensivePokemon: modMove.overrideOffensivePokemon as 'target' | 'source',
  overrideDefensivePokemon: modMove.overrideDefensivePokemon as 'target' | 'source',
  breaksProtect: modMove.breaksProtect,
  isZ: !!modMove.isZ,
  isMax: modMove.isMax,
  multihit: modMove.multihit,
  multiaccuracy: modMove.multiaccuracy,
  bp: modMove.basePower,
  makesContact: !!modMove.flags.contact,
  isPunch: !!modMove.flags.punch,
  isBite: !!modMove.flags.bite,
  isBullet: !!modMove.flags.bullet,
  isSound: !!modMove.flags.sound,
  isPulse: !!modMove.flags.pulse,
  isSlicing: !!modMove.flags.slicing,
  isWind: !!modMove.flags.wind,
});

const capitalizeFirstLetter = (val: string) =>
  String(val).charAt(0).toUpperCase() + String(val).slice(1);

const damageTakenToModifier = (damageTaken: number) => {
  switch (damageTaken) {
    case 3: return 0; // Immune
    case 2: return 0.5; // Super-effective
    case 1: return 2; // Not very effective
    case 0: return 1; // Neutral
  }
  return 1; // Whatever
};

export const convertModTypechart = (modTypechart: ModTypechart): any => {
  const typeChart: Record<string, any> = {};

  Object.entries(modTypechart).forEach(([defensiveTypeName, defensiveType]) => {
    const capitalizedDefensiveTypeName = capitalizeFirstLetter(defensiveTypeName);
    Object.entries(defensiveType.damageTaken).forEach(([offensiveTypeName, offensiveTypeMod]) => {
      if (!modTypechart[toID(offensiveTypeName)] && offensiveTypeName !== '???') return;
      typeChart[offensiveTypeName] = {
        ...typeChart[offensiveTypeName],
        [capitalizedDefensiveTypeName]: damageTakenToModifier(offensiveTypeMod),
      };
    });
  });

  return typeChart;
};
