import { useDispatch } from "../hooks/useCustomRedux";
import { removeItem } from "../slices/CartSlice";
import { closeModal } from "../slices/ModalSlice";

const Modal = () => {
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    closeModal();
  };

  const removeAll = () => {
    // 장바구니 초기화 로직 작성
    dispatch(removeItem({ id: "all" }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="flex flex-col">
        <div>정말 삭제하시겠습니까?</div>
        <div>
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          >
            아니오
          </button>
          <button
            onClick={removeAll}
            className="absolute top-4 right-4 bg-red-500 text-white text-2xl font-bold cursor-pointer"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
