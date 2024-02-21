var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PublicKey, Experimental, Field, SmartContract, State, state, Proof, PrivateKey, Struct, Permissions, method, MerkleWitness, } from 'o1js';
import { Schema } from 'zkdb';
// Height of the Merkle Tree
const merkleHeight = 20;
// Extend Merkle witness at the same height as the Merkle Tree
class MVSMerkleWitness extends MerkleWitness(merkleHeight) {
}
class UserProof extends Schema({
    userAddress: PublicKey,
    proof: Object,
}) {
    // Deserialize the document from a Uint8Array
    static deserialize(data) {
        return new UserProof(UserProof.decode(data));
    }
    // Index the document by user public key
    index() {
        return {
            userAddress: this.userAddress.toBase58(),
        };
    }
    json() {
        return {
            userAddress: this.userAddress.toBase58(),
            proof: this.proof,
        };
    }
}
export class MVSContract extends SmartContract {
    constructor() {
        super(...arguments);
        this.root = State();
    }
    deploy(args) {
        super.deploy(args);
        this.account.permissions.set({
            ...Permissions.default(),
            editState: Permissions.proofOrSignature(),
        });
    }
    initStateRoot(stateRoot) {
        this.root.set(stateRoot);
    }
    addNewUser(userProof, userWitness) {
        // Get the on-chain merkle root commitment,
        // Make sure it matches the one we have locally
        let commitment = this.root.get();
        this.root.assertEquals(commitment);
        // reconstruct user proof and verify
        let proof = Proof.fromJSON(userProof.proof);
        proof.verify();
        // ensure that witness path is empty
        const emptyroot = userWitness.calculateRoot(Field(0));
        commitment.assertEquals(emptyroot);
        // calculate root for new user.
        const newCommitment = userWitness.calculateRoot(userProof.hash());
        // update root
        this.root.set(newCommitment);
    }
    verifyUser(userProof, userWitness) {
        // Get the on-chain merkle root commitment,
        // Make sure it matches the one we have locally
        let commitment = this.root.get();
        this.root.assertEquals(commitment);
        // reconstruct user proof and verify
        let proof = Proof.fromJSON(userProof.proof);
        proof.verify();
        // check the user exists already within the committed Merkle tree
        const userCommitment = userWitness.calculateRoot(userProof.hash());
        commitment.assertEquals(userCommitment);
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], MVSContract.prototype, "root", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", void 0)
], MVSContract.prototype, "initStateRoot", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserProof, MVSMerkleWitness]),
    __metadata("design:returntype", void 0)
], MVSContract.prototype, "addNewUser", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserProof, MVSMerkleWitness]),
    __metadata("design:returntype", void 0)
], MVSContract.prototype, "verifyUser", null);
class MVSState extends Struct({}) {
}
const MVSProofGen = Experimental.ZkProgram({
    publicInput: Field,
    methods: {
        generate: {
            privateInputs: [],
            method(state) {
                state.assertEquals(Field(0));
            },
        },
    },
});
(async () => {
    console.log('compiling...');
    await MVSProofGen.compile();
    const add = PrivateKey.random();
    const addkey = add.toPublicKey();
    console.log('making proof 0');
    const proof0 = await MVSProofGen.generate(Field(0));
    const newUser = new UserProof({
        userAddress: addkey,
        proof: proof0.toJSON(),
    });
    console.log(newUser.json());
})();
//# sourceMappingURL=mvsV2proofs.js.map