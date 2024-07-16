import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderDraft {
  orderType: string;
  customerName: string;
  createdByUserName: string;
}

interface OrderState {
  draft: OrderDraft;
}

const initialState: OrderState = {
  draft: {
    orderType: "",
    customerName: "",
    createdByUserName: "",
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    saveDraft: (state, action: PayloadAction<OrderDraft>) => {
      state.draft = action.payload;
    },
    clearDraft: (state) => {
      state.draft = initialState.draft;
    },
  },
});

export const { saveDraft, clearDraft } = orderSlice.actions;
export default orderSlice.reducer;
