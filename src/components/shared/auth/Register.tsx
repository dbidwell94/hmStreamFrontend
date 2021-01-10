import React, { FormEvent } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../../../constants";
import { useDispatch } from "react-redux";
import { sendSystemMessage } from "../../../actions";
import { messageSeverity } from "../../../constants/Types";

const registerSchema = yup.object().shape({
  username: yup.string().required().min(4).max(15),
  email: yup.string().email().required(),
  password: yup.string().min(6).max(25),
  confirmPassword: yup.string().min(6).max(25),
});

type RegisterInputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const { register, handleSubmit } = useForm<RegisterInputs>({
    shouldFocusError: true,
    resolver: yupResolver(registerSchema),
  });

  const dispatch = useDispatch();

  async function onSubmit(data: RegisterInputs) {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/users/register`,
        data
      );
    } catch (err) {
      if (err.isAxiosError) {
        const error = err as AxiosError;
        if ("error" in error.response?.data) {
          dispatch(
            sendSystemMessage(
              error.response?.data.error || error.message,
              messageSeverity.CRITICAL
            )
          );
        }
      } else {
        dispatch(
          sendSystemMessage(
            "An unknown error has occured...",
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
          name="username"
          id="username"
          placeholder="jdoe"
          ref={register}
        />
      </label>
      <label>
        Email{" "}
        <input
          type="email"
          id="email"
          name="email"
          placeholder="jdoe91@gmail.com"
          ref={register}
        />
      </label>
      <label htmlFor="password">
        Password{" "}
        <input
          id="password"
          name="password"
          type="password"
          placeholder="My 1ns3cuR3 P@$sw0rD"
          ref={register}
        />
      </label>
      <label htmlFor="confirm-password">
        Confirm Password{" "}
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="My 1ns3cuR3 P@$sw0rD"
          ref={register}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
