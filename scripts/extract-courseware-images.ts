import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const archives = [
  {
    id: "courseware-top",
    label: "七上课件",
    path: "C:/Users/chenh/Desktop/《金版学案》七年级  上册  地理（人教版）课件.rar",
    outputDir: resolve(projectRoot, "public", "images", "courseware", "七上课件")
  },
  {
    id: "courseware-bottom",
    label: "七下课件",
    path: "C:/Users/chenh/Desktop/金版学案 同步优学智慧作业 地理 七年级下册（人教版）课件.rar",
    outputDir: resolve(projectRoot, "public", "images", "courseware", "七下课件")
  }
];

const pythonScript = String.raw`
import io
import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path

from PIL import Image

config = json.loads(sys.argv[1])

WEB_NATIVE = {"png", "jpg", "jpeg", "gif", "webp", "svg"}
TIFF_TYPES = {"tif", "tiff"}
RAW_ONLY = {"emf", "wmf"}


def safe_name(text: str) -> str:
    text = re.sub(r'[<>:"/\\\\|?*]+', "_", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:120] if text else "untitled"


def lesson_folder_name(index: int, pptx_path: str) -> str:
    parts = [part for part in pptx_path.split("/") if part]
    tail = parts[-2:] if len(parts) >= 2 else parts
    name = " - ".join(safe_name(part.replace(".pptx", "")) for part in tail)
    return f"{index:03d} {name}"


def save_converted_tiff(target: Path, data: bytes):
    with Image.open(io.BytesIO(data)) as image:
        rgb = image.convert("RGBA") if image.mode not in ("RGB", "RGBA") else image
        rgb.save(target, format="PNG")


summary = {
    "generatedAt": __import__("datetime").datetime.now().isoformat(),
    "archives": []
}

for archive in config["archives"]:
    archive_path = Path(archive["path"])
    output_dir = Path(archive["outputDir"])
    output_dir.mkdir(parents=True, exist_ok=True)

    archive_summary = {
        "id": archive["id"],
        "label": archive["label"],
        "path": str(archive_path),
        "outputDir": str(output_dir),
        "exists": archive_path.exists(),
        "pptxCount": 0,
        "extractedLessons": [],
        "totals": {
            "lessonsWithMedia": 0,
            "webReadyFiles": 0,
            "rawOnlyFiles": 0,
            "convertedTiffFiles": 0,
            "skippedFiles": 0
        }
    }

    if not archive_path.exists():
        summary["archives"].append(archive_summary)
        continue

    listing = subprocess.run(
        ["tar", "-tf", str(archive_path)],
        capture_output=True,
        text=True,
        check=True
    )
    entries = [line.strip() for line in listing.stdout.splitlines() if line.strip()]
    pptx_entries = [entry for entry in entries if entry.lower().endswith(".pptx")]
    archive_summary["pptxCount"] = len(pptx_entries)

    for lesson_index, pptx_entry in enumerate(pptx_entries, start=1):
        raw_pptx = subprocess.run(
            ["tar", "-xOf", str(archive_path), pptx_entry],
            capture_output=True,
            check=True
        )
        with zipfile.ZipFile(io.BytesIO(raw_pptx.stdout)) as zf:
            media_files = [
                name
                for name in zf.namelist()
                if name.startswith("ppt/media/") and not name.endswith("/")
            ]
            if not media_files:
                continue

            archive_summary["totals"]["lessonsWithMedia"] += 1
            lesson_dir = output_dir / lesson_folder_name(lesson_index, pptx_entry)
            lesson_dir.mkdir(parents=True, exist_ok=True)
            raw_dir = lesson_dir / "_raw"
            raw_dir.mkdir(parents=True, exist_ok=True)

            lesson_summary = {
                "pptxPath": pptx_entry,
                "lessonDir": str(lesson_dir),
                "webReadyAssets": [],
                "rawAssets": [],
                "skipped": []
            }

            for media_index, media_name in enumerate(media_files, start=1):
                media_ext = media_name.split(".")[-1].lower()
                data = zf.read(media_name)

                if media_ext in WEB_NATIVE:
                    filename = f"img-{media_index:03d}.{media_ext}"
                    target = lesson_dir / filename
                    target.write_bytes(data)
                    archive_summary["totals"]["webReadyFiles"] += 1
                    lesson_summary["webReadyAssets"].append({
                        "source": media_name,
                        "path": str(target),
                        "relativeWebPath": "/" + "/".join(target.parts[target.parts.index("public") + 1:]),
                        "type": media_ext,
                        "converted": False
                    })
                    continue

                if media_ext in TIFF_TYPES:
                    filename = f"img-{media_index:03d}.png"
                    target = lesson_dir / filename
                    save_converted_tiff(target, data)
                    raw_target = raw_dir / f"img-{media_index:03d}.{media_ext}"
                    raw_target.write_bytes(data)
                    archive_summary["totals"]["webReadyFiles"] += 1
                    archive_summary["totals"]["convertedTiffFiles"] += 1
                    lesson_summary["webReadyAssets"].append({
                        "source": media_name,
                        "path": str(target),
                        "relativeWebPath": "/" + "/".join(target.parts[target.parts.index("public") + 1:]),
                        "type": "png",
                        "converted": True,
                        "rawPath": str(raw_target)
                    })
                    lesson_summary["rawAssets"].append({
                        "source": media_name,
                        "path": str(raw_target),
                        "type": media_ext
                    })
                    continue

                if media_ext in RAW_ONLY:
                    raw_target = raw_dir / f"img-{media_index:03d}.{media_ext}"
                    raw_target.write_bytes(data)
                    archive_summary["totals"]["rawOnlyFiles"] += 1
                    lesson_summary["rawAssets"].append({
                        "source": media_name,
                        "path": str(raw_target),
                        "type": media_ext
                    })
                    continue

                archive_summary["totals"]["skippedFiles"] += 1
                lesson_summary["skipped"].append({
                    "source": media_name,
                    "type": media_ext
                })

            archive_summary["extractedLessons"].append(lesson_summary)

    summary["archives"].append(archive_summary)

print(json.dumps(summary, ensure_ascii=False, indent=2))
`;

const run = spawnSync("python", ["-", JSON.stringify({ archives })], {
  input: pythonScript,
  encoding: "utf-8",
  cwd: projectRoot,
  maxBuffer: 32 * 1024 * 1024
});

if (run.status !== 0) {
  console.error(run.stderr);
  process.exit(run.status ?? 1);
}

const manifestDir = resolve(projectRoot, "public", "images", "manifests");
mkdirSync(manifestDir, { recursive: true });
writeFileSync(
  resolve(manifestDir, "courseware-image-manifest.json"),
  run.stdout,
  "utf-8"
);
console.log("Generated public/images/manifests/courseware-image-manifest.json");
