"use client"
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";

const Page = ()=>{

    const { user: clerkUser } = useUser();
    const { user } = useAuth(clerkUser?.id);
  console.log(user)

}
export default Page