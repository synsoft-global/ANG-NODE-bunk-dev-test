import request from 'supertest';
import app from  './app';

describe('POST /payouts With response data types', () => {
  it('POST /payouts =>  With response data types', () => {
    return request(app)
      .post('/payouts').send({
        'expenses': [
            { 'name': 'Adriana', 'amount': 12 },
            { 'name': 'Adriana', 'amount': 12 },
            { 'name': 'Bao', 'amount': 12 }
        ]
    }).expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            total: expect.any(Number),
            equalShare: expect.any(Number),
              payouts:expect.arrayContaining([
                  expect.objectContaining({
                    owes: expect.any(String),
                    owed: expect.any(String),
                    amount: expect.any(Number)
                  })
              ])
          }),
        );
      });
  });
});


describe('POST /payouts  With exact response data', () => {
  it('POST /payouts =>  With exact response data', () => {
    return request(app)
      .post('/payouts').send({
        'expenses': [
            { 'name': 'Adriana', 'amount': 5.75 },
            { 'name': 'Adriana', 'amount': 5.75 },
            { 'name': 'Bao', 'amount': 12 }
        ]
    }).expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            total: 23.5,
            equalShare: 11.75,
              payouts:expect.arrayContaining([
                  expect.objectContaining({
                    owes: 'Adriana',
                    owed: 'Bao',
                    amount: 0.25                    
                  })
              ])
          }),
        );
      });
  });
});