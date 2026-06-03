import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const sources = [
  {
    id: "七上",
    label: "七上教材",
    path: "D:/chenhz/初中教材/七年级教材/上册/（根据2022年版课程标准修订）义务教育教科书·地理七年级上册.pdf",
    outputDir: resolve(projectRoot, "public", "images", "七上")
  },
  {
    id: "七下",
    label: "七下教材",
    path: "D:/chenhz/初中教材/七年级教材/下册/（根据2022年版课程标准修订）义务教育教科书·地理七年级下册.pdf",
    outputDir: resolve(projectRoot, "public", "images", "七下")
  },
  {
    id: "七上教师",
    label: "七上教师用书",
    path: "C:/Users/chenh/Desktop/金版学案+同步优学智慧作业+地理+七年级上册（人教版）教师用书.pdf",
    outputDir: resolve(projectRoot, "public", "images", "七上教师")
  },
  {
    id: "七下教师",
    label: "七下教师用书",
    path: "C:/Users/chenh/Desktop/金版学案 同步优学智慧作业 地理 七年级下册（人教版）教师用书.pdf",
    outputDir: resolve(projectRoot, "public", "images", "七下教师")
  }
];

const pythonScript = String.raw`
import json
import sys
from pathlib import Path
from pypdf import PdfReader

config = json.loads(sys.argv[1])
manifest = {"generatedAt": __import__("datetime").datetime.now().isoformat(), "sources": []}

for source in config["sources"]:
    pdf_path = Path(source["path"])
    output_dir = Path(source["outputDir"])
    output_dir.mkdir(parents=True, exist_ok=True)
    source_manifest = {
        "id": source["id"],
        "label": source["label"],
        "path": str(pdf_path),
        "outputDir": str(output_dir),
        "exists": pdf_path.exists(),
        "pageCount": 0,
        "extracted": []
    }

    if not pdf_path.exists():
        manifest["sources"].append(source_manifest)
        continue

    reader = PdfReader(str(pdf_path))
    source_manifest["pageCount"] = len(reader.pages)

    for page_index, page in enumerate(reader.pages, start=1):
        if not page.images:
            continue

        page_bucket = []
        for image_index, image in enumerate(page.images, start=1):
            suffix = image.name.split(".")[-1].lower() if "." in image.name else "bin"
            filename = f"page-{page_index:03d}-{image_index:02d}.{suffix}"
            target = output_dir / filename
            target.write_bytes(image.data)
            page_bucket.append(filename)

        source_manifest["extracted"].append({
            "page": page_index,
            "images": page_bucket
        })

    manifest["sources"].append(source_manifest)

print(json.dumps(manifest, ensure_ascii=False))
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

const manifestDir = resolve(projectRoot, "public", "images", "manifests");
mkdirSync(manifestDir, { recursive: true });
writeFileSync(resolve(manifestDir, "image-manifest.json"), run.stdout, "utf-8");
console.log("Generated public/images/manifests/image-manifest.json");
