import { Glob } from "bun";

const BASE = `https://raw.githubusercontent.com/genius-invokation/genius-invokation-beta/refs/heads/beta/packages/static-data/src/data`;

const TARGET_PATH = `${import.meta.dirname}/../data`;

const FILENAMES = ["action_cards", "characters", "entities", "keywords"];

const allData: any[] = [];

for (const filename of FILENAMES) {
  const data = await fetch(`${BASE}/${filename}.json`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  }).then((r) => r.text());
  const arr = JSON.parse(data).map((src: any) => ({
    ...src,
    category: filename,
  }));
  allData.push(...arr);
  allData.push(...arr.flatMap((obj: any) => obj.skills ?? []));
  await Bun.write(`${TARGET_PATH}/${filename}.json`, JSON.stringify(arr));
}

const result: Record<number, string> = {
  "0": "UI_Gcg_Buff_Common_Element_Physics",
  "1": "UI_Gcg_Buff_Common_Element_Ice",
  "2": "UI_Gcg_Buff_Common_Element_Water",
  "3": "UI_Gcg_Buff_Common_Element_Fire",
  "4": "UI_Gcg_Buff_Common_Element_Electric",
  "5": "UI_Gcg_Buff_Common_Element_Wind",
  "6": "UI_Gcg_Buff_Common_Element_Rock",
  "7": "UI_Gcg_Buff_Common_Element_Grass",
  "9": "UI_Gcg_Buff_Common_Element_Heal",
};
const replaceNameMap: Record<string, string> = {
  UI_Gcg_CardFace_Summon_AbyssEle: "UI_Gcg_CardFace_Summon_AbyssEle_Layer00",
  UI_Gcg_CardFace_Char_Monster_Effigyice:
    "UI_Gcg_CardFace_Char_Monster_EffigyIce",
};

// 召唤物、角色牌、行动牌
for (const obj of allData) {
  let filename: string;
  if ("cardFace" in obj && obj.cardFace) {
    filename = obj.cardFace;
  } else if ("icon" in obj && obj.icon) {
    filename = obj.icon;
  } else if ("buffIcon" in obj && obj.buffIcon) {
    filename = obj.buffIcon;
  } else if ("buffIconHash" in obj && obj.buffIconHash) {
    filename = "UI_Gcg_Buff_Common_Special";
  } else {
    continue;
  }
  if (filename in replaceNameMap) {
    filename = replaceNameMap[filename];
  }
  if (!result[obj.id]) {
    result[obj.id] = filename;
  }
}

await Bun.write(
  `${TARGET_PATH}/image_names.json`,
  JSON.stringify(result, null, 2),
);

await Bun.write(
  `${TARGET_PATH}/extra_images.json`,
  JSON.stringify(
    await Array.fromAsync(
      new Glob(`*.png`).scan(`${import.meta.dirname}/../public/assets`),
    ),
    null,
    2,
  ),
);
