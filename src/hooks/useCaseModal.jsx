import { useState, useRef } from "react";
import { Button, Table, Modal, CloseButton } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import _ from "lodash";
import useModal from "./useModal";
import { CaseImage } from "../components/common/cubing/cubeImage";
import DeletableOption from "../components/common/deletableOption";
import CenterModalHeader from "../components/common/centerModalHeader";
import { setDocument, getCaseSetDocRef } from "../utils/writeCases";
import { useAuthState } from "../fire";

const CaseModalContent = ({ cas, caseSetDetails, hideModal }) => {
  const [editing, setEditing] = useState(false);
  const initialOptions = cas.algs.map((a) => ({ value: a, label: a }));
  const customOption = { value: "!@#$", label: "Custom" };
  const [options, setOptions] = useState([customOption, ...initialOptions]);
  const [selectedOption, setSelectedOption] = useState({
    value: cas.alg,
    label: cas.alg,
  });
  const [caseDoc, setCaseDoc] = useState(null);
  const user = useAuthState();
  const selectRef = useRef();

  const edit = async () => {
    const caseSetDocRef = getCaseSetDocRef(user, caseSetDetails);
    const _caseDoc = await caseSetDocRef.collection("cases").doc(cas.id).get();
    setCaseDoc(_caseDoc);
    const userCase = _caseDoc.data();
    if (userCase && userCase.userAlgs) {
      const userAlgs = userCase.userAlgs;
      const userOptions = userAlgs.map((a) => ({
        label: a,
        value: a,
        deletable: true,
      }));
      setOptions([...options, ...userOptions]);
    }
    if (userCase && userCase.alg) {
      const alg = userCase.alg;
      setSelectedOption({ label: alg, value: alg });
    } else setSelectedOption(options[1]);
    setEditing(true);
  };

  const save = async () => {
    const userAlgs = options.filter((o) => o.deletable).map((o) => o.value);
    const alg = selectedOption.value;
    const newCaseDoc = { ...caseDoc.data(), alg, userAlgs };
    setDocument(caseDoc.ref, newCaseDoc);

    const caseSetDocRef = getCaseSetDocRef(user, caseSetDetails);
    const caseSetDoc = await caseSetDocRef.get();
    const oldCaseSet = caseSetDoc.data();
    const oldCases = oldCaseSet.cases;
    const oldCase = _.find(oldCases, ["id", cas.id]);
    let newCase; // set id in case oldCase undefined

    if (oldCase) newCase = { ...oldCase, alg };
    else newCase = { alg, id: cas.id };

    const newCases = [...oldCases.filter((c) => c.id !== cas.id), newCase];
    const newCaseSet = { ...oldCaseSet, cases: newCases };
    setDocument(caseSetDocRef, newCaseSet);
    setEditing(false);
  };
  const components = {
    Option: (props) => <DeletableOption {...props} onDelete={handleDelete} />,
  };

  const handleDelete = (value) => {
    const newOptions = options.filter((o) => o.value !== value);
    setOptions(newOptions);
    const deletedIsSelected = selectedOption.value === value;
    if (deletedIsSelected) {
      const i = _.findIndex(options, (o) => o.value === value);
      if (i !== 0) setSelectedOption(newOptions[i - 1]);
    }
  };

  const handleCreate = (inputValue) => {
    const newOption = { label: inputValue, value: inputValue, deletable: true };
    setOptions([...options, newOption]);
    setSelectedOption(newOption);
  };

  const handleChange = (option) => {
    if (option && option.value === customOption.value) {
      setSelectedOption(null);
      selectRef.current.blur();
      selectRef.current.focus();
      // blur then focus ensures blinking typey cursor
    } else {
      setSelectedOption(option);
    }
  };

  const caseModalContent = (
    <>
      <CenterModalHeader title={cas.name} onClose={hideModal} />
      <Modal.Body className="text-center">
        <CaseImage
          caseSetDetails={caseSetDetails}
          alg={selectedOption && selectedOption.value}
          size="200"
          live
        />
        {!editing && (
          <Table bordered>
            <tbody>
              <tr>
                <th colspan="2">{"Details"}</th>
              </tr>
              <tr>
                <th>{"Name"}</th>
                <td>{cas.name}</td>
              </tr>
              {cas.group && (
                <tr>
                  <th>{"Group"}</th>
                  <td>{cas.group}</td>
                </tr>
              )}
              <tr>
                <th>{"Case Set"}</th>
                <td>{caseSetDetails.title}</td>
              </tr>
              <tr>
                <th>{"Algorithm"}</th>
                <td>{cas.alg}</td>
              </tr>
            </tbody>
          </Table>
        )}
        {editing && (
          <Table bordered>
            <tr>
              <th>{"Edit Algorithm:"}</th>
            </tr>
            <tr>
              <td>
                <CreatableSelect
                  ref={selectRef}
                  options={options}
                  value={selectedOption}
                  onChange={handleChange}
                  components={components}
                  onCreateOption={handleCreate}
                  placeholder="Type or paste custom alg..."
                />
              </td>
            </tr>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!editing && (
          <>
            <Button onClick={edit}>Edit Algorithm</Button>
            <Button variant="secondary" onClick={hideModal}>
              Close
            </Button>
          </>
        )}
        {editing && <Button onClick={save}>Save</Button>}
      </Modal.Footer>
    </>
  );

  return caseModalContent;
};

export default function useCaseModal() {
  const [_ModalComponent, _showModal, _hideModal, _setContent, _showing] =
    useModal();
  const showModal = (cas, caseSetDetails) => {
    setContent(cas, caseSetDetails);
    _showModal();
  };

  const hideModal = _hideModal;
  const ModalComponent = _ModalComponent;
  const setContent = (cas, caseSetDetails) => {
    _setContent(
      <CaseModalContent
        cas={cas}
        caseSetDetails={caseSetDetails}
        hideModal={_hideModal}
      />
    );
  };
  const showing = _showing;

  return [ModalComponent, showModal, hideModal, setContent, showing];
}
