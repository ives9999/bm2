import errors from "../component/form/Errors";
import {GetEmailBlankError} from "../errors/MemberError";

export default class Validate {
    attributes = {};
    rules = [];
    errors = {};
    constructor(attributes, rules) {
        this.attributes = attributes;
        this.rules = rules;
    }

    validate() {
        var res = true;
        var when = true;

        //['email', 'required', {message: GetEmailBlankError().msg}],
        // rule[0]是欄位名稱
        // rule[1]是驗證方法
        // rule[2]是驗證錯誤後要出現的錯誤訊息
        this.rules.forEach(rule => {
            //console.info(rule);
            const field = rule[0];
            let method = rule[1];
            //let on = '';
            let message = '';
            when = null;
            //console.info(field);

            const rule2 = rule[2];
            // 如果沒有設定驗證方法的參數，則預設為驗證是否為空白，然後第二個參數就是錯誤訊息
            if (typeof rule2 === 'object' && 'message' in rule2) {
                message = rule2.message;
                method = 'required';
            // when 表示要滿足該條件才做驗證
            } else if (typeof rule2 === 'object' && 'when' in rule2) {
                const f = rule2.when;
                if (typeof f === 'function') {
                    when = f();
                    //console.info(when);
                    message = rule[3].message;
                }
            }

            if (field in this.attributes) {
                if ((when === null || when) && method === 'required' && this.required(this.attributes[field])) {
                    this.errors = {...this.errors, [field]: message};
                    res = false;
                }
            }
        });

        return res;
    }

    required(field) {
        return field.length === 0 || field === 0;
    }

    showErrors(setFn, errors = null) {
        if (errors !== null) {
            this.errors = errors
        }

        Object.keys(this.errors).forEach((field) => {
            setFn((prev) => (
                {...prev, [field]: this.errors[field]}
            ));
        });
    }
}