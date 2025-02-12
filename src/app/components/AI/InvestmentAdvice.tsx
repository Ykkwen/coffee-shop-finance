"use client";
import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Progress,
  Divider,
} from "antd";
import {
  UserOutlined,
  ShopOutlined,
  DollarOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import type { JournalEntryType } from "@/app/types/accounting";

interface InvestmentAdviceProps {
  entries: JournalEntryType[];
}

export const InvestmentAdvice = ({ entries }: InvestmentAdviceProps) => {
  // 计算关键指标
  const calculateMetrics = () => {
    // 这里应该根据实际的会计分录计算各项指标
    return {
      customerRetention: 68,
      averageOrder: 42,
      monthlyRevenue: 158000,
      growthRate: 25,
    };
  };

  const metrics = calculateMetrics();

  const faqColumns = [
    {
      title: "常见问题",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "答案",
      dataIndex: "answer",
      key: "answer",
    },
  ];

  const faqData = [
    {
      key: "1",
      question: "回头客比例是多少？",
      answer: `${metrics.customerRetention}%，高于行业平均水平`,
    },
    {
      key: "2",
      question: "平均客单价是多少？",
      answer: `${metrics.averageOrder} 元，且呈上升趋势`,
    },
    {
      key: "3",
      question: "月均营收多少？",
      answer: `${metrics.monthlyRevenue} 元，同比增长 ${metrics.growthRate}%`,
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="投资亮点">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="回头客比例"
                  value={metrics.customerRetention}
                  suffix="%"
                  prefix={<UserOutlined />}
                />
                <Progress
                  percent={metrics.customerRetention}
                  size="small"
                  status="active"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="平均客单价"
                  value={metrics.averageOrder}
                  prefix={<DollarOutlined />}
                  suffix="元"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="月均营收"
                  value={metrics.monthlyRevenue}
                  prefix={<DollarOutlined />}
                  suffix="元"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="营收增长率"
                  value={metrics.growthRate}
                  prefix={<RiseOutlined />}
                  suffix="%"
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card
            title="投资人问答手册"
            extra={
              <Button type="primary">导出完整报告</Button>
            }
          >
            <Table columns={faqColumns} dataSource={faqData} pagination={false} />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="分店选址分析">
            <Row gutter={16}>
              <Col span={8}>
                <Card title="西湖区">
                  <Statistic
                    title="预计日均客流"
                    value={135}
                    suffix="人次"
                    prefix={<UserOutlined />}
                  />
                  <Divider />
                  <div>
                    <p>
                      <ShopOutlined /> 周边写字楼：12栋
                    </p>
                    <p>
                      <UserOutlined /> 办公人群：约8000人
                    </p>
                    <p>
                      <DollarOutlined /> 预期月营收：18.2万
                    </p>
                  </div>
                  <Button type="primary" style={{ marginTop: 16 }}>
                    查看详细报告
                  </Button>
                </Card>
              </Col>
              {/* 可以添加更多区域的分析 */}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}; 