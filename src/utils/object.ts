export const isEmptyObject = (obj: object) => {
    let is_empty = true;
    if (obj && obj instanceof Object) {
        Object.keys(obj).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) is_empty = false;
        });
    }
    return is_empty;
};
