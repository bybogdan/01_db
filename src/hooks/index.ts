import { useContext } from "react";
import { TrpcContext } from "../TrpcContext";

export const UseTrpcContext = () => {
  return useContext(TrpcContext);
};
