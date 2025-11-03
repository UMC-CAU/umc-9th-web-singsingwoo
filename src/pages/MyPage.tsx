import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";

export default function MyPage() {
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response);
    };
    getData();
  }, []);
  return <div>{data?.data.name}</div>;
}
