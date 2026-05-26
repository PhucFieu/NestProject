import { PrismaClient } from '@prisma/client'; // <-- Sửa lại import chuẩn theo generator mặc định
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString =
  'postgresql://postgres:123456@localhost:5432/nestjs_product_db?schema=public';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🔄 Starting data cleanup...');

  // STAGE 0: Xóa dữ liệu cũ (Đã sửa thành order_Item chuẩn theo schema của bạn)
  await prisma.order_Item.deleteMany({}); // Khớp với model Order_Item
  await prisma.order.deleteMany({});     
  await prisma.cartItem.deleteMany({});  
  await prisma.cart.deleteMany({});      
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

  // STAGE 4: Seed Users
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

  // STAGE 5: Seed Kho hàng (Inventory)
  console.log('📦 Seeding inventory...');
  const allProducts = await prisma.product.findMany();
  for (const product of allProducts) {
    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        quantity: 50,          
        reservedQuantity: 0,   
      },
    });
  }

  // STAGE 6: Ném sẵn đồ vào Giỏ hàng cho tài khoản 'user@gmail.com'
  console.log('🛒 Seeding cart and cart items for user...');
  const targetUser = await prisma.user.findUnique({
    where: { email: 'user@gmail.com' },
  });

  if (targetUser) {
    const userCart = await prisma.cart.upsert({
      where: { userId: targetUser.id },
      update: {},
      create: { userId: targetUser.id },
    });

    const iphone = await prisma.product.findUnique({ where: { sku: 'IP17-01' } });
    const macbook = await prisma.product.findUnique({ where: { sku: 'MAC-M6-01' } });

    if (iphone && macbook) {
      await prisma.cartItem.upsert({
        where: {
          cartId_productId: { cartId: userCart.id, productId: iphone.id },
        },
        update: {},
        create: {
          cartId: userCart.id,
          productId: iphone.id,
          quantity: 2,
        },
      });

      await prisma.cartItem.upsert({
        where: {
          cartId_productId: { cartId: userCart.id, productId: macbook.id },
        },
        update: {},
        create: {
          cartId: userCart.id,
          productId: macbook.id,
          quantity: 1,
        },
      });
    }
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