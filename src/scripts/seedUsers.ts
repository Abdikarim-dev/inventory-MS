import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db';
import User from '../user/user.model';

async function seedUsers() {
  try {
    await connectDB();

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin', 10);
    const staffPassword = await bcrypt.hash('staff', 10);

    // Create admin users
    const admin1 = await User.create({
      username: 'admin1',
      name: 'Admin One',
      email: 'admin1@example.com',
      password: adminPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'One'
    });

    const admin2 = await User.create({
      username: 'admin2',
      name: 'Admin Two',
      email: 'admin2@example.com',
      password: adminPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'Two'
    });

    // Create staff users
    const staffUsers = await Promise.all([
      User.create({
        username: 'staff1',
        name: 'Staff One',
        email: 'staff1@example.com',
        password: staffPassword,
        role: 'staff',
        firstName: 'Staff',
        lastName: 'One'
      }),
      User.create({
        username: 'staff2',
        name: 'Staff Two',
        email: 'staff2@example.com',
        password: staffPassword,
        role: 'staff',
        firstName: 'Staff',
        lastName: 'Two'
      }),
      User.create({
        username: 'staff3',
        name: 'Staff Three',
        email: 'staff3@example.com',
        password: staffPassword,
        role: 'staff',
        firstName: 'Staff',
        lastName: 'Three'
      })
    ]);

    console.log('Users created successfully:');
    console.log('Admins:', { admin1, admin2 });
    console.log('Staff:', staffUsers);

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedUsers();
