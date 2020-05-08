/*
    Safe way to retrieve a value from an array

    Index can be any number
*/
export const getValueAt = (values: any[]) => (index: number) => values[(index % values.length + values.length) % values.length];