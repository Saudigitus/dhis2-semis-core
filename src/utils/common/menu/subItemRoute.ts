import { DataStoreProps } from "dhis2-semis-types";

export const subItemRoute = (location: string, sectionType: string, filterDataElements?: DataStoreProps[0]["filters"], removeParams?: boolean) => {
    let newLocation: string

    if (location) {
        if (location.includes(`sectionType=${sectionType}`) && !removeParams)
            newLocation = location;

        else {
            newLocation = location.replace(/(student|staff)/g, sectionType);
            filterDataElements?.dataElements?.forEach(filter => newLocation = removeQueryParam(newLocation, filter.code));
        }
    }

    else newLocation = `sectionType=${sectionType}`

    return newLocation.toString();
};

function removeQueryParam(queryString: string, paramToRemove: string) {
    const queryParams = new URLSearchParams(queryString);

    queryParams.delete(paramToRemove);

    return queryParams.toString();
}