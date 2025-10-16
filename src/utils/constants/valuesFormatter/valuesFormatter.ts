type AnyObject = Record<string, any>;

interface ValidationResult {
    isValid: boolean;
    errors: string[];
    converted: AnyObject[];
    academicYear: any;
    currentAcademicYear: any;
}

export function validateNestedKeys(
    inputObj: any,
    refObj: any,
    parentKey: string,
    errors: string[]
): void {
    if (!inputObj || !refObj) return;

    for (const key of Object.keys(inputObj)) {
        const inputVal = inputObj[key];
        const refVal = refObj[key];

        if (!(key in refObj)) {
            errors.push(
              `The key '${key}' is missing in '${parentKey}' for the object with key '${inputObj.key || "unknown"}`
            );
            continue;
        }

        if (Array.isArray(inputVal) && Array.isArray(refVal)) {
            inputVal.forEach((item, i) => {
                if (typeof item === "object" && item !== null) {
                    validateNestedKeys(item, refVal[0], `${parentKey}.${key}[${i}]`, errors);
                }
            });
            continue;
        }

        if (
            typeof inputVal === "object" &&
            inputVal !== null &&
            typeof refVal === "object" &&
            refVal !== null &&
            !Array.isArray(inputVal)
        ) {
            validateNestedKeys(inputVal, refVal, `${parentKey}.${key}`, errors);
        }
    }
}


export function mergeDeep(ref: any, input: any): any {

    if (typeof ref !== 'object' || ref === null || ref?.length == 0) {
        return input !== undefined ? input : ref;
    }

    if (Array.isArray(ref)) {
        if (Array.isArray(input)) {
            return input.map((item) => mergeDeep(ref[0], item));
        }

        return ref;
    }

    const merged: any = {};
    const allKeys = new Set([...Object.keys(ref), ...Object.keys(input || {})]);

    for (const key of allKeys) {
        merged[key] = mergeDeep(ref[key], input?.[key]);
    }

    return merged;
}

export const validateAndConvertArrayAgainstReference = (
    input: AnyObject[],
    reference: AnyObject[]
): ValidationResult => {
    const errors: string[] = [];
    const converted: AnyObject[] = [];
    let academicYear: string = '';
    let currentAcademicYear: string = '';

    for (const item of input) {
        const requiredKeys = ['key', 'program', 'registration', 'defaults'];
        for (const reqKey of requiredKeys) {
            if (!(reqKey in item)) {
                errors.push(
                    `Missing required field '${reqKey}' in object: ${JSON.stringify(item)}`
                );
            }
        }
        currentAcademicYear = item?.defaults?.currentAcademicYear || '';
        academicYear = item?.registration?.academicYear || '';

        const refItem = reference.find(r => r.key === item.key);
        if (!refItem) {
            errors.push(`Missing reference for key '${item.key}'`);
            continue;
        }

        const output: AnyObject = {
            defaults: (item.defaults ?? reference.find(r => r.key === item.key)?.defaults) || {},
            key: item.key,
            program: item.program,
            registration: {
                ...Object.fromEntries(
                    Object.entries(item.registration).filter(([k]) => k in refItem.registration)
                ),
            },
        };

        if (item.registration && refItem.registration) {
            validateNestedKeys(item.registration, refItem.registration, 'registration', errors);
        }

        if (item.attendance && !item.absenteeism && refItem.absenteeism) {
            output.absenteeism = { ...refItem.absenteeism };
        }

        for (const key of Object.keys(item)) {
            if (key in refItem) {
                const refValue = refItem[key];
                const inputValue = item[key];

                if (typeof refValue === 'object' && refValue !== null) {
                    output[key] = mergeDeep(refValue, inputValue);

                    if (key !== 'registration') {
                        console.log(key, inputValue, inputValue)

                        validateNestedKeys(inputValue, inputValue, key, errors);
                    }
                } else {
                    output[key] = inputValue;
                }
            } else {
                errors.push(`Unexpected key '${key}' in object with key '${item.key}'`);
            }
        }

        for (const key of Object.keys(refItem)) {
            if (!(key in item)) {
                output[key] = refItem[key];
            }
        }

        converted.push(output);
    }

    return {
        isValid: errors.length === 0,
        errors,
        converted,
        academicYear,
        currentAcademicYear,
    };
};