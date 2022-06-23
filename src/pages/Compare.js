import {
  Card,
  Col,
  DatePicker,
  Row,
  Segmented,
  Spin,
  Table,
  Tabs,
  Typography,
} from "antd";
import moment from "moment";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiUri } from "../appsettings";
import currencyContext from "../context/currency-context";
import { guid } from "../helpers/guid-v4";
import { useHttp } from "../hooks/http-hook";

const { TabPane } = Tabs;
const { Text } = Typography;

const periods = [
  { name: "Weekly", code: "week", format: "YYYY-wo" },
  { name: "Monthly", code: "month", format: "MMMM YYYY" },
  { name: "Quarterly", code: "quarter", format: "YYYY-\\QQ" },
  { name: "Yearly", code: "year", format: "YYYY" },
];

const cardStyle = {
  background: "var(--base-color-50)",
  padding: "0.25rem 1rem",
  marginTop: "2rem",
  border: "1px solid var(--base-color-200)",
};

const divider = {
  width: "100%",
  textAlign: "center",
  margin: "0.5rem 0",
  color: "var(--base-color-400)",
};

const dateStringStyle = {
  fontWeight: "bold",
};

const savedType = (amount) => {
  if (amount > 0) return "success";
  if (amount < 0) return "danger";
  return "secondary";
};

const Compare = () => {
  const { httpCall } = useHttp();

  // currency context
  const currencyCtx = useContext(currencyContext);
  const formatter = currencyCtx.formatter;

  const [searchPeriod, setSearchPeriod] = useState(periods[1].name);
  const [firstDate, setFirstDate] = useState(moment().subtract(1, "M"));
  const [secondDate, setSecondDate] = useState(moment());

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [firstDateSaved, setFirstDateSaved] = useState(0);
  const [secondDateSaved, setSecondDateSaved] = useState(0);

  const firstDateString =
    firstDate?.format(periods.find((x) => x.name === searchPeriod).format) ||
    "";

  const secondDateString =
    secondDate?.format(periods.find((x) => x.name === searchPeriod).format) ||
    "";

  const columns = useMemo(
    () => [
      {
        title: "Category",
        dataIndex: "category",
        sorter: (a, b, direction) => {
          if (direction === "descend")
            return a.category.toLowerCase() > b.category.toLowerCase();
          if (direction === "ascend")
            return a.category
              .toLowerCase()
              .localeCompare(b.category.toLowerCase());
        },
        sortDirections: ["descend", "ascend"],
        key: "category",
      },
      {
        title: firstDateString,
        dataIndex: "date1TotalAmount",
        sorter: (a, b, direction) => {
          if (direction === "descend")
            return a.date1TotalAmount > b.date1TotalAmount;
          if (direction === "ascend")
            return a.date1TotalAmount - b.date1TotalAmount;
        },
        sortDirections: ["descend", "ascend"],
        render: (amount) => formatter.format(amount),
        key: "date1",
      },
      {
        title: secondDateString,
        dataIndex: "date2TotalAmount",
        sorter: (a, b, direction) => {
          if (direction === "descend")
            return a.date2TotalAmount > b.date2TotalAmount;
          if (direction === "ascend")
            return a.date2TotalAmount - b.date2TotalAmount;
        },
        sortDirections: ["descend", "ascend"],
        render: (amount) => formatter.format(amount),
        key: "date2",
      },
    ],
    [firstDateString, formatter, secondDateString]
  );

  const fetchCompareData = useCallback(async () => {
    const date1 = firstDate.format("YYYY-MM-DD");
    const date2 = secondDate.format("YYYY-MM-DD");

    const url = `${apiUri}/compare/${searchPeriod}/${date1}/${date2}`;

    setLoading(true);

    try {
      const response = await httpCall(url);
      response.data = response?.data?.map((x) => ({ ...x, key: guid() }));

      const allIncomes = response?.data?.filter((x) => !x.isExpense);
      const allExpenses = response.data.filter((x) => x.isExpense);

      const inc1 = allIncomes
        .map((x) => x.date1TotalAmount)
        .reduce((a, b) => a + b, 0);

      const inc2 = allIncomes
        .map((x) => x.date2TotalAmount)
        .reduce((a, b) => a + b, 0);

      const exp1 = allExpenses
        .map((x) => x.date1TotalAmount)
        .reduce((a, b) => a + b, 0);

      const exp2 = allExpenses
        .map((x) => x.date2TotalAmount)
        .reduce((a, b) => a + b, 0);

      setIncomes(allIncomes);
      setExpenses(allExpenses);

      setFirstDateSaved(inc1 - exp1);
      setSecondDateSaved(inc2 - exp2);

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstDate, searchPeriod, secondDate]);

  useEffect(() => {
    fetchCompareData();
  }, [fetchCompareData]);

  return (
    <Card>
      <Segmented
        style={{ width: "100%" }}
        onChange={(period) => setSearchPeriod(period)}
        value={searchPeriod}
        options={periods.map((x) => x.name)}
      />

      <Row style={{ marginTop: "2rem" }}>
        <Col xs={24} sm={11}>
          <DatePicker
            style={{ width: "100%" }}
            allowClear={false}
            format={periods.find((x) => x.name === searchPeriod).format}
            onChange={(date) => setFirstDate(date)}
            value={firstDate}
            size="large"
            picker={periods.find((x) => x.name === searchPeriod).code}
          />
        </Col>
        <Col xs={24} sm={2}>
          <div style={divider}>vs</div>
        </Col>
        <Col xs={24} sm={11}>
          <DatePicker
            style={{ width: "100%" }}
            allowClear={false}
            format={periods.find((x) => x.name === searchPeriod).format}
            onChange={(date) => setSecondDate(date)}
            value={secondDate}
            size="large"
            picker={periods.find((x) => x.name === searchPeriod).code}
          />
        </Col>
      </Row>

      <div style={cardStyle}>
        <Spin size="medium" spinning={loading} delay={50}>
          <div>
            <span style={dateStringStyle}>{`${firstDateString}`}</span> You
            saved:{" "}
            <Text type={savedType(firstDateSaved)}>
              {formatter.format(firstDateSaved)}
            </Text>
          </div>
          <div>
            <span style={dateStringStyle}>{`${secondDateString}`}</span> You
            saved:{" "}
            <Text type={savedType(secondDateSaved)}>
              {formatter.format(secondDateSaved)}
            </Text>
          </div>
        </Spin>
      </div>

      <Tabs style={{ marginTop: "1rem" }}>
        <TabPane tab="Incomes" key="1">
          <Table
            dataSource={incomes}
            columns={columns}
            loading={loading}
            pagination={false}
            summary={(values) => {
              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <b>Total</b>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text type="success">
                        <b>
                          {formatter.format(
                            values
                              .map((x) => x.date1TotalAmount)
                              .reduce((a, b) => a + b, 0)
                          )}
                        </b>
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text type="success">
                        <b>
                          {formatter.format(
                            values
                              .map((x) => x.date2TotalAmount)
                              .reduce((a, b) => a + b, 0)
                          )}
                        </b>
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </TabPane>
        <TabPane tab="Expenses" key="2">
          <Table
            dataSource={expenses}
            columns={columns}
            loading={loading}
            pagination={false}
            summary={(values) => {
              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <b>Total</b>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text type="danger">
                        <b>
                          {formatter.format(
                            values
                              .map((x) => x.date1TotalAmount)
                              .reduce((a, b) => a + b, 0)
                          )}
                        </b>
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text type="danger">
                        <b>
                          {formatter.format(
                            values
                              .map((x) => x.date2TotalAmount)
                              .reduce((a, b) => a + b, 0)
                          )}
                        </b>
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Compare;
