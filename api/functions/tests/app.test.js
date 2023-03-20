require('dotenv').config()
const app = require('../index')
const request = require('supertest');

describe('POST /', () => {
  it.only('should process message and api', async () => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const message = 'Hi, how are you?';
    const api = OPENAI_API_KEY;
    // const response = await request(app)
    //   .post('/')
    //   .send({ message, api })
    // // .expect(200);
    // console.log(response);

    console.log(api);

    // expect(response.text).toBe('Message and API processed successfully!');
  }, 70000);

  it('should return 500 if message and api processing fails', async () => {
    const message = 'Hello, world!';
    const api = 'https://example.com/api';
    jest.spyOn(app.locals, 'doSomethingWithMessageAndApi').mockRejectedValue(new Error('Failed to process message and API'));
    const response = await request(app)
      .post('/')
      .send({ message, api })
      .expect(500);
    expect(response.text).toBe('Error processing message and API');
  });
});