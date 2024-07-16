declare module "redux-mock-store" {
  import { Store, AnyAction } from "redux";

  export interface MockStoreCreator<S = any> {
    <A extends AnyAction = AnyAction>(state?: S): MockStoreEnhanced<S, A>;
  }

  export interface MockStoreEnhanced<S = any, A extends AnyAction = AnyAction>
    extends Store<S, A> {
    getActions(): A[];
    clearActions(): void;
    subscribe(): () => void;
    replaceReducer(): void;
    dispatch: unknown;
  }

  const configureStore: MockStoreCreator;
  export default configureStore;
}
