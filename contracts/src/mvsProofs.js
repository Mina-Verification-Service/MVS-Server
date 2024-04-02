var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, Experimental, MerkleWitness, Bool, CircuitString, SmartContract, State, state, PublicKey, method, Signature, SelfProof, } from 'o1js';
import { Schema } from './serializer';
// Height of the Merkle Tree
const merkleHeight = 20;
// Extend Merkle witness at the same height as the Merkle Tree
export class MVSMerkleWitnessV2 extends MerkleWitness(merkleHeight) {
}
export const MVSProofGen = Experimental.ZkProgram({
    name: 'mvs-proof-gen',
    publicInput: MVSMerkleWitnessV2,
    methods: {
        getProof: {
            // private inputs the, the db commitment and ml check result.
            privateInputs: [Field, Bool],
            method(publicInput, commitmentRoot, result) {
                // check user path does not exist in commitment
                let emptyRoot = publicInput.calculateRoot(Field(0));
                commitmentRoot.assertEquals(emptyRoot);
                // check that result is true from ml checker
                result.assertEquals(Bool(true));
            },
        },
    },
});
export class ProofRecord extends Schema({
    userId: CircuitString,
    userPubKey: PublicKey,
    proof: [Field],
}) {
    // Deserialize the document from a Uint8Array
    static deserialize(data) {
        return new ProofRecord(ProofRecord.decode(data));
    }
    // Index the document by user id
    index() {
        return {
            userId: this.userId.toString(),
        };
    }
    json() {
        return {
            userId: this.userId.toString(),
            userPubKey: this.userPubKey.toBase58(),
            proof: this.proof,
        };
    }
}
export class MVSContractV2 extends SmartContract {
    constructor() {
        super(...arguments);
        this.storageRoot = State();
        this.numOfUsers = State();
        this.mvsController = State();
        this.initialized = State();
    }
    init() {
        super.init();
        // init numofusers
        this.numOfUsers.set(Field(0));
        // set state to false
        this.initialized.set(Bool(false));
        // set controller
        this.mvsController.set(this.sender);
    }
    // can only be called by controller
    setZkdbRoot(storageRoot) {
        // get states
        const initialized = this.initialized.getAndAssertEquals();
        const controller = this.mvsController.getAndAssertEquals();
        // check if controller is txn sender
        controller.assertEquals(this.sender);
        // check if contract has been locked or fail
        initialized.assertEquals(Bool(false));
        // set storageRoot
        this.storageRoot.set(storageRoot);
        // lock the contract
        this.initialized.set(Bool(true));
    }
    // can only be called by controller
    addProofRecord(record, witness) {
        // get contract states
        const controller = this.mvsController.getAndAssertEquals();
        const initialized = this.initialized.getAndAssertEquals();
        const storageRoot = this.storageRoot.getAndAssertEquals();
        const noOfUsers = this.numOfUsers.getAndAssertEquals();
        // check if controller is txn sender
        controller.assertEquals(this.sender);
        // check if contract has been initialized
        initialized.assertEquals(Bool(false));
        // get user root;
        let emptyRoot = witness.calculateRoot(Field(0));
        // ensure that witness path at index is empty, i.e address has not been added before
        emptyRoot.assertEquals(storageRoot);
        // calculate root for new address addition
        const newRoot = witness.calculateRoot(record);
        // update root and counter
        this.storageRoot.set(newRoot);
        this.numOfUsers.set(noOfUsers.add(1));
    }
    // can be called by anybody
    verifyProofRecord(record, witness, signature, proof, proofAsFields, userPubKey) {
        // get storage
        const storageRoot = this.storageRoot.getAndAssertEquals();
        // calculate root
        const userRoot = witness.calculateRoot(record);
        // ensure that storage root and user root are the same
        storageRoot.assertEquals(userRoot);
        // check if proof signature is valid
        const validSignature = signature.verify(userPubKey, proofAsFields);
        // Check that the signature is valid
        validSignature.assertTrue();
        // then verify proof
        proof.verify();
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], MVSContractV2.prototype, "storageRoot", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], MVSContractV2.prototype, "numOfUsers", void 0);
__decorate([
    state(PublicKey),
    __metadata("design:type", Object)
], MVSContractV2.prototype, "mvsController", void 0);
__decorate([
    state(Bool),
    __metadata("design:type", Object)
], MVSContractV2.prototype, "initialized", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", void 0)
], MVSContractV2.prototype, "setZkdbRoot", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, MVSMerkleWitnessV2]),
    __metadata("design:returntype", void 0)
], MVSContractV2.prototype, "addProofRecord", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field,
        MVSMerkleWitnessV2,
        Signature,
        SelfProof, Array, PublicKey]),
    __metadata("design:returntype", void 0)
], MVSContractV2.prototype, "verifyProofRecord", null);
//# sourceMappingURL=mvsProofs.js.map