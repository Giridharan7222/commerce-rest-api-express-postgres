import { expect } from "chai";
import sequelize from "../database/connection";
import { User } from "../models";
import { createUser } from "../services/user";
import { CreateUserDto } from "../dtos/user";
import { UserRole } from "../enums/user";

describe("User Service - Create User", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it("1. should create a new customer user successfully", async () => {
    const userData: CreateUserDto = {
      email: "test@example.com",
      password: "TestPass123!",
      role: UserRole.CUSTOMER,
    };

    const user = await createUser(userData);

    expect(user).to.exist;
    expect(user.email).to.equal("test@example.com");
    expect(user.role).to.equal("customer");
    expect(user.is_active).to.equal(true);
    expect(user.password).to.be.undefined; // Password should be excluded
  });

  it("2. should create a new admin user successfully", async () => {
    const userData: CreateUserDto = {
      email: "admin@example.com",
      password: "AdminPass123!",
      role: UserRole.ADMIN,
    };

    const user = await createUser(userData);

    expect(user).to.exist;
    expect(user.email).to.equal("admin@example.com");
    expect(user.role).to.equal("admin");
    expect(user.is_active).to.equal(true);
  });

  it("3. should NOT allow duplicate email", async () => {
    const userData: CreateUserDto = {
      email: "duplicate@example.com",
      password: "TestPass123!",
      role: UserRole.CUSTOMER,
    };

    await createUser(userData);

    try {
      await createUser(userData);
      throw new Error("Expected error not thrown");
    } catch (err: any) {
      expect(err.message).to.include("User with this email already exists");
    }
  });

  it("4. should hash the password", async () => {
    const userData: CreateUserDto = {
      email: "hash@example.com",
      password: "TestPass123!",
      role: UserRole.CUSTOMER,
    };

    await createUser(userData);

    const dbUser = await User.findOne({ where: { email: "hash@example.com" } });
    expect(dbUser?.password).to.not.equal("TestPass123!");
    expect(dbUser?.password).to.exist;
  });

  it("5. should create user with UUID primary key", async () => {
    const userData: CreateUserDto = {
      email: "uuid@example.com",
      password: "TestPass123!",
      role: UserRole.CUSTOMER,
    };

    const user = await createUser(userData);

    expect(user.id).to.exist;
    expect(user.id).to.be.a("string");
    expect(user.id.length).to.be.greaterThan(30); // UUID length check
  });
});
