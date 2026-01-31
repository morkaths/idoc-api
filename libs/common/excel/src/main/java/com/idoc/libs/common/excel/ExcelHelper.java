package com.idoc.libs.common.excel;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.function.Function;

public class ExcelHelper {
    private static final Logger log = LoggerFactory.getLogger(ExcelHelper.class);

    public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public static boolean hasExcelFormat(MultipartFile file) {
        return TYPE.equals(file.getContentType());
    }

    /**
     * Generic method to parse Excel file into a List of objects.
     * 
     * @param is     InputStream of the Excel file
     * @param mapper Function to map a Row to an Object T
     * @param <T>    Type of object to return
     * @return List of objects
     */
    public static <T> List<T> importFromExcel(InputStream is, Function<Row, T> mapper, int skipRows) {
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            List<T> tutorials = new ArrayList<>();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                // Skip header rows
                if (rowNumber < skipRows) {
                    rowNumber++;
                    continue;
                }

                try {
                    T mappedObject = mapper.apply(currentRow);
                    if (mappedObject != null) {
                        tutorials.add(mappedObject);
                    }
                } catch (Exception e) {
                    log.error("Error parsing row {}: {}", rowNumber, e.getMessage());
                }
                rowNumber++;
            }

            workbook.close();
            return tutorials;
        } catch (IOException e) {
            throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
        }
    }

    /**
     * Import from Excel with dynamic header mapping.
     */
    public static <T> List<T> importFromExcel(InputStream is, BiFunction<Row, Map<String, Integer>, T> mapper) {
        try (Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            List<T> list = new ArrayList<>();

            Map<String, Integer> headerMap = new HashMap<>();
            int rowNumber = 0;

            if (rows.hasNext()) {
                Row headerRow = rows.next();
                // Build header map
                for (Cell cell : headerRow) {
                    String headerValue = getCellStringValue(headerRow, cell.getColumnIndex());
                    if (headerValue != null && !headerValue.trim().isEmpty()) {
                        headerMap.put(headerValue.trim().toLowerCase(), cell.getColumnIndex());
                    }
                }
                rowNumber++;
            }

            while (rows.hasNext()) {
                Row currentRow = rows.next();
                try {
                    T mappedObject = mapper.apply(currentRow, headerMap);
                    if (mappedObject != null) {
                        list.add(mappedObject);
                    }
                } catch (Exception e) {
                    log.error("Error parsing row {}: {}", rowNumber, e.getMessage());
                }
                rowNumber++;
            }

            return list;
        } catch (IOException e) {
            throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
        }
    }

    public static <T> ByteArrayInputStream exportToExcel(List<T> data, String sheetName, String[] headers,
            Function<T, Object[]> dataMapper) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(sheetName);

            // Header
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < headers.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(headers[col]);
            }

            // Data
            int rowIdx = 1;
            for (T item : data) {
                Row row = sheet.createRow(rowIdx++);
                Object[] values = dataMapper.apply(item);
                for (int col = 0; col < values.length; col++) {
                    Cell cell = row.createCell(col);
                    Object value = values[col];
                    if (value instanceof String) {
                        cell.setCellValue((String) value);
                    } else if (value instanceof Number) {
                        cell.setCellValue(((Number) value).doubleValue());
                    } else if (value != null) {
                        cell.setCellValue(value.toString());
                    }
                }
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("fail to import data to Excel file: " + e.getMessage());
        }
    }

    // Helper to safely get string value
    public static String getCellStringValue(Row row, int cellIndex) {
        Cell cell = row.getCell(cellIndex);
        if (cell == null)
            return null;

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                }
                DataFormatter formatter = new DataFormatter();
                return formatter.formatCellValue(cell);
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return null;
        }
    }

    public static String getCellStringValue(Row row, Map<String, Integer> headerMap, String columnName) {
        if (headerMap == null || columnName == null) {
            return null;
        }
        // Case-insensitive lookup
        Integer cellIndex = headerMap.get(columnName.toLowerCase());
        if (cellIndex == null) {
            return null;
        }
        return getCellStringValue(row, cellIndex);
    }
}
