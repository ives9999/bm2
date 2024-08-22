import errors from "../component/form/Errors";

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

        this.rules.forEach(rule => {
            const field = rule[0];
            const method = rule[1];
            var on = '';
            var message = '';
            when = null;

            const rule2 = rule[2];
            if (typeof rule2 === 'object' && 'message' in rule2) {
                message = rule2.message;
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
        return field.length === 0;
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