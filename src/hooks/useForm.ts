import { useEffect, useState } from "react";

interface UseFormProps<T> {
  initialValue: T; //{email: '', password: ''}
  // 값이 올바른지 검증하는 함수
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValue);

  const [touched, setTouched] = useState<Record<string, boolean>>();

  const [errors, setErrors] = useState<Record<string, string>>();

  //사용자가 입력값을 바꿀 때 실행
  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values, //기존 값 유지
      [name]: text,
    });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  //이메일 인풋, 패스워드 인풋, 속성들을 가져오는 것
  const getInputProps = (name: keyof T) => {
    const value = values[name];
    const onChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => handleChange(name, e.target.value);

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  const resetForm = () => {
    setValues(initialValue);
    setTouched(
      Object.keys(initialValue as object).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<string, boolean>
      )
    );
    setErrors(
      Object.keys(initialValue as object).reduce(
        (acc, key) => ({ ...acc, [key]: "" }),
        {} as Record<string, string>
      )
    );
  };

  //values가 변경될 때마다 에러 검증 로직 실행
  //{eamil: ''}
  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [validate, values]);
  return { values, errors, touched, getInputProps, resetForm };
}

export default useForm;
