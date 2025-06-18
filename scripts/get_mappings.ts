import characters from "../data/characters.json";
import entities from "../data/entities.json";

const skills = [...characters, ...entities].flatMap((obj: any) => obj.skills);

export const ICON_MAPPINGS = {
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

const skillIconMappings: Record<string, string> = {};
const buffIconMappings: Record<string, string> = {};

for (const [id, iconName] of Object.entries(ICON_MAPPINGS)) {
  const numberId = Number(id);
  if (iconName.toLocaleLowerCase().includes("buff")) {
    const entity = entities.find((e) => e.id === numberId);
    if (entity?.buffIconHash) {
      buffIconMappings[entity.buffIconHash] = iconName;
    }
  } else {
    const skill = skills.find((s) => s.id === numberId);
    // TODO no iconHash of skill
    if (skill?.iconHash) {
      skillIconMappings[skill.iconHash] = iconName;
    }
  }
}

await Bun.write(
  `mappings.json`,
  JSON.stringify(
    {
      skillIconMappings,
      buffIconMappings,
    },
    null,
    2,
  ),
);
