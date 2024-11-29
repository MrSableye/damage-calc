import {writeFileSync} from 'fs';
import {join} from 'path';

import Axios from 'axios';

import {
  ModAbilities,
  ModFormatsData,
  ModItems,
  ModMoves,
  ModPokedex,
  ModTypechart,
  Mods,
} from './types';
import {
  convertModMove,
  convertModSpecies,
  convertModTypechart,
} from './util';

const BASE_URL = 'https://clover.weedl.es/data/mods';
const MODS_JSON = 'mods.json';
const ABILITIES_JSON = 'abilities.json';
const FORMATS_DATA_JSON = 'formats-data.json';
const ITEMS_JSON = 'items.json';
const MOVES_JSON = 'moves.json';
const POKEDEX_JSON = 'pokedex.json';
const TYPECHART_JSON = 'typechart.json';

const getData = async <T>(url: string): Promise<T> => {
  const {data} = await Axios.get<T>(url);
  return data;
};

const getMods = async (): Promise<Mods> => getData(`${BASE_URL}/${MODS_JSON}`);
const getFormatsData = async (mod: string): Promise<ModFormatsData> =>
  getData(`${BASE_URL}/${mod}/${FORMATS_DATA_JSON}`);
const getAbilities = async (mod: string): Promise<ModAbilities> =>
  getData(`${BASE_URL}/${mod}/${ABILITIES_JSON}`);
const getItems = async (mod: string): Promise<ModItems> =>
  getData(`${BASE_URL}/${mod}/${ITEMS_JSON}`);
const getMoves = async (mod: string): Promise<ModMoves> =>
  getData(`${BASE_URL}/${mod}/${MOVES_JSON}`);
const getPokedex = async (mod: string): Promise<ModPokedex> =>
  getData(`${BASE_URL}/${mod}/${POKEDEX_JSON}`);
const getTypechart = async (mod: string): Promise<ModTypechart> =>
  getData(`${BASE_URL}/${mod}/${TYPECHART_JSON}`);

const getModData = async (mod: string) => Promise.all([
  getAbilities(mod),
  getFormatsData(mod),
  getItems(mod),
  getMoves(mod),
  getPokedex(mod),
  getTypechart(mod),
]);

const convertMoves = (modMoves: ModMoves): any => {
  const convertedMoves: Record<string, any> = {};
  Object.entries(modMoves).forEach(([moveId, move]) => {
    convertedMoves[moveId] = convertModMove(move);
  });
  convertedMoves['(No Move)'] = {name: '(No Move)', bp: 0, category: 'Status', type: 'Normal'};
  return convertedMoves;
};

const convertSpecies = (modSpecies: ModPokedex): any => {
  const convertedSpecies: Record<string, any> = {};
  Object.entries(modSpecies).forEach(([speciesId, species]) => {
    convertedSpecies[speciesId] = convertModSpecies(species);
  });
  return convertedSpecies;
};

const getAllModData = async () => Promise.all(
  Object.entries(await getMods())
    .map(async ([modName, mod]) => {
      const modData = await getModData(modName);
      return {
        mod,
        abilities: modData[0],
        formatsData: modData[1],
        items: modData[2],
        moves: convertMoves(modData[3]),
        pokedex: convertSpecies(modData[4]),
        typechart: convertModTypechart(modData[5]),
      };
    })
);

(async () => {
  const modsPath = join(__dirname, '../../../calc/src/data/mods/mods.ts');
  const modSetsPath = join(__dirname, '../../../src/js/data/sets/mods.js');
  const modTiersPath = join(__dirname, '../../../src/js/data/tiers/mods.json');

  const allModData = await getAllModData();

  const modData: Record<string, any> = {};
  const modSets: Record<string, any> = {};
  const modTiers: Record<string, any> = {};
  allModData.forEach((entry) => {
    modData[entry.mod.mod] = entry;
    modSets[entry.mod.mod] = {};
    modTiers[entry.mod.mod] = {};

    Object.values(entry.pokedex).forEach((pokemon: any) => {
      modSets[entry.mod.mod][pokemon.name] = {};
    });

    Object.entries(entry.formatsData).forEach(([key, formatsDataEntry]) => {
      const pokemon = entry.pokedex[key];
      if (!pokemon) return;
      modTiers[entry.mod.mod][pokemon.name] = formatsDataEntry.tier;
    });
  });

  writeFileSync(
    modsPath,
    'export const MODS: Record<string, any> = ' + JSON.stringify(modData),
    'utf8',
  );
  writeFileSync(modSetsPath, 'var SETDEX_MODS = ' + JSON.stringify(modSets) + ';\n', 'utf8');
  writeFileSync(modTiersPath, JSON.stringify(modTiers), 'utf8');

  process.exit(0);
})().catch((err) => {
  throw err;
});
