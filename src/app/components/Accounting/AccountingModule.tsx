"use client";
import { Tabs } from 'antd';
import { SmartAccounting } from './SmartAccounting';
import { JournalEntry } from './JournalEntry';
import { AccountVerification } from './AccountVerification';
import { LedgerView } from './LedgerView';
import type { JournalEntryType } from '@/app/types/accounting';

interface AccountingModuleProps {
  entries: JournalEntryType[];
  onNewEntry: (entry: JournalEntryType) => void;
}

export const AccountingModule = ({ entries, onNewEntry }: AccountingModuleProps) => {
  const handleVerificationComplete = (entry: JournalEntryType, isApproved: boolean) => {
    // 这里可以处理核验完成后的逻辑
    console.log("核验完成:", entry, isApproved);
  };

  const items = [
    {
      key: '1',
      label: '智能记账',
      children: <SmartAccounting onNewEntry={onNewEntry} entries={entries} />,
    },
    {
      key: '2',
      label: '手动记账',
      children: <JournalEntry onNewEntry={onNewEntry} entries={entries} />,
    },
    {
      key: '3',
      label: '账务核验',
      children: (
        <AccountVerification
          entries={entries}
          onVerificationComplete={handleVerificationComplete}
        />
      ),
    },
    {
      key: '4',
      label: '账簿查询',
      children: <LedgerView entries={entries} />,
    },
  ];

  return (
    <Tabs defaultActiveKey="1" items={items} />
  );
}; 