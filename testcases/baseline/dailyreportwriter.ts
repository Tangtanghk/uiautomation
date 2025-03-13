import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';

export class DailyReportWriter {
    private filename: string = 'daily_report.xlsx';
    private workbook: ExcelJS.Workbook;
    private columns: string[] = ['Test Execute Time','Landing Page(s)', 'Product Listing Page(s)',
    'Product Details Page(s)', 'Builder(s)', 'Uploading(s)',
    'Uploading Start', 'Uploading Finish', 'File Size(MB)'];
    constructor() {
      this.workbook = new ExcelJS.Workbook();
    }

    async setFilename(filename:string){
      this.filename = filename;
    }

    async setColumns(columns:string[]){
      this.columns = columns;
    }
  
  
    async createDailyReport(data:string[]): Promise<void> {
      // Check if the file exists
      const fileExists = fs.existsSync(this.filename);
  
      if (!fileExists) {
        // Create a new workbook
        this.workbook = new ExcelJS.Workbook();
      } else {
        // Load existing workbook
        await this.workbook.xlsx.readFile(this.filename);
      }
  
      // Get today's date (you can replace this with your actual date logic)
      let today = new Date().toISOString().slice(0, 10);
      // Check if the sheet for today exists
      const sheetExists = this.workbook.getWorksheet(today);
  
      if (!sheetExists) {
        // Create a new sheet for today
        const worksheet = this.workbook.addWorksheet(today);
        await worksheet?.addRow(this.columns);

      }
  


      // Append data to the sheet
      const sheet = this.workbook.getWorksheet(today);
      await sheet?.addRow(data);
    //   dataToAppend.forEach((row) => {
    //     sheet.addRow(row);
    //   });
  
      // Save the workbook
      await this.workbook.xlsx.writeFile(this.filename);
      console.log(`Data appended to ${today}'s sheet in ${this.filename}.`);
    }
}
