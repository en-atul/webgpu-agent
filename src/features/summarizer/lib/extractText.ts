import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const SUPPORTED = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "text/plain": "txt",
} as const;

export type SupportedType = (typeof SUPPORTED)[keyof typeof SUPPORTED];

export function getSupportedTypes(): string[] {
  return Object.keys(SUPPORTED);
}

export function isSupported(file: File): boolean {
  return file.type in SUPPORTED;
}

async function extractFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const parts: string[] = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    parts.push(text);
  }
  return parts.join("\n\n").trim();
}

async function extractFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

async function extractFromTxt(file: File): Promise<string> {
  return file.text();
}

export async function extractTextFromFile(file: File): Promise<string> {
  const type = file.type as keyof typeof SUPPORTED;
  if (!(type in SUPPORTED)) {
    throw new Error(`Unsupported file type: ${file.type}. Use PDF, DOCX, or TXT.`);
  }
  switch (SUPPORTED[type]) {
    case "pdf":
      return extractFromPdf(file);
    case "docx":
      return extractFromDocx(file);
    case "txt":
      return extractFromTxt(file);
    default:
      throw new Error(`Unsupported: ${file.name}`);
  }
}
