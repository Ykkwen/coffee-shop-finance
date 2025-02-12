"use client";
import { useState } from 'react';
import { Tabs, DatePicker } from 'antd';
import { BalanceSheet } from './BalanceSheet';
import { IncomeStatement } from './IncomeStatement';
import { CashFlowStatement } from './CashFlowStatement';
import type { JournalEntryType } from '@/app/types/accounting';
import dayjs from 'dayjs';

interface ReportsModuleProps {
  entries: JournalEntryType[];
  defaultActiveKey?: string;
}

export const ReportsModule = ({ entries, defaultActiveKey = '1' }: ReportsModuleProps) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const items = [
    {
      key: '1',
      label: '资产负债表',
      children: <BalanceSheet entries={entries} date={selectedDate} />,
    },
    {
      key: '2',
      label: '利润表',
      children: <IncomeStatement entries={entries} date={selectedDate} />,
    },
    {
      key: '3',
      label: '现金流量表',
      children: <CashFlowStatement entries={entries} date={selectedDate} />,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8 }}>报表日期：</span>
        <DatePicker 
          value={selectedDate} 
          onChange={handleDateChange}
          allowClear={false}
        />
      </div>
      <Tabs defaultActiveKey={defaultActiveKey} items={items} />
    </div>
  );
}; 