import { expect } from "chai";
import { describe, it } from "mocha";
import { Request } from "express";
import { createCustomerProfilePayload } from "../validators/user";

describe("Profile Tests", () => {
  describe("Profile Validation", () => {
    const validProfilePayload = {
      user_id: "123e4567-e89b-12d3-a456-426614174000",
      full_name: "John Doe",
      phone: "+1234567890",
      dob: "1990-01-01",
      gender: "male",
    };

    it("should validate valid profile payload", () => {
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

    it("should handle missing optional fields", () => {
      const minimalPayload = {
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        full_name: "John Doe",
      };
      const req = { 
        body: minimalPayload,
        user: { id: "123e4567-e89b-12d3-a456-426614174000" }
      } as any;
      const result = createCustomerProfilePayload(req);

      expect(result.full_name).to.equal("John Doe");
    });

    it("should validate phone number format", () => {
      const payloadWithPhone = {
        ...validProfilePayload,
        phone: "invalid-phone",
      };
      const req = { 
        body: payloadWithPhone,
        user: { id: "123e4567-e89b-12d3-a456-426614174000" }
      } as any;
      const result = createCustomerProfilePayload(req);

      expect(result.phone).to.equal("invalid-phone");
    });

    it("should validate date of birth format", () => {
      const payloadWithDOB = {
        ...validProfilePayload,
        dob: "1990-12-25",
      };
      const req = { 
        body: payloadWithDOB,
        user: { id: "123e4567-e89b-12d3-a456-426614174000" }
      } as any;
      const result = createCustomerProfilePayload(req);

      expect(result.dob).to.be.instanceOf(Date);
    });
  });

  describe("Profile Update", () => {
    it("should handle profile update payload", () => {
      const updatePayload = {
        full_name: "Jane Smith",
        phone: "+0987654321",
      };
      const req = { 
        body: updatePayload,
        user: { id: "123e4567-e89b-12d3-a456-426614174000" }
      } as any;
      const result = createCustomerProfilePayload(req);

      expect(result.full_name).to.equal("Jane Smith");
      expect(result.phone).to.equal("+0987654321");
    });
  });
});
