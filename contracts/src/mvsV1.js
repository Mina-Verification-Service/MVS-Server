var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, State, state, method, MerkleWitness, CircuitString, PublicKey, Bool, } from 'o1js';
// Added a new schema serializer to fix issue with current zkdb serializer. PR already made
import { Schema } from './serializer/schema.js';
// Height of the Merkle Tree
const merkleHeight = 20;
// Extend Merkle witness at the same height as the Merkle Tree
export class MVSMerkleWitness extends MerkleWitness(merkleHeight) {
}
export class UserSession extends Schema({
    name: CircuitString,
    email: CircuitString,
    image: CircuitString,
}) {
    static deserialize(data) {
        return new UserSession(UserSession.decode(data));
    }
    json() {
        return {
            name: this.name.toString(),
            email: this.email.toString(),
            image: this.image.toString(),
        };
    }
}
export class UserData extends Schema({
    userAddress: PublicKey,
    session: UserSession,
}) {
    // Deserialize the document from a Uint8Array
    static deserialize(data) {
        return new UserData(UserData.decode(data));
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
            session: this.session.json(),
        };
    }
}
export class MVSContract extends SmartContract {
    constructor() {
        super(...arguments);
        this.root = State();
        this.initiated = State();
    }
    init() {
        super.init();
    }
    setZkdbCommitment(initialCommitment) {
        // check if contract has been locked or fail
        this.initiated.assertEquals(Bool(false));
        this.root.set(initialCommitment);
        // lock the contract
        this.initiated.set(Bool(true));
    }
    addNewUser(userData, userWitness) {
        // Get the on-chain merkle root commitment,
        // Make sure it matches the one we have locally
        let commitment = this.root.get();
        this.root.assertEquals(commitment);
        // ensure that witness path is empty
        const emptyroot = userWitness.calculateRoot(Field(0));
        commitment.assertEquals(emptyroot);
        // calculate root for new user.
        const newCommitment = userWitness.calculateRoot(userData);
        // update root
        this.root.set(newCommitment);
    }
    verifyUser(userData, userWitness) {
        // Get the on-chain merkle root commitment,
        // Make sure it matches the one we have locally
        let commitment = this.root.get();
        this.root.assertEquals(commitment);
        // check the user exists already within the committed Merkle tree
        const userCommitment = userWitness.calculateRoot(userData);
        commitment.assertEquals(userCommitment);
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], MVSContract.prototype, "root", void 0);
__decorate([
    state(Bool),
    __metadata("design:type", Object)
], MVSContract.prototype, "initiated", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MVSContract.prototype, "init", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", void 0)
], MVSContract.prototype, "setZkdbCommitment", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, MVSMerkleWitness]),
    __metadata("design:returntype", void 0)
], MVSContract.prototype, "addNewUser", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, MVSMerkleWitness]),
    __metadata("design:returntype", void 0)
], MVSContract.prototype, "verifyUser", null);
//# sourceMappingURL=mvsV1.js.map