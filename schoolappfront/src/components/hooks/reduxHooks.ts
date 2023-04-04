import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";

/* This is because of Typescript, basically renaming the useDispatch and useSelector from redux toolkit in order to fit with the types created in the store:  

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
*/
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;