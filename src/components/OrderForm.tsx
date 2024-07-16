import React, { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { saveDraft, clearDraft } from "../redux/orderSlice";
import { createOrder } from "../services/api";
import axios from "axios";
import "./OrderForm.css";

const OrderForm: React.FC<{ onCreate: () => void; onClose: () => void }> = ({
  onCreate,
  onClose,
}) => {
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.order.draft);

  const [orderType, setOrderType] = useState<string>(draft.orderType);
  const [customerName, setCustomerName] = useState<string>(draft.customerName);
  const [createdByUserName, setCreatedByUserName] = useState<string>(
    draft.createdByUserName
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!orderType || !customerName || !createdByUserName) {
      setError("All fields are required");
      return;
    }
    try {
      const orderData = { orderType, customerName, createdByUserName };
      console.log("Creating order with data:", orderData);
      await createOrder(orderData);
      onCreate();
      dispatch(clearDraft());
      onClose();
    } catch (error) {
      console.error("Error creating order:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors) {
          const validationErrors = error.response.data.errors;
          if (validationErrors.OrderType) {
            setError(
              `OrderType Error: ${validationErrors.OrderType.join(", ")}`
            );
          } else {
            setError(
              "Failed to create order. Please check the data and try again."
            );
          }
        } else {
          setError(
            "Failed to create order. Please check the data and try again."
          );
        }
      } else {
        setError(
          "Failed to create order. Please check the data and try again."
        );
      }
    }
  };

  const handleSaveDraft = () => {
    dispatch(saveDraft({ orderType, customerName, createdByUserName }));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent className="dialog-content">
        <FormControl fullWidth margin="normal">
          <InputLabel id="order-type-label">Order Type</InputLabel>
          <Select
            labelId="order-type-label"
            value={orderType}
            onChange={(e: SelectChangeEvent<string>) =>
              setOrderType(e.target.value as string)
            }
          >
            <MenuItem value="Standard">Standard</MenuItem>
            <MenuItem value="SaleOrder">Sale Order</MenuItem>
            <MenuItem value="PurchaseOrder">Purchase Order</MenuItem>
            <MenuItem value="TransferOrder">Transfer Order</MenuItem>
            <MenuItem value="ReturnOrder">Return Order</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Customer Name"
          value={customerName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCustomerName(e.target.value)
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Created By Username"
          value={createdByUserName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCreatedByUserName(e.target.value)
          }
          fullWidth
          margin="normal"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button type="submit" variant="contained" color="primary">
          Create Order
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSaveDraft}>
          Save Draft
        </Button>
      </DialogActions>
    </form>
  );
};

export default OrderForm;
