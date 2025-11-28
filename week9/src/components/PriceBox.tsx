import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { clearCart } from "../slices/CartSlice";
import { openModal } from "../slices/ModalSlice";

const PriceBox = () => {
  const { total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleInitializeCart = () => {
    dispatch(clearCart());
    dispatch(openModal());
  };
  return (
    <div className="p-12 flex justify-between">
      <button
        className="border p-4 rounded-md cursor-pointer"
        onClick={handleInitializeCart}
      >
        장바구니 초기화
      </button>

      <div>총 가격 {total}원</div>
    </div>
  );
};

export default PriceBox;
