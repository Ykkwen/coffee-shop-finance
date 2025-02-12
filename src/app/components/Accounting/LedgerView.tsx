"use client";
import { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Select, Button, Space } from 'antd';
import type { JournalEntryType, AccountBalance } from '@/app/types/accounting';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface LedgerViewProps {
  entries: JournalEntryType[];
}

export const LedgerView = ({ entries }: LedgerViewProps) => {
  const [balances, setBalances] = useState<AccountBalance[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  const columns = [
    {
      title: '科目',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '借方发生额',
      dataIndex: 'debit',
      key: 'debit',
    },
    {
      title: '贷方发生额',
      dataIndex: 'credit',
      key: 'credit',
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => balance >= 0 ? balance : `(${Math.abs(balance)})`,
    },
  ];

  // 计算科目余额
  const calculateBalances = () => {
    const accountMap = new Map<string, AccountBalance>();

    entries.forEach(entry => {
      // 处理日期筛选
      if (dateRange[0] && dateRange[1]) {
        const entryDate = dayjs(entry.date);
        if (entryDate.isBefore(dateRange[0]) || entryDate.isAfter(dateRange[1])) {
          return;
        }
      }

      // 处理借方
      if (!accountMap.has(entry.debitAccount)) {
        accountMap.set(entry.debitAccount, {
          account: entry.debitAccount,
          debit: 0,
          credit: 0,
          balance: 0,
        });
      }
      const debitAccount = accountMap.get(entry.debitAccount)!;
      debitAccount.debit += entry.debitAmount;
      debitAccount.balance = debitAccount.debit - debitAccount.credit;

      // 处理贷方
      if (!accountMap.has(entry.creditAccount)) {
        accountMap.set(entry.creditAccount, {
          account: entry.creditAccount,
          debit: 0,
          credit: 0,
          balance: 0,
        });
      }
      const creditAccount = accountMap.get(entry.creditAccount)!;
      creditAccount.credit += entry.creditAmount;
      creditAccount.balance = creditAccount.debit - creditAccount.credit;
    });

    return Array.from(accountMap.values());
  };

  const handleSearch = () => {
    const calculatedBalances = calculateBalances();
    if (selectedAccount === 'all') {
      setBalances(calculatedBalances);
    } else {
      setBalances(calculatedBalances.filter(b => b.account === selectedAccount));
    }
  };

  // 当 entries 变化时自动更新余额
  useEffect(() => {
    handleSearch();
  }, [entries]);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Card title="账簿查询">
        <Space style={{ marginBottom: 16 }}>
          <RangePicker 
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
          />
          <Select 
            defaultValue="all" 
            style={{ width: 120 }}
            onChange={setSelectedAccount}
          >
            <Option value="all">所有科目</Option>
            <Option value="现金">现金</Option>
            <Option value="银行存款">银行存款</Option>
            <Option value="应收账款">应收账款</Option>
          </Select>
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
        </Space>

        <Table columns={columns} dataSource={balances} pagination={false} />
      </Card>
    </div>
  );
}; 