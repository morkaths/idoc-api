import { Buffer } from 'buffer';
import * as ExcelJS from 'exceljs';

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

export class ExcelService {
  /**
   * Tạo file Excel từ dữ liệu
   * @param columns Cấu hình cột
   * @param data Dữ liệu cần xuất
   * @param sheetName Tên sheet (mặc định: 'Sheet1')
   * @returns Buffer của file Excel
   */
  async generateExcel(
    columns: ExcelColumn[],
    data: any[],
    sheetName = 'Sheet1'
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns;

    // Add rows
    worksheet.addRows(data);

    // Auto fit columns
    if (worksheet.columns) {
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell?.({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 0;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
      });
    }

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Generate buffer
    const buffer = (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
    return buffer;
  }

  /**
   * Đọc dữ liệu từ file Excel
   * @param buffer Buffer của file Excel
   * @returns Mảng các object chứa dữ liệu
   */
  async readExcel<T = any>(buffer: Buffer): Promise<T[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new Error('Excel file must have at least one worksheet');
    }

    const data: T[] = [];
    const headers: string[] = [];

    worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      if (rowNumber === 1) {
        // Read headers
        row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
          headers[colNumber] = cell.value ? cell.value.toString() : '';
        });
      } else {
        // Read data
        const rowData: any = {};
        row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
          const header = headers[colNumber];
          if (header) {
            rowData[header] = cell.value;
          }
        });
        data.push(rowData as T);
      }
    });

    return data;
  }
}
