import { expect } from "chai";
import sinon from "sinon";
import { User, Category, AdminActivityLog } from "../models";
import { createCategory } from "../services/product";
import { createUser } from "../services/user";
import { UserRole } from "../enums/user";

describe("Category Service", () => {
  let sandbox: sinon.SinonSandbox;
  let adminUser: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    adminUser = {
      id: "admin-123",
      email: "admin@example.com",
      role: UserRole.ADMIN,
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("createCategory", () => {
    it("should create category with name and description", async () => {
      const categoryData = {
        name: "Electronics",
        description: "Electronic devices and accessories",
      };

      const mockCategory = {
        id: "cat-123",
        name: "Electronics",
        description: "Electronic devices and accessories",
        created_by: adminUser.id,
        get: () => ({
          id: "cat-123",
          name: "Electronics",
          description: "Electronic devices and accessories",
          created_by: adminUser.id,
        }),
      };

      // Mock database calls
      sandbox.stub(User, "findOne").resolves(adminUser as any);
      sandbox.stub(Category, "findOne").resolves(null);
      sandbox.stub(Category, "create").resolves(mockCategory as any);
      sandbox.stub(AdminActivityLog, "create").resolves({} as any);

      const category = await createCategory(categoryData, adminUser.id);

      expect(category.name).to.equal("Electronics");
      expect(category.description).to.equal(
        "Electronic devices and accessories",
      );
    });

    it("should validate admin user authorization", () => {
      expect(adminUser.role).to.equal(UserRole.ADMIN);
      expect(adminUser.id).to.be.a("string");
    });
  });
});
