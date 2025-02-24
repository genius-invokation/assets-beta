// @ts-check
import { imageMap } from "../images.js";

const mainImagesPromise = fetch(
  "https://assets.gi-tcg.guyutongxue.site/api/v2/images",
).then((r) => r.json());

const missingImages = [
  "UI_Gcg_CardFace_Event_Event_NiyeLong",
  "UI_Gcg_CardFace_Event_Food_MingShi",
  "UI_Gcg_CardFace_Modify_Talent_Kachina",
  "UI_Gcg_CardFace_Modify_Talent_Emilie",
  "UI_Gcg_CardFace_Modify_Vehicle_LangChuan",
  "UI_Gcg_CardFace_Assist_Location_YanmiZhu",
  "UI_Gcg_CardFace_Char_Avatar_Kachina",
  "UI_Gcg_CardFace_Char_Avatar_Emilie",
  "UI_Gcg_CardFace_Summon_Emilie_1",
  "UI_Gcg_CardFace_Summon_Emilie_2",
  "UI_Gcg_CardFace_Summon_Emilie_3",
  "UI_Gcg_CardFace_Summon_Kachina",
];

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
  const image = imageMap[id];
  if (!image) {
    res.status(404).send("Not found");
    return;
  }
  if (missingImages.includes(image)) {
    return res.redirect(`/assets/${image}.webp`);
  }
  const mainImages = await mainImagesPromise;
  let url;
  if (mainImages[id]) {
    url = `https://assets.gi-tcg.guyutongxue.site/assets/${
      thumb ? "thumbs/" : ""
    }${image}.webp`;
  } else if (image.includes("CardFace")) {
    url = `https://api.hakush.in/gi/UI/${image}.webp`;
  } else {
    res.status(404).send("Not found");
    return;
  }
  res
    .status(307)
    .setHeader("Location", url)
    .send(void 0);
}
