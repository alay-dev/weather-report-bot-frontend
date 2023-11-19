import { baseUrl } from "@/config/api";
import { ApiSuccess } from "@/types/api";
import { Forecast } from "@/types/forecast";
import { User } from "@/types/users";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type GetAllUsersRes = User[];

type GetBotDetail = {
  bot: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
    can_join_groups: boolean;
    can_read_all_group_messages: boolean;
    supports_inline_queries: boolean;
    token: string;
  };
  channel: {
    id: number;
    title: string;
    type: string;
    invite_link: string;
  };
};

type GetAllForcastRes = Forecast[];

type UpdateBotProps = {
  token: string;
  chat_id: string;
};

export const telegramApi = createApi({
  reducerPath: "telegramApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl + "/telegram",
  }),
  tagTypes: ["botDetail", "bannedUser", "users"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<GetAllUsersRes, void>({
      query: () => ({
        url: "/get_users",
      }),
      transformResponse: (response: ApiSuccess<GetAllUsersRes>) => {
        return response.data;
      },
      providesTags: ["users"],
    }),
    getBannedUsers: builder.query<GetAllUsersRes, void>({
      query: () => ({
        url: "/get_banned_users",
      }),
      transformResponse: (response: ApiSuccess<GetAllUsersRes>) => {
        return response.data;
      },
      providesTags: ["bannedUser"],
    }),
    getAllForecasts: builder.query<GetAllForcastRes, void>({
      query: () => ({
        url: "/get_forecasts",
      }),
      transformResponse: (response: ApiSuccess<GetAllForcastRes>) => {
        return response.data;
      },
    }),
    getChatBot: builder.query<GetBotDetail, void>({
      query: () => ({
        url: "/",
      }),
      transformResponse: (response: ApiSuccess<GetBotDetail>) => {
        return response.data;
      },
      transformErrorResponse: (res) => {
        return res.data;
      },
      providesTags: ["botDetail"],
    }),
    updateBot: builder.mutation<GetBotDetail, UpdateBotProps>({
      query: (body) => ({
        url: "/",
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiSuccess<GetBotDetail>) => {
        return response.data;
      },
    }),
    hardReset: builder.mutation<void, void>({
      query: () => ({
        url: "/hard_reset",
        method: "POST",
      }),
      transformResponse: (response: ApiSuccess<void>) => {
        return response.data;
      },
    }),
    banUser: builder.mutation<string, string>({
      query: (user_id) => ({
        url: "/ban_user",
        method: "POST",
        body: {
          user_id: user_id,
        },
      }),
      transformResponse: (response: ApiSuccess) => {
        return response.message;
      },
    }),
    unBanUser: builder.mutation<string, string>({
      query: (user_id) => ({
        url: "/unban_user",
        method: "POST",
        body: {
          user_id: user_id,
        },
      }),
      transformResponse: (response: ApiSuccess) => {
        return response.message;
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetChatBotQuery,
  useGetAllForecastsQuery,
  useUpdateBotMutation,
  useHardResetMutation,
  useGetBannedUsersQuery,
  useBanUserMutation,
  useUnBanUserMutation,
} = telegramApi;
