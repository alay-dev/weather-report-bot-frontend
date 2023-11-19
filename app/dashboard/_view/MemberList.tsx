import {
  telegramApi,
  useBanUserMutation,
  useUnBanUserMutation,
} from "@/api/telegram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/config/store";
import { cn } from "@/lib/utils";
import { User } from "@/types/users";
import { tree } from "next/dist/build/templates/app-page";
import { useMemo, useState } from "react";
import {
  RoundedMagnifer as SearchIcon,
  User as UserIcon,
  UserBlock as BanUserIcon,
} from "solar-icon-set";

const MemberList = ({ users, bannedUserList }: MemberListProps) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [bannedUser, setBannedUser] = useState(false);
  const [banUser] = useBanUserMutation();
  const [unBanUser] = useUnBanUserMutation();

  const data = bannedUser ? bannedUserList : users;

  const handleBanUser = async (chatId: string) => {
    try {
      await banUser(chatId).unwrap();
      dispatch(telegramApi.util.invalidateTags(["bannedUser", "users"]));
      toast({
        title: "Success",
        description: "Chat member baned",
      });
    } catch (err) {
      toast({
        title: "Failed to ban user",
        description: "Can't ban chat admin",
        variant: "destructive",
      });
    }
  };

  const handleUnBanUser = async (chatId: string) => {
    try {
      await unBanUser(chatId).unwrap();
      toast({
        title: "Success",
        description: "Chat member baned",
      });
      dispatch(telegramApi.util.invalidateTags(["bannedUser", "users"]));
    } catch (err) {
      toast({
        title: "Failed to ban user",
        description: "Can't ban chat admin",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 flex-1 border self-stretch">
      <div className="flex items-center justify-end gap-2  p-2 rounded-lg  mb-3">
        {/* <SearchIcon className="#E0E0E0" />
        <Input
          disabled
          placeholder="Search by member name"
          className="border-0 ring-none focus-visible:ring-none focus-visible:ring-0 bg-transparent"
        /> */}
        <div className="flex items-center justify-center gap-1 text-sm text-gray-400 w-[17rem] bg-white border rounded-xl ">
          <div
            onClick={() => setBannedUser(false)}
            className={cn(
              "flex-1 text-center py-2 rounded-xl cursor-pointer",
              bannedUser ? "bg-transparent" : "bg-blue-600 text-white"
            )}
          >
            Users
          </div>
          <div
            onClick={() => setBannedUser(true)}
            className={cn(
              "flex-1 text-center py-2 rounded-xl px-1 cursor-pointer",
              bannedUser ? "bg-blue-600 text-white" : " bg-transparent"
            )}
          >
            Banned users
          </div>
        </div>
      </div>
      <ul className="h-[18rem] overflow-auto">
        <ScrollArea>
          {data?.map((user, i) => {
            return (
              <li
                key={i}
                className="flex items-center justify-between hover:bg-gray-50 border-b py-2"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 rounded-full w-10 h-10 grid place-items-center">
                    <UserIcon size={20} />
                  </div>
                  <p>
                    {user.name}{" "}
                    <span className="text-gray-500 text-xs">{user.id}</span>{" "}
                  </p>
                </div>
                {bannedUser ? (
                  <Button
                    onClick={() => handleUnBanUser(user.id?.toString())}
                    variant="link"
                    className="rounded-full text-green-400 gap-2"
                  >
                    <p>Unban member</p>
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleBanUser(user.id?.toString())}
                    variant="link"
                    className="rounded-full text-red-400 gap-2"
                  >
                    <BanUserIcon />
                    <p>Ban member</p>
                  </Button>
                )}
              </li>
            );
          })}
        </ScrollArea>
      </ul>
    </div>
  );
};

export default MemberList;

type MemberListProps = {
  users: User[];
  bannedUserList: User[];
};
