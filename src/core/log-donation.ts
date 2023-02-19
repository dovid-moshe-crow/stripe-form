import { google }  from 'googleapis'

// Replace the value of `spreadsheetId` with the actual ID of your Google Sheet
const spreadsheetId = '14wm9rnzS_vbxJUF6xwmxNuIXXylWmMat8d83nVfXY_I';

export async function writeRow(data: any[]) {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const request = {
    spreadsheetId,
    range: 'Sheet1',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [data]
    }
  };

  sheets.spreadsheets.values.append(request, (err: any, res: any) => {
    if (err) return console.log(`The API returned an error: ${err}`);
    console.log(res.data);
  });
}
