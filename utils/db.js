import fs from "node:fs/promises";

export async function readDB() {
  const data = await fs.readFile("db.json", "utf-8");
  const jsonData = JSON.parse(data);
  return jsonData;
}

export async function writeDB(data) {
  await fs.writeFile("db.json", JSON.stringify(data, null, 2), "utf-8");
}
