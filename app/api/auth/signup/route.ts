import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";



const userSignup = z.object({
   username: z.string(),
   phone: z
      .string()
      .min(10, { message: 'Must be a valid mobile number' })
      .max(14, { message: 'Must be a valid mobile number' }),
   password: z.string(),

})


//! Hash the password before saving it

export const POST = async (req: NextRequest) => {
   try {
      const body = await req.json();

      const parsedData = userSignup.safeParse(body);

      if (!parsedData.success) {
         return NextResponse.json({ message: "request body is not valid", parsedData }, { status: 400 })
      }



      const createUser = await prisma.user.create({
         data: {
            username: parsedData.data.username,
            phone: parsedData.data.phone,
            password: parsedData.data.password
         }
      })


      return NextResponse.json({ message: "user created", data: { ...createUser, wallet: createUser.wallet.toString() } }, { status: 200 });

   } catch (error) {

      console.log(error, "error in bank signup");
      return NextResponse.json({ message: "user not created", error });
   }
}