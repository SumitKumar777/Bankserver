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
			"http://localhost:3001/api/transaction/deposit",
			{
				userId: paymentDetails.userId,
				amount: paymentDetails.amount,
				bankTranx: paymentDetails.bankTranx,
				choice: choice ? "confirm" : "reject",
			}
		);
		console.log(backResponse, "backresponse in the deposit in bankserver");

		 if (window.opener) {
			console.log(window.opener,"window opener");
				window.opener.location.href = backResponse.data.redirectUrl;
				window.close(); 
			} else {
				window.location.href = backResponse.data.redirectUrl;
			}
	};


	return (
		<>
			<div className=" bg-amber-300 max-w-[500px] ">
				<h1 className="text-4xl">Confirm Your Payment</h1>
				<p>
					Amount {paymentDetails.amount} will be deducted and added to your
					paytm wallet
				</p>
				<p>Paytm transaction id{paymentDetails.paytmTranx}</p>
			

				<div className="">
					<button onClick={() => handleChoice(true)}>Complete</button>
					<button onClick={() => handleChoice(false)}>Reject</button>
				</div>
			</div>
		</>
	);
};

export default Deposit;
