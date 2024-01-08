/**
 * Models for payout request
 *
 * These can be moved to separate files if needed.
 */
export interface PayoutRequest {
  name: string;
  amount: number;
}

export interface Payout {
  owes: string;
  owed: string;
  amount: number;
}

export interface PayoutResult {
  total: number;
  equalShare: number;
  payouts: Payout[];
}

export interface EmailData {
  email: string;
  password: string;
  testname: string;
  startdate: string;
  enddate: string;
  test_timing: string;
}

