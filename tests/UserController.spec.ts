import request from 'supertest';
import server from '../src/server';
import mongoose from 'mongoose';

const connectToDatabase = async () => {
  const uri = "mongodb+srv://teste:teste@cluster0.jp8nunv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
};

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  // await mongoose.connection.dropDatabase(); /*Uncomment this option to delete the DB after use.*/
  await mongoose.connection.close();
});

describe('UserController Tests', () => {
  let userId: string | undefined;

  it('should create a user', async () => {
    const user = { name: 'John Doe', email: 'john@example.com', profession: 'Programmer' };

    const response = await request(server)
      .post('/users')
      .send(user)
      .expect(201);

    expect(response.body.data.user).toHaveProperty('_id');
    expect(response.body.data.user.name).toBe(user.name);
    expect(response.body.data.user.email).toBe(user.email);
    expect(response.body.data.user.profession).toBe(user.profession);

    userId = response.body.data.user._id;
  });

  it('should get a user by id', async () => {
    if (!userId) {
      throw new Error('User ID not set');
    }

    const response = await request(server)
      .get(`/users/${userId}`)
      .expect(200);

    expect(response.body.data.user).toHaveProperty('_id', userId);
    expect(response.body.data.user.name).toBe('John Doe');
  });

  it('should list all users', async () => {
    const user2 = { name: 'Jane Doe', email: 'jane@example.com', profession: 'Designer' };

    await request(server)
      .post('/users')
      .send(user2)
      .expect(201);

    const response = await request(server)
      .get('/users')
      .expect(200);

    expect(response.body.data.users).toBeInstanceOf(Array);
    expect(response.body.data.users.length).toBeGreaterThanOrEqual(2);

    const userNames = response.body.data.users.map((user: any) => user.name);
    expect(userNames).toContain('John Doe');
    expect(userNames).toContain('Jane Doe');
  });

  it('should update a user', async () => {
    if (!userId) {
      throw new Error('User ID not set');
    }

    const response = await request(server)
      .patch(`/users/${userId}`)
      .send({ name: 'John Doe Updated' })
      .expect(201);

    expect(response.body.data.user).toHaveProperty('_id', userId);
    expect(response.body.data.user.name).toBe('John Doe Updated');
  });

  it('should delete a user', async () => {
    if (!userId) {
      throw new Error('User ID not set');
    }

    await request(server)
      .delete(`/users/${userId}`)
      .expect(204);

    await request(server)
      .get(`/users/${userId}`)
      .expect(404);
  });
});
