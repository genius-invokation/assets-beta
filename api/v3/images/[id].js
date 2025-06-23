// @ts-check
import { all } from "../data.js";
import extraImages from "../../../data/extra_images.json" with { type: "json" };

/**
 * @typedef {import("@vercel/node").VercelRequest} VercelRequest
 * @typedef {import("@vercel/node").VercelResponse} VercelResponse
 */

const MISSING_ICONS = {
  11142: "Skill_S_Citlali_01",
  11143: "Skill_E_Citlali_01_HD",
  11144: "Skill_S_Citlali_02",
  13152: "Skill_S_Mavuika_01",
  13153: "Skill_E_Mavuika_01_HD",
  13154: "Skill_S_Mavuika_06",
  15112: "Skill_S_Chasca_01",
  15113: "Skill_E_Chasca_01_HD",
  15114: "Skill_S_Chasca_06",
  1131541: "Skill_S_Mavuika_04",
  1131551: "Skill_S_Mavuika_03",
  1131561: "Skill_S_Mavuika_02",
  1151121: "Skill_S_Chasca_02",
  3130092: "Skill_GCG_SaurusBaby",
  111141: "UI_Gcg_Buff_Nightsoul_Ice",
  111142: "UI_Gcg_Buff_Citlali_Shiled",
  111143: "UI_Gcg_Buff_Citlali_E1",
  113151: "UI_Gcg_Buff_Nightsoul_Fire",
  113152: "UI_Gcg_Buff_Mavuika_S",
  113153: "UI_Gcg_Buff_Mavuika_E",
  115111: "UI_Gcg_Buff_Nightsoul_Wind",
  301306: "UI_Gcg_Buff_Vehicle_SaurusBaby",
  303240: "UI_Gcg_Buff_Resurrection",
};

const MISSING_CARD_FACES = {
  113154: "UI_Gcg_CardFace_Summon_Mavuika_Sky",
  113155: "UI_Gcg_CardFace_Summon_Mavuika_Sea",
  113156: "UI_Gcg_CardFace_Summon_Mavuika_Land",
  115112: "UI_Gcg_CardFace_Summon_Chasca_Gun",
  115113: "UI_Gcg_CardFace_Summon_Chasca_Wind",
  115114: "UI_Gcg_CardFace_Summon_Chasca_Fire",
  115115: "UI_Gcg_CardFace_Summon_Chasca_Water",
  115116: "UI_Gcg_CardFace_Summon_Chasca_Elec",
  115117: "UI_Gcg_CardFace_Summon_Chasca_Ice",
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
