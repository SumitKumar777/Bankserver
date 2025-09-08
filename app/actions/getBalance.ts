"use server";
import prisma from "@/prisma";

export const getBalance = async (id: number): Promise<bigint | null> => {

   try {
      const usrBalance = await prisma.user.findUnique({
         where: {
            id
         },
         select: {
            wallet: true
         }
      })


      if (!usrBalance) {
         throw new Error("userBalance not found")
      }
      return usrBalance.wallet ? usrBalance.wallet : null;

   } catch (error) {

      console.log(error, "error in the get balance");
      return null;


   }
}