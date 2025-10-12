import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { postSignup } from "../apis/auth";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 최대 20자 이하이어야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 최대 20자 이하이어야 합니다." }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const EyeIcon = ({ closed }: { closed: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-500"
  >
    {closed ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
    )}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "details">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const emailValue = watch("email");

  const handleNextStep = async () => {
    const isEmailValid = await trigger("email");
    if (isEmailValid) {
      setStep("details");
    }
  };

  const handlePrevStep = () => {
    setStep("email");
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck, ...rest } = data;
    console.log("제출 데이터:", rest);
    try {
      await postSignup(rest);

      console.log("회원가입 성공:", rest);
      alert("회원가입이 성공적으로 완료되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          {step === "email" ? "이메일 입력" : "회원가입"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === "email" && (
            <div className="flex flex-col gap-2">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  이메일
                </label>
                <input
                  {...register("email")}
                  id="email"
                  className={`mt-1 border w-full p-3 focus:border-indigo-500 focus:ring-indigo-500 rounded-md transition
                    ${
                      errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  type="email"
                  placeholder="이메일을 입력하세요"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!emailValue || !!errors.email}
                className={`w-full py-3 mt-2 rounded-md text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  !emailValue || !!errors.email
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                다음
              </button>
            </div>
          )}

          {step === "details" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    className={`mt-1 border w-full p-3 pr-10 focus:border-indigo-500 focus:ring-indigo-500 rounded-md transition
                      ${
                        errors.password
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요 (8~20자)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <EyeIcon closed={showPassword} />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    {...register("passwordCheck")}
                    className={`mt-1 border w-full p-3 pr-10 focus:border-indigo-500 focus:ring-indigo-500 rounded-md transition
                      ${
                        errors.passwordCheck
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    type={showPasswordCheck ? "text" : "password"}
                    placeholder="비밀번호 다시 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <EyeIcon closed={showPasswordCheck} />
                  </button>
                </div>
                {errors.passwordCheck && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.passwordCheck.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  이름
                </label>
                <input
                  {...register("name")}
                  className={`mt-1 border w-full p-3 focus:border-indigo-500 focus:ring-indigo-500 rounded-md transition
                    ${
                      errors.name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  type="text"
                  placeholder="이름"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-full py-3 rounded-md text-gray-700 font-semibold bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                >
                  이전
                </button>
                <button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  className="w-full py-3 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "가입 처리 중..." : "회원가입"}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="text-center">
          <Link
            to={"/login"}
            className="text-sm text-indigo-600 hover:underline"
          >
            이미 계정이 있으신가요?
            <div className="text-sm text-gray-800">로그인</div>
          </Link>
          <Link
            to={"/"}
            className="text-sm text-indigo-600 hover:underline ml-4"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
