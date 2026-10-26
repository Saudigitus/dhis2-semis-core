import { useState } from "react";

type AnyObject = Record<string, any>;

interface ValidationResult {
    isValid: boolean;
    errors: string[];
    converted: AnyObject[];
    academicYear: any;
    currentAcademicYear: any;
    // Settings missing inside a configured module: converting cannot guess them, the admin fills them in Configurations.
    toReview: { section: string, setting: string }[];
    // True when converting changes the settings (old format, modules that are not there yet).
    canConvert: boolean;
}

// Same content whatever the order of the keys.
function sortedJson(value: any): string {
    if (Array.isArray(value)) return `[${value.map(sortedJson).join(",")}]`;
    if (value && typeof value === "object") {
        return `{${Object.keys(value).filter(k => value[k] !== undefined).sort().map(k => `${JSON.stringify(k)}:${sortedJson(value[k])}`).join(",")}}`;
    }
    return JSON.stringify(value);
}

export function validateNestedKeys(
    inputObj: any,
    refObj: any,
    parentKey: string,
    errors: string[]
): void {
    if (!inputObj || !refObj) return;

    // ✅ Keys no inputObj que NÃO existem no refObj (keys inválidas/extras)
    for (const key of Object.keys(inputObj)) {
        if (!(key in refObj)) {
            errors.push(
                `The key '${key}' is not allowed in '${parentKey}' for the object with key '${inputObj.key || "unknown"}'`
            );
        }
    }

    // ✅ Keys no refObj que NÃO existem no inputObj (keys obrigatórias ausentes)
    for (const key of Object.keys(refObj)) {
        const inputVal = inputObj[key];
        const refVal = refObj[key];

        if (!(key in inputObj)) {
            errors.push(
                `The key '${key}' is missing in '${parentKey}' for the object with key '${inputObj.key || "unknown"}'`
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

export function mergeDeep(ref: any, input: any, errors: any[], missing?: string[]): any {
    if (typeof ref !== 'object' || ref === null || ref?.length == 0)
        return input !== undefined ? input : ref;

    if (Array.isArray(ref)) {
        if (Array.isArray(input)) return input.map((item) => mergeDeep(ref[0], item, errors, missing));
        return ref;
    }

    const merged: any = {};

    for (const key of Object.keys(ref)) {
        if (!input || !(key in input)) {
            errors.push(`Missing required field '${key}' in object: ${JSON.stringify(input)}`);
            // The reference only has an empty value for it: leave it out instead of saving it empty.
            if (input && missing) {
                missing.push(key);
                continue;
            }
        }
        merged[key] = mergeDeep(ref[key], input?.[key], errors, missing);
    }

    // Keep the settings the reference does not list (e.g. the class attendance record), so converting does not lose them.
    if (input && typeof input === 'object' && !Array.isArray(input)) {
        for (const key of Object.keys(input)) {
            if (!(key in merged)) merged[key] = input[key];
        }
    }

    return merged;
}

export const useValidate = () => {
    let academicYear: string = '';
    let currentAcademicYear: string = '';

    function validateAndConvertArrayAgainstReference(
        input: AnyObject[],
        reference: AnyObject[]
    ): ValidationResult {
        const errors: string[] = [];
        const converted: AnyObject[] = [];
        const toReview: { section: string, setting: string }[] = [];
        academicYear = '';
        currentAcademicYear = '';
        const inputCopy = [...(input?.length > 0 ? input : [{}, {}])]

        for (const item of inputCopy) {

            const requiredKeys = ['key', 'program', 'registration', 'defaults'];
            for (const reqKey of requiredKeys) {
                if (!(reqKey in item)) {
                    errors.push(
                        `Missing required field '${reqKey}' in object: ${JSON.stringify(item)}`
                    );
                    if (item.key && reqKey !== 'key') toReview.push({ section: item.key, setting: reqKey });
                }
            }
            // The first one found, so an entry without it does not erase the one of the previous entry.
            currentAcademicYear = currentAcademicYear || item?.defaults?.currentAcademicYear || '';
            academicYear = academicYear || item?.registration?.academicYear || '';

            const refItem = reference?.find(r => r.key === item.key);
            if (!refItem) {
                errors.push(`Missing reference for key '${item.key}'`);
                converted
                continue;
            }

            const output: AnyObject = {
                defaults: (item.defaults ?? reference.find(r => r.key === item.key)?.defaults) || {},
                key: item.key,
                program: item.program,
                registration: {
                    ...Object.fromEntries(
                        Object.entries(item.registration ?? {}).filter(([k]) => k in refItem.registration)
                    )
                }
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
                        const missing: string[] = [];
                        // registration only keeps the keys of the reference: its old academicYear goes to the school calendar.
                        output[key] = mergeDeep(refValue, key === 'registration' ? output.registration : inputValue, errors, missing);
                        if (missing.length > 0) toReview.push({ section: item.key, setting: key });

                        if (key !== 'registration') {
                            validateNestedKeys(inputValue, inputValue, key, errors);
                        }
                    } else {
                        output[key] = inputValue;
                    }
                } else {
                    errors.push(`Unexpected key '${key}' in object with key '${item.key}'`);
                }

            }

            // A module that is not there yet is added switched off; a single value (e.g. the program) is left for the admin.
            for (const key of Object.keys(refItem)) {
                if (!(key in item) && typeof refItem[key] === 'object') output[key] = refItem[key];
            }

            converted.push(output);
        }

        const result = converted?.length > 0 ? converted : reference;

        return {
            isValid: errors?.length === 0,
            errors,
            converted: result,
            academicYear,
            currentAcademicYear,
            toReview,
            canConvert: sortedJson(result) !== sortedJson(input ?? []),
        };
    }

    return { validateAndConvertArrayAgainstReference }
};