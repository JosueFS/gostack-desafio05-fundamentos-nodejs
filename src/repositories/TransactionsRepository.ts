import Transaction from '../models/Transaction';
import { response } from 'express';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface GroupTransactionType {
  income: Transaction[];
  outcome: Transaction[];
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance: Balance = this.transactions.reduce(
      (accum, obj) => {
        const b = accum;

        b[obj.type] += obj.value;

        return b;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    balance.total = balance.income - balance.outcome;

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const newTransaction = new Transaction({ title, value, type });
    const balance = this.getBalance();

    this.transactions.push(newTransaction);

    return newTransaction;
  }
}

export default TransactionsRepository;
