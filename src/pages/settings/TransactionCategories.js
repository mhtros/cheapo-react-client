import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  Pagination,
  Popconfirm,
  Table,
  Tooltip,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { apiUri } from "../../appsettings";
import { EditableCell, EditableRow } from "../../components/UI/EditableContext";
import { guid } from "../../helpers/guid-v4";
import { successToast } from "../../helpers/toasts";
import { useHttp } from "../../hooks/http-hook";

const TransactionCategories = () => {
  // A positive integer value which identifies
  // the timer created by the call to setTimeout()
  const timeout = useRef();

  const { httpCall } = useHttp();

  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [namefilter, setNameFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTransactionCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namefilter]);

  const getTransactionCategories = async (pageNumber = 1, pageSize = 10) => {
    let url = `${apiUri}/transaction-categories?userOnly=true&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (namefilter !== "") url += `&name=${namefilter}`;
    try {
      setLoading(true);
      const response = await httpCall(url);
      setPagination(response.pagination);

      const records = response.data?.map((x) => ({
        name: x.name,
        id: x.id,
        userId: x.userId,
        key: guid(),
      }));

      setCategories(records);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const deleteTransactionCategory = async (category) => {
    try {
      setLoading(true);
      const url = `${apiUri}/transaction-categories/${category.id}`;
      await httpCall(url, { method: "DELETE" });
      successToast("Deleted");
      removeFromList(category);
      setLoading(false);
    } catch (ex) {
      setLoading(false);
    }
  };

  const addCategory = () => {
    const category = { name: "Enter a value...", id: null, key: guid() };
    setCategories((prev) => [category, ...prev]);
  };

  const deleteCategory = async (category) => {
    if (category.id !== null) await deleteTransactionCategory(category);
    else removeFromList(category);
  };

  const removeFromList = (category) =>
    setCategories(categories.filter((x) => x.name !== category.name));

  const saveCategory = async (category) => {
    try {
      setLoading(true);
      const url = `${apiUri}/transaction-categories`;

      const response = await httpCall(url, {
        method: "POST",
        body: JSON.stringify({ name: category.name }),
      });

      successToast("Ceated");
      handleSave(response.data, category.key);
      setLoading(false);
    } catch (ex) {
      setLoading(false);
    }
  };

  const onFilterChange = (event) => {
    // Clear the previous timeout
    clearTimeout(timeout.current);
    // Debouncing fetch
    timeout.current = setTimeout(() => setNameFilter(event.target.value), 500);
  };

  const onPaginationChange = (pageNumber, pageSize) =>
    getTransactionCategories(pageNumber, pageSize);

  const showTotal = (total) => `Total ${total} items`;

  const defaultColumns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name < b.name,
      sortDirections: ["descend"],
      editable: true,
    },
    {
      dataIndex: "operation",
      width: "20px",
      render: (_, record) =>
        categories.length >= 1 ? (
          <>
            {record.id === null && (
              <Tooltip placement="top" title="save">
                <Button
                  style={{ marginBottom: "1rem" }}
                  onClick={() => saveCategory(record)}
                >
                  <SaveOutlined />
                </Button>
              </Tooltip>
            )}
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => deleteCategory(record)}
            >
              <Button danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </>
        ) : null,
    },
  ];

  const handleSave = (category, key = null) => {
    const newCategories = [...categories];
    const index = newCategories.findIndex(
      (item) => category.key === key || item.key
    );
    const item = newCategories[index];
    newCategories.splice(index, 1, { ...item, ...category });
    setCategories(newCategories);
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const components = { body: { row: EditableRow, cell: EditableCell } };

  const cardTitle = (
    <div style={{ textAlign: "center" }}>Transaction Categories</div>
  );

  return (
    <Card title={cardTitle}>
      <Input
        allowClear
        onChange={onFilterChange}
        style={{ marginBottom: "1rem" }}
        size="large"
        placeholder="search..."
      />
      <Tooltip placement="right" title="Add category">
        <Button
          type="primary"
          onClick={addCategory}
          style={{ marginBottom: "1rem" }}
        >
          <PlusOutlined />
        </Button>
      </Tooltip>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        loading={loading}
        bordered
        dataSource={categories}
        columns={columns}
        pagination={false}
      />
      <Pagination
        disabled={loading}
        style={{ marginTop: "1rem" }}
        className="pagination"
        responsive={true}
        pageSizeOptions={[5, 10, 20, 50]}
        showQuickJumper
        showTotal={showTotal}
        defaultCurrent={pagination.currentPage}
        total={pagination.totalItems}
        onChange={onPaginationChange}
      />
    </Card>
  );
};

export default TransactionCategories;
