import { Card, DatePicker, Empty, List, Spin, Tag, Typography } from "antd";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import moment from "moment";
import { useCallback, useContext, useEffect, useState } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { apiUri } from "../appsettings";
import currencyContext from "../context/currency-context";
import { useHttp } from "../hooks/http-hook";

const { RangePicker } = DatePicker;
const { Text } = Typography;

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const sortByDate = (a, b) => {
  return new Date(b.transactionDate) - new Date(a.transactionDate);
};

const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

var groupBy = (xs, key) =>
  xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});

var randomColors = (numberOfColors) => {
  const colors = [
    "rgb(255, 99, 132)",
    "rgb(54, 162, 235)",
    "rgb(255, 206, 86)",
    "rgb(75, 192, 192)",
    "rgb(153, 102, 255)",
    "rgb(255, 159, 64)",
  ];

  if (numberOfColors >= colors.length) return colors;

  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  for (let i = 0; i < numberOfColors; i++) {
    const r = randomInt(50, 255);
    const g = randomInt(50, 255);
    const b = randomInt(50, 255);

    colors.push(`rgb(${r},${g},${b})`);
  }

  return colors;
};

export const lineOptions = { responsive: true };

const stackedOptions = {
  responsive: true,
  interaction: { mode: "index", intersect: false },
  scales: {
    x: { stacked: true },
    y: { stacked: true },
  },
};

const titleStyle = {
  margin: "2rem 0",
  textAlign: "center",
};

const listItemStyles = {
  padding: "1rem",
  display: "flex",
  gap: 10,
  alignContent: "space-between",
};

const listItemFragmentStyle = {
  flexGrow: 1,
  flexBasis: 0,
  marginTop: "auto",
};

const title = <div style={{ textAlign: "center" }}>Statistics</div>;

const Statistics = () => {
  const { httpCall } = useHttp();

  // currency context
  const currencyCtx = useContext(currencyContext);
  const formatter = currencyCtx.formatter;

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [dates, setDates] = useState([moment().startOf("month"), moment()]);

  const [doughnutIncomesExpenses, setDoughnutIncomesExpenses] = useState({
    labels: ["Incomes", "Expenses"],
    datasets: [],
  });

  const [stackedIncomesExpenses, setStackedIncomesExpenses] = useState({
    labels: [],
    datasets: [],
  });

  const [lineIncomesExpenses, setLineIncomesExpenses] = useState({
    labels: [],
    datasets: [],
  });

  const [categoriesIncomes, setCategoriesIncomes] = useState({
    labels: [],
    datasets: [],
  });

  const [categoriesExpenses, setCategoriesExpenses] = useState({
    labels: [],
    datasets: [],
  });

  const fetchTransaction = useCallback(async () => {
    const from = dates[0].format("YYYY-MM-DD");
    const to = dates[1].format("YYYY-MM-DD");
    const pagination = `pageNumber=${1}&pageSize=${500}`;
    const url = `${apiUri}/transactions?${pagination}&createdFrom=${from}&createdTo=${to}`;

    setLoading(true);

    try {
      const response = await httpCall(url);

      const transactions = response?.data
        ?.map((x) => ({ ...x, categoryName: x.category.name }))
        .sort(sortByDate)
        .reverse();

      setTransactions(transactions);

      const incomes = transactions?.filter((x) => !x.isExpense);
      const expenses = transactions?.filter((x) => x.isExpense);

      setDoughnutIncomesExpenses({
        ...doughnutIncomesExpenses,
        datasets: [
          {
            data: [
              incomes.map((x) => x.amount).reduce((a, b) => a + b, 0),
              expenses.map((x) => x.amount).reduce((a, b) => a + b, 0),
            ],
            backgroundColor: ["rgba(75, 192, 192)", "rgba(255, 99, 132)"],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
          },
        ],
      });

      const incomesGroupByDate = groupBy(incomes, "transactionDate");
      const sumsIncomes = [];

      for (var dateIncome in incomesGroupByDate) {
        sumsIncomes.push(
          incomesGroupByDate[dateIncome]
            .map((x) => x.amount)
            .reduce((a, b) => a + b, 0)
        );
      }

      const expensesGroupByDate = groupBy(expenses, "transactionDate");
      const sumsExpenses = [];
      const sumsExpensesNegatives = [];

      for (var dateExpense in expensesGroupByDate) {
        const value = expensesGroupByDate[dateExpense]
          .map((x) => x.amount)
          .reduce((a, b) => a + b, 0);
        sumsExpenses.push(value);
        sumsExpensesNegatives.push(-value);
      }

      setStackedIncomesExpenses({
        labels: transactions
          .map((x) => moment(x.transactionDate).format("YYYY-DD-MM"))
          .filter(unique),
        datasets: [
          {
            label: "Incomes",
            data: sumsIncomes,
            backgroundColor: "rgb(75, 192, 192)",
            stack: "Stack 0",
          },
          {
            label: "Expenses",
            data: sumsExpensesNegatives,
            backgroundColor: "rgb(255, 99, 132)",
            stack: "Stack 0",
          },
        ],
      });

      setLineIncomesExpenses({
        labels: transactions
          .map((x) => moment(x.transactionDate).format("YYYY-DD-MM"))
          .filter(unique),
        datasets: [
          {
            label: "Incomes",
            data: sumsIncomes,
            borderColor: "rgba(75, 192, 192, 0.5)",
            backgroundColor: "rgb(75, 192, 192)",
          },
          {
            label: "Expenses",
            data: sumsExpenses,
            borderColor: "rgba(255, 99, 132, 0.2)",
            backgroundColor: "rgb(255, 99, 132)",
          },
        ],
      });

      const incomesGroupByCategories = groupBy(incomes, "categoryName");
      const sumsCategoriesIncomes = [];
      const incomeLabels = [];

      for (var categoryIncomes in incomesGroupByCategories) {
        incomeLabels.push(categoryIncomes);
        sumsCategoriesIncomes.push(
          incomesGroupByCategories[categoryIncomes]
            .map((x) => x.amount)
            .reduce((a, b) => a + b, 0)
        );
      }

      const expensesGroupByCategories = groupBy(expenses, "categoryName");
      const sumsCategoriesExpenses = [];
      const expenseLabels = [];

      for (var categoryExpenses in expensesGroupByCategories) {
        expenseLabels.push(categoryExpenses);
        sumsCategoriesExpenses.push(
          expensesGroupByCategories[categoryExpenses]
            .map((x) => x.amount)
            .reduce((a, b) => a + b, 0)
        );
      }

      setCategoriesIncomes({
        labels: incomeLabels,
        datasets: [
          {
            data: sumsCategoriesIncomes,
            backgroundColor: randomColors(incomeLabels.length),
          },
        ],
      });

      setCategoriesExpenses({
        labels: expenseLabels,
        datasets: [
          {
            data: sumsCategoriesExpenses,
            backgroundColor: randomColors(expenseLabels.length),
          },
        ],
      });

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  const TransactionItem = ({ transaction }) => (
    <List.Item key={transaction.id} style={listItemStyles}>
      <div style={listItemFragmentStyle}>
        {moment(transaction.transactionDate).format("YYYY-MM-DD")}
      </div>
      <div style={listItemFragmentStyle}>
        <Tag color="blue">{transaction.category.name}</Tag>
      </div>
      <div style={listItemFragmentStyle}>{transaction.description}</div>
      <div style={listItemFragmentStyle}>
        <Text type={transaction.isExpense ? "danger" : "success"}>
          {formatter.format(transaction.amount)}
        </Text>
      </div>
    </List.Item>
  );

  return (
    <Card title={title} style={{ paddingBottom: "2rem" }}>
      <RangePicker
        style={{ width: "100%" }}
        size="large"
        allowClear={false}
        value={dates}
        onChange={(array) => setDates(array)}
      />

      <Spin size="large" spinning={loading} delay={50}>
        {transactions.length === 0 && <Empty style={{ marginTop: "3rem" }} />}

        {transactions.length > 0 && (
          <>
            <List
              style={{ marginTop: "2rem" }}
              size="large"
              dataSource={transactions}
              renderItem={(item) => <TransactionItem transaction={item} />}
            />

            <Typography.Title style={titleStyle} level={5}>
              Income vs Expenses
            </Typography.Title>

            <Doughnut
              style={{ margin: "0 2rem" }}
              data={doughnutIncomesExpenses}
            />

            <Bar
              style={{ marginTop: "1rem" }}
              options={stackedOptions}
              data={stackedIncomesExpenses}
            />

            <Line
              style={{ marginTop: "1rem" }}
              options={lineOptions}
              data={lineIncomesExpenses}
            />

            <Typography.Title style={titleStyle} level={5}>
              Categories (Incomes)
            </Typography.Title>

            <Pie style={{ margin: "0 2rem" }} data={categoriesIncomes} />

            <Typography.Title style={titleStyle} level={5}>
              Categories (Expenses)
            </Typography.Title>

            <Pie style={{ margin: "0 2rem" }} data={categoriesExpenses} />
          </>
        )}
      </Spin>
    </Card>
  );
};

export default Statistics;
