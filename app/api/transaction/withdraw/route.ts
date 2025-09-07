

import prisma from "@/prisma";
import { OnRampStatus, OnRampType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";


const withDrawSchema=z.object({
   id:z.number(),
   amount:z.string(),
})

export const POST=async (req:NextRequest)=>{
   const body=await req.json();

   const parsedData=withDrawSchema.safeParse(body);
   const data=parsedData.data;
   if(!parsedData){
      return NextResponse.json({message:"invalid body in bank withdraw",},{status:400});
   }

   try {

      const withDrawTransacton=await prisma.$transaction(async(tx)=>{

         // record transaction 
         if (!data?.amount) {
            throw new Error("Amount is required for withdrawal");
         }
         await tx.onRamp.create({
            data:{
               userId:data?.id,
               type:OnRampType.WITHDRAW,
               amount: BigInt(data?.amount ),
               status:OnRampStatus.COMPLETED,

            }
         })

         return await tx.user.update({
            where:{
               id:data.id
            },
            data:{
               wallet:{increment:BigInt(data.amount)}
            }
         })

      })
      return NextResponse.json({message:"money added to bank",data:{...withDrawTransacton,wallet:withDrawTransacton.wallet.toString()}},{status:201})
   } catch (error) {
      await prisma.onRamp.create({
         data: {
            userId: data?.id ?? 1,
            type: OnRampType.WITHDRAW,
            amount: BigInt(data?.amount ?? 0),
            status: OnRampStatus.FAILED,

         }
      })
      console.log(error,"error in the withdraw")
      return NextResponse.json({message:"withdraw failed in bank",error},{status:400});
   }

}