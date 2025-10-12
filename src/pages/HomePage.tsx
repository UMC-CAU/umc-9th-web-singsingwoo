import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div>HomePage</div>
      <Link to={"/login"}>
        <div className="text-md text-indigo-600 hover:underline">로그인</div>
      </Link>
      <Link to={"/signup"}>
        <div className="text-md text-indigo-600 hover:underline">회원가입</div>
      </Link>
    </div>
  );
}
