describe('Payout Calculation api', () => {
  context('When I send POST /payouts', () => {
    it('Then it should return', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/payouts',
        body: {
          "expenses": [
            { "name": "Adriana", "amount": 5.75 },
            { "name": "Adriana", "amount": 5.75 },
            { "name": "Bao", "amount": 12 }
          ]
        }
      })
        .should((response) => {
          expect(response.status).eq(200)
          expect(JSON.stringify(response.body)).eq(JSON.stringify({"total":23.5,"equalShare":11.75,"payouts":[{"owes":"Adriana","owed":"Bao","amount":0.25}]}));
            
        });
    });
  });
});