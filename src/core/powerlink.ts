import axios from "axios";

let lastId = "";
let lastResult: Array<{ value: string; label: string }> = [];
let lastRequestTime = 0;

export default async function powerlink(
  id: string
): Promise<Array<{ value: string; label: string }>> {
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
        timeout: 4000,
      }
    );

    lastId = id;
    lastResult = result.data["data"]["Data"].map(
      (x: Record<string, string>) => {
        return {
          value: x["customobject1020id"],
          label: x["pcfsystemfield333"],
        };
      }
    );
    lastRequestTime = Date.now();
    return lastResult;
  } catch {
    return [];
  }
}
