require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');

const sampleFoods = [
  {
    name: 'Crispy Samosa (2 pcs)',
    description: 'Golden-fried pastry pockets stuffed with spiced potato and green peas, served with mint & tamarind chutney.',
    price: 30,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
  {
    name: 'Veg Grilled Sandwich',
    description: 'Toasted bread filled with crunchy cucumbers, tomatoes, bell peppers, cheese, and zesty green chutney.',
    price: 60,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
  {
    name: 'College Special Masala Maggi',
    description: 'Classic 2-minute noodles tossed with fresh chopped onions, tomatoes, sweet corn, and canteen special spice mix.',
    price: 40,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
  {
    name: 'Crispy Veg Burger',
    description: 'Crispy vegetable patty with fresh lettuce, sliced tomatoes, creamy mayo, and tangy sauce in a toasted sesame bun.',
    price: 70,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
  {
    name: 'Chilled Cold Coffee',
    description: 'Thick, creamy blended cold coffee topped with rich cocoa powder and chocolate drizzle.',
    price: 50,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
  {
    name: 'Crispy Masala Dosa',
    description: 'Thin crispy fermented rice crepe stuffed with fragrant spiced mashed potatoes, served with coconut chutney & piping hot sambar.',
    price: 80,
    category: 'Meals',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
  {
    name: 'Paneer Butter Masala Thali',
    description: 'Rich tomato-cashew paneer curry served with 2 flaky butter parathas, aromatic jeera rice, and salad.',
    price: 120,
    category: 'Meals',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
  {
    name: 'Amritsari Chole Bhature',
    description: 'Spiced authentic Punjabi chickpeas curry served with 2 fluffy golden deep-fried bhaturas, pickled onions, and green chili.',
    price: 90,
    category: 'Meals',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
  {
    name: 'Lemon Mint Iced Tea',
    description: 'Refreshing brewed black tea infused with real lemon juice and fresh garden mint leaves, served on ice.',
    price: 40,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
  {
    name: 'Hot Chocolate Brownie',
    description: 'Gooey, decadent dark chocolate walnut brownie served warm.',
    price: 55,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
  {
    name: 'Steamed Idli Sambar (2 pcs)',
    description: 'Soft and fluffy steamed rice cakes served with aromatic lentil sambar and freshly ground coconut chutney.',
    price: 50,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    available: false, // Intentionally unavailable sample item to test availability filter & badge!
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/campus_canteen';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await FoodItem.deleteMany({});
    await Order.deleteMany({});

    console.log('Creating Admin account...');
    const admin = await User.create({
      name: 'Canteen Administrator',
      email: 'admin@example.com',
      password: 'Admin@123',
      studentId: 'ADMIN-001',
      role: 'admin',
    });
    console.log(`✓ Admin created: ${admin.email}`);

    console.log('Creating Sample Student account...');
    const student = await User.create({
      name: 'Rahul Sharma',
      email: 'student@example.com',
      password: 'Student@123',
      studentId: 'STU-2024-001',
      role: 'student',
    });
    console.log(`✓ Student created: ${student.email}`);

    console.log('Creating sample food menu items...');
    const createdFoods = await FoodItem.insertMany(sampleFoods);
    console.log(`✓ ${createdFoods.length} food items created successfully`);

    console.log('Creating sample initial orders for realistic dashboard demo...');
    const sampleOrder1 = await Order.create({
      orderId: 'ORD-20261001-1001',
      userId: student._id,
      items: [
        {
          foodItem: createdFoods[0]._id,
          name: createdFoods[0].name,
          price: createdFoods[0].price,
          quantity: 2,
          subtotal: 60,
        },
        {
          foodItem: createdFoods[4]._id,
          name: createdFoods[4].name,
          price: createdFoods[4].price,
          quantity: 1,
          subtotal: 50,
        },
      ],
      totalAmount: 110,
      orderStatus: 'Placed',
      paymentMethod: 'Cash on Pickup',
      paymentStatus: 'Pending',
      notes: 'Please pack in eco-friendly paper bags',
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
    });

    const sampleOrder2 = await Order.create({
      orderId: 'ORD-20261001-1002',
      userId: student._id,
      items: [
        {
          foodItem: createdFoods[5]._id,
          name: createdFoods[5].name,
          price: createdFoods[5].price,
          quantity: 1,
          subtotal: 80,
        },
      ],
      totalAmount: 80,
      orderStatus: 'Preparing',
      paymentMethod: 'Cash on Pickup',
      paymentStatus: 'Pending',
      notes: 'Extra spicy sambar if possible',
      createdAt: new Date(Date.now() - 35 * 60 * 1000), // 35 mins ago
    });

    const sampleOrder3 = await Order.create({
      orderId: 'ORD-20261001-1003',
      userId: student._id,
      items: [
        {
          foodItem: createdFoods[1]._id,
          name: createdFoods[1].name,
          price: createdFoods[1].price,
          quantity: 2,
          subtotal: 120,
        },
      ],
      totalAmount: 120,
      orderStatus: 'Completed',
      paymentMethod: 'Cash on Pickup',
      paymentStatus: 'Paid',
      notes: 'Completed order',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    });

    console.log(`✓ 3 sample orders created for demo & test verification`);

    console.log('==============================================');
    console.log('Database Seeding Completed Successfully!');
    console.log('Admin Login:   admin@example.com   / Admin@123');
    console.log('Student Login: student@example.com / Student@123');
    console.log('==============================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
