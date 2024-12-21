export const Error2 = [
    {able: 'supplier', item: 'name', error: 'empty', code: 4400, message: '供應廠商名稱不能為空白'},
    {able: 'pos', item: 'buy', error: 'empty', code: 4500, message: '進貨是空的'},
    {able: 'match', item: 'name', error: 'empty', code: 5000, message: '報名名稱不能為空白'},
    {able: 'match', item: 'contact_name', error: 'empty', code: 5001, message: '聯絡人姓名不能為空白'},
    {able: 'match', item: 'contact_tel', error: 'empty', code: 5002, message: '聯絡人電話不能為空白'},
    {able: 'match', item: 'contact_email', error: 'empty', code: 5003, message: '聯絡人Email不能為空白'},
];

export function getErrorMessage(code) {
    const res = Error2.find(error => error.code === code);
    return res ? res.message : '沒有取得錯誤碼';
}