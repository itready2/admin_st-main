/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ExcelJS from 'exceljs';
import Swal from 'sweetalert2';

async function exportJSONToXLSX(jsonData: any[], fileName: string): Promise<void> {
    if (!jsonData || !jsonData.length) {
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Add headers
    const keys = Object.keys(jsonData[0]);
    worksheet.addRow(keys);

    // Add data
    jsonData.forEach(item => {
        const row: any[] = [];
        keys.forEach(key => {
            row.push(item[key]);
        });
        worksheet.addRow(row);
    });

    // Save workbook
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName}.xlsx`;
    link.click();
}

export async function exportToXLSX(json: any) {
    const { value: fileName } = await Swal.fire({
        title: 'Enter file name:',
        input: 'text',
        inputLabel: 'File Name',
        inputPlaceholder: 'Enter file name',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Export',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        preConfirm: (fileName) => {
            if (!fileName) {
                Swal.showValidationMessage('Please enter a file name');
            }
        }
    });
    if (fileName) {
        exportJSONToXLSX(json, fileName);
        Swal.fire(
            'Exported!',
            `Your contact list has been exported as "${fileName}".`,
            'success'
        );
    }
}
