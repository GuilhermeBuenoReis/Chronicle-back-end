"use strict";

// src/modules/gamification.spec.ts
var import_vitest = require("vitest");

// src/modules/gamification.ts
var BASE_EXPERIENCE = 20;
var EXPERIENCE_FACTOR = 1.3;
function calculateLevelFromExperience(experience) {
  return Math.floor(
    Math.log(experience / BASE_EXPERIENCE * (EXPERIENCE_FACTOR - 1) + 1) / Math.log(EXPERIENCE_FACTOR)
  ) + 1;
}
function calculateExperienceForNextLevel(level) {
  return Math.floor(
    BASE_EXPERIENCE * ((EXPERIENCE_FACTOR ** level - 1) / (EXPERIENCE_FACTOR - 1))
  );
}

// src/modules/gamification.spec.ts
(0, import_vitest.test)("total experience to level", () => {
  const exp1 = calculateExperienceForNextLevel(1);
  const exp2 = calculateExperienceForNextLevel(2);
  const exp3 = calculateExperienceForNextLevel(3);
  (0, import_vitest.expect)(exp1).toEqual(20);
  (0, import_vitest.expect)(exp2).toEqual(20 + 26);
  (0, import_vitest.expect)(exp3).toEqual(20 + 26 + 33);
});
(0, import_vitest.test)("level from experience", () => {
  const lev1 = calculateLevelFromExperience(5);
  const lev2 = calculateLevelFromExperience(20);
  const lev5 = calculateLevelFromExperience(20 + 26 + 33 + 43);
  (0, import_vitest.expect)(lev1).toEqual(1);
  (0, import_vitest.expect)(lev2).toEqual(2);
  (0, import_vitest.expect)(lev5).toEqual(4);
});
