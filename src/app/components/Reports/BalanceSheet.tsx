"use client";
import { Table, Card, Row, Col } from 'antd';
import type { JournalEntryType } from '@/app/types/accounting';
import dayjs from 'dayjs';

interface BalanceSheetProps {
  entries: JournalEntryType[];
  date: dayjs.Dayjs;
}

interface AccountBalance {
  account: string;
  balance: number;
}

export const BalanceSheet = ({ entries, date }: BalanceSheetProps) => {
  // 计算科目余额
  const calculateBalances = () => {
    const balances = new Map<string, number>();

    // 只处理截止日期之前的分录
    const validEntries = entries.filter(entry => 
      dayjs(entry.date).isBefore(date, 'day') || dayjs(entry.date).isSame(date, 'day')
    );

    validEntries.forEach(entry => {
      // 处理借方
      if (!balances.has(entry.debitAccount)) {
        balances.set(entry.debitAccount, 0);
      }
      balances.set(
        entry.debitAccount,
        balances.get(entry.debitAccount)! + entry.debitAmount
      );

      // 处理贷方
      if (!balances.has(entry.creditAccount)) {
        balances.set(entry.creditAccount, 0);
      }
      balances.set(
        entry.creditAccount,
        balances.get(entry.creditAccount)! - entry.creditAmount
      );
    });

    return balances;
  };

  const balances = calculateBalances();

  // 资产类科目
  const assets = [
    { account: '现金', balance: balances.get('现金') || 0 },
    { account: '银行存款', balance: balances.get('银行存款') || 0 },
    { account: '应收账款', balance: balances.get('应收账款') || 0 },
    { account: '库存商品', balance: balances.get('库存商品') || 0 },
    { account: '固定资产', balance: balances.get('固定资产') || 0 },
  ];

  // 负债类科目
  const liabilities = [
    { account: '应付账款', balance: -1 * (balances.get('应付账款') || 0) },
    { account: '预收账款', balance: -1 * (balances.get('预收账款') || 0) },
  ];

  // 所有者权益类科目
  const equity = [
    { 
      account: '实收资本', 
      balance: -1 * (balances.get('实收资本') || 0) 
    },
    {
      account: '未分配利润',
      balance: -1 * (
        (balances.get('营业收入') || 0) - 
        (balances.get('营业成本') || 0) - 
        (balances.get('费用') || 0)
      ),
    },
  ];

  const columns = [
    {
      title: '科目',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '金额',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right' as const,
      render: (value: number) => value.toFixed(2),
    },
  ];

  const totalAssets = assets.reduce((sum, item) => sum + item.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.balance, 0);
  const totalEquity = equity.reduce((sum, item) => sum + item.balance, 0);

  return (
    <Row gutter={24}>
      <Col span={12}>
        <Card title="资产">
          <Table
            columns={columns}
            dataSource={assets}
            pagination={false}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell>资产总计</Table.Summary.Cell>
                  <Table.Summary.Cell align="right">
                    {totalAssets.toFixed(2)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="负债和所有者权益">
          <Table
            columns={columns}
            dataSource={[...liabilities, ...equity]}
            pagination={false}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell>负债和所有者权益总计</Table.Summary.Cell>
                  <Table.Summary.Cell align="right">
                    {(totalLiabilities + totalEquity).toFixed(2)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
}; 