export const Error2 = [
    {key: 'supplier_name_empty', code: 4400, message: '供應廠商名稱不能為空白'},
];

export function getErrorMessage(code) {
    const res = Error2.find(error => error.code === code);
    return res ? res.message : '沒有取得錯誤碼';
}