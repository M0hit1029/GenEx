import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import argparse
import json
import email
from email import policy
from io import BytesIO
from email.message import Message
from PyPDF2 import PdfReader
import pandas as pd
from docs import extract_text_and_tables_from_docx
from pdf import extract_text_and_images, extract_tables_from_pdf
from audio import transcribe_audio
from video import transcribe_video
from requirement_extraction import get_exact_requirements
from excel import extract_text_and_tables_from_excel
from db_store import store_requirements
from prompt import get_op_from_prompt

# Function to extract text from .eml file
def extract_email_text(eml_file):
    with open(eml_file, 'rb') as f:
        msg = email.message_from_binary_file(f, policy=policy.default)
    
    # Initialize an empty string to collect the text
    email_text = ""

    # Check if the email is multipart
    if msg.is_multipart():
        # Iterate over each part of the email
        for part in msg.iter_parts():
            # Extract text/plain content
            if part.get_content_type() == 'text/plain':
                email_text += part.get_payload(decode=True).decode()

            # Extract text/html content if no plain text found
            elif part.get_content_type() == 'text/html':
                email_text += part.get_payload(decode=True).decode()

            # Handle attachments
            elif part.get_content_disposition() == 'attachment':
                filename = part.get_filename()
                if filename:
                    print(f"Attachment found: {filename}")
                    file_data = part.get_payload(decode=True)
                    if filename.endswith('.pdf'):
                        email_text += extract_pdf_text(file_data)
                    elif filename.endswith('.xlsx') or filename.endswith('.xls'):
                        email_text += extract_excel_text(file_data)
                    # Add more file types here if needed
    else:
        # If the email isn't multipart, directly get the payload (body)
        email_text = msg.get_payload(decode=True).decode()

    return email_text if email_text else None

# Function to extract text from PDF
def extract_pdf_text(pdf_data):
    try:
        reader = PdfReader(BytesIO(pdf_data))
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        return f"Error extracting PDF text: {str(e)}"

# Function to extract text from Excel files
def extract_excel_text(excel_data):
    try:
        df = pd.read_excel(BytesIO(excel_data), sheet_name=None)
        text = ""
        for sheet_name, sheet_data in df.items():
            text += f"Sheet: {sheet_name}\n"
            text += sheet_data.to_string(index=False) + "\n"
        return text
    except Exception as e:
        return f"Error extracting Excel text: {str(e)}"

# Function to chunk text into smaller pieces
def chunk_text(text, max_chunk_size=2000):
    chunks = []
    current_chunk = []
    current_length = 0
    lines = text.splitlines(keepends=True)

    for line in lines:
        if current_length + len(line) > max_chunk_size and current_chunk:
            chunks.append("".join(current_chunk))
            current_chunk = []
            current_length = 0
        current_chunk.append(line)
        current_length += len(line)

    if current_chunk:
        chunks.append("".join(current_chunk))

    return chunks

# Function to convert tables to text
def convert_tables_to_text(tables, file_label):
    table_text = ""
    for idx, table in enumerate(tables, 1):
        table_text += f"\n\nTable {idx} from {file_label}:\n"
        for row in table:
            table_text += " | ".join(row) + "\n"
    return table_text

# Main file processing function
def process_files_by_type(file_paths):
    categorized = {
        "PDF": ("", []),
        "DOCX": ("", []),
        "AUDIO": ("", []),
        "VIDEO": ("", []),
        "EXCEL": ("", []),
        "EML": ("", []),  # Added EML type for email files
    }

    for file_path in file_paths:
        ext = os.path.splitext(file_path)[1].lower()
        print(f"\n>>> Processing file: {file_path}")
        if ext == ".pdf":
            print("Processing PDF...")
            text = extract_text_and_images(file_path)
            tables = extract_tables_from_pdf(file_path)
            categorized["PDF"] = (categorized["PDF"][0] + f"\n\n{text}" + convert_tables_to_text(tables, file_path), categorized["PDF"][1] + tables)

        elif ext in [".mp4", ".avi", ".mov", ".mkv"]:
            print("Processing Video...")
            text = transcribe_video(file_path)
            categorized["VIDEO"] = (categorized["VIDEO"][0] + f"\n\n{text}", [])

        elif ext in [".mp3", ".wav", ".m4a", ".mpga"]:
            print("Processing Audio...")
            text = transcribe_audio(file_path)
            categorized["AUDIO"] = (categorized["AUDIO"][0] + f"\n\n{text}", [])

        elif ext == ".docx":
            print("Processing DOCX...")
            text, tables = extract_text_and_tables_from_docx(file_path)
            categorized["DOCX"] = (
            categorized["DOCX"][0] + f"\n\n{text}" + convert_tables_to_text(tables, file_path),
            categorized["DOCX"][1] + tables
            )

        elif ext in [".xlsx", ".xls"]:
            print("Processing Excel...")
            text, tables = extract_text_and_tables_from_excel(file_path)
            categorized["EXCEL"] = (categorized["EXCEL"][0] + f"\n\n{text}" + convert_tables_to_text(tables, file_path), categorized["EXCEL"][1] + tables)

        elif ext == ".eml":
            print("Processing Email...")
            email_text = extract_email_text(file_path)
            if email_text:
                categorized["EML"] = (categorized["EML"][0] + f"\n\n{email_text}", [])

        else:
            print(f"Unsupported file type: {file_path}")

    return categorized

def main():
    # ——— Argument parsing ———
    parser = argparse.ArgumentParser(
        description="Bulk-extract requirements from multiple files"
    )
    parser.add_argument(
        'files', nargs='+', help='One or more file paths to process'
    )
    parser.add_argument(
        '--user-id',    required=True, help="Mongo userId to attach"
    )
    parser.add_argument(
        '--project-id', required=True, help="Mongo projectId to attach"
    )
    parser.add_argument(
        '--prompt', required=True, help="Mongo prompt to attach"
    )
    args = parser.parse_args()

    file_paths = args.files
    user_id    = args.user_id
    project_id = args.project_id
    api_key = "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"   # your real key here
    categorized_data = process_files_by_type(file_paths)

    all_requirements = []
    all_tables = []

    for source_type, (text, tables) in categorized_data.items():
        if not text.strip():
            continue
        chunks = chunk_text(text)
        requirements = get_exact_requirements(api_key, chunks, all_requirements)
        if not requirements:
            continue
        # only extend with truly new items
        for req in requirements:
            if req not in all_requirements:
                all_requirements.append(req)
        all_tables.extend(tables)

    if not all_requirements:
        print("No requirements extracted from any source.", file=sys.stderr)
        sys.exit(1)

    # Save into Mongo
    success = store_requirements(
        all_requirements,
        source_name="bulk_upload",
        project_id=project_id,
        user_id=user_id,
        table_data=all_tables
    )

    if not success:
        print("Failed to store in DB.", file=sys.stderr)
        sys.exit(1)

    # # Optionally, emit the structured requirements back to Node as JSON:
    sys.stdout.write(json.dumps(all_requirements, ensure_ascii=False))
    sys.exit(0)

if __name__ == "__main__":
    main()
