#!/usr/bin/env python3
import sys
from pathlib import Path

try:
    import win32com.client
except ImportError:
    print("Error: pywin32 required")
    sys.exit(1)

if len(sys.argv) < 2:
    print("Usage: python simple_excel_to_pdf.py <input.xlsx>")
    sys.exit(1)

input_file = Path(sys.argv[1]).resolve()
output_file = input_file.with_suffix('.pdf')

print(f"Input: {input_file.name}")
print(f"Output: {output_file.name}")

try:
    excel = win32com.client.Dispatch("Excel.Application")
    wb = excel.Workbooks.Open(str(input_file))
    ws = wb.Worksheets[0]
    ws.ExportAsFixedFormat(0, str(output_file))
    wb.Close(False)
    excel.Quit()
    print(f"Success: {output_file}")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
