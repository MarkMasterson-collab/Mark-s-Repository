import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Increase body size limit to 20 MB for PDFs
export const maxDuration = 30;

async function extractPdfText(buffer: Buffer): Promise<string | null> {
  try {
    // Import from lib directly to avoid pdf-parse loading its test fixtures
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse/lib/pdf-parse.js");
    const data = await pdfParse(buffer);
    return data.text?.trim() || null;
  } catch (err) {
    console.error("PDF text extraction failed:", err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const subjectId = formData.get("subjectId") as string | null;
  const title = (formData.get("title") as string | null)?.trim();
  const type = formData.get("type") as string | null;
  const language = (formData.get("language") as string) || "en";
  const examYearRaw = formData.get("examYear") as string | null;

  // Validate required fields
  if (!file || !subjectId || !title || !type) {
    return NextResponse.json(
      { error: "Missing required fields: file, subjectId, title, type" },
      { status: 400 }
    );
  }

  if (!["past_paper", "notes", "other"].includes(type)) {
    return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
  }

  if (!["en", "fr"].includes(language)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
  }

  const MAX_SIZE = 20 * 1024 * 1024; // 20 MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File exceeds 20 MB limit" }, { status: 400 });
  }

  const examYear = examYearRaw ? parseInt(examYearRaw, 10) : null;
  if (examYearRaw && (isNaN(examYear!) || examYear! < 1900 || examYear! > 2100)) {
    return NextResponse.json({ error: "Invalid exam year" }, { status: 400 });
  }

  // Read file into buffer once — reused for storage upload and text extraction
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Generate a stable document ID so the storage path and DB row share the same ID
  const docId = crypto.randomUUID();
  const storagePath = `${subjectId}/${docId}.pdf`;

  // 1. Upload PDF to Supabase Storage
  const { error: storageError } = await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (storageError) {
    console.error("Storage upload error:", storageError);
    return NextResponse.json(
      { error: `Storage error: ${storageError.message}` },
      { status: 500 }
    );
  }

  // 2. Extract text (non-fatal — we continue even if extraction fails)
  const extractedText = await extractPdfText(buffer);

  // 3. Insert document record
  const { data: document, error: dbError } = await supabase
    .from("documents")
    .insert({
      id: docId,
      subject_id: subjectId,
      title,
      type: type as "past_paper" | "notes" | "other",
      language: language as "en" | "fr",
      storage_path: storagePath,
      extracted_text: extractedText,
      exam_year: examYear,
    })
    .select()
    .single();

  if (dbError) {
    // Roll back the storage upload so we don't leave orphaned files
    await supabase.storage.from("documents").remove([storagePath]);
    console.error("DB insert error:", dbError);
    return NextResponse.json(
      { error: `Database error: ${dbError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      document,
      textExtracted: extractedText !== null,
    },
    { status: 201 }
  );
}
