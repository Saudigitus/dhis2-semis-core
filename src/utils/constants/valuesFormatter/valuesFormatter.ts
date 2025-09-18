type AnyObject = Record<string, any>;

interface ValidationResult {
    isValid: boolean;
    errors: string[];
    converted: AnyObject[];
    academicYear: any;
    currentAcademicYear: any;
}

// Função auxiliar para validar chaves de objetos aninhados
const validateNestedKeys = (
    inputObj: AnyObject,
    refObj: AnyObject,
    parentKey: string,
    errors: string[]
) => {
    for (const key of Object.keys(inputObj)) {
        if (!(key in refObj)) {
            errors.push(`Unexpected key '${key}' in ${parentKey} for object with key '${inputObj.key || "unknown"}'`);
        } else if (
            typeof inputObj[key] === "object" &&
            inputObj[key] !== null &&
            // !Array.isArray(inputObj[key]) &&
            typeof refObj[key] === "object" &&
            refObj[key] !== null 
        ) {
            // Recursivamente valida objetos aninhados
            validateNestedKeys(inputObj[key], refObj[key], `${parentKey}.${key}`, errors);
        }

    }
    // console.log(errors)
};

// função auxiliar para merge profundo
function mergeDeep(ref: any, input: any): any {
    if (typeof ref !== 'object' || ref === null) {
        // primitivo
        return input !== undefined ? input : ref;
    }

    if (Array.isArray(ref)) {
        if (Array.isArray(input)) {
            return ref.map((refItem, i) => mergeDeep(refItem, input[i]));
        } else {
            return ref; // não tem input → fica default
        }
    }

    const merged: any = {};
    for (const key of Object.keys(ref)) {
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

        // valida chaves no objeto registration
        if (item.registration && refItem.registration) {
            validateNestedKeys(item.registration, refItem.registration, 'registration', errors);
        }

        if (item.attendance && !item.absenteeism && refItem.absenteeism) {
            output.absenteeism = { ...refItem.absenteeism };
        }

        if (
            item.key === 'staff' &&
            'registration' in item &&
            !('reenroll' in item)
        ) {
            if ('reenroll' in refItem) {
                output.reenroll = { ...refItem.reenroll };
                errors.push(`Missing 'reenroll' for key 'staff'`);
            }
        }

        console.log(item)
        for (const key of Object.keys(item)) {
            // if (requiredKeys.includes(key)) continue;

            if (key in refItem) {
                const refValue = refItem[key];
                const inputValue = item[key];

                if (typeof refValue === 'object' && refValue !== null) {
                    // merge profundo para qualquer tipo (objeto ou array)
                    output[key] = mergeDeep(refValue, inputValue);

                    if (key !== 'registration') {
                        validateNestedKeys(inputValue, refValue, key, errors);
                    }
                } else {
                    output[key] = inputValue;
                }
            } else {
                errors.push(`Unexpected key '${key}' in object with key '${item.key}'`);
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