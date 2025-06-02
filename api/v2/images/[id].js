// @ts-check
import { imageMap } from "../images.js";
import extraImages from "../../../data/extra_images.json" with { type: "json" };

/** @type {Record<number, string>} */
const alImageMap = {
  ...imageMap,
  11142: "Skill_S_Citlali_01",
  11143: "Skill_E_Citlali_01_HD",
  11144: "Skill_S_Citlali_02",
  13152: "Skill_S_Mavuika_01",
  13153: "Skill_E_Mavuika_01_HD",
  13154: "Skill_S_Mavuika_06",
  15112: "Skill_S_Chasca_01",
  15113: "Skill_E_Chasca_01_HD",
  15114: "Skill_S_Chasca_06",
  111141: "UI_Gcg_Buff_Nightsoul_Ice",
  111142: "UI_Gcg_Buff_Citlali_Shiled",
  111143: "UI_Gcg_Buff_Citlali_E1",
  113151: "UI_Gcg_Buff_Nightsoul_Fire",
  113152: "UI_Gcg_Buff_Mavuika_S",
  113153: "UI_Gcg_Buff_Mavuika_E",
  113154: "UI_Gcg_CardFace_Summon_Mavuika_Sky",
  1131541: "Skill_S_Mavuika_04",
  113155: "UI_Gcg_CardFace_Summon_Mavuika_Sea",
  1131551: "Skill_S_Mavuika_03",
  113156: "UI_Gcg_CardFace_Summon_Mavuika_Land",
  1131561: "Skill_S_Mavuika_02",
  115111: "UI_Gcg_Buff_Nightsoul_Wind",
  115112: "UI_Gcg_CardFace_Summon_Chasca_Gun",
  115113: "UI_Gcg_CardFace_Summon_Chasca_Wind",
  115114: "UI_Gcg_CardFace_Summon_Chasca_Fire",
  115115: "UI_Gcg_CardFace_Summon_Chasca_Water",
  115116: "UI_Gcg_CardFace_Summon_Chasca_Elec",
  115117: "UI_Gcg_CardFace_Summon_Chasca_Ice",
  1151121: "Skill_S_Chasca_02",
  301306: "UI_Gcg_Buff_Vehicle_SaurusBaby",
  3130092: "Skill_GCG_SaurusBaby",
  303240: "UI_Gcg_Buff_Resurrection",
};

/**
 * @typedef {import("@vercel/node").VercelRequest} VercelRequest
 * @typedef {import("@vercel/node").VercelResponse} VercelResponse
 */

/**
 *
 * @param {VercelRequest} req
 * @param {VercelResponse} res
 * @returns
 */
export default async function handler(req, res) {
  const { id, thumb } = req.query;
  if (Array.isArray(id)) {
    res.status(400).send("Bad request (multiple id)");
    return;
  }
  const image = alImageMap[id];
  console.log(image);
  if (!image) {
    res.status(404).send("Not found");
    return;
  }
  if (extraImages.includes(`${image}.png`)) {
    return res.redirect(`/assets/${image}.png`);
  }
  let url = `https://assets.gi-tcg.guyutongxue.site/assets/${
      thumb ? "thumbs/" : ""
    }${image}.webp`;
  res
    .status(307)
    .setHeader("Location", url)
    .send(void 0);
}
