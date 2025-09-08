import prisma from "@/prisma";
import { OnRampStatus, OnRampType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const userSession = z.object({
   tranxId: z.number(),
   userId: z.number(),
   amount: z.string(),
})

export const POST = async (req: NextRequest) => {

   try {
      const body = await req.json();

      const parsedData = userSession.safeParse(body);

      if (!parsedData.success) {
         return NextResponse.json({ message: "request body is not valid", parsedData }, { status: 400 })
      }

      const bankTransaction = await prisma.onRamp.create({
         data: {
            userId: parsedData.data.userId,
            type: OnRampType.DEPOSIT,
            status: OnRampStatus.PENDING,
            amount: BigInt(parsedData.data.amount)
         }
      })


      // create a url for the bank frontend 

      const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/deposit?userId=${bankTransaction.userId}&amount=${bankTransaction.amount}&bankTranx=${bankTransaction.id}&paytmTranx=${parsedData.data.tranxId}`;

      return NextResponse.json({ message: "session created from bank", bankResponse: redirectUrl }, { status: 200 });

   } catch (error) {
      console.log("error in the bank session", error);
      return NextResponse.json({ message: "session not created", error }, { status: 500 });
   }
}