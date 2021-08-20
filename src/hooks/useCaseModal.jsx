import { useState, useRef, useEffect, useContext } from "react";
import { Button, Table, Modal, Accordion, Card } from "react-bootstrap";
import { FaIcon } from "../fontAwesome";
import CreatableSelect from "react-select/creatable";
import _ from "lodash";
import { UserContext } from "../fire";
import CaseImage from "../components/common/cubing/cubeImage";
import DeletableOption from "../components/common/deletableOption";
import CenterModalHeader from "../components/common/centerModalHeader";
import useModal from "./useModal";
import { setDocument, getCaseSetDocRef } from "../utils/writeCases";
import DarkModeContext from "../hooks/useDarkMode";

const CaseModalContent = ({ cas, caseSetDetails, hideModal }) => {
  const [options, setOptions] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [editing, setEditing] = useState(false);
  const [caseDoc, setCaseDoc] = useState(null);
  const { user } = useContext(UserContext);
  const customOption = { value: null, label: "Custom" };
  const { darkMode } = useContext(DarkModeContext);

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

    const userAlgs = userCase?.userAlgs;
    if (userAlgs) {
      const userOptions = userAlgs.map((alg) => newOption(alg, true));
      setOptions([...options, ...userOptions]);
    }

    const userAlg = userCase?.alg;
    if (userAlg) setSelectedOption(newOption(userAlg));
    else setSelectedOption(options[1]);

    setEditing(true);
  };

  const save = async () => {
    const userAlgs = options.filter((o) => o.deletable).map((o) => o.value);
    const alg = selectedOption.value;
    const newCaseDoc = { ...caseDoc.data(), alg, userAlgs };
    setDocument(caseDoc.ref, newCaseDoc);

    const caseSetDocRef = getCaseSetDocRef(user, caseSetDetails);
    const caseSetDoc = await caseSetDocRef.get();
    if (caseSetDoc.exists) {
      const oldCaseSet = caseSetDoc.data();
      const oldCases = oldCaseSet?.cases;
      if (oldCases) {
        const oldCase = _.find(oldCases, ["id", cas.id]);
        const newCase = oldCase ? { ...oldCase, alg } : { alg, id: cas.id };
        const newCases = [...oldCases.filter((c) => c.id !== cas.id), newCase];
        const newCaseSet = { ...oldCaseSet, cases: newCases };
        setDocument(caseSetDocRef, newCaseSet);
      } else {
        const newCases = [{ alg, id: cas.id }];
        const oldCaseSetNewCases = { ...oldCaseSet, cases: newCases };
        setDocument(caseSetDocRef, oldCaseSetNewCases);
      }
    } else {
      const newCaseSet = { cases: [{ alg, id: cas.id }] };
      setDocument(caseSetDocRef, newCaseSet);
    }
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
    { key: "hRate", Header: <FaIcon icon="spinner" /> },
    { key: "nmRate", Header: <FaIcon icon="check" /> },
    { key: "mmRate", Header: <FaIcon icon="minus" /> },
    { key: "cmRate", Header: <FaIcon icon="times" /> },
    { key: "avgTime", Header: "Mean Time" },
    { key: "numSolves", Header: "Num Solves" },
  ];

  const dropdownDarkTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: "#007bff",
      primary75: "#0057b7",
      primary50: "#003e82",
      primary25: "#002650",
      neutral0: "#191d21",
      danger: "#eb00ff",
      dangerLight: "#eb00ff",
      neutral5: "#eb00ff",
      neutral80: "#bfbfbf",
    },
  });

  const caseModalContent = (
    <>
      <CenterModalHeader title={cas.name} onClose={hideModal} />
      <Modal.Body className="text-center">
        <CaseImage
          caseSetDetails={caseSetDetails}
          alg={selectedOption?.value}
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
                      <td>
                        <Button
                          onClick={edit}
                          variant="link"
                          size="md"
                          className="p-0"
                        >
                          {cas.alg}
                        </Button>
                      </td>
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
              <th>{"New Algorithm:"}</th>
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
                  theme={darkMode && dropdownDarkTheme}
                />
              </td>
            </tr>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!editing && (
          <>
            <Button onClick={edit}>Edit</Button>
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
