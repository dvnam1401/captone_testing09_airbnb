import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join } from "path";

export const readFileFromCSV = <T>(fileName: string): T[] => {
  // đường dẫn đến file trong thư mục 'data'
  // B1: xác định đường dẫn đến file csv
  // ../data/login-data.csv
  // __dirname: path của file hiện tại utils/csvReader.ts
  const filePath = join(__dirname, "..", "data", fileName);

  // B2: đọc nội dung file csv
  const fileContent = readFileSync(filePath, { encoding: "utf-8" });

  // b3: parse data string => list LoginData
  const data = parse(fileContent, {
    columns: true, // sử dụng dòng đầu tiên làm header
    skip_empty_lines: true, // bỏ qua dòng trống
    trim: true, // bỏ khoảng trắng thừa
  }) as T[];
  return data;
};
