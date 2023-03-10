import type { Request, Response } from 'express';
import type { PayoutRequest, PayoutResult, Payout } from '../models';

/**
 * Objective: 'Calculate Payout on the basis of provided details'
 * parameters: req, 
 * returns: status, data/error
 **/
export const calculatePayout = (req: Request, res: Response) => {
  try {
    
    const requests: PayoutRequest[] = req?.body?.expenses;
    if (requests && requests.length) {
      const uniqueReqs: any = {};
      // Step 1: Calculate the total against each user.
      requests.forEach((element) => {
        if (uniqueReqs[element.name]) {
          uniqueReqs[element.name] += +element.amount;
        } else {
          uniqueReqs[element.name] = +element.amount;
        }
      });
      // Step 2: Calculate the total amount
      const total: number = requests.reduce(
        (acc: number, req: PayoutRequest) => acc + +req.amount,
        0
      );
      // Step 3: Calculate the equal share
      const equalShare: number = total / Object.keys(uniqueReqs).length;
      // Step 4: Calculate how much each person owes or is owed
      const payouts: Payout[] = [];
      const balances: any = {};

      Object.keys(uniqueReqs).forEach((req: any) => {
        if (!balances[req]) {
          balances[req] = 0;
        }
        balances[req] += uniqueReqs[req] - equalShare;
      });
      // Step 5: Generate the payouts
      for (const payer in balances) {
        for (const payee in balances) {
          if (balances[payer] > 0 && balances[payee] < 0) {
            const amount: number = Math.min(balances[payer], -balances[payee]);
            payouts.push({ owes: payee, owed: payer, amount });
            balances[payer] -= amount;
            balances[payee] += amount;
          }
        }
      }
      // Output the results
      const result: PayoutResult = {
        total,
        equalShare,
        payouts,
      };
      console.log({ ...result });
      res.send({ ...result });
    } else {
      res.status(400).send({ error: 'Invalid data'});
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
};
