import { DataStoreProps } from "dhis2-semis-types";

export const subItemRoute = (location: string, sectionType: string, filterDataElements?: DataStoreProps[0]["filters"], pathname?: string) => {
    let newLocation: string

    if (location) {
        if (location.includes(`sectionType=${sectionType}`))
            newLocation = location;

        else {
            newLocation = location.replace(/(student|staff)/g, sectionType);
            filterDataElements?.dataElements?.forEach(filter => newLocation = removeQueryParam(newLocation, filter.code));
        }

        newLocation = removeModulesQueryParams(newLocation, pathname ?? "");
    }

    else newLocation = `sectionType=${sectionType}`

    return newLocation.toString();
};

function removeQueryParam(queryString: string, paramToRemove: string) {
    const queryParams = new URLSearchParams(queryString);

    queryParams.delete(paramToRemove);

    return queryParams.toString();
}

function removeModulesQueryParams(queryString: string, pathname: string) {
    const queryParams = new URLSearchParams(queryString);
    if (pathname === "/semis/attendance") {
        queryParams.delete("attendanceMode");
        queryParams.delete("selectedDate");
    }
    else if (pathname === "/semis/performance") {
        queryParams.delete("programStage");
    }
    else if (pathname === "/semis/transfer") {
        queryParams.delete("position");
    }
    return queryParams.toString();
}