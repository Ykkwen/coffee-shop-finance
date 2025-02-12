"use client";
import { Card, Row, Col, DatePicker } from 'antd';
import { TrendChart } from './TrendChart';
import { AccountPieChart } from './AccountPieChart';
import { DailyFlowChart } from './DailyFlowChart';
import { TopAccountsTable } from './TopAccountsTable';
import type { JournalEntryType } from '@/app/types/accounting';

const { RangePicker } = DatePicker;

interface AnalysisModuleProps {
  entries: JournalEntryType[];
}

export const AnalysisModule = ({ entries }: AnalysisModuleProps) => {
  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <RangePicker style={{ marginBottom: 16 }} />
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Card title="收支趋势">
              <TrendChart entries={entries} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="科目余额分布">
              <AccountPieChart entries={entries} />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="每日收支流水">
              <DailyFlowChart entries={entries} />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="重要科目统计">
              <TopAccountsTable entries={entries} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}; 