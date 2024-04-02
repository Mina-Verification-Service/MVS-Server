import { Field, SmartContract, State, PublicKey, Signature, SelfProof } from 'o1js';
declare const MVSMerkleWitnessV2_base: typeof import("o1js/dist/node/lib/merkle_tree").BaseMerkleWitness;
export declare class MVSMerkleWitnessV2 extends MVSMerkleWitnessV2_base {
}
export declare const MVSProofGen: {
    name: string;
    compile: () => Promise<{
        verificationKey: string;
    }>;
    verify: (proof: import("o1js/dist/node/lib/proof_system").Proof<MVSMerkleWitnessV2, void>) => Promise<boolean>;
    digest: () => string;
    analyzeMethods: () => {
        rows: number;
        digest: string;
        result: unknown;
        gates: import("o1js/dist/node/snarky").Gate[];
        publicInputSize: number;
    }[];
    publicInputType: typeof MVSMerkleWitnessV2;
    publicOutputType: import("o1js/dist/node/lib/circuit_value").ProvablePureExtended<void, null>;
} & {
    getProof: (publicInput: MVSMerkleWitnessV2, ...args: [import("o1js/dist/node/lib/field").Field, import("o1js/dist/node/lib/bool").Bool] & any[]) => Promise<import("o1js/dist/node/lib/proof_system").Proof<MVSMerkleWitnessV2, void>>;
};
declare const ProofRecord_base: {
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
export declare class ProofRecord extends ProofRecord_base {
    static deserialize(data: Uint8Array): ProofRecord;
    index(): {
        userId: string;
    };
    json(): {
        userId: string;
        userPubKey: string;
        proof: Field[];
    };
}
export declare class MVSContractV2 extends SmartContract {
    storageRoot: State<import("o1js/dist/node/lib/field").Field>;
    numOfUsers: State<import("o1js/dist/node/lib/field").Field>;
    mvsController: State<PublicKey>;
    initialized: State<import("o1js/dist/node/lib/bool").Bool>;
    init(): void;
    setZkdbRoot(storageRoot: Field): void;
    addProofRecord(record: Field, witness: MVSMerkleWitnessV2): void;
    verifyProofRecord(record: Field, witness: MVSMerkleWitnessV2, signature: Signature, proof: SelfProof<MVSMerkleWitnessV2, void>, proofAsFields: [Field], userPubKey: PublicKey): void;
}
export {};
