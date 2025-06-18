// @ts-check
import { all } from "../data.js";
import extraImages from "../../../data/extra_images.json" with { type: "json" };

/**
 * @typedef {import("@vercel/node").VercelRequest} VercelRequest
 * @typedef {import("@vercel/node").VercelResponse} VercelResponse
 */

const MISSING_ICONS = {
  // 5.8
  15122: "Skill_S_Lanyan_01",
  15123: "Skill_E_Lanyan_01_HD",
  115121: "UI_Gcg_Buff_Lanyan_E1",
  15132: "Skill_S_Heizo_01",
  15133: "Skill_E_Heizo_01_HD",
  15134: "UI_Talent_S_Heizo_05",
  115132: "UI_Gcg_Buff_Heizo_E1",  
  115133: "UI_Gcg_DeBuff_Heizo_S",
  115134: "UI_Gcg_DeBuff_Heizo_S",
  115135: "UI_Gcg_DeBuff_Heizo_S",
  115136: "UI_Gcg_DeBuff_Heizo_S",
  27042: "MonsterSkill_S_HookwalkerPrimo_01",
  27043: "MonsterSkill_E_HookwalkerPrimo_01_HD",
  27044: "MonsterSkill_S_HookwalkerPrimo_02",
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
