import useModal from "./useModal";
import CaseModalContent from "../components/common/CaseModalContent";

export default function useCaseModal() {
  const [ModalComponent, _showModal, hideModal, _setContent] = useModal();
  const showModal = (cas, caseSetDetails) => {
    setContent(cas, caseSetDetails);
    _showModal();
  };

  const setContent = (cas, caseSetDetails) => {
    _setContent(
      <CaseModalContent
        cas={cas}
        caseSetDetails={caseSetDetails}
        hideModal={hideModal}
      />
    );
  };

  return [ModalComponent, showModal, hideModal, setContent];
}
