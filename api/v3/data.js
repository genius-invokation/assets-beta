// @ts-check

import characters_ from "../../data/characters.json" with { type: "json" };
import actionCards_ from "../../data/action_cards.json" with { type: "json" };
import entities_ from "../../data/entities.json" with { type: "json" };
import keywords_ from "../../data/keywords.json" with { type: "json" };

/**
 * @typedef {import("@gi-tcg/static-data").CharacterRawData} CharacterRawData
 * @typedef {import("@gi-tcg/static-data").ActionCardRawData} ActionCardRawData
 * @typedef {import("@gi-tcg/static-data").EntityRawData} EntityRawData
 * @typedef {import("@gi-tcg/static-data").KeywordRawData} KeywordRawData
 */

/** @type {CharacterRawData[]} */
export const characters = characters_;

/** @type {ActionCardRawData[]} */
export const actionCards = actionCards_;

/** @type {EntityRawData[]} */
const entities = /** @type {EntityRawData[]} */ (entities_);

/** @type {KeywordRawData[]} */
const keywords = keywords_;

/**
 * @typedef {import("@vercel/node").VercelRequest} VercelRequest
 * @typedef {import("@vercel/node").VercelResponse} VercelResponse
 */

const skills = [...characters, ...entities].flatMap((ch) => ch.skills);

/**
 *
 * @param {{ type: string }} x
 */
function key(x) {
  if (x.type === "GCG_CARD_SUMMON") return 0;
  else return 1;
}

const allEntities = Object.values(
  [...entities, ...actionCards].reduce((acc, curr) => {
    if (acc[curr.id]) {
      // 合并对象
      acc[curr.id] = { ...acc[curr.id], ...curr };
    } else {
      acc[curr.id] = curr;
    }
    return acc;
  }, {}),
);

export const all = [...characters, ...allEntities, ...skills, ...keywords];

/**
 *
 * @param {VercelRequest} req
 * @param {VercelResponse} res
 * @returns
 */
export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  return res.status(200).json(all);
}

export { keywords };
