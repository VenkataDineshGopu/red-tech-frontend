import React, { useState, useEffect } from "react";
import { Order } from "../types/order";
import {
  Button,
  Checkbox,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { parse, format, isValid } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import { updateOrder } from "../services/api";
import "./OrderList.css";

const OrderList: React.FC<{
  orders: Order[];
  onDelete: () => void;
  onEdit: () => void;
  selectedOrders: Set<string>;
  setSelectedOrders: React.Dispatch<React.SetStateAction<Set<string>>>;
}> = ({ orders, onDelete, onEdit, selectedOrders, setSelectedOrders }) => {
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);

  useEffect(() => {
    console.log("Orders updated: ", orders);
  }, [orders]);

  const handleSelect = (orderId: string) => {
    console.log(`Toggling selection for order with orderId: ${orderId}`);
    setSelectedOrders((prevSelectedOrders) => {
      const newSelectedOrders = new Set(prevSelectedOrders);
      if (newSelectedOrders.has(orderId)) {
        newSelectedOrders.delete(orderId);
      } else {
        newSelectedOrders.add(orderId);
      }
      console.log(
        `Current selected orders: ${Array.from(newSelectedOrders).join(", ")}`
      );
      return newSelectedOrders;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders(new Set());
    } else {
      const allOrderIds = orders.map((order) => order.orderId);
      setSelectedOrders(new Set(allOrderIds));
    }
    setSelectAll(!selectAll);
  };

  const handleEdit = (order: Order) => {
    setEditOrderId(order.orderId);
    setEditOrder(order);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    if (editOrder) {
      const { name, value } = e.target;
      setEditOrder({ ...editOrder, [name as string]: value });
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (editOrder && date) {
      const isoString = date.toISOString();
      console.log("New date set:", isoString);
      setEditOrder({
        ...editOrder,
        createdDate: isoString,
      });
    }
  };

  const handleOrderTypeChange = (event: SelectChangeEvent<string>) => {
    if (editOrder) {
      setEditOrder({ ...editOrder, orderType: event.target.value });
    }
  };

  const handleEditSubmit = async () => {
    if (editOrder) {
      try {
        const payload: Order = {
          ...editOrder,
          createdDate: editOrder.createdDate || new Date().toISOString(),
        };
        console.log("Updating order with data:", payload);
        await updateOrder(payload);
        setEditOrderId(null);
        setEditOrder(null);
        onEdit();
      } catch (error) {
        console.error("Error updating order:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditOrderId(null);
    setEditOrder(null);
  };

  const parseDate = (dateString: string): Date | null => {
    console.log("Parsing date string:", dateString);

    if (!dateString) return null;

    // Try parsing as ISO format
    let date = new Date(dateString);
    if (isValid(date)) return date;

    // Try parsing as Unix timestamp (milliseconds)
    date = new Date(parseInt(dateString));
    if (isValid(date)) return date;

    // Try parsing as Unix timestamp (seconds)
    date = new Date(parseInt(dateString) * 1000);
    if (isValid(date)) return date;

    // Try parsing common date formats
    const formats = [
      "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
      "yyyy-MM-dd'T'HH:mm:ssxxx",
      "yyyy-MM-dd",
      "MM/dd/yyyy",
      "dd/MM/yyyy",
    ];

    for (const dateFormat of formats) {
      date = parse(dateString, dateFormat, new Date());
      if (isValid(date)) return date;
    }

    console.error("Failed to parse date:", dateString);
    return null;
  };

  const formatDate = (dateString: string) => {
    console.log("Formatting date string:", dateString);
    const date = parseDate(dateString);
    return date ? format(date, "EEEE, dd MMMM yyyy") : "Invalid date";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="order-list">
        <table>
          <thead>
            <tr>
              <th>
                <Checkbox checked={selectAll} onChange={handleSelectAll} />
              </th>
              <th>Order ID</th>
              <th>Creation Date</th>
              <th>Created By</th>
              <th>Order Type</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} className="order-row">
                <td>
                  <Checkbox
                    checked={selectedOrders.has(order.orderId)}
                    onChange={() => handleSelect(order.orderId)}
                  />
                </td>
                {editOrderId === order.orderId ? (
                  <>
                    <td>{order.orderId}</td>
                    <td>
                      <DatePicker
                        value={
                          editOrder?.createdDate
                            ? parseDate(editOrder.createdDate)
                            : null
                        }
                        onChange={(newValue) => handleDateChange(newValue)}
                        format="EEEE, dd MMMM yyyy"
                      />
                    </td>
                    <td>
                      <TextField
                        name="createdByUserName"
                        value={editOrder?.createdByUserName || ""}
                        onChange={handleEditChange}
                        fullWidth
                      />
                    </td>
                    <td>
                      <FormControl fullWidth>
                        <InputLabel id="order-type-label">
                          Order Type
                        </InputLabel>
                        <Select
                          labelId="order-type-label"
                          value={editOrder?.orderType || ""}
                          onChange={handleOrderTypeChange}
                        >
                          <MenuItem value="Standard">Standard</MenuItem>
                          <MenuItem value="SaleOrder">Sale Order</MenuItem>
                          <MenuItem value="PurchaseOrder">
                            Purchase Order
                          </MenuItem>
                          <MenuItem value="TransferOrder">
                            Transfer Order
                          </MenuItem>
                          <MenuItem value="ReturnOrder">Return Order</MenuItem>
                        </Select>
                      </FormControl>
                    </td>
                    <td>
                      <TextField
                        name="customerName"
                        value={editOrder?.customerName || ""}
                        onChange={handleEditChange}
                        fullWidth
                      />
                    </td>
                    <td className="actions">
                      <Button onClick={handleEditSubmit}>Save</Button>
                      <Button onClick={handleCancelEdit}>Cancel</Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{order.orderId}</td>
                    <td>{formatDate(order.createdDate)}</td>
                    <td>{order.createdByUserName}</td>
                    <td>{order.orderType}</td>
                    <td>{order.customerName}</td>
                    <td className="actions">
                      <IconButton onClick={() => handleEdit(order)}>
                        <EditIcon />
                      </IconButton>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LocalizationProvider>
  );
};

export default OrderList;
