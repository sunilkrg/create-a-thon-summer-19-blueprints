import { createStore, applyMiddleware, compose } from "redux";
import reducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import mainSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(mainSaga);

export default store;
