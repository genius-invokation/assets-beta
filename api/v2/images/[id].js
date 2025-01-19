// @ts-check
import { imageMap } from "../images.js";

const mainImagesPromise = fetch(
  "https://assets.gi-tcg.guyutongxue.site/api/v2/images",
).then((r) => r.json());

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
  const mainImages = await mainImagesPromise;
  let url;
  if (mainImages[id]) {
    url = `https://assets.gi-tcg.guyutongxue.site/assets/${
      thumb ? "thumbs/" : ""
    }${image}.webp`;
  } else {
    url = `https://api.hakush.in/gi/UI/${image}.webp`;
  }
  res
    .status(307)
    .setHeader("Location", url)
    .send(void 0);
}
