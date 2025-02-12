"use client";
import { Table, Card } from 'antd';
import type { JournalEntryType } from '@/app/types/accounting';
import dayjs from 'dayjs';

interface CashFlowStatementProps {
  entries: JournalEntryType[];
  date: dayjs.Dayjs;
}

export const CashFlowStatement = ({ entries, date }: CashFlowStatementProps) => {
  // 计算现金流量
  const calculateCashFlows = () => {
    let operatingInflow = 0;
    let operatingOutflow = 0;
    let investingInflow = 0;
    let investingOutflow = 0;

    // 只处理截止日期之前的分录
    const validEntries = entries.filter(entry => 
      dayjs(entry.date).isBefore(date, 'day') || dayjs(entry.date).isSame(date, 'day')
    );

    validEntries.forEach(entry => {
      // 经营活动现金流入
      if (
        (entry.debitAccount === '现金' || entry.debitAccount === '银行存款') &&
        ['营业收入', '应收账款'].includes(entry.creditAccount)
      ) {
        operatingInflow += entry.debitAmount;
      }

      // 经营活动现金流出
      if (
        (entry.creditAccount === '现金' || entry.creditAccount === '银行存款') &&
        ['应付账款', '费用', '营业成本'].includes(entry.debitAccount)
      ) {
        operatingOutflow += entry.creditAmount;
      }

      // 投资活动现金流入（示例：处置固定资产）
      if (
        (entry.debitAccount === '现金' || entry.debitAccount === '银行存款') &&
        entry.creditAccount === '固定资产'
      ) {
        investingInflow += entry.debitAmount;
      }

      // 投资活动现金流出（示例：购置固定资产）
      if (
        (entry.creditAccount === '现金' || entry.creditAccount === '银行存款') &&
        entry.debitAccount === '固定资产'
      ) {
        investingOutflow += entry.creditAmount;
      }
    });

    return {
      operatingInflow,
      operatingOutflow,
      investingInflow,
      investingOutflow,
    };
  };

  const {
    operatingInflow,
    operatingOutflow,
    investingInflow,
    investingOutflow,
  } = calculateCashFlows();

  const operatingNet = operatingInflow - operatingOutflow;
  const investingNet = investingInflow - investingOutflow;
  const totalNet = operatingNet + investingNet;

  const data = [
    { item: '一、经营活动产生的现金流量：', amount: null, level: 0 },
    { item: '经营活动现金流入', amount: operatingInflow, level: 1 },
    { item: '经营活动现金流出', amount: operatingOutflow, level: 1 },
    { item: '经营活动产生的现金流量净额', amount: operatingNet, level: 1 },
    { item: '二、投资活动产生的现金流量：', amount: null, level: 0 },
    { item: '投资活动现金流入', amount: investingInflow, level: 1 },
    { item: '投资活动现金流出', amount: investingOutflow, level: 1 },
    { item: '投资活动产生的现金流量净额', amount: investingNet, level: 1 },
    { item: '三、现金及现金等价物净增加额', amount: totalNet, level: 0 },
  ];

  const columns = [
    {
      title: '项目',
      dataIndex: 'item',
      key: 'item',
      render: (text: string, record: any) => (
        <span style={{ marginLeft: record.level * 24 }}>{text}</span>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (value: number | null) => (value === null ? '' : value.toFixed(2)),
    },
  ];

  return (
    <Card title="现金流量表">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowClassName={(record) => 
          record.level === 0 ? 'bold-row' : ''
        }
      />
    </Card>
  );
}; 