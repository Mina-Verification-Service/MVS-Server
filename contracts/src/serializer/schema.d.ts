export function Schema(type: any): {
    new (value: any): {
        [x: string]: any;
        serialize(): Uint8Array;
        iter_serialize(keys: any, object: any): {};
        hash(): import("o1js/dist/node/lib/field").Field;
    };
    decode(doc: any): {};
    _isStruct: true;
    toFields: (value: any) => import("o1js/dist/node/lib/field").Field[];
    toAuxiliary: (value?: any) => any[];
    fromFields: (fields: import("o1js/dist/node/lib/field").Field[], aux: any[]) => any;
    sizeInFields(): number;
    check: (value: any) => void;
    toInput: (x: any) => {
        fields?: import("o1js/dist/node/lib/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/field").Field, number][] | undefined;
    };
    toJSON: (x: any) => any;
    fromJSON: (x: any) => any;
};
