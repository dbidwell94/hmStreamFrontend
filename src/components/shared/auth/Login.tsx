import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../../../constants";
import { useDispatch } from "react-redux";
import { sendSystemMessage, loadAuth, toggleAuth } from "../../../actions";
import { messageSeverity } from "../../../constants/Types";

type LoginInputs = {
  name: string;
  password: string;
};

const loginSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

export default function Login() {
  const { register, handleSubmit } = useForm<LoginInputs>({
    shouldFocusError: true,
    resolver: yupResolver(loginSchema),
  });

  const dispatch = useDispatch();

  async function onSubmit(data: LoginInputs) {
    try {
      const response = await axios.post<{ token: string }>(
        `${BACKEND_URL}/api/users/login`,
        data
      );

      if ("token" in response.data) {
        window.localStorage.setItem("token", response.data.token);
        dispatch(loadAuth());
        dispatch(toggleAuth());
      } else {
        dispatch(
          sendSystemMessage(
            "An unknown error has occurred...",
            messageSeverity.CRITICAL
          )
        );
      }
    } catch (err) {
      if (err.isAxiosError) {
        const error = err as AxiosError;
        dispatch(
          sendSystemMessage(
            error.response?.data.error || error.message,
            messageSeverity.CRITICAL
          )
        );
      } else {
        dispatch(
          sendSystemMessage(
            "An unknown error has occurred...",
            messageSeverity.CRITICAL
          )
        );
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="username">
        Username{" "}
        <input
          ref={register}
          name="username"
          id="username"
          placeholder="jdoe"
        />
      </label>
      <label htmlFor="password">
        Password{" "}
        <input
          ref={register}
          id="password"
          type="password"
          name="password"
          placeholder="My 1ns3cuR3 P@$sw0rD"
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
