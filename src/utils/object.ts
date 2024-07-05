export const isEmptyObject = <T extends object | null | undefined>(obj: T): boolean => {
    let isEmpty = true;
    if (obj && obj instanceof Object) {
        Object.keys(obj).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) isEmpty = false;
        });
    }
    return isEmpty;
};
