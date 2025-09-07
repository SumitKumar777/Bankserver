import prisma from "@/prisma";


import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {

   try {
      const body = await req.json()
      console.log(body, "body");
      if (!body) {
         return NextResponse.json({ message: "id missing", body }, { status: 400 })
      }

      const usrBalance = await prisma.user.findUnique({
         where: {
            id: body.id
         },
         select: {
            wallet: true
         }
      })
      console.log(usrBalance, "userbalance");

      if (!usrBalance) {
         throw new Error("userBalance not found")
      }
      return NextResponse.json({ message: "user balance", balance: (Number(usrBalance.wallet) / 100).toString() })

   } catch (error) {

      console.log(error, "error in the get balance");
      return NextResponse.json({ message: error })

   }
}