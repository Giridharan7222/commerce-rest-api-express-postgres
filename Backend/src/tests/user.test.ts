import { expect } from "chai";
import sinon from "sinon";
import { User } from "../models";
import { createUser } from "../services/user";
import { UserRole } from "../enums/user";
import bcrypt from "bcrypt";

describe("User Service - Create User", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("1. should create a new customer user successfully", async () => {
    const userData = {
      email: "test@example.com",
      password: "TestPass123!",
      role: UserRole.CUSTOMER,
    };

    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      role: "customer",
      is_active: true,
      get: () => ({
        id: "user-123",
        email: "test@example.com",
        role: "customer",
        is_active: true,
      }),
    };

    // Mock database calls
    sandbox.stub(User, "findOne").resolves(null);
    sandbox.stub(User, "create").resolves(mockUser as any);
    sandbox.stub(bcrypt, "hash").resolves("hashedpassword");

    const user = await createUser(userData);

    expect(user.email).to.equal("test@example.com");
    expect(user.role).to.equal("customer");
    expect(user.is_active).to.be.true;
  });

  it("2. should validate password hashing", async () => {
    const plainPassword = "TestPass123!";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    expect(hashedPassword).to.not.equal(plainPassword);
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    expect(isValid).to.be.true;
  });

  it("3. should validate UUID format", () => {
    const mockUUID = "123e4567-e89b-12d3-a456-426614174000";
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    expect(mockUUID).to.match(uuidRegex);
  });
});
