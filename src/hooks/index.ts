import { useContext } from "react";
import { TrpcContext } from "../TrpcContext";

export const useAppContext = () => {
  return useContext(TrpcContext);
};
