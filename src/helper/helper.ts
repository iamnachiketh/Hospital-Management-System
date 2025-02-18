export const deptNameStringMatch = function (degree: string) {
    const str = degree;
    const match = str.match(/\(([^)]+)\)/);
    const extracted = match ? match[1] : "";
    return extracted;
}