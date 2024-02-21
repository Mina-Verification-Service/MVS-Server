import { PublicKey, Field, SmartContract, State, DeployArgs } from 'o1js';
import type { JsonProof } from 'o1js';
declare const MVSMerkleWitness_base: typeof import("o1js/dist/node/lib/merkle_tree").BaseMerkleWitness;
declare class MVSMerkleWitness extends MVSMerkleWitness_base {
}
declare const UserProof_base: import("o1js/dist/node/lib/provable").Provable<import("o1js/dist/node/bindings/lib/provable-snarky").NonMethods<{
    userAddress: typeof PublicKey;
    proof: JsonProof;
} & {
    userAddress: PublicKey;
    proof: {
        publicInput: never[];
        publicOutput: never[];
        maxProofsVerified: never;
        proof: never;
    };
} & import("zkdb").ISchema>> & {
    toInput: (x: import("o1js/dist/node/bindings/lib/provable-snarky").NonMethods<{
        userAddress: typeof PublicKey;
        proof: JsonProof;
    } & {
        userAddress: PublicKey;
        proof: {
            publicInput: never[];
            publicOutput: never[];
            maxProofsVerified: never;
            proof: never;
        };
    } & import("zkdb").ISchema>) => {
        fields?: import("o1js/dist/node/lib/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/field").Field, number][] | undefined;
    };
    toJSON: (x: import("o1js/dist/node/bindings/lib/provable-snarky").NonMethods<{
        userAddress: typeof PublicKey;
        proof: JsonProof;
    } & {
        userAddress: PublicKey;
        proof: {
            publicInput: never[];
            publicOutput: never[];
            maxProofsVerified: never;
            proof: never;
        };
    } & import("zkdb").ISchema>) => any;
    fromJSON: (x: any) => import("o1js/dist/node/bindings/lib/provable-snarky").NonMethods<{
        userAddress: typeof PublicKey;
        proof: JsonProof;
    } & {
        userAddress: PublicKey;
        proof: {
            publicInput: never[];
            publicOutput: never[];
            maxProofsVerified: never;
            proof: never;
        };
    } & import("zkdb").ISchema>;
} & (new (...args: any) => {
    userAddress: typeof PublicKey;
    proof: JsonProof;
} & {
    userAddress: PublicKey;
    proof: {
        publicInput: never[];
        publicOutput: never[];
        maxProofsVerified: never;
        proof: never;
    };
} & import("zkdb").ISchema) & {
    _isStruct: true;
} & {
    decode: (_doc: Uint8Array) => {
        userAddress: typeof PublicKey;
        proof: JsonProof;
    };
};
declare class UserProof extends UserProof_base {
    static deserialize(data: Uint8Array): UserProof;
    index(): {
        userAddress: string;
    };
    json(): {
        userAddress: string;
        proof: JsonProof;
    };
}
export declare class MVSContract extends SmartContract {
    root: State<import("o1js/dist/node/lib/field").Field>;
    deploy(args: DeployArgs): void;
    initStateRoot(stateRoot: Field): void;
    addNewUser(userProof: UserProof, userWitness: MVSMerkleWitness): void;
    verifyUser(userProof: UserProof, userWitness: MVSMerkleWitness): void;
}
export {};
