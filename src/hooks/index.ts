import { useContext } from "react";
import { TrpcContext } from "../TrpcContext";

export const useTrpcContext = () => {
  return useContext(TrpcContext);
};
