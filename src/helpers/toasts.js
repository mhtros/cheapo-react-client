import { notification } from "antd";

export const successToast = (message) =>
  notification.success({ description: message });

export const errorToast = (message) =>
  notification.error({ description: message });
