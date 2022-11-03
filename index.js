import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";
import twilio from "twilio";
import * as dotenv from 'dotenv';

dotenv.config()

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemyClient = new Alchemy(settings);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const filter = {
  address: "0x60bb1e2AA1c9ACAfB4d34F71585D7e959f387769",
  topics: [ethers.utils.id("GobblerPurchased(address,uint256,uint256)")],
};

const subscribers = process.env.SUBSCRIBERS.split(",")

alchemyClient.ws.on(filter, (log, event) => {
  console.log(log.transactionHash)
  subscribers.map((phone) =>
    twilioClient.messages
      .create({
         body: `Someone just minted a gobbler! https://etherscan.io/tx/${log.transactionHash}`,
         from: '+14156498874',
         to: phone
       })
      .then(message => console.log(message.sid))
  )
});
