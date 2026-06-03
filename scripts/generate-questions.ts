import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { knowledgeBase } from "../src/data/knowledge-base";
import { mapChallenges } from "../src/data/map-challenges";
import { createMapReviewCard, createReviewCard } from "../src/utils/review";
import type { ReviewCard } from "../src/types";

const outputDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "generated"
);
mkdirSync(outputDir, { recursive: true });

const questions: ReviewCard[] = [
  ...knowledgeBase.flatMap((item) => [
    createReviewCard(item, "select", knowledgeBase),
    createReviewCard(item, "judge", knowledgeBase),
    createReviewCard(item, "fill", knowledgeBase),
    createReviewCard(item, "flashcard", knowledgeBase)
  ]),
  ...mapChallenges.map((challenge) => createMapReviewCard(challenge))
];

writeFileSync(
  resolve(outputDir, "questions.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      count: questions.length,
      questions
    },
    null,
    2
  ),
  "utf-8"
);

console.log("Generated src/data/generated/questions.json");
