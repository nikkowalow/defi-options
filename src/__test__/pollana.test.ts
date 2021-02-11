import { PublicKey } from "@solana/web3.js";
import { connect, getBalance,  } from "../solanaHelperMethods";


describe("Filter function", () => {

    const ID = new PublicKey("FWGQWagB1RAfTv2d4vi1oFm5F5Ny8y3h21tUAv9SDzf8");
    
  test("test1", () =>{
      expect(true).toBe(true);
  })

  test("test2", async () =>{
    await connect();


    const balance = await getBalance(ID);
    expect(balance).toBeTruthy();
  })
});