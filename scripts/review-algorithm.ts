import { pathToFileURL } from "node:url";
import {
  REVIEW_INTERVALS,
  applyReviewResult,
  masteryLabel
} from "../src/utils/review";
import type { ReviewProgress, SelfRating } from "../src/types";

export { REVIEW_INTERVALS, applyReviewResult, masteryLabel };

function demo() {
  const sequence: SelfRating[] = ["again", "hard", "good", "good", "good"];
  let progress: ReviewProgress | undefined;

  for (const rating of sequence) {
    progress = applyReviewResult(progress, rating);
    console.log(
      `${rating} -> mastery ${progress.mastery} (${masteryLabel(progress.mastery)}) -> next ${progress.nextReviewAt}`
    );
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log("Review intervals:", REVIEW_INTERVALS.join(", "));
  demo();
}
