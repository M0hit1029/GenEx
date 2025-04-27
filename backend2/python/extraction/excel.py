import openpyxl

def extract_text_and_tables_from_excel(excel_path):
    wb = openpyxl.load_workbook(excel_path)
    all_text = ""
    all_tables = []

    for sheet in wb.worksheets:
        table_data = []
        all_text += f"\n\nSheet: {sheet.title}\n"

        for row in sheet.iter_rows(values_only=True):
            row_data = [str(cell) if cell is not None else "" for cell in row]
            all_text += " | ".join(row_data) + "\n"
            table_data.append(row_data)
        
        all_tables.append(table_data)

    print("\n--- Extracted Text from Excel ---")

    return all_text, all_tables
