"use client";
import { Table, Card } from 'antd';
import type { JournalEntryType } from '@/app/types/accounting';
import dayjs from 'dayjs';

interface IncomeStatementProps {
  entries: JournalEntryType[];
  date: dayjs.Dayjs;
}

export const IncomeStatement = ({ entries, date }: IncomeStatementProps) => {
  // 计算期间发生额
  const calculateAmounts = () => {
    let revenue = 0;
    let costOfSales = 0;
    let expenses = 0;

    // 只处理截止日期之前的分录
    const validEntries = entries.filter(entry => 
      dayjs(entry.date).isBefore(date, 'day') || dayjs(entry.date).isSame(date, 'day')
    );

    validEntries.forEach(entry => {
      if (entry.creditAccount === '营业收入') {
        revenue += entry.creditAmount;
      }
      if (entry.debitAccount === '营业成本') {
        costOfSales += entry.debitAmount;
      }
      if (entry.debitAccount === '费用') {
        expenses += entry.debitAmount;
      }
    });

    return { revenue, costOfSales, expenses };
  };

  const { revenue, costOfSales, expenses } = calculateAmounts();
  const grossProfit = revenue - costOfSales;
  const netIncome = grossProfit - expenses;

  const data = [
    { item: '营业收入', amount: revenue },
    { item: '减：营业成本', amount: costOfSales },
    { item: '毛利润', amount: grossProfit },
    { item: '减：期间费用', amount: expenses },
    { item: '净利润', amount: netIncome },
  ];

  const columns = [
    {
      title: '项目',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (value: number) => value.toFixed(2),
    },
  ];

  return (
    <Card title="利润表">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowClassName={(record) => 
          record.item === '毛利润' || record.item === '净利润' ? 'bold-row' : ''
        }
      />
    </Card>
  );
}; 