"use client";
import { Pie } from '@ant-design/charts';
import type { JournalEntryType } from '@/app/types/accounting';

interface AccountPieChartProps {
  entries: JournalEntryType[];
}

export const AccountPieChart = ({ entries }: AccountPieChartProps) => {
  // 处理数据
  const processData = () => {
    const accountBalances = new Map<string, number>();

    entries.forEach(entry => {
      // 处理借方
      if (!accountBalances.has(entry.debitAccount)) {
        accountBalances.set(entry.debitAccount, 0);
      }
      accountBalances.set(
        entry.debitAccount,
        accountBalances.get(entry.debitAccount)! + entry.debitAmount
      );

      // 处理贷方
      if (!accountBalances.has(entry.creditAccount)) {
        accountBalances.set(entry.creditAccount, 0);
      }
      accountBalances.set(
        entry.creditAccount,
        accountBalances.get(entry.creditAccount)! - entry.creditAmount
      );
    });

    return Array.from(accountBalances.entries())
      .map(([account, balance]) => ({
        account,
        value: Math.abs(balance),
      }))
      .filter(item => item.value > 0);
  };

  const data = processData();

  const config = {
    data,
    angleField: 'value',
    colorField: 'account',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return <Pie {...config} />;
}; 