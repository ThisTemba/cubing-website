import { useState, useRef, useEffect } from "react";
import { Button, Table, Modal, Accordion, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreatableSelect from "react-select/creatable";
import _ from "lodash";
import { useAuthState } from "../fire";
import CaseImage from "../components/common/cubing/cubeImage";
import DeletableOption from "../components/common/deletableOption";
import CenterModalHeader from "../components/common/centerModalHeader";
import useModal from "./useModal";
import { setDocument, getCaseSetDocRef } from "../utils/writeCases";

const CaseModalContent = ({ cas, caseSetDetails, hideModal }) => {
  const [options, setOptions] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [editing, setEditing] = useState(false);
  const [caseDoc, setCaseDoc] = useState(null);
  const user = useAuthState();
  const customOption = { value: null, label: "Custom" };

  useEffect(() => {
    const initialOptions = cas.algs.map((a) => ({ value: a, label: a }));
    setOptions([customOption, ...initialOptions]);
    setSelectedOption(newOption(cas.alg));
  }, []);

  const newOption = (alg, deletable = false) => ({
    label: alg,
    value: alg,
    deletable,
  });

  const edit = async () => {
    const caseSetDocRef = getCaseSetDocRef(user, caseSetDetails);
    const _caseDoc = await caseSetDocRef.collection("cases").doc(cas.id).get();
    setCaseDoc(_caseDoc);
    const userCase = _caseDoc.data();
    if (userCase && userCase.userAlgs) {
      const userAlgs = userCase.userAlgs;
      const userOptions = userAlgs.map((alg) => newOption(alg, true));
      setOptions([...options, ...userOptions]);
    }
    if (userCase && userCase.alg) {
      const alg = userCase.alg;
      setSelectedOption(newOption(alg));
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
    const newCase = oldCase ? { ...oldCase, alg } : { alg, id: cas.id };
    const newCases = [...oldCases.filter((c) => c.id !== cas.id), newCase];
    const newCaseSet = { ...oldCaseSet, cases: newCases };
    setDocument(caseSetDocRef, newCaseSet);
    setEditing(false);
  };

  const components = {
    Option: (props) => <DeletableOption {...props} onDelete={handleDelete} />,
  };

  const handleDelete = (delValue) => {
    const newOptions = options.filter((o) => o.value !== delValue);
    setOptions(newOptions);
    if (selectedOption.value === delValue) {
      const i = _.findIndex(options, (o) => o.value === delValue);
      setSelectedOption(newOptions[i - 1]);
    }
  };

  const handleCreate = (inputValue) => {
    const createdOption = newOption(inputValue, true);
    setOptions([...options, createdOption]);
    setSelectedOption(createdOption);
  };

  const handleChange = (option) => setSelectedOption(option);

  const statCols = [
    { key: "hRate", Header: <FontAwesomeIcon icon="spinner" /> },
    { key: "nmRate", Header: <FontAwesomeIcon icon="check" /> },
    { key: "mmRate", Header: <FontAwesomeIcon icon="minus" /> },
    { key: "cmRate", Header: <FontAwesomeIcon icon="times" /> },
    { key: "avgTime", Header: "Mean Time" },
    { key: "numSolves", Header: "Num Solves" },
  ];

  const caseModalContent = (
    <>
      <CenterModalHeader title={cas.name} onClose={hideModal} />
      <Modal.Body className="text-center">
        <CaseImage
          caseSetDetails={caseSetDetails}
          alg={selectedOption && selectedOption.value}
          size="200"
        />
        {!editing && (
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  Details
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Table size={"sm"} className="mb-0">
                  <tbody>
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
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle
                  as={Button}
                  variant="link"
                  eventKey="1"
                  disabled={!cas.numSolves}
                >
                  Stats
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Table size={"sm"} className="mb-0">
                  <tbody>
                    {statCols.map((c) => {
                      return (
                        <tr>
                          <th>{c.Header}</th>
                          <td>{cas[c.key]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        )}
        {editing && (
          <Table bordered>
            <tr>
              <th>{"Edit Algorithm:"}</th>
            </tr>
            <tr>
              <td>
                <CreatableSelect
                  options={options}
                  onChange={handleChange}
                  value={selectedOption}
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
