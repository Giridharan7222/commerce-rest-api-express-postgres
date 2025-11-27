import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Request } from 'express';
import { createUserPayload } from '../validators/user';
import { CreateUserDto } from '../dtos/user';

describe('User Validator', () => {
  const validPayload = {
    email: 'test@example.com',
    password: 'TestPass123!',
    first_name: 'John',
    last_name: 'Doe',
  };

  describe('createUserPayload', () => {
    it('should extract valid user payload from request', () => {
      const req = { body: { ...validPayload } } as Request;

      const result = createUserPayload(req);

      expect(result.email).to.equal('test@example.com');
      expect(result.password).to.equal('TestPass123!');
      expect(result.first_name).to.equal('John');
      expect(result.last_name).to.equal('Doe');
    });

    it('should handle missing optional fields', () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'TestPass123!',
          first_name: 'John',
          last_name: 'Doe',
        },
      } as Request;

      const result = createUserPayload(req);

      expect(result).to.have.property('email');
      expect(result).to.have.property('password');
      expect(result).to.have.property('first_name');
      expect(result).to.have.property('last_name');
    });

    it('should extract first_name and last_name correctly', () => {
      const req = {
        body: {
          ...validPayload,
          first_name: 'Jane',
          last_name: 'Smith',
        },
      } as Request;

      const result = createUserPayload(req);

      expect(result.first_name).to.equal('Jane');
      expect(result.last_name).to.equal('Smith');
    });

    it('should handle empty strings', () => {
      const req = {
        body: {
          email: '',
          password: '',
          first_name: '',
          last_name: '',
        },
      } as Request;

      const result = createUserPayload(req);

      expect(result.email).to.equal('');
      expect(result.password).to.equal('');
      expect(result.first_name).to.equal('');
      expect(result.last_name).to.equal('');
    });
  });
});
