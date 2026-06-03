import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const recommendedKeywords = [
  "\\u4e9a\\u6d32",
  "\\u5341\\u5b57\\u8def\\u53e3",
  "\\u77f3\\u6cb9\\u8d44\\u6e90",
  "\\u4e16\\u754c\\u9762\\u79ef\\u6700\\u5927\\u7684\\u56fd\\u5bb6",
  "\\u72ec\\u5360\\u4e00\\u4e2a\\u5927\\u9646",
  "\\u7f8e\\u56fd",
  "\\u5df4\\u897f",
  "\\u6781\\u5730\\u5730\\u533a"
];

const pythonScript = String.raw`
import io
import json
import subprocess
import zipfile
from collections import Counter
from pathlib import Path

desktop = Path.home() / "Desktop"
archives = sorted(desktop.glob("*.rar"))
recommended_keywords = json.loads("""${JSON.stringify(recommendedKeywords)}""")
results = []

for archive_path in archives:
    listing = subprocess.run(
        ["tar", "-tf", str(archive_path)],
        capture_output=True,
        text=True,
        check=True
    )
    entries = [line.strip() for line in listing.stdout.splitlines() if line.strip()]
    pptx_entries = [entry for entry in entries if entry.lower().endswith(".pptx")]
    doc_entries = [entry for entry in entries if entry.lower().endswith(".doc")]
    media_types = Counter()
    total_media = 0
    pptx_with_media = []

    for entry in pptx_entries:
        raw = subprocess.run(
            ["tar", "-xOf", str(archive_path), entry],
            capture_output=True,
            check=True
        )
        with zipfile.ZipFile(io.BytesIO(raw.stdout)) as zf:
            media_files = [
                name
                for name in zf.namelist()
                if name.startswith("ppt/media/") and not name.endswith("/")
            ]
        if media_files:
            total_media += len(media_files)
            pptx_with_media.append({
                "path": entry,
                "mediaCount": len(media_files),
                "sampleMediaFiles": media_files[:12],
            })
            for name in media_files:
                media_types[name.split(".")[-1].lower()] += 1

    pptx_with_media.sort(key=lambda item: (-item["mediaCount"], item["path"]))
    results.append({
        "archive": str(archive_path),
        "archiveName": archive_path.name,
        "pptxCount": len(pptx_entries),
        "docCount": len(doc_entries),
        "pptxWithMediaCount": len(pptx_with_media),
        "totalEmbeddedMedia": total_media,
        "mediaTypes": media_types.most_common(),
        "topPptx": pptx_with_media[:12],
        "recommendedMapSources": [
            item for item in pptx_with_media
            if any(keyword in item["path"] for keyword in recommended_keywords)
        ][:12]
    })

print(json.dumps({
    "generatedAt": __import__("datetime").datetime.now().isoformat(),
    "archives": results
}, ensure_ascii=False, indent=2))
`;

const run = spawnSync("python", ["-"], {
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
writeFileSync(resolve(outputDir, "courseware-assets.json"), run.stdout, "utf-8");
console.log("Generated src/data/generated/courseware-assets.json");
