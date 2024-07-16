import React, { useEffect, useState } from "react";
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import NavBar from "./components/NavBar";
import { fetchOrders, deleteOrders } from "./services/api";
import { Order } from "./types/order";
import "./App.css";

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      (filter === "" || order.orderType === filter) &&
      (search === "" || order.orderId.includes(search))
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteOrders(Array.from(selectedOrders));
      setSelectedOrders(new Set());
      loadOrders();
    } catch (error) {
      console.error("Error deleting orders:", error);
    }
  };

  return (
    <div className="container">
      <NavBar />
      <div className="header-spacer"></div>
      <div className="order-list-controls-wrapper">
        <div className="order-list-controls">
          <TextField
            label="Customer Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            style={{ backgroundColor: "#007bff", color: "#fff" }}
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Create Order
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#007bff", color: "#fff" }}
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
            disabled={selectedOrders.size === 0}
          >
            Delete Selected
          </Button>
          <FormControl variant="outlined">
            <InputLabel>Order Type</InputLabel>
            <Select
              label="Order Type"
              value={filter}
              onChange={(e: SelectChangeEvent<string>) =>
                setFilter(e.target.value as string)
              }
            >
              <MenuItem value="">
                <em>Order Type</em>
              </MenuItem>
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="SaleOrder">Sale Order</MenuItem>
              <MenuItem value="PurchaseOrder">Purchase Order</MenuItem>
              <MenuItem value="TransferOrder">Transfer Order</MenuItem>
              <MenuItem value="ReturnOrder">Return Order</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Order</DialogTitle>
        <DialogContent>
          <OrderForm onCreate={loadOrders} onClose={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {loading && <Typography variant="h6">Loading...</Typography>}
      {error && (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      )}
      {!loading && !error && (
        <OrderList
          orders={filteredOrders}
          onDelete={loadOrders}
          onEdit={loadOrders}
          selectedOrders={selectedOrders}
          setSelectedOrders={setSelectedOrders}
        />
      )}
    </div>
  );
};

export default App;
