import { expect } from "chai";
import { describe, it } from "mocha";
import { Request } from "express";
import { createAddressPayload } from "../validators/user";

describe("Address Tests", () => {
  describe("Address Validation", () => {
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

    it("should validate valid address payload", () => {
      const req = { 
        body: { ...validAddressPayload },
        user: { id: "123e4567-e89b-12d3-a456-426614174000" }
      } as any;
      const result = createAddressPayload(req);

      expect(result.user_id).to.equal("123e4567-e89b-12d3-a456-426614174000");
      expect(result.full_name).to.equal("John Doe");
      expect(result.address_line1).to.equal("123 Main St");
      expect(result.city).to.equal("New York");
      expect(result.state).to.equal("NY");
      expect(result.pincode).to.equal("10001");
      expect(result.country).to.equal("USA");
    });

    it("should handle all required fields", () => {
      const req = { body: { ...validAddressPayload } } as Request;
      const result = createAddressPayload(req);

      expect(result).to.have.property("address_line1");
      expect(result).to.have.property("city");
      expect(result).to.have.property("state");
      expect(result).to.have.property("pincode");
      expect(result).to.have.property("country");
    });

    it("should validate US zip code format", () => {
      const payloadWithZip = {
        ...validAddressPayload,
        pincode: "12345-6789",
      };
      const req = { body: payloadWithZip } as Request;
      const result = createAddressPayload(req);

      expect(result.pincode).to.equal("12345-6789");
    });

    it("should handle international addresses", () => {
      const internationalAddress = {
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        full_name: "John Smith",
        phone: "+44123456789",
        address_line1: "10 Downing Street",
        city: "London",
        state: "England",
        pincode: "SW1A 2AA",
        country: "UK",
      };
      const req = { body: internationalAddress } as Request;
      const result = createAddressPayload(req);

      expect(result.city).to.equal("London");
      expect(result.country).to.equal("UK");
      expect(result.pincode).to.equal("SW1A 2AA");
    });
  });

  describe("Address Update", () => {
    it("should handle address update payload", () => {
      const updatePayload = {
        full_name: "Jane Doe",
        phone: "+1987654321",
        address_line1: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        pincode: "90210",
      };
      const req = { 
        body: updatePayload,
        user: { id: "123e4567-e89b-12d3-a456-426614174000" }
      } as any;
      const result = createAddressPayload(req);

      expect(result.address_line1).to.equal("456 Oak Avenue");
      expect(result.city).to.equal("Los Angeles");
      expect(result.state).to.equal("CA");
      expect(result.pincode).to.equal("90210");
    });
  });
});
