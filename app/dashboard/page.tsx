"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy as CopyIcon } from "solar-icon-set";
import StatCard, { Stats } from "./_component/StatCard";
import { FormEvent, useEffect, useState } from "react";
import MemberList from "./_view/MemberList";
import ForecastList from "./_view/ForecastList";
import {
  telegramApi,
  useGetAllForecastsQuery,
  useGetAllUsersQuery,
  useGetBannedUsersQuery,
  useGetChatBotQuery,
  useHardResetMutation,
  useUpdateBotMutation,
} from "@/api/telegram";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/config/store";
import { Spinner } from "@/components/ui/spinner";

const Dashboard = () => {
  const [activeStat, setActiveStat] = useState<Stats>("Members");
  const [token, setToken] = useState("");
  const [channel, setChannel] = useState("");
  const [updateModal, setUpdateModal] = useState(false);
  const [channelError, setChannelError] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const { data: chatBotDetail, error: chatBotDetailError } =
    useGetChatBotQuery();
  const { data: users } = useGetAllUsersQuery();
  const { data: bannedUsers } = useGetBannedUsersQuery();
  const { data: forecast } = useGetAllForecastsQuery();
  const [updateBot, { isLoading: updateBotLoading }] = useUpdateBotMutation();
  const [hardReset, { isLoading: hardResetLoading }] = useHardResetMutation();

  useEffect(() => {
    if (!chatBotDetail?.bot?.token || !chatBotDetail?.channel?.id) return;
    setToken(chatBotDetail?.bot?.token!);
    setChannel(chatBotDetail?.channel?.id?.toString());
  }, [chatBotDetail]);

  const handleUpdateBot = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateBot({
        chat_id: channel,
        token: token,
      }).unwrap();
      dispatch(telegramApi.util.invalidateTags(["botDetail"]));
      dispatch(telegramApi.util.invalidateTags(["bannedUser", "users"]));
      setUpdateModal(false);
    } catch (err) {
      const e = err as any;
      if (e?.data?.message === "Invalid Channel ID") {
        toast({
          title: "Invalid Channel ID",
          description: "Please provide a valid channel ID",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to update bot",
          description: e?.data?.message,
        });
      }
    }
  };

  useEffect(() => {
    const err = chatBotDetailError as any;
    if (err) {
      setChannelError(true);
    } else {
      setChannelError(false);
    }
  }, [chatBotDetailError]);

  const handleHardReset = async () => {
    await hardReset().unwrap();
    toast({ title: "Success", description: "Hard reset successful" });
    dispatch(telegramApi?.util?.invalidateTags(["botDetail"]));
  };

  return (
    <section className="px-16 pt-12 relative">
      <Button
        onClick={handleHardReset}
        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 w-44"
        disabled={hardResetLoading}
      >
        {hardResetLoading ? <Spinner className="w-5 h-5" /> : "  Hard reset"}
      </Button>
      <h1 className="font-medium text-2xl">Your bot</h1>
      <div className="bg-white rounded-xl p-5 border mt-4 shadow-light flex gap-10  justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">
            @{chatBotDetail?.bot.username} /{" "}
            <span className="text-gray-400 text-sm">
              {chatBotDetail?.channel?.title}
            </span>
          </h3>
          <div className=" mt-2 p-2 py-1 rounded-md bg-gray-100 border flex items-center justify-between w-max gap-8">
            <p className="text-sm text-gray-500">{chatBotDetail?.bot?.id}</p>
            <CopyIcon className="cursor-pointer" iconStyle="Linear" />
          </div>
        </div>

        <Dialog open={updateModal} onOpenChange={(val) => setUpdateModal(val)}>
          <DialogTrigger asChild>
            <Button>Update bot settings</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-5">
                Add these details to update your bot
              </DialogTitle>
              <DialogDescription>
                <form className="flex flex-col" onSubmit={handleUpdateBot}>
                  <label>Bot token</label>
                  <Input
                    className="mt-2 mb-4"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                  <label>Channel ID</label>
                  <Input
                    className="mt-2"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                  />
                  <Button
                    disabled={updateBotLoading}
                    type="submit"
                    className="mt-8"
                  >
                    {updateBotLoading ? (
                      <Spinner className="w-5 h-5" />
                    ) : (
                      "Update bot"
                    )}
                  </Button>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex  gap-12 mt-6">
        <div className="flex flex-col gap-4">
          <StatCard
            title="Members"
            val={users?.length || 0}
            active={activeStat === "Members"}
            setActive={setActiveStat}
          />
          <StatCard
            title="Forecast"
            val={forecast?.length || 0}
            active={activeStat === "Forecast"}
            setActive={setActiveStat}
          />
        </div>
        {activeStat === "Members" && (
          <MemberList users={users || []} bannedUserList={bannedUsers || []} />
        )}
        {activeStat === "Forecast" && <ForecastList data={forecast || []} />}
      </div>
      <Dialog open={channelError} onOpenChange={(val) => setChannelError(val)}>
        <DialogContent>
          <h2 className="font-medium text-xl">
            Failed to fetch channel detail
          </h2>
          This could be because the bot is not added to the channel or the bot
          doesn&apos;t have enough permissions.
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Dashboard;
