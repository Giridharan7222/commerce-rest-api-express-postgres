import { expect } from "chai";
import { testDatabase as sequelize } from "../config";
import { User, Category, Product } from "../models";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/product";
import { createUser } from "../services/user";
import { CreateUserDto } from "../dtos/user";
import { UserRole } from "../enums/user";

describe("Category Service", () => {
  let adminUser: any;
  let testCategory: any;

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    // Create admin user for tests
    const adminData: CreateUserDto = {
      email: "admin@test.com",
      password: "AdminPass123!",
      role: UserRole.ADMIN,
    };
    adminUser = await createUser(adminData);

    // Create test category
    testCategory = await createCategory({
      name: "Electronics",
      description: "Electronic devices and accessories",
    });
  });

  describe("createCategory", () => {
    it("should create category with name and description", async () => {
      const categoryData = {
        name: "Books",
        description: "Books and educational materials",
      };

      const category = await createCategory(categoryData, adminUser.id);

      expect(category).to.exist;
      expect(category.name).to.equal("Books");
      expect(category.description).to.equal("Books and educational materials");
      expect(category.id).to.be.a("string");
    });

    it("should create category with only name", async () => {
      const categoryData = {
        name: "Clothing",
      };

      const category = await createCategory(categoryData);

      expect(category).to.exist;
      expect(category.name).to.equal("Clothing");
      expect(category.description).to.be.undefined;
    });

    it("should throw error for duplicate category name", async () => {
      const categoryData = {
        name: "Electronics",
        description: "Duplicate category",
      };

      try {
        await createCategory(categoryData);
        throw new Error("Expected error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("already exists");
      }
    });

    it("should create category with empty name", async () => {
      const categoryData = {
        name: "",
        description: "Empty name category",
      };

      const category = await createCategory(categoryData);
      expect(category.name).to.equal("");
    });
  });

  describe("getAllCategories", () => {
    it("should return all categories", async () => {
      await createCategory({ name: "Sports" });
      await createCategory({ name: "Home & Garden" });

      const categories = await getAllCategories();

      expect(categories).to.be.an("array");
      expect(categories.length).to.equal(3); // Including testCategory
      expect(categories.map((c) => c.name)).to.include.members([
        "Electronics",
        "Sports",
        "Home & Garden",
      ]);
    });

    it("should return empty array when no categories exist", async () => {
      await Category.destroy({ where: {} });

      const categories = await getAllCategories();

      expect(categories).to.be.an("array");
      expect(categories.length).to.equal(0);
    });

    it("should return categories ordered by creation date", async () => {
      await createCategory({ name: "Second Category" });
      await createCategory({ name: "Third Category" });

      const categories = await getAllCategories();

      expect(categories[0].name).to.equal("Third Category");
      expect(categories[categories.length - 1].name).to.equal("Electronics");
    });
  });

  describe("getCategoryById", () => {
    it("should return category by valid ID", async () => {
      const category = await getCategoryById(testCategory.id);

      expect(category).to.exist;
      expect(category.id).to.equal(testCategory.id);
      expect(category.name).to.equal("Electronics");
    });

    it("should throw error for invalid ID", async () => {
      try {
        await getCategoryById("invalid-uuid");
        throw new Error("Expected error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("Category not found");
      }
    });

    it("should throw error for non-existent ID", async () => {
      try {
        await getCategoryById("123e4567-e89b-12d3-a456-426614174000");
        throw new Error("Expected error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("Category not found");
      }
    });
  });

  describe("updateCategory", () => {
    it("should update category name and description", async () => {
      const updateData = {
        name: "Updated Electronics",
        description: "Updated description for electronics",
      };

      const updatedCategory = await updateCategory(
        testCategory.id,
        updateData,
        adminUser.id,
      );

      expect(updatedCategory.name).to.equal("Updated Electronics");
      expect(updatedCategory.description).to.equal(
        "Updated description for electronics",
      );
    });

    it("should update only name", async () => {
      const updateData = {
        name: "Only Name Updated",
      };

      const updatedCategory = await updateCategory(testCategory.id, updateData);

      expect(updatedCategory.name).to.equal("Only Name Updated");
      expect(updatedCategory.description).to.equal(
        "Electronic devices and accessories",
      );
    });

    it("should update only description", async () => {
      const updateData = {
        description: "Only description updated",
      };

      const updatedCategory = await updateCategory(testCategory.id, updateData);

      expect(updatedCategory.name).to.equal("Electronics");
      expect(updatedCategory.description).to.equal("Only description updated");
    });

    it("should throw error for invalid category ID", async () => {
      const updateData = {
        name: "Updated Name",
      };

      try {
        await updateCategory("invalid-uuid", updateData);
        throw new Error("Expected error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("Category not found");
      }
    });

    it("should allow updating to same name", async () => {
      const updateData = {
        name: "Electronics",
        description: "Updated description",
      };

      const updatedCategory = await updateCategory(testCategory.id, updateData);
      expect(updatedCategory.name).to.equal("Electronics");
      expect(updatedCategory.description).to.equal("Updated description");
    });
  });

  describe("deleteCategory", () => {
    it("should delete category successfully", async () => {
      const result = await deleteCategory(testCategory.id, adminUser.id);

      expect(result.message).to.equal("Category deleted successfully");

      try {
        await getCategoryById(testCategory.id);
        throw new Error("Expected error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("Category not found");
      }
    });

    it("should throw error for invalid category ID", async () => {
      try {
        await deleteCategory("invalid-uuid");
        throw new Error("Expected error not thrown");
      } catch (error: any) {
        expect(error.message).to.include("Category not found");
      }
    });

    it("should delete category even with products", async () => {
      // Create a product in the category
      await Product.create({
        name: "Test Product",
        price: 99.99,
        categoryId: testCategory.id,
        stock: 10,
      });

      const result = await deleteCategory(testCategory.id);
      expect(result.message).to.equal("Category deleted successfully");
    });
  });

  describe("Category with Products relationship", () => {
    it("should load category with its products", async () => {
      await Product.create({
        name: "Smartphone",
        price: 699.99,
        categoryId: testCategory.id,
        stock: 25,
      });

      await Product.create({
        name: "Laptop",
        price: 1299.99,
        categoryId: testCategory.id,
        stock: 15,
      });

      const categoryWithProducts = await Category.findByPk(testCategory.id, {
        include: [Product],
      });

      expect(categoryWithProducts).to.exist;
      expect(categoryWithProducts?.products).to.have.length(2);
      expect(
        categoryWithProducts?.products.map((p) => p.name),
      ).to.include.members(["Smartphone", "Laptop"]);
    });

    it("should return category with empty products array", async () => {
      const categoryWithProducts = await Category.findByPk(testCategory.id, {
        include: [Product],
      });

      expect(categoryWithProducts).to.exist;
      expect(categoryWithProducts?.products).to.have.length(0);
    });
  });
});
