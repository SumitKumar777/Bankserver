import { NextRequest, NextResponse } from "next/server";

interface User {
   name: string,
   age: number
}

export const POST = async (req: NextRequest) => {
   const { name, age }: User = await req.json();
   console.log(name, age);

   return NextResponse.json({ message: "request recieved", data: { name, age } })

}

export const GET = () => {
   return NextResponse.json({ message: "request recieved from get", })
}