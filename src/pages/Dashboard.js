import {
  CaretLeftOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Collapse,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { apiUri } from "../appsettings";
import currencyContext from "../context/currency-context";
import { useHttp } from "../hooks/http-hook";

const { Title } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;

const transactionCardStyle = {
  marginTop: "1rem",
  background: "#fefefe",
  padding: "0.5rem 1rem",
  borderRadius: "0.2rem",
  border: "1px solid var(--base-color-200)",
};

const transactionButtonsLayoutStyle = {
  display: "flex",
  flexDirection: "row-reverse",
  gap: 10,
};

const greaterThanZero = () => ({
  validator(_, value) {
    const error = "must be greater than zero";
    return value <= 0 ? Promise.reject(error) : Promise.resolve();
  },
});

const Dashboard = () => {
  // A positive integer value which identifies
  // the timer created by the call to setTimeout()
  const timeout = useRef();

  const { httpCall } = useHttp();

  const [date, setDate] = useState(moment());
  const [loading, setLoading] = useState(false);

  // currency context
  const currencyCtx = useContext(currencyContext);
  const formatter = currencyCtx.formatter;
  const currencyParser = currencyCtx.currencyParser;

  // balance
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // incomes
  const [incomesForm] = Form.useForm();
  const [incomes, setIncomes] = useState([]);
  const [incomesFormData, setIncomesFormData] = useState({});
  const [incomesDisabled, setIncomesDisabled] = useState(true);
  const [incomesLoading, setIncomesLoading] = useState(false);
  const [incomesModalVisibility, setIncomesModalVisibility] = useState(false);

  // expenses
  const [expensesForm] = Form.useForm();
  const [expenses, setExpenses] = useState([]);
  const [expensesFormData, setExpensesFormData] = useState({});
  const [expensesDisabled, setExpensesDisabled] = useState(true);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [expensesModalVisibility, setExpensesModalVisibility] = useState(false);

  useEffect(() => {
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const expensesHeader = (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ flexGrow: 1 }}>EXPENSES</div>
      <div style={{ fontWeight: "bold", color: "#ef4444" }}>
        {formatter.format(
          expenses.map((i) => i.amount).reduce((a, b) => a + b, 0) || 0
        )}
      </div>
    </div>
  );

  const incomesHeader = (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ flexGrow: 1 }}>INCOME</div>
      <div style={{ fontWeight: "bold", color: "#22c55e" }}>
        {formatter.format(
          incomes.map((i) => i.amount).reduce((a, b) => a + b, 0) || 0
        )}
      </div>
    </div>
  );

  const expensesItems = expenses.map((expense) => (
    <div key={expense.id} style={transactionCardStyle}>
      {/* Description */}
      <Title level={4}>
        {expense.description}: {formatter.format(expense.amount)}
      </Title>
      <Tag style={{ marginBottom: "0.5rem" }} color="blue">
        {expense.category.name}
      </Tag>

      {/* Comments */}
      {expense?.comments?.length > 500 && (
        <Collapse defaultActiveKey={["1"]} ghost>
          <Panel header="comment" key="1">
            {expense.comments}
          </Panel>
        </Collapse>
      )}
      {expense?.comments?.length <= 500 && <div>{expense.comments}</div>}
      {/* Buttons */}
      <div style={transactionButtonsLayoutStyle}>
        <Popconfirm
          title="Delete?"
          okText="Yes"
          onConfirm={() => deleteExpense(expense.id)}
          cancelText="No"
        >
          <Button danger>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
        <Tooltip placement="top" title="Edit">
          <Button onClick={() => editExpense(expense)}>
            <EditOutlined />
          </Button>
        </Tooltip>
      </div>
    </div>
  ));

  const incomesItems = incomes.map((income) => (
    <div key={income.id} style={transactionCardStyle}>
      {/* Description */}
      <Title level={4}>
        {income.description}: {formatter.format(income.amount)}
      </Title>
      <Tag style={{ marginBottom: "0.5rem" }} color="blue">
        {income.category.name}
      </Tag>

      {/* Comments */}
      {income?.comments?.length > 500 && (
        <Collapse defaultActiveKey={["1"]} ghost>
          <Panel header="comment" key="1">
            {income.comments}
          </Panel>
        </Collapse>
      )}
      {income?.comments?.length <= 500 && <div>{income.comments}</div>}
      {/* Buttons */}
      <div style={transactionButtonsLayoutStyle}>
        <Popconfirm
          title="Delete?"
          okText="Yes"
          onConfirm={() => deleteIncome(income.id)}
          cancelText="No"
        >
          <Button danger>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
        <Tooltip placement="top" title="Edit">
          <Button onClick={() => editIncome(income)}>
            <EditOutlined />
          </Button>
        </Tooltip>
      </div>
    </div>
  ));

  const onDateChange = (date) => setDate(date);
  const previousMonth = () => setDate(moment(date).subtract(1, "months"));
  const nextMonth = () => setDate(moment(date).add(1, "months"));

  const getBalance = async () => {
    const url = `${apiUri}/transactions/balance`;
    setBalanceLoading(true);
    try {
      const response = await httpCall(url);
      setBalance(response.data);
      setBalanceLoading(false);
    } catch (e) {
      setBalanceLoading(false);
    }
  };

  const getTransactions = async () => {
    if (!date) return;
    const isoDate = date.toISOString();
    const pagination = `pageNumber=${1}&pageSize=${50}`;
    const dateRanges = `createdFrom=${isoDate}&createdTo=${isoDate}&ignoreDays=true`;
    const url = `${apiUri}/transactions?${pagination}&${dateRanges}`;
    setLoading(true);
    try {
      const response = await httpCall(url);
      setExpenses(response.data.filter((x) => x.isExpense === true));
      setIncomes(response.data.filter((x) => x.isExpense === false));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const searchCategories = (value) => {
    // Clear the previous timeout
    clearTimeout(timeout.current);
    // Debouncing fetch
    timeout.current = setTimeout(async () => {
      await getCategories(value);
    }, 500);
  };

  const getCategories = async (filter = "") => {
    let url = `${apiUri}/transaction-categories?pageNumber=${1}&pageSize=${50}`;
    if (filter !== "") url += `&name=${filter}`;
    setCategoriesLoading(true);
    try {
      const response = await httpCall(url);
      setCategories(response.data);
      setCategoriesLoading(false);
    } catch (e) {
      setCategoriesLoading(false);
    }
  };

  const editExpense = async (expense) => {
    const mappedExpense = {
      amount: expense.amount,
      category: JSON.stringify(expense.category),
      comments: expense.comments,
      createdAt: expense.createdAt,
      description: expense.description,
      id: expense.id,
      isExpense: expense.isExpense,
      userId: expense.isExpense,
    };

    // reset categories to only have one item.
    setCategories([expense.category]);
    // save default values.
    setExpensesFormData(mappedExpense);
    // make form clean.
    setExpensesDisabled(true);
    // add values to form.
    expensesForm.setFieldsValue(mappedExpense);
    // make modal visible
    setExpensesModalVisibility(true);
  };

  const editIncome = async (income) => {
    const mappedIncome = {
      amount: income.amount,
      category: JSON.stringify(income.category),
      comments: income.comments,
      createdAt: income.createdAt,
      description: income.description,
      id: income.id,
      isExpense: income.isExpense,
      userId: income.isExpense,
    };

    // reset categories to only have one item.
    setCategories([income.category]);
    // save default values.
    setIncomesFormData(mappedIncome);
    // make form clean.
    setIncomesDisabled(true);
    // add values to form.
    incomesForm.setFieldsValue(mappedIncome);
    // make modal visible
    setIncomesModalVisibility(true);
  };

  const showExpensesModal = async () => {
    await getCategories();
    setExpensesModalVisibility(true);
  };

  const showIncomesModal = async () => {
    await getCategories();
    setIncomesModalVisibility(true);
  };

  const saveExpense = async () => {
    const expense = await expensesForm.validateFields();

    if (typeof expense.category === "string")
      expense.category = JSON.parse(expense.category);

    if (!expense.id) await createExpense(expense);
    else await updateExpense(expense);

    await getBalance();
  };

  const saveIncome = async () => {
    const income = await incomesForm.validateFields();

    if (typeof income.category === "string")
      income.category = JSON.parse(income.category);

    if (!income.id) await createIncome(income);
    else await updateIncome(income);

    await getBalance();
  };

  const deleteExpense = async (id) => {
    try {
      message.loading({ content: "Deleting...", key: "updatable" });
      const url = `${apiUri}/transactions/${id}`;
      await httpCall(url, { method: "DELETE" });
      message.success({ content: "Deleted", key: "updatable", duration: 2 });
      setExpenses((prev) => prev.filter((i) => i.id !== id));
      await getBalance();
    } catch (e) {}
  };

  const deleteIncome = async (id) => {
    try {
      message.loading({ content: "Deleting...", key: "updatable" });
      const url = `${apiUri}/transactions/${id}`;
      await httpCall(url, { method: "DELETE" });
      message.success({ content: "Deleted", key: "updatable", duration: 2 });
      setIncomes((prev) => prev.filter((i) => i.id !== id));
      await getBalance();
    } catch (e) {}
  };

  const updateExpense = async (expense) => {
    try {
      setExpensesLoading(true);
      const url = `${apiUri}/transactions/${expense.id}`;
      const response = await httpCall(url, {
        method: "PUT",
        body: JSON.stringify({
          description: expense.description,
          categoryId: expense.category.id,
          amount: expense.amount,
          comments: expense.comments,
        }),
      });
      setExpensesLoading(false);
      message.success({ content: "Updated", duration: 2 });
      updateExpensesStates(response.data);
    } catch (e) {
      setExpensesLoading(false);
    }
  };

  const updateIncome = async (income) => {
    try {
      setIncomesLoading(true);
      const url = `${apiUri}/transactions/${income.id}`;
      const response = await httpCall(url, {
        method: "PUT",
        body: JSON.stringify({
          description: income.description,
          categoryId: income.category.id,
          amount: income.amount,
          comments: income.comments,
        }),
      });
      setIncomesLoading(false);
      message.success({ content: "Updated", duration: 2 });
      updateIncomesStates(response.data);
    } catch (e) {
      setIncomesLoading(false);
    }
  };

  const createExpense = async (expense) => {
    try {
      setExpensesLoading(true);
      const url = `${apiUri}/transactions`;
      const response = await httpCall(url, {
        method: "POST",
        body: JSON.stringify({
          transactionDate: date.toISOString(),
          description: expense.description,
          categoryId: expense.category.id,
          amount: expense.amount,
          comments: expense.comments,
          isExpense: true,
        }),
      });
      setExpensesLoading(false);
      message.success({ content: "Inserted", duration: 2 });
      updateExpensesStates(response.data);
    } catch (e) {
      setExpensesLoading(false);
    }
  };

  const createIncome = async (income) => {
    try {
      setIncomesLoading(true);
      const url = `${apiUri}/transactions`;
      const response = await httpCall(url, {
        method: "POST",
        body: JSON.stringify({
          transactionDate: date.toISOString(),
          description: income.description,
          categoryId: income.category.id,
          amount: income.amount,
          comments: income.comments,
          isExpense: false,
        }),
      });
      setIncomesLoading(false);
      message.success({ content: "Inserted", duration: 2 });
      updateIncomesStates(response.data);
    } catch (e) {
      setIncomesLoading(false);
    }
  };

  const updateExpensesStates = (expense) => {
    const newExpenses = arrayUpdateItem(expenses, expense);
    setExpenses(newExpenses);
    // reset fields;
    expensesForm.resetFields();
    // reset default values.
    setExpensesFormData({});
    // make form clean.
    setExpensesDisabled(true);
    // hide modal
    setExpensesModalVisibility(false);
  };

  const updateIncomesStates = (income) => {
    const newIncomes = arrayUpdateItem(incomes, income);
    setIncomes(newIncomes);
    // reset fields;
    incomesForm.resetFields();
    // reset default values.
    setIncomesFormData({});
    // make form clean.
    setIncomesDisabled(true);
    // hide modal
    setIncomesModalVisibility(false);
  };

  const arrayUpdateItem = (array, newItem) => {
    const newArray = [...array];
    const index = newArray.findIndex((item) => item.id === newItem.id);
    // this is a newly created record
    if (index === -1) {
      newArray.unshift(newItem);
      return newArray;
    }
    const item = newArray[index];
    newArray.splice(index, 1, { ...item, ...newItem });
    return newArray;
  };

  const onExpensesFormValueChange = () => {
    var description = expensesForm.getFieldValue("description");
    var category = expensesForm.getFieldValue("category");
    var amount = expensesForm.getFieldValue("amount");
    var comments = expensesForm.getFieldValue("comments");
    var createdAt = expensesForm.getFieldValue("createdAt");
    var userId = expensesForm.getFieldValue("userId");
    var id = expensesForm.getFieldValue("id");
    var isExpense = expensesForm.getFieldValue("isExpense");

    if (description === "") description = undefined;
    if (category === "") category = undefined;
    if (amount === "") amount = undefined;
    if (comments === "") comments = undefined;
    if (createdAt === "") createdAt = undefined;
    if (userId === "") userId = undefined;
    if (id === "") id = undefined;
    if (isExpense === "") isExpense = undefined;

    const currentValue_JSON = JSON.stringify({
      amount,
      category,
      comments,
      createdAt,
      description,
      id,
      isExpense,
      userId,
    });

    const formData_JSON = JSON.stringify(expensesFormData);
    if (currentValue_JSON !== formData_JSON) {
      setExpensesDisabled(false);
    } else {
      setExpensesDisabled(true);
    }
  };

  const onIncomesFormValueChange = () => {
    var description = incomesForm.getFieldValue("description");
    var category = incomesForm.getFieldValue("category");
    var amount = incomesForm.getFieldValue("amount");
    var comments = incomesForm.getFieldValue("comments");
    var createdAt = incomesForm.getFieldValue("createdAt");
    var userId = incomesForm.getFieldValue("userId");
    var id = incomesForm.getFieldValue("id");
    var isExpense = incomesForm.getFieldValue("isExpense");

    if (description === "") description = undefined;
    if (category === "") category = undefined;
    if (amount === "") amount = undefined;
    if (comments === "") comments = undefined;
    if (createdAt === "") createdAt = undefined;
    if (userId === "") userId = undefined;
    if (id === "") id = undefined;
    if (isExpense === "") isExpense = undefined;

    const currentValue_JSON = JSON.stringify({
      amount,
      category,
      comments,
      createdAt,
      description,
      id,
      isExpense,
      userId,
    });

    const formData_JSON = JSON.stringify(incomesFormData);
    if (currentValue_JSON !== formData_JSON) {
      setIncomesDisabled(false);
    } else {
      setIncomesDisabled(true);
    }
  };

  const expenseCancel = () => {
    expensesForm.resetFields();
    setExpensesFormData({});
    setExpensesDisabled(true);
    setExpensesModalVisibility(false);
  };

  const incomeCancel = () => {
    incomesForm.resetFields();
    setIncomesFormData({});
    setIncomesDisabled(true);
    setIncomesModalVisibility(false);
  };

  return (
    <Card>
      <Card style={{ background: "var(--base-color-50)" }}>
        <Title level={3} style={{ margin: 0 }}>
          Balance{" "}
          <span style={{ color: "var(--secondary-color-500)" }}>
            {balanceLoading && <Spin />}
            {!balanceLoading && formatter.format(balance)}
          </span>
        </Title>
      </Card>

      <div style={{ display: "flex", marginTop: "1rem" }}>
        <Tooltip placement="top" title="Previous">
          <Button size="large" onClick={previousMonth} disabled={!date}>
            <CaretLeftOutlined />
          </Button>
        </Tooltip>
        <DatePicker
          format="MMMM YYYY"
          value={date}
          style={{ flexGrow: "1", margin: "0 0.5rem" }}
          size="large"
          superNextIcon
          onChange={onDateChange}
        />
        <Tooltip placement="top" title="Next">
          <Button size="large" onClick={nextMonth} disabled={!date}>
            <CaretRightOutlined />
          </Button>
        </Tooltip>
      </div>

      <Collapse style={{ marginTop: "2rem" }} defaultActiveKey={["1"]}>
        <Panel header={incomesHeader} activeKey={["1"]} key="1">
          {/* Add Income button */}
          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Tooltip placement="right" title="Add Income">
              <Button
                type="primary"
                onClick={showIncomesModal}
                disabled={loading}
              >
                <PlusOutlined />
              </Button>
            </Tooltip>
          </div>

          {/* Content */}
          <Skeleton loading={loading} active />
          {!loading && incomes?.length < 1 && <Empty />}
          {!loading && incomes?.length > 0 && incomesItems}

          {/* Modal */}
          <Modal
            title="Add new Income Item"
            visible={incomesModalVisibility}
            maskClosable={false}
            onOk={saveIncome}
            okButtonProps={{
              loading: incomesLoading,
              disabled: incomesDisabled,
            }}
            onCancel={incomeCancel}
          >
            <Form
              form={incomesForm}
              layout="vertical"
              autoComplete="off"
              onValuesChange={onIncomesFormValueChange}
            >
              {/* hidden properties */}
              <Form.Item name="id" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Form.Item name="createdAt" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Form.Item name="isExpense" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Form.Item name="userId" style={{ display: "none" }}>
                <Input />
              </Form.Item>

              {/* visible properties */}
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  loading={categoriesLoading}
                  allowClear
                  placeholder="search categories..."
                  onSearch={searchCategories}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {categories?.map((c) => (
                    <Option key={c.id} value={JSON.stringify(c)}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true }, greaterThanZero]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) => {
                    if (value.trim() === "") return "";
                    return formatter.format(value);
                  }}
                  parser={(value) => currencyParser(value)}
                />
              </Form.Item>

              <Form.Item label="Comments" name="comments">
                <TextArea rows={4} />
              </Form.Item>
            </Form>
          </Modal>
        </Panel>
      </Collapse>

      <Collapse style={{ marginTop: "2rem" }} defaultActiveKey={["1"]}>
        <Panel header={expensesHeader} activeKey={["1"]} key="1">
          {/* Add Expense button */}
          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Tooltip placement="right" title="Add Expense">
              <Button
                type="primary"
                onClick={showExpensesModal}
                disabled={loading}
              >
                <PlusOutlined />
              </Button>
            </Tooltip>
          </div>

          {/* Content */}
          <Skeleton loading={loading} active />
          {!loading && expenses?.length < 1 && <Empty />}
          {!loading && expenses?.length > 0 && expensesItems}

          {/* Modal */}
          <Modal
            title="Add new Expense Item"
            visible={expensesModalVisibility}
            maskClosable={false}
            onOk={saveExpense}
            okButtonProps={{
              loading: expensesLoading,
              disabled: expensesDisabled,
            }}
            onCancel={expenseCancel}
          >
            <Form
              form={expensesForm}
              layout="vertical"
              autoComplete="off"
              onValuesChange={onExpensesFormValueChange}
            >
              {/* hidden properties */}
              <Form.Item name="id" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Form.Item name="createdAt" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Form.Item name="isExpense" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Form.Item name="userId" style={{ display: "none" }}>
                <Input />
              </Form.Item>

              {/* visible properties */}
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  loading={categoriesLoading}
                  allowClear
                  placeholder="search categories..."
                  onSearch={searchCategories}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {categories?.map((c) => (
                    <Option key={c.id} value={JSON.stringify(c)}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true }, greaterThanZero]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) => {
                    if (value.trim() === "") return "";
                    return formatter.format(value);
                  }}
                  parser={(value) => currencyParser(value)}
                />
              </Form.Item>

              <Form.Item label="Comments" name="comments">
                <TextArea rows={4} />
              </Form.Item>
            </Form>
          </Modal>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default Dashboard;
