import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt'; // Đã thêm thư viện bcrypt để tự động băm mật khẩu

const connectionString =
  'postgresql://postgres:123456@localhost:5432/nestjs_product_db?schema=public';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🔄 Starting data cleanup...');

  // STAGE 0: Xóa toàn bộ dữ liệu cũ (Chú ý thứ tự: bảng Con xóa trước, bảng Cha xóa sau)
  await prisma.auditLog.deleteMany({});
  await prisma.inventory.deleteMany({});
  
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  
  await prisma.category.deleteMany({});
  await prisma.role.deleteMany({});

  console.log('✅ Cleanup completed! Inserting new seed data...');

  // STAGE 1: Seed Categories
  const phoneCategory = await prisma.category.upsert({
    where: { name: 'Phone' },
    update: {},
    create: {
      name: 'Phone',
      slug: 'phone', 
    },
  });

  const laptopCategory = await prisma.category.upsert({
    where: { name: 'Laptop' },
    update: {},
    create: {
      name: 'Laptop',
      slug: 'laptop', 
    },
  });

  const pcCategory = await prisma.category.upsert({
    where: { name: 'PC' },
    update: {},
    create: {
      name: 'PC',
      slug: 'pc', 
    },
  });

  // STAGE 2: Seed Products
  const productsData = [
    { name: 'iPhone 17', sku: 'IP17-01', price: 30000000, categoryId: phoneCategory.id },
    { name: 'Samsung S30', sku: 'SS30-01', price: 25000000, categoryId: phoneCategory.id },
    { name: 'Xiaomi 20 Ultra', sku: 'XM20U-01', price: 18000000, categoryId: phoneCategory.id },
    { name: 'Dell XPS', sku: 'DELL-XPS-01', price: 40000000, categoryId: laptopCategory.id },
    { name: 'Macbook Pro M6', sku: 'MAC-M6-01', price: 65000000, categoryId: laptopCategory.id },
    { name: 'Asus ROG', sku: 'ASUS-ROG-01', price: 50000000, categoryId: laptopCategory.id },
    { name: 'RTX 5090 PC', sku: 'PC-RTX5090', price: 80000000, categoryId: pcCategory.id },
    { name: 'Gaming PC', sku: 'PC-GAMING-01', price: 45000000, categoryId: pcCategory.id },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { sku: product.sku }, 
      update: {},
      create: product,
    });
  }

  // STAGE 3: Seed Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER' },
  });

  // STAGE 4: Seed Users (Tự động sinh chuỗi mã hóa chuẩn cho mật khẩu '123456')
  const generatedPasswordHash = bcrypt.hashSync('123456', 10);

  const usersData = [
    {
      email: 'admin@gmail.com',
      passwordHash: generatedPasswordHash, 
      fullName: 'Admin',
      roleId: adminRole.id,
    },
    {
      email: 'user@gmail.com',
      passwordHash: generatedPasswordHash,
      fullName: 'User',
      roleId: userRole.id,
    },
  ];

  for (const user of usersData) {
    await prisma.user.upsert({
      where: { email: user.email }, 
      update: {},
      create: user,
    });
  }

  console.log('🚀 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });