import { Field, SmartContract, State } from 'o1js';
declare const MVSMerkleWitness_base: typeof import("o1js/dist/node/lib/merkle_tree.js").BaseMerkleWitness;
export declare class MVSMerkleWitness extends MVSMerkleWitness_base {
}
declare const UserSession_base: {
    new (value: any): {
        [x: string]: any;
        serialize(): Uint8Array;
        iter_serialize(keys: any, object: any): {};
        hash(): import("o1js/dist/node/lib/field.js").Field;
    };
    decode(doc: any): {};
    _isStruct: true;
    toFields: (value: any) => import("o1js/dist/node/lib/field.js").Field[];
    toAuxiliary: (value?: any) => any[];
    fromFields: (fields: import("o1js/dist/node/lib/field.js").Field[], aux: any[]) => any;
    sizeInFields(): number;
    check: (value: any) => void;
    toInput: (x: any) => {
        fields?: import("o1js/dist/node/lib/field.js").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/field.js").Field, number][] | undefined;
    };
    toJSON: (x: any) => any;
    fromJSON: (x: any) => any;
};
export declare class UserSession extends UserSession_base {
    static deserialize(data: Uint8Array): UserSession;
    json(): {
        name: string;
        email: string;
        image: string;
    };
}
declare const UserData_base: {
    new (value: any): {
        [x: string]: any;
        serialize(): Uint8Array;
        iter_serialize(keys: any, object: any): {};
        hash(): import("o1js/dist/node/lib/field.js").Field;
    };
    decode(doc: any): {};
    _isStruct: true;
    toFields: (value: any) => import("o1js/dist/node/lib/field.js").Field[];
    toAuxiliary: (value?: any) => any[];
    fromFields: (fields: import("o1js/dist/node/lib/field.js").Field[], aux: any[]) => any;
    sizeInFields(): number;
    check: (value: any) => void;
    toInput: (x: any) => {
        fields?: import("o1js/dist/node/lib/field.js").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/field.js").Field, number][] | undefined;
    };
    toJSON: (x: any) => any;
    fromJSON: (x: any) => any;
};
export declare class UserData extends UserData_base {
    static deserialize(data: Uint8Array): UserData;
    index(): {
        userAddress: string;
    };
    json(): {
        userAddress: string;
        session: object;
    };
}
export declare class MVSContract extends SmartContract {
    root: State<import("o1js/dist/node/lib/field.js").Field>;
    initiated: State<import("o1js/dist/node/lib/bool.js").Bool>;
    init(): void;
    setZkdbCommitment(initialCommitment: Field): void;
    addNewUser(userData: Field, userWitness: MVSMerkleWitness): void;
    verifyUser(userData: Field, userWitness: MVSMerkleWitness): void;
}
export {};
