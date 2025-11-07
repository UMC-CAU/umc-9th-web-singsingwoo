import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";

export default function HomePage() {
  const [search, setSearch] = useState("상우");
  const { data, isPending, isError } = useGetLpList({
    search,
  });

  if (isPending) {
    return <div className="mt-20">로딩중...</div>;
  }
  if (isError) {
    return <div className="mt-20">에러 발생!</div>;
  }

  return (
    <div className="mt-20">
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      {data?.data.map((lp) => (
        <h1>{lp.title}</h1>
      ))}
    </div>
  );
}
