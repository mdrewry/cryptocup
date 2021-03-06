//https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20ethereum%2C%20solana%2C%20cardano%2C%20polkadot%2C%20dogecoin%2C%20shiba-inu%2C%20ripple&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C%2024h%2C%207d
import type { NextApiRequest, NextApiResponse } from "next";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase.config";

export async function getServerSideProps() {
    const response = await fetch('//https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20ethereum%2C%20solana%2C%20cardano%2C%20polkadot%2C%20dogecoin%2C%20shiba-inu%2C%20ripple&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C%2024h%2C%207d');
    const data = await response.json();

    console.log(data);
  
    return {
      props: {
        coins: data,
      },
    }
  }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {} = req.body;
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20ethereum%2C%20solana%2C%20cardano%2C%20polkadot%2C%20dogecoin%2C%20shiba-inu%2C%20ripple&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C%2024h%2C%207d');

    const cryptoData: any = await response.json();

    const cryptoSnap = await getDocs(collection(db, "cryptoInfo"));
    await Promise.all(
      cryptoSnap.docs.map(async (doc: any) => {
        let data = doc.data();
        const coinGeckoID = data.coinGeckoID;
        const geckoCoinData = cryptoData.find((c: any) => c.id === coinGeckoID);
        if(geckoCoinData != undefined)
        await updateDoc(doc.ref, {
          price: geckoCoinData.current_price,
          hour: geckoCoinData.price_change_percentage_1h_in_currency,
          day: geckoCoinData.price_change_percentage_24h,
          week: geckoCoinData.price_change_24h,
        });
      })
    );
  } catch (error) {
    res.status(500).json({ error });
    return;
  }

  res.status(200).json({ message: "Crypto Updated successfully." });
}