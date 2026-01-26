export async function translate(file: File): Promise<ArrayBuffer> {
  const form = new FormData();
  form.append("file", file, file.name);

  const res = await fetch(
    "http://localhost:5001/api/process-pdf?steps=ocr,translate",
    {
      method: "POST",
      body: form,
    }
  );

  if (!res.ok) {
    const ct = res.headers.get("content-type") ?? "";
    const msg = ct.includes("application/json")
      ? JSON.stringify(await res.json())
      : await res.text();
    throw new Error(`Translator error (${res.status}): ${msg}`);
  }

  return await res.arrayBuffer();
}