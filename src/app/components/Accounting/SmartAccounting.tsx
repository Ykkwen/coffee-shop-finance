"use client";
import { useState } from "react";
import {
  Card,
  Upload,
  Button,
  Alert,
  Spin,
  message,
  Input,
  Tabs,
  Space,
  Tag,
} from "antd";
import {
  InboxOutlined,
  CameraOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import type { JournalEntryType } from "@/app/types/accounting";
import type { UploadProps } from "antd";

const { Dragger } = Upload;
const { TextArea } = Input;

// 常用业务示例
const examples = [
  {
    text: "收到客户现金支付的咖啡费用 150 元",
    type: "现金收入",
  },
  {
    text: "通过微信收款 280 元",
    type: "移动支付",
  },
  {
    text: "支付本月房租 5000 元，使用银行转账",
    type: "费用支出",
  },
  {
    text: "采购咖啡豆，赊账 2000 元",
    type: "采购支出",
  },
  {
    text: "支付水电费 800 元，使用现金",
    type: "费用支出",
  },
  {
    text: "收到上月赊账客户还款 1500 元",
    type: "收回账款",
  },
  {
    text: "外卖平台收入 3200 元已到账",
    type: "平台收入",
  },
  {
    text: "购买新的咖啡机 12000 元，分期付款",
    type: "设备采购",
  },
];

interface SmartAccountingProps {
  onNewEntry: (entry: JournalEntryType) => void;
  entries: JournalEntryType[];
}

// 添加科目映射规则
const accountRules = {
  income: {
    keywords: ["收到", "收款", "收入", "营业额"],
    accounts: {
      cash: {
        keywords: ["现金"],
        debit: "现金",
        credit: "营业收入",
      },
      bank: {
        keywords: ["微信", "支付宝", "银行", "转账", "到账"],
        debit: "银行存款",
        credit: "营业收入",
      },
      receivable: {
        keywords: ["赊账", "应收"],
        debit: "应收账款",
        credit: "营业收入",
      },
    },
  },
  expense: {
    keywords: ["支付", "付款", "采购"],
    accounts: {
      rent: {
        keywords: ["房租"],
        debit: "费用",
        credit: "银行存款",
      },
      utility: {
        keywords: ["水电", "电费", "水费"],
        debit: "费用",
        credit: "现金",
      },
      purchase: {
        keywords: ["咖啡豆", "原料", "进货"],
        debit: "库存商品",
        credit: "应付账款",
      },
      equipment: {
        keywords: ["设备", "咖啡机", "家具"],
        debit: "固定资产",
        credit: "应付账款",
      },
    },
  },
};

export const SmartAccounting = ({
  onNewEntry,
  entries,
}: SmartAccountingProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<JournalEntryType | null>(null);
  const [textInput, setTextInput] = useState("");

  // 处理图片上传
  const handleUpload: UploadProps["customRequest"] = async (options) => {
    setLoading(true);
    setError(null);
    try {
      // 这里应该调用后端 API 进行图片识别和处理
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockEntry: JournalEntryType = {
        key: Date.now(),
        debitAccount: "库存商品",
        debitAmount: 150,
        creditAccount: "应付账款",
        creditAmount: 150,
        description: "采购咖啡豆 3kg",
        date: new Date().toISOString(),
      };

      setPreview(mockEntry);
      message.success("单据识别成功");
    } catch (err) {
      setError("单据识别失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 处理自然语言输入
  const handleTextProcess = async () => {
    if (!textInput.trim()) {
      message.warning("请输入业务描述");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 解析文本
      const entry = parseBusinessText(textInput);
      if (!entry) {
        throw new Error("无法识别业务类型，请检查输入");
      }

      setPreview(entry);
      message.success("已生成会计分录");
    } catch (err) {
      setError(err instanceof Error ? err.message : "处理失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 解析业务文本
  const parseBusinessText = (text: string): JournalEntryType | null => {
    // 提取金额
    const amountMatch = text.match(/\d+(\.\d+)?/);
    if (!amountMatch) {
      throw new Error("未能识别到金额");
    }
    const amount = parseFloat(amountMatch[0]);

    // 识别业务类型和科目
    let debitAccount = "";
    let creditAccount = "";
    let businessType = "";

    // 遍历规则匹配业务类型
    for (const [type, rule] of Object.entries(accountRules)) {
      if (rule.keywords.some((keyword) => text.includes(keyword))) {
        businessType = type;
        // 遍历科目规则
        for (const [accountType, accountRule] of Object.entries(
          rule.accounts
        )) {
          if (accountRule.keywords.some((keyword) => text.includes(keyword))) {
            debitAccount = accountRule.debit;
            creditAccount = accountRule.credit;
            break;
          }
        }
        break;
      }
    }

    if (!debitAccount || !creditAccount) {
      throw new Error("无法识别具体业务类型，请检查描述");
    }

    return {
      key: Date.now(),
      debitAccount,
      debitAmount: amount,
      creditAccount,
      creditAmount: amount,
      description: text.trim(),
      date: new Date().toISOString(),
    };
  };

  // 添加示例点击处理函数
  const handleExampleClick = (text: string) => {
    setTextInput(text);
  };

  // 确认记账
  const handleConfirm = () => {
    if (preview) {
      // 进行智能检查
      const checkResult = checkEntryValidity(preview);
      if (checkResult.hasError) {
        message.warning(checkResult.message);
        return;
      }

      onNewEntry(preview);
      setPreview(null);
      message.success("记账成功");
    }
  };

  // 智能检查函数
  const checkEntryValidity = (entry: JournalEntryType) => {
    // 1. 检查借贷是否平衡
    if (entry.debitAmount !== entry.creditAmount) {
      return {
        hasError: true,
        message: "借贷不平衡，请检查金额",
      };
    }

    // 2. 检查是否有重复记账
    const duplicateEntry = entries.find(
      (e) =>
        e.date.slice(0, 10) === entry.date.slice(0, 10) &&
        e.debitAccount === entry.debitAccount &&
        e.creditAccount === entry.creditAccount &&
        Math.abs(e.debitAmount - entry.debitAmount) < 0.01
    );

    if (duplicateEntry) {
      return {
        hasError: true,
        message: "发现可能重复的记账，请确认",
      };
    }

    // 3. 检查金额是否异常（比如超过历史平均值的3倍）
    const similarEntries = entries.filter(
      (e) =>
        e.debitAccount === entry.debitAccount &&
        e.creditAccount === entry.creditAccount
    );

    if (similarEntries.length > 0) {
      const avgAmount =
        similarEntries.reduce((sum, e) => sum + e.debitAmount, 0) /
        similarEntries.length;
      if (entry.debitAmount > avgAmount * 3) {
        return {
          hasError: true,
          message: "本次金额显著高于历史平均值，请确认",
        };
      }
    }

    return { hasError: false, message: "" };
  };

  const items = [
    {
      key: "1",
      label: "拍照记账",
      children: (
        <>
          <Dragger
            customRequest={handleUpload}
            showUploadList={false}
            accept="image/*"
            disabled={loading}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传单据照片</p>
            <p className="ant-upload-hint">
              支持发票、进货单、外卖平台流水等单据
            </p>
          </Dragger>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Button
              type="primary"
              icon={<CameraOutlined />}
              size="large"
              disabled={loading}
            >
              打开相机拍照
            </Button>
          </div>
        </>
      ),
    },
    {
      key: "2",
      label: "语音/文字记账",
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8, color: "#666" }}>常见业务示例：</div>
            <Space wrap size={[8, 16]} style={{ marginBottom: 16 }}>
              {examples.map((example, index) => (
                <Tag
                  key={index}
                  color="blue"
                  style={{ cursor: "pointer", padding: "4px 8px" }}
                  onClick={() => handleExampleClick(example.text)}
                >
                  {example.type}: {example.text}
                </Tag>
              ))}
            </Space>
          </div>
          <TextArea
            rows={4}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="请输入业务描述，或点击上方示例直接使用"
            style={{ marginBottom: 16 }}
          />
          <Button
            type="primary"
            icon={<RobotOutlined />}
            onClick={handleTextProcess}
            loading={loading}
          >
            生成会计分录
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Card title="智能记账">
        <Tabs defaultActiveKey="1" items={items} />

        {loading && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Spin tip={preview ? "正在智能检查..." : "正在处理..."} />
          </div>
        )}

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}

        {preview && (
          <Card title="识别结果" style={{ marginTop: 16 }}>
            <div>借方科目：{preview.debitAccount}</div>
            <div>借方金额：{preview.debitAmount}</div>
            <div>贷方科目：{preview.creditAccount}</div>
            <div>贷方金额：{preview.creditAmount}</div>
            <div>描述：{preview.description}</div>
            <div style={{ marginTop: 16 }}>
              <Button type="primary" onClick={handleConfirm}>
                确认记账
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setPreview(null);
                  setTextInput("");
                }}
              >
                取消
              </Button>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
};
