import { Link, Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col">
      <main className="flex-1">
        <div className="text-center">머리</div>
        <Outlet />
        <Link to={"/login"}>
          <div className="gap-10">로그인</div>
        </Link>
      </main>

      <footer>
        <div className="text-center">바닥</div>
      </footer>
    </div>
  );
};

export default HomeLayout;
