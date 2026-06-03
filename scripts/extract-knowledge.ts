import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const sources = [
  {
    id: "teacher_top",
    label: "七上教师用书",
    kind: "teacher",
    path: "C:/Users/chenh/Desktop/金版学案+同步优学智慧作业+地理+七年级上册（人教版）教师用书.pdf"
  },
  {
    id: "teacher_bottom",
    label: "七下教师用书",
    kind: "teacher",
    path: "C:/Users/chenh/Desktop/金版学案 同步优学智慧作业 地理 七年级下册（人教版）教师用书.pdf"
  },
  {
    id: "textbook_top",
    label: "七上教材",
    kind: "textbook",
    path: "D:/chenhz/初中教材/七年级教材/上册/（根据2022年版课程标准修订）义务教育教科书·地理七年级上册.pdf"
  },
  {
    id: "textbook_bottom",
    label: "七下教材",
    kind: "textbook",
    path: "D:/chenhz/初中教材/七年级教材/下册/（根据2022年版课程标准修订）义务教育教科书·地理七年级下册.pdf"
  }
];

const pythonScript = String.raw`
import json
import re
import sys
from pathlib import Path
import pdfplumber

config = json.loads(sys.argv[1])
chapter_pattern = re.compile(r"^\s*第[一二三四五六七八九十0-9]+章")
results = []

for source in config["sources"]:
    path = Path(source["path"])
    result = {
        "id": source["id"],
        "label": source["label"],
        "kind": source["kind"],
        "path": str(path),
        "exists": path.exists(),
        "pages": 0,
        "samplePages": [],
        "chapterLines": [],
        "needsOcr": False,
    }

    if not path.exists():
        results.append(result)
        continue

    with pdfplumber.open(path) as pdf:
        result["pages"] = len(pdf.pages)
        text_hits = 0
        for index, page in enumerate(pdf.pages[:16], start=1):
            text = page.extract_text() or ""
            cleaned = "\n".join(line.strip() for line in text.splitlines() if line.strip())
            if cleaned:
                text_hits += 1
                result["samplePages"].append({
                    "page": index,
                    "text": cleaned[:600],
                })

            for raw_line in cleaned.splitlines():
                compact = re.sub(r"\s+", "", raw_line)
                if chapter_pattern.match(compact):
                    if raw_line not in result["chapterLines"]:
                        result["chapterLines"].append(raw_line)

        if source["id"].startswith("textbook"):
            for page_no in (4, 5):
                if page_no <= len(pdf.pages):
                    text = pdf.pages[page_no - 1].extract_text() or ""
                    cleaned = "\n".join(line.strip() for line in text.splitlines() if line.strip())
                    if cleaned:
                        result["samplePages"].append({
                            "page": page_no,
                            "text": cleaned[:900],
                        })

        if source["kind"] == "teacher" and text_hits == 0:
            result["needsOcr"] = True

    results.append(result)

print(json.dumps({"generatedAt": __import__("datetime").datetime.now().isoformat(), "sources": results}, ensure_ascii=False))
`;

const run = spawnSync("python", ["-", JSON.stringify({ sources })], {
  input: pythonScript,
  encoding: "utf-8",
  cwd: projectRoot
});

if (run.status !== 0) {
  console.error(run.stderr);
  process.exit(run.status ?? 1);
}

const outputDir = resolve(projectRoot, "src", "data", "generated");
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, "pdf-structure.json"), run.stdout, "utf-8");
console.log("Generated src/data/generated/pdf-structure.json");
