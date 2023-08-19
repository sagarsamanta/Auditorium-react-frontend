import { getCurrencyFormat } from "./utils";

const convertKeysToUpperCaseWithDashes = (data) => {
    if (!data) return data;
    return data.map(item => {
        const newItem = {};
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                const convertedKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toUpperCase();
                newItem[convertedKey] = (key.toLowerCase().includes('amount')) ? getCurrencyFormat(item[key]) : item[key];
            }
        }
        return newItem;
    });
}

export const generateReportFileName = (movieTitle = '', showTitle = '', date = '') => {
    let movie = movieTitle || 'All Movie';
    let show = showTitle || 'All Shows';
    let reportDate = date || 'All Time';
    return `${movie}--${show}--${reportDate}`;
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
    const modifiedJsonData = convertKeysToUpperCaseWithDashes(jsonData);
    const csvData = convertToCSV(modifiedJsonData);

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};