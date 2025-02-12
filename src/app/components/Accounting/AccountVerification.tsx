"use client";
import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Alert,
  Timeline,
  Row,
  Col,
  Statistic,
  Radio,
  Descriptions,
  Divider,
  Segmented,
  List,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  AuditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { JournalEntryType } from "@/app/types/accounting";
import { message } from "antd";
import dynamic from "next/dynamic";

// 动态导入 Modal 组件，禁用 SSR
const DynamicModal = dynamic(() => import("antd").then((mod) => mod.Modal), {
  ssr: false,
});

// 添加 AI 分析结果接口
interface AIAnalysis {
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  suggestions: string[];
  similarCases?: {
    description: string;
    result: string;
    date: string;
  }[];
}

interface VerificationResult {
  entryId: number;
  entry: JournalEntryType;
  status: "pending" | "verified" | "rejected" | "manual_review";
  issues: string[];
  verificationDate: string;
  reviewer?: string;
  reviewNotes?: string;
  aiAnalysis?: AIAnalysis;
}

interface AccountVerificationProps {
  entries: JournalEntryType[];
  onVerificationComplete: (
    entry: JournalEntryType,
    isApproved: boolean
  ) => void;
}

// 定义状态选项
const STATUS_OPTIONS = [
  { value: "manual_review", label: "待复核", color: "#faad14" },
  { value: "verified", label: "已通过", color: "#52c41a" },
  { value: "rejected", label: "已拒绝", color: "#ff4d4f" },
  { value: "all", label: "全部", color: "#1890ff" },
];

// 使用固定的模拟数据
const mockAIAnalysis: Record<number, AIAnalysis> = {
  1001: {
    riskLevel: "high",
    confidence: 0.85,
    suggestions: [
      "建议查验供应商资质证明",
      "比对历史采购价格，当前单价高于平均值32%",
      "建议核实付款条件和账期",
    ],
    similarCases: [
      {
        description: "上次大额咖啡豆采购",
        result: "通过",
        date: "2023-12-15",
      },
    ],
  },
  1002: {
    riskLevel: "medium",
    confidence: 0.92,
    suggestions: [
      "装修费用借贷不平，可能是税费单独记账",
      "建议检查装修合同金额明细",
    ],
  },
  1003: {
    riskLevel: "low",
    confidence: 0.95,
    suggestions: ["广告费建议使用销售费用科目", "金额符合正常广告支出范围"],
  },
  1006: {
    riskLevel: "high",
    confidence: 0.88,
    suggestions: [
      "单笔交易金额超过10万元，需要管理层审批",
      "建议核实合同签订情况",
      "检查付款账户是否在白名单内",
    ],
    similarCases: [
      {
        description: "上月大额设备采购",
        result: "通过",
        date: "2024-01-15",
      },
    ],
  },
  1007: {
    riskLevel: "medium",
    confidence: 0.78,
    suggestions: [
      "费用报销缺少明细清单",
      "建议补充发票扫描件",
      "检查费用分类是否准确",
    ],
  },
  1008: {
    riskLevel: "low",
    confidence: 0.96,
    suggestions: ["常规营业收入，金额在正常范围内", "建议定期核对POS机数据"],
  },
};

// 修改模拟数据，添加 AI 分析结果
const mockVerificationData: VerificationResult[] = [
  {
    entryId: 1001,
    entry: {
      key: 1001,
      debitAccount: "库存商品",
      debitAmount: 150000,
      creditAccount: "应付账款",
      creditAmount: 150000,
      description: "采购进口咖啡豆",
      date: "2024-02-01T08:00:00.000Z",
    },
    status: "manual_review",
    issues: ["交易金额异常，需要人工复核", "需要检查供应商资质"],
    verificationDate: "2024-02-01T08:05:00.000Z",
    aiAnalysis: mockAIAnalysis[1001],
  },
  {
    entryId: 1002,
    entry: {
      key: 1002,
      debitAccount: "费用",
      debitAmount: 8000,
      creditAccount: "现金",
      creditAmount: 8500,
      description: "支付店面装修费用",
      date: "2024-02-01T09:15:00.000Z",
    },
    status: "manual_review",
    issues: ["借贷不平衡：借方8000，贷方8500"],
    verificationDate: "2024-02-01T09:20:00.000Z",
    aiAnalysis: mockAIAnalysis[1002],
  },
  {
    entryId: 1003,
    entry: {
      key: 1003,
      debitAccount: "其他支出",
      debitAmount: 3000,
      creditAccount: "银行存款",
      creditAmount: 3000,
      description: "支付广告费",
      date: "2024-02-01T10:30:00.000Z",
    },
    status: "manual_review",
    issues: ["科目'其他支出'不存在，请确认正确的费用类别"],
    verificationDate: "2024-02-01T10:35:00.000Z",
    aiAnalysis: mockAIAnalysis[1003],
  },
  {
    entryId: 1004,
    entry: {
      key: 1004,
      debitAccount: "现金",
      debitAmount: 5000,
      creditAccount: "营业收入",
      creditAmount: 5000,
      description: "咖啡销售收入",
      date: "2024-02-01T11:00:00.000Z",
    },
    status: "verified",
    issues: [],
    verificationDate: "2024-02-01T11:05:00.000Z",
    reviewer: "张三",
  },
  {
    entryId: 1005,
    entry: {
      key: 1005,
      debitAccount: "费用",
      debitAmount: 12000,
      creditAccount: "银行存款",
      creditAmount: 12000,
      description: "支付员工工资",
      date: "2024-02-01T14:00:00.000Z",
    },
    status: "rejected",
    issues: ["金额异常，需要提供详细的工资清单"],
    verificationDate: "2024-02-01T14:10:00.000Z",
    reviewer: "李四",
  },
  {
    entryId: 1006,
    entry: {
      key: 1006,
      debitAccount: "固定资产",
      debitAmount: 120000,
      creditAccount: "银行存款",
      creditAmount: 120000,
      description: "购买咖啡机设备",
      date: "2024-02-02T09:00:00.000Z",
    },
    status: "manual_review",
    issues: ["大额支出需要管理层审批", "需要提供设备采购合同"],
    verificationDate: "2024-02-02T09:05:00.000Z",
    aiAnalysis: mockAIAnalysis[1006],
  },
  {
    entryId: 1007,
    entry: {
      key: 1007,
      debitAccount: "费用",
      debitAmount: 15800,
      creditAccount: "银行存款",
      creditAmount: 15800,
      description: "员工差旅费报销",
      date: "2024-02-02T10:30:00.000Z",
    },
    status: "manual_review",
    issues: ["需要提供差旅费明细清单", "检查是否符合差旅报销标准"],
    verificationDate: "2024-02-02T10:35:00.000Z",
    aiAnalysis: mockAIAnalysis[1007],
  },
  {
    entryId: 1008,
    entry: {
      key: 1008,
      debitAccount: "银行存款",
      debitAmount: 25600,
      creditAccount: "营业收入",
      creditAmount: 25600,
      description: "周末营业收入",
      date: "2024-02-03T18:00:00.000Z",
    },
    status: "verified",
    issues: [],
    verificationDate: "2024-02-03T18:05:00.000Z",
    reviewer: "王五",
    aiAnalysis: mockAIAnalysis[1008],
  },
  {
    entryId: 1009,
    entry: {
      key: 1009,
      debitAccount: "费用",
      debitAmount: 4500,
      creditAccount: "现金",
      creditAmount: 4500,
      description: "店面日常维护费用",
      date: "2024-02-03T14:30:00.000Z",
    },
    status: "verified",
    issues: [],
    verificationDate: "2024-02-03T14:35:00.000Z",
    reviewer: "张三",
  },
  {
    entryId: 1010,
    entry: {
      key: 1010,
      debitAccount: "应收账款",
      debitAmount: 35000,
      creditAccount: "营业收入",
      creditAmount: 35000,
      description: "企业客户月结账单",
      date: "2024-02-03T16:00:00.000Z",
    },
    status: "rejected",
    issues: ["缺少客户签字的确认单", "账期超过信用期限"],
    verificationDate: "2024-02-03T16:05:00.000Z",
    reviewer: "李四",
  },
];

export const AccountVerification = ({
  entries,
  onVerificationComplete,
}: AccountVerificationProps) => {
  const [verificationResults, setVerificationResults] =
    useState<VerificationResult[]>(mockVerificationData);
  const [selectedEntry, setSelectedEntry] = useState<VerificationResult | null>(
    null
  );
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("manual_review");
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // 自动核验规则
  const verificationRules = {
    balanceCheck: (entry: JournalEntryType) => {
      return entry.debitAmount === entry.creditAmount ? null : "借贷不平衡";
    },
    accountMatch: (entry: JournalEntryType) => {
      const validAccounts = [
        "现金",
        "银行存款",
        "应收账款",
        "库存商品",
        "固定资产",
        "应付账款",
        "营业收入",
        "营业成本",
        "费用",
      ];
      return validAccounts.includes(entry.debitAccount) &&
        validAccounts.includes(entry.creditAccount)
        ? null
        : "科目不存在";
    },
    amountReasonability: (entry: JournalEntryType) => {
      // 检查金额是否异常（例如：超过历史平均值的3倍）
      return entry.debitAmount > 100000 ? "交易金额异常，需要人工复核" : null;
    },
  };

  // 执行自动核验
  const performVerification = (entry: JournalEntryType) => {
    const issues: string[] = [];

    // 应用所有核验规则
    Object.values(verificationRules).forEach((rule) => {
      const result = rule(entry);
      if (result) {
        issues.push(result);
      }
    });

    return {
      entryId: entry.key,
      entry,
      status: issues.length === 0 ? "verified" : "manual_review",
      issues,
      verificationDate: new Date().toISOString(),
    };
  };

  // 修改数据处理逻辑
  useEffect(() => {
    // 处理真实数据
    const realResults = entries.map((entry) => performVerification(entry));

    // 将最新的5条设置为待复核状态
    const latestEntries = realResults
      .sort(
        (a, b) =>
          new Date(b.entry.date).getTime() - new Date(a.entry.date).getTime()
      )
      .slice(0, 5)
      .map((result) => ({
        ...result,
        status: "manual_review",
        issues: ["新增记录，需要人工复核"],
      }));

    // 其他记录保持原状态
    const otherEntries = realResults.slice(5);

    // 合并所有数据
    const allResults = [
      ...latestEntries,
      ...otherEntries,
      ...mockVerificationData,
    ];
    // setVerificationResults(allResults);
  }, [entries]);

  // 修改复核弹窗
  const showReviewModal = (record: VerificationResult) => {
    setSelectedEntry(record);
    setReviewModalVisible(true);
    form.resetFields();
  };

  // 表格列定义
  const columns = [
    {
      title: "日期",
      dataIndex: ["entry", "date"],
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "描述",
      dataIndex: ["entry", "description"],
      key: "description",
    },
    {
      title: "借方金额",
      dataIndex: ["entry", "debitAmount"],
      key: "debitAmount",
    },
    {
      title: "贷方金额",
      dataIndex: ["entry", "creditAmount"],
      key: "creditAmount",
    },
    {
      title: "AI 风险评估",
      key: "aiRisk",
      render: (_: any, record: VerificationResult) => {
        const analysis = record.aiAnalysis;
        if (!analysis) return <Tag color="default">未分析</Tag>;

        return (
          <Space>
            <Tag
              color={
                analysis.riskLevel === "high"
                  ? "red"
                  : analysis.riskLevel === "medium"
                  ? "orange"
                  : "green"
              }
            >
              {analysis.riskLevel === "high"
                ? "高风险"
                : analysis.riskLevel === "medium"
                ? "中风险"
                : "低风险"}
            </Tag>
            <span style={{ fontSize: "12px", color: "#999" }}>
              {Math.round(analysis.confidence * 100)}% 置信度
            </span>
          </Space>
        );
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          verified: { color: "success", text: "已验证" },
          rejected: { color: "error", text: "已拒绝" },
          manual_review: { color: "warning", text: "待复核" },
          pending: { color: "default", text: "待验证" },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record: VerificationResult) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => showReviewModal(record)}
            disabled={record.status !== "manual_review"}
            icon={<AuditOutlined />}
          >
            复核
          </Button>
          <Button
            type="link"
            size="small"
            onClick={(e) => {
              const tr = (e.target as HTMLElement).closest("tr");
              const expandIcon = tr?.querySelector(
                ".ant-table-row-expand-icon"
              ) as HTMLElement;
              if (expandIcon) {
                expandIcon.click();
              }
            }}
            icon={<EyeOutlined />}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  // 筛选数据
  const getFilteredResults = () => {
    return verificationResults
      .filter((result) => {
        if (filterStatus === "all") return true;
        return result.status === filterStatus;
      })
      .filter((result) =>
        result.entry.description
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
  };

  // 获取统计数据
  const getStatistics = () => {
    return {
      total: verificationResults.length,
      pending: verificationResults.filter((r) => r.status === "manual_review")
        .length,
      verified: verificationResults.filter((r) => r.status === "verified")
        .length,
      rejected: verificationResults.filter((r) => r.status === "rejected")
        .length,
    };
  };

  // 修改复核提交处理
  const handleManualReview = async (values: any) => {
    if (!selectedEntry) return;

    try {
      const isApproved = values.approved === true;
      const updatedResult = {
        ...selectedEntry,
        status: isApproved ? "verified" : "rejected",
        reviewer: "当前审核员",
        verificationDate: new Date().toISOString(),
        reviewNotes: values.reviewNotes,
      };

      // 更新状态
      setVerificationResults((prev) =>
        prev.map((result) =>
          result.entryId === selectedEntry.entryId ? updatedResult : result
        )
      );

      // 先关闭弹窗和清理状态
      setReviewModalVisible(false);
      setSelectedEntry(null);
      form.resetFields();

      // 显示成功消息
      message.success(isApproved ? "审核通过" : "已拒绝", 1, () => {
        onVerificationComplete(selectedEntry.entry, isApproved);
      });
    } catch (error) {
      message.error("操作失败，请重试");
    }
  };

  // 修改表单提交按钮的处理
  const handleFormSubmit = (approved: boolean) => {
    form
      .validateFields()
      .then((values) => {
        handleManualReview({
          ...values,
          approved: approved,
        });
      })
      .catch(() => {
        message.error("请填写必要信息");
      });
  };

  // 在展开行中添加 AI 分析结果的渲染
  const renderAIAnalysis = (record: VerificationResult) => {
    const analysis = record.aiAnalysis;
    if (!analysis) return null;

    return (
      <Card
        type="inner"
        title={
          <Space>
            <span>AI 智能分析</span>
            <Tag
              color={
                analysis.riskLevel === "high"
                  ? "red"
                  : analysis.riskLevel === "medium"
                  ? "orange"
                  : "green"
              }
            >
              {analysis.riskLevel === "high"
                ? "高风险"
                : analysis.riskLevel === "medium"
                ? "中风险"
                : "低风险"}{" "}
              ({Math.round(analysis.confidence * 100)}% 置信度)
            </Tag>
          </Space>
        }
        style={{ marginTop: 16 }}
      >
        <div>
          <div style={{ marginBottom: 16 }}>
            <Typography.Title level={5}>AI 建议</Typography.Title>
            <ul>
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          {analysis.similarCases && (
            <div>
              <Typography.Title level={5}>相似案例</Typography.Title>
              <List
                size="small"
                dataSource={analysis.similarCases}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <span>{item.description}</span>
                      <Tag color={item.result === "通过" ? "green" : "red"}>
                        {item.result}
                      </Tag>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </Space>
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div>
      <Card title="账务核验">
        <Space direction="vertical" style={{ width: "100%" }}>
          {/* 统计信息和状态切换 */}
          <Row gutter={16}>
            <Col span={6}>
              <Card
                size="small"
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    filterStatus === "manual_review" ? "#fff7e6" : undefined,
                }}
                onClick={() => setFilterStatus("manual_review")}
              >
                <Statistic
                  title="待复核"
                  value={getStatistics().pending}
                  valueStyle={{ color: "#faad14" }}
                  prefix={<WarningOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                size="small"
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    filterStatus === "verified" ? "#f6ffed" : undefined,
                }}
                onClick={() => setFilterStatus("verified")}
              >
                <Statistic
                  title="已通过"
                  value={getStatistics().verified}
                  valueStyle={{ color: "#52c41a" }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                size="small"
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    filterStatus === "rejected" ? "#fff1f0" : undefined,
                }}
                onClick={() => setFilterStatus("rejected")}
              >
                <Statistic
                  title="已拒绝"
                  value={getStatistics().rejected}
                  valueStyle={{ color: "#ff4d4f" }}
                  prefix={<CloseCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                size="small"
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    filterStatus === "all" ? "#f0f5ff" : undefined,
                }}
                onClick={() => setFilterStatus("all")}
              >
                <Statistic
                  title="总计"
                  value={getStatistics().total}
                  prefix={<AuditOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* 搜索框 */}
          <Row>
            <Col span={8}>
              <Input.Search
                placeholder="搜索描述..."
                onSearch={(value) => setSearchText(value)}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
          </Row>

          {/* 表格 */}
          <Table
            dataSource={getFilteredResults()}
            columns={columns}
            rowKey="entryId"
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ padding: "12px 0" }}>
                  <Timeline
                    items={[
                      {
                        color: "blue",
                        children: `创建时间：${new Date(
                          record.entry.date
                        ).toLocaleString()}`,
                      },
                      {
                        color: "red",
                        children: (
                          <div>
                            <div>需要复核的问题：</div>
                            <ul>
                              {record.issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        ),
                      },
                      ...(record.reviewer
                        ? [
                            {
                              color: "green",
                              children: `复核人：${
                                record.reviewer
                              }，时间：${new Date(
                                record.verificationDate
                              ).toLocaleString()}`,
                            },
                          ]
                        : []),
                    ]}
                  />
                  {renderAIAnalysis(record)}
                </div>
              ),
            }}
          />
        </Space>
      </Card>

      <DynamicModal
        title="人工复核"
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          setSelectedEntry(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        {selectedEntry && (
          <Form form={form} layout="vertical">
            <Alert
              message="待复核事项"
              description={
                <div>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="记账描述">
                      {selectedEntry.entry.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="借方">
                      {selectedEntry.entry.debitAccount} ¥
                      {selectedEntry.entry.debitAmount}
                    </Descriptions.Item>
                    <Descriptions.Item label="贷方">
                      {selectedEntry.entry.creditAccount} ¥
                      {selectedEntry.entry.creditAmount}
                    </Descriptions.Item>
                  </Descriptions>
                  <Divider />
                  <div>需要复核的问题：</div>
                  <ul>
                    {selectedEntry.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              }
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Form.Item
              name="reviewNotes"
              label="复核意见"
              rules={[{ required: true, message: "请输入复核意见" }]}
            >
              <Input.TextArea rows={4} placeholder="请输入复核意见..." />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  onClick={() => handleFormSubmit(true)}
                  icon={<CheckCircleOutlined />}
                >
                  通过
                </Button>
                <Button
                  danger
                  onClick={() => handleFormSubmit(false)}
                  icon={<CloseCircleOutlined />}
                >
                  拒绝
                </Button>
                <Button
                  onClick={() => {
                    setReviewModalVisible(false);
                    setSelectedEntry(null);
                    form.resetFields();
                  }}
                >
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </DynamicModal>
    </div>
  );
};
