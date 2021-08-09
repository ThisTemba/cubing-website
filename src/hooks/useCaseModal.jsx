import { useState, useRef } from "react";
import { Button, Table, Modal, CloseButton } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import _ from "lodash";
import useModal from "./useModal";
import { CaseImage } from "../components/common/cubing/cubeImage";
import DeletableOption from "../components/common/deletableOption";
import CenterModalHeader from "../components/common/centerModalHeader";

const CaseModalBody = ({ case: cas, caseSetDetails, editing }) => {
  const initialOptions = cas.algs.map((a) => ({ value: a, label: a }));
  const customOption = { value: "!@#$", label: "Custom" };
  const [options, setOptions] = useState([customOption, ...initialOptions]);
  const [selectedOption, setSelectedOption] = useState(options[1]);
  const selectRef = useRef();

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

  return (
    <div className="text-center">
      <CaseImage caseSetDetails={caseSetDetails} case={cas} size="200" />
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
              <td>{selectedOption && selectedOption.value}</td>
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
    </div>
  );
};

const CaseModalContent = ({ cas, caseSetDetails, hideModal }) => {
  const [editing, setEditing] = useState(false);
  const edit = () => setEditing(true);
  const save = () => setEditing(false);

  const caseModalContent = (
    <>
      <CenterModalHeader title={cas.name} onClose={hideModal} />
      <Modal.Body>
        <CaseModalBody
          case={cas}
          caseSetDetails={caseSetDetails}
          editing={editing}
        />
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
  const [_ModalComponent, _showModal, _hideModal] = useModal();
  const showModal = (cas, caseSetDetails) => {
    _showModal(
      <CaseModalContent
        cas={cas}
        caseSetDetails={caseSetDetails}
        hideModal={_hideModal}
      />
    );
  };

  const hideModal = _hideModal;
  const ModalComponent = _ModalComponent;

  return [ModalComponent, showModal, hideModal];
}
