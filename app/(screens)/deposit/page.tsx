"use client";
import axios from "axios";
import {  useSearchParams } from "next/navigation";



const Deposit = () => {

	const searchParams = useSearchParams();
	const paymentDetails = {
		userId: searchParams.get("userId"),
		amount: searchParams.get("amount"),
		bankTranx: searchParams.get("bankTranx"),
		paytmTranx: searchParams.get("paytmTranx"),
	};

	const handleChoice = async (choice: boolean) => {
		const backResponse = await axios.post(
			"/api/transaction/deposit",
			{
				userId: paymentDetails.userId,
				amount: paymentDetails.amount,
				bankTranx: paymentDetails.bankTranx,
				choice: choice ? "confirm" : "reject",
			}
		);


		 if (window.opener) {

				window.opener.location.href = backResponse.data.redirectUrl;
				window.close(); 
			} else {
				window.location.href = backResponse.data.redirectUrl;
			}
	};


	return (
		<div className="h-screen text-center ">
			<div className="  max-w-[500px] p-4 mx-auto space-y-6 translate-y-1/2">
				<h1 className="text-4xl font-bold">Confirm Your Payment</h1>
				<p className="p-4 font-xl font-medium">
					Amount{" "}
					<span className="font-bold text-green-600">
						{(Number(paymentDetails.amount) / 100).toString()}
					</span>{" "}
					will be deducted and added to your paytm wallet
				</p>

				<div className="space-x-4 text-xl text-center ">
					<button
						className="border1 rounded-md bg-green-400 p-2"
						onClick={() => handleChoice(true)}
					>
						Complete
					</button>
					<button
						className="border1 rounded-md bg-red-400 p-2"
						onClick={() => handleChoice(false)}
					>
						Reject
					</button>
				</div>
			</div>
		</div>
	);
};

export default Deposit;
