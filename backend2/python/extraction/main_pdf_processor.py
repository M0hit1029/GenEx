import sys
from pdf import extract_text_and_images, extract_tables_from_pdf
from requirement_extraction import chunk_text, get_exact_requirements
from db_store import store_requirements

def main():
    if len(sys.argv) < 2:
        print("Usage: python main_pdf_handler.py <pdf_path>")
        return

    pdf_path = sys.argv[1]
    api_key = "sk-xxx"  # Replace with your actual OpenRouter key

    raw_text = extract_text_and_images(pdf_path)
    if not raw_text:
        print("No text extracted")
        return

    print(f"Total lines extracted: {len(raw_text.splitlines())}")
    chunks = chunk_text(raw_text)
    print(f"Split into {len(chunks)} chunks")

    requirements = get_exact_requirements(api_key, chunks)
    if not requirements:
        print("Requirement extraction failed")
        return

    print(f"Extracted {len(requirements)} requirements")
    tables = extract_tables_from_pdf(pdf_path)

    print(f"Found {len(tables)} tables")
    store_requirements(requirements, source_name=pdf_path, table_data=tables)
    print("All done")

if __name__ == "__main__":
    main()
