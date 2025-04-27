import pdfplumber
import fitz  # PyMuPDF
from PIL import Image
import pytesseract
import io

def extract_text_with_ocr(image_data):
    return pytesseract.image_to_string(image_data)

def extract_text_and_images(pdf_path):
    doc = fitz.open(pdf_path)
    text_output = []

    for page_index in range(len(doc)):
        page = doc.load_page(page_index)
        text = page.get_text()

        if text.strip():  # normal text
            text_output.append(text)
        else:
            pix = page.get_pixmap(dpi=300)
            img_bytes = pix.tobytes("png")
            image = Image.open(io.BytesIO(img_bytes))
            ocr_text = extract_text_with_ocr(image)
            text_output.append(ocr_text)

    return "\n".join(text_output)

def extract_tables_from_pdf(pdf_path):
    tables = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables.extend(page.extract_tables())
    return tables
