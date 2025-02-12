"use client";
import { Column } from '@ant-design/charts';
import dayjs from 'dayjs';
import type { JournalEntryType } from '@/app/types/accounting';

interface DailyFlowChartProps {
  entries: JournalEntryType[];
}

export const DailyFlowChart = ({ entries }: DailyFlowChartProps) => {
  // 处理数据
  const processData = () => {
    const dailyFlow = new Map<string, {
      date: string;
      inflow: number;
      outflow: number;
    }>();

    entries.forEach(entry => {
      const date = dayjs(entry.date).format('YYYY-MM-DD');
      if (!dailyFlow.has(date)) {
        dailyFlow.set(date, { date, inflow: 0, outflow: 0 });
      }

      const flow = dailyFlow.get(date)!;

      // 现金流入：收到现金或银行存款
      if (entry.debitAccount === '现金' || entry.debitAccount === '银行存款') {
        flow.inflow += entry.debitAmount;
      }
      // 现金流出：支付现金或银行存款
      if (entry.creditAccount === '现金' || entry.creditAccount === '银行存款') {
        flow.outflow += entry.creditAmount;
      }
    });

    return Array.from(dailyFlow.values())
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const data = processData();

  // 转换数据为柱状图所需格式
  const chartData = data.reduce((acc: any[], curr) => {
    acc.push(
      { date: curr.date, type: '流入', value: curr.inflow },
      { date: curr.date, type: '流出', value: curr.outflow }
    );
    return acc;
  }, []);

  const config = {
    data: chartData,
    isGroup: true,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'middle',
    },
    legend: {
      position: 'top',
    },
  };

  return <Column {...config} />;
}; 