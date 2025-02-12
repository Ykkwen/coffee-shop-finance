export interface JournalEntryType {
  key: number;
  debitAccount: string;
  debitAmount: number;
  creditAccount: string;
  creditAmount: number;
  description: string;
  date: string;
}

export interface AccountBalance {
  account: string;
  debit: number;
  credit: number;
  balance: number;
} 