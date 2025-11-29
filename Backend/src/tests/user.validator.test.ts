import { expect } from "chai";
import { describe, it } from "mocha";
import { Request } from "express";
import {
  createUserPayload,
  createCustomerProfilePayload,
  createAddressPayload,
} from "../validators/user";
import { CreateUserDto } from "../dtos/user";

describe("User Validator", () => {
  const validUserPayload = {
    email: "test@example.com",
    password: "TestPass123!",
    role: "customer",
  };

  describe("createUserPayload", () => {
    it("should extract valid user payload from request", () => {
      const req = { body: { ...validUserPayload } } as Request;

      const result = createUserPayload(req);

      expect(result.email).to.equal("test@example.com");
      expect(result.password).to.equal("TestPass123!");
      expect(result.role).to.equal("customer");
    });

    it("should handle admin role", () => {
      const req = {
        body: {
          ...validUserPayload,
          role: "admin",
        },
      } as Request;

      try {
        createUserPayload(req);
        throw new Error("Expected error not thrown");
      } catch (error: any) {
        expect(error.message).to.equal("You are not allowed to set admin role");
      }
    });

    it("should extract all required fields", () => {
      const req = { body: { ...validUserPayload } } as Request;

      const result = createUserPayload(req);

      expect(result).to.have.property("email");
      expect(result).to.have.property("password");
      expect(result).to.have.property("role");
    });
  });

  describe("createCustomerProfilePayload", () => {
    const validProfilePayload = {
      user_id: "123e4567-e89b-12d3-a456-426614174000",
      full_name: "John Doe",
      phone: "+1234567890",
      gender: "male",
    };

    it("should extract valid profile payload from request", () => {
      const req = { 
        body: { ...validProfilePayload },
        user: { id: "123e4567-e89b-12d3-a456-426614174000" }
      } as any;

      const result = createCustomerProfilePayload(req);

      expect(result.user_id).to.equal("123e4567-e89b-12d3-a456-426614174000");
      expect(result.full_name).to.equal("John Doe");
      expect(result.phone).to.equal("+1234567890");
      expect(result.gender).to.equal("male");
    });
  });

  describe("createAddressPayload", () => {
    const validAddressPayload = {
      user_id: "123e4567-e89b-12d3-a456-426614174000",
      full_name: "John Doe",
      phone: "+1234567890",
      address_line1: "123 Main St",
      city: "New York",
      state: "NY",
      pincode: "10001",
      country: "USA",
    };

    it("should extract valid address payload from request", () => {
      const req = { 
        body: { ...validAddressPayload },
        user: { id: "123e4567-e89b-12d3-a456-426614174000" }
      } as any;

      const result = createAddressPayload(req);

      expect(result.user_id).to.equal("123e4567-e89b-12d3-a456-426614174000");
      expect(result.full_name).to.equal("John Doe");
      expect(result.address_line1).to.equal("123 Main St");
      expect(result.city).to.equal("New York");
      expect(result.is_default).to.equal(false);
    });
  });
});
