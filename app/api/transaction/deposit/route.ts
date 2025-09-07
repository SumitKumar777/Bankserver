



import prisma from "@/prisma";
import { OnRampStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";



const userPayment = z.object({
   userId: z.string(),
   amount: z.string(),
   bankTranx: z.string(),
   choice: z.string(),

})


export const POST = async (req: NextRequest) => {
   const body = await req.json();

   const parsedData = userPayment.safeParse(body);

   if (!parsedData.success) {
      return NextResponse.json({ message: "request body is invalid", data: false }, { status: 400 });
   }
   let redirectUrl = `http://localhost:3000/onramp?userId=${parsedData.data.userId}&amount=${parsedData.data.amount}&transxId=${parsedData.data.bankTranx}&status=failed`

   try {
      if (parsedData.data.choice === "reject") {
         await prisma.onRamp.update({
            where: {
               id: Number(parsedData.data.bankTranx)
            },
            data: {
               status: OnRampStatus.FAILED
            }
         })

         return NextResponse.json({ message: "transaction marked failed", data: false, redirectUrl }, { status: 201 });
      }
      // ! check balance and then deduct money so that negative balance do not happen 
      const deductMoney = await prisma.$transaction(async (tx) => {

         // recordTransaction
         await tx.onRamp.update({
            where: {
               id: Number(parsedData.data.bankTranx)
            },
            data: {
               status: OnRampStatus.COMPLETED
            }
         })

         return await tx.user.update({
            where: {
               id: Number(parsedData.data.userId)
            },
            data: {
               wallet: { decrement: BigInt(parsedData.data.amount) }
            }
         })
      })
      redirectUrl = `http://localhost:3000/onramp?userId=${parsedData.data.userId}&amount=${parsedData.data.amount}&transxId=${parsedData.data.bankTranx}&status=success`
      console.log(deductMoney, "deductMoney");
      return NextResponse.json({ message: "success", data: true, redirectUrl }, { status: 200 });
   } catch (error) {

      console.log(error, "error in the bankdeposit");
      return NextResponse.json({ message: "error in deposit", data: false, error, redirectUrl })
   }
}