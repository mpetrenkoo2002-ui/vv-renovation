import fs from 'node:fs/promises';
import {FileBlob,Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const dir='D:/construction website/outputs/vv-bidcentral-crm';
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(`${dir}/native-review.xlsx`));
for(const [sheetName,range]of Object.entries({Leads:'A1:G5',Dashboard:'A1:C27','Follow-ups':'A1:F5',Instructions:'A1:A6',Examples:'A1:G4',Lists:'A1:F12'})){
 const img=await wb.render({sheetName,range,scale:1.1,format:'png'});
 await fs.writeFile(`${dir}/native-${sheetName}.png`,new Uint8Array(await img.arrayBuffer()));
}
console.log('Native export layout review rendered for six tabs.');
