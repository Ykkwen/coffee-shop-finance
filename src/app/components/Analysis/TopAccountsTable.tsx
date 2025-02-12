"use client";
import { Table } from 'antd';
import type { JournalEntryType } from '@/app/types/accounting';

interface TopAccountsTableProps {
  entries: JournalEntryType[];
}

export const TopAccountsTable = ({ entries }: TopAccountsTableProps) => {
  // 处理数据
  const processData = () => {
    const accountStats = new Map<string, {
      account: string;
      debitTotal: number;
      creditTotal: number;
      frequency: number;
      balance: number;
    }>();

    entries.forEach(entry => {
      // 处理借方
      if (!accountStats.has(entry.debitAccount)) {
        accountStats.set(entry.debitAccount, {
          account: entry.debitAccount,
          debitTotal: 0,
          creditTotal: 0,
          frequency: 0,
          balance: 0,
        });
      }
      const debitStats = accountStats.get(entry.debitAccount)!;
      debitStats.debitTotal += entry.debitAmount;
      debitStats.frequency += 1;
      debitStats.balance = debitStats.debitTotal - debitStats.creditTotal;

      // 处理贷方
      if (!accountStats.has(entry.creditAccount)) {
        accountStats.set(entry.creditAccount, {
          account: entry.creditAccount,
          debitTotal: 0,
          creditTotal: 0,
          frequency: 0,
          balance: 0,
        });
      }
      const creditStats = accountStats.get(entry.creditAccount)!;
      creditStats.creditTotal += entry.creditAmount;
      creditStats.frequency += 1;
      creditStats.balance = creditStats.debitTotal - creditStats.creditTotal;
    });

    return Array.from(accountStats.values())
      .sort((a, b) => b.frequency - a.frequency);
  };

  const columns = [
    {
      title: '科目',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '借方发生额',
      dataIndex: 'debitTotal',
      key: 'debitTotal',
      sorter: (a: any, b: any) => a.debitTotal - b.debitTotal,
    },
    {
      title: '贷方发生额',
      dataIndex: 'creditTotal',
      key: 'creditTotal',
      sorter: (a: any, b: any) => a.creditTotal - b.creditTotal,
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => balance >= 0 ? balance : `(${Math.abs(balance)})`,
      sorter: (a: any, b: any) => a.balance - b.balance,
    },
    {
      title: '发生频次',
      dataIndex: 'frequency',
      key: 'frequency',
      sorter: (a: any, b: any) => a.frequency - b.frequency,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={processData()}
      rowKey="account"
      pagination={false}
    />
  );
}; 