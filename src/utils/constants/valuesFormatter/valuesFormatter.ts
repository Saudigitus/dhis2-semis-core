type AnyObject = Record<string, any>;

interface ValidationResult {
    isValid: boolean;
    errors: string[];
    converted: AnyObject[];
}

export const validateAndConvertArrayAgainstReference = (
    input: AnyObject[],
    reference: AnyObject[]
): ValidationResult => {
    const errors: string[] = [];
    const converted: AnyObject[] = [];

    for (const item of input) {
        // Check required root-level keys
        const requiredKeys = ["key", "program", "registration"];
        for (const reqKey of requiredKeys) {
            if (!(reqKey in item)) {
                errors.push(`Missing required field '${reqKey}' in object: ${JSON.stringify(item)}`);
            }
        }

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

        // Step 3.6: Add absenteeism if attendance exists and absenteeism is missing
        if (item.attendance && !item.absenteeism && refItem.absenteeism) {
            output.absenteeism = { ...refItem.absenteeism };
        }

        // Step 3.5: Add reenroll if staff has registration and reenroll is missing
        if (
            item.key === "staff" &&
            "registration" in item &&
            !("reenroll" in item) &&
            "reenroll" in refItem
        ) {
            output.reenroll = { ...refItem.reenroll };
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
    };
};
