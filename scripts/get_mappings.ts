import characters from "../data/characters.json";
import entities from "../data/entities.json";

const skills = [...characters, ...entities].flatMap((obj: any) => obj.skills);

export const ICON_MAPPINGS = {
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
