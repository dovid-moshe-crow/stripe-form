import axios from "axios";

let lastId = "";
let lastResult: Array<{ name: string; id: string }> = [];
let lastRequestTime = 0;

export default async function powerlink(
  id: string
): Promise<Array<{ name: string; id: string }>> {
  if (id === lastId && Date.now() - lastRequestTime < 3 * 60 * 1000) {
    console.log("cached");
    return lastResult;
  }
  try {
    const result = await axios.post(
      "https://api.powerlink.co.il/api/query",
      {
        objecttype: "1020",
        sort_type: "desc",
        fields: "pcfsystemfield333,pcfsystemfield326,customobject1020id",
        query: `(pcfsystemfield326 = ${id})`,
      },
      {
        headers: {
          "Content-type": "application/json",
          tokenId: process.env.POWERLINK_TOKEN_ID,
        },
      }
    );

    lastId = id;
    lastResult = result.data["data"]["Data"].map(
      (x: Record<string, string>) => {
        return {
          name: x["pcfsystemfield333"],
          id: x["customobject1020id"],
        };
      }
    );
    lastRequestTime = Date.now();
    return lastResult;
  } catch {
    return [];
  }
}
