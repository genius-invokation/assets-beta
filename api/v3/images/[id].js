// @ts-check
import { all } from "../data.js";
import extraImages from "../../../data/extra_images.json" with { type: "json" };

/**
 * @typedef {import("@vercel/node").VercelRequest} VercelRequest
 * @typedef {import("@vercel/node").VercelResponse} VercelResponse
 */

const MISSING_ICONS = {
  // 6.0
  14142:"Skill_S_Iansan_01",  
  14143:"Skill_E_Iansan_01_HD",
  14144:"UI_Talent_S_Iansan_08",
  15142:"Skill_S_Mizuki_01",
  15143:"Skill_E_Mizuki_01_HD",
  23052:"MonsterSkill_S_TheAbyssXiuhcoatl_01",
  23053:"MonsterSkill_E_TheAbyssXiuhcoatl_01_HD",
  23054:"MonsterSkill_S_TheAbyssXiuhcoatl_02",

  114141:"UI_Gcg_Buff_Nightsoul_Elec",
  114142:"UI_Gcg_Buff_Iansan_S",
  115141:"UI_Gcg_Buff_Mizuki_S",
  123051:"UI_Gcg_Buff_TheAbyssXiuhcoatl_S",
};

const MISSING_CARD_FACES = {
};

/**
 *
 * @param {string | string[] | undefined} type
 * @returns {"icon" | "cardFace" | "unspecified"}
 */
const checkType = (type) => {
  if (Array.isArray(type) || !type) {
    return "unspecified";
  }
  if (type.toLocaleLowerCase() === "icon") {
    return "icon";
  }
  if (type.toLocaleLowerCase() === "cardface") {
    return "cardFace";
  }
  return "unspecified";
};

const dataIncludesElements = [
  ...[
    "UI_Gcg_Buff_Common_Element_Physics",
    "UI_Gcg_Buff_Common_Element_Ice",
    "UI_Gcg_Buff_Common_Element_Water",
    "UI_Gcg_Buff_Common_Element_Fire",
    "UI_Gcg_Buff_Common_Element_Electric",
    "UI_Gcg_Buff_Common_Element_Wind",
    "UI_Gcg_Buff_Common_Element_Rock",
    "UI_Gcg_Buff_Common_Element_Grass",
    "UI_Gcg_Buff_Common_Element_Piercing", // not exists
    "UI_Gcg_Buff_Common_Element_Heal",
  ].map((icon, id) => ({ id, icon })),
  ...Object.entries(MISSING_ICONS).map(([id, icon]) => ({
    id: Number(id),
    icon,
  })),
  ...Object.entries(MISSING_CARD_FACES).map(([id, cardFace]) => ({
    id: Number(id),
    cardFace,
  })),
  ...all,
];

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
  const { id, thumb, type } = req.query;
  if (Array.isArray(id)) {
    res.status(400).send("Bad request (multiple id)");
    return;
  }
  const ty = checkType(type);
  const data = dataIncludesElements.find((x) => x.id === Number(id));
  if (!data) {
    res.status(404).send("Not found");
    return;
  }
  console.log(data);
  let imageName;
  if ("cardFace" in data && (ty === "cardFace" || ty === "unspecified")) {
    imageName = data.cardFace;
  } else {
    for (const key of ["icon", "skillIcon", "buffIcon"]) {
      if (key in data && (ty === "icon" || ty === "unspecified")) {
        imageName = data[key];
        break;
      }
    }
  }
  if (!imageName) {
    res.status(404).send("Not found");
    return;
  }
  if (extraImages.includes(`${imageName}.png`)) {
    return res.redirect(`/assets/${imageName}.png`);
  }
  let url = `https://assets.gi-tcg.guyutongxue.site/assets/${
      thumb ? "thumbs/" : ""
    }${imageName}.webp`;
  res
    .status(307)
    .setHeader("Location", url)
    .send(void 0);
}
