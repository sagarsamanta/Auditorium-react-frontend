import { displayDate, getCurrencyFormat } from "./utils";

export const generateReportFileName = (movieTitle = '', showTitle = '', date = '') => {
    let movie = movieTitle;
    let show = showTitle ? `_${showTitle.replaceAll(' ', '-')}` : '';
    let reportDate = date ? `_${date}` : '';
    return `${movie}${show}${reportDate}__${displayDate(new Date(), "DD-MM-YYYY_hhmmss")}`;
}

export const convertToCSV = (data) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
        const values = headers.map(header => JSON.stringify(row[header]));
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};
export const downloadCSV = (jsonData, title) => {
    const csvData = convertToCSV(jsonData);

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};