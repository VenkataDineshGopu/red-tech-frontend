import React from "react";
import { TextField } from "@mui/material";
import "./OrderFilter.css";

const OrderFilter: React.FC<{
  search: string;
  setSearch: (search: string) => void;
}> = ({ search, setSearch }) => {
  return (
    <div className="order-filter">
      <TextField
        label="Customer Search"
        variant="outlined"
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        fullWidth
        margin="normal"
        size="small"
      />
    </div>
  );
};

export default OrderFilter;
