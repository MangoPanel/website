export async function translate(file: ArrayBuffer, name : string): Promise<ArrayBuffer> {
  const outForm = new FormData();
  outForm.append(
    "file",
    new Blob([file], { type: "application/pdf" }),
    name
  );

  const res = await fetch("http://localhost:5001/api/process-pdf?steps=ocr,translate", {
    method: "POST",
    body: outForm,
  });

  if (!res.ok) {
    const ct = res.headers.get("content-type") ?? "";
    const msg = ct.includes("application/json")
      ? JSON.stringify(await res.json())
      : await res.text();
    throw new Error(`Translator error (${res.status}): ${msg}`);
  }

  return await res.arrayBuffer();
}