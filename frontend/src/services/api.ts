import axios from "axios";
import { Platform } from "react-native";

const URL_PADRAO =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

export const BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL?.trim() || URL_PADRAO
).replace(/\/+$/, "");

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});
