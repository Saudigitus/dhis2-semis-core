type AnyObject = Record<string, any>;

interface ValidationResult {
    isValid: boolean;
    errors: string[];
    converted: AnyObject[];
    academicYear: any
}

export const validateAndConvertArrayAgainstReference = (input: AnyObject[], reference: AnyObject[]): ValidationResult => {
    const errors: string[] = [];
    const converted: AnyObject[] = [];
    let academicYear: string = ""

    for (const item of input) {
        const requiredKeys = ["key", "program", "registration"];
        for (const reqKey of requiredKeys) {
            if (!(reqKey in item)) {
                errors.push(`Missing required field '${reqKey}' in object: ${JSON.stringify(item)}`);
            }
        }
        academicYear = item?.registration?.academicYear
        const refItem = reference.find(r => r.key === item.key);
        if (!refItem) {
            errors.push(`Missing reference for key '${item.key}'`);
            continue;
        }

        const output: AnyObject = {
            key: item.key,
            program: refItem.program,
            registration: { ...refItem.registration },
        };

        if (item.attendance && !item.absenteeism && refItem.absenteeism) {
            output.absenteeism = { ...refItem.absenteeism };
        }

        if (
            item.key === "staff" &&
            "registration" in item &&
            !("reenroll" in item)
        ) {
            if ("reenroll" in refItem) {
                output.reenroll = { ...refItem.reenroll };
                errors.push(`Missing 'reenroll' for key 'staff'`);
            }
        }

        for (const key of Object.keys(item)) {
            if (requiredKeys.includes(key)) continue;

            if (key in refItem) {
                const refValue = refItem[key];
                const inputValue = item[key];

                if (
                    typeof refValue === "object" &&
                    refValue !== null &&
                    !Array.isArray(refValue)
                ) {
                    output[key] = {
                        ...refValue,
                        ...inputValue,
                    };
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
        academicYear
    };
};
