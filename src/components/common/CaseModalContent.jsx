import React from "react";
import { useState, useEffect, useContext } from "react";
import { Button, Table, Modal, Accordion, Card } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import _ from "lodash";
import { UserContext, getCaseSetDocRef, setDoc } from "../../services/firebase";
import { FaIcon } from "../../fontAwesome";
import CaseImage from "./cubing/cubeImage";
import DeletableOption from "./deletableOption";
import CenterModalHeader from "./centerModalHeader";
import DarkModeContext from "../../hooks/useDarkMode";
import { dispDur, dispDecimal } from "../../utils/displayValue";

export default function CaseModalContent({ cas, caseSetDetails, hideModal }) {
  const [options, setOptions] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [editing, setEditing] = useState(false);
  const [caseDoc, setCaseDoc] = useState(null);
  const { user } = useContext(UserContext);
  const { darkMode } = useContext(DarkModeContext);
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
    setDoc(caseDoc.ref, newCaseDoc);

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
        setDoc(caseSetDocRef, newCaseSet);
      } else {
        const newCases = [{ alg, id: cas.id }];
        const oldCaseSetNewCases = { ...oldCaseSet, cases: newCases };
        setDoc(caseSetDocRef, oldCaseSetNewCases);
      }
    } else {
      const newCaseSet = { cases: [{ alg, id: cas.id }] };
      setDoc(caseSetDocRef, newCaseSet);
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
    { key: "hRate", Header: <FaIcon icon="spinner" />, Cell: dispDecimal },
    { key: "nmRate", Header: <FaIcon icon="check" />, Cell: dispDecimal },
    { key: "mmRate", Header: <FaIcon icon="minus" />, Cell: dispDecimal },
    { key: "cmRate", Header: <FaIcon icon="times" />, Cell: dispDecimal },
    { key: "avgTime", Header: "Mean Time", Cell: dispDur },
    {
      key: "numSolves",
      Header: "Num Solves",
      Cell: (value) => dispDecimal(value, 0),
    },
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

  const Table1 = ({ cas, caseSetDetails }) => {
    return (
      <Table size={"sm"} className="mb-0">
        <tbody>
          <tr>
            <th className="align-middle">{"Name"}</th>
            <td className="align-middle">{cas.name}</td>
          </tr>
          {cas.group && (
            <tr>
              <th className="align-middle">{"Group"}</th>
              <td className="align-middle">{cas.group}</td>
            </tr>
          )}
          <tr>
            <th className="align-middle">{"Case Set"}</th>
            <td className="align-middle">{caseSetDetails.title}</td>
          </tr>
          <tr>
            <th className="align-middle">{"Algorithm"}</th>
            <td className="align-middle">
              <Button onClick={edit} variant="link" size="md" className="p-0">
                {cas.alg}
              </Button>{" "}
              <Button
                onClick={() =>
                  console.log(navigator.clipboard.writeText(cas.alg))
                }
                size="sm"
                variant={darkMode ? "dark" : "light"}
              >
                <FaIcon icon="copy"></FaIcon>
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  };

  const Table2 = ({ statCols, cas }) => {
    return (
      <Table size={"sm"} className="mb-0">
        <tbody>
          {statCols.map((col) => {
            return (
              <tr>
                <th>{col.Header}</th>
                <td>{col.Cell(cas[col.key])}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  const Footer = ({ editing, edit, hideModal, save }) => {
    return (
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
    );
  };

  return (
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
                <Table1 cas={cas} caseSetDetails={caseSetDetails} />
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
                <Table2 statCols={statCols} cas={cas} />
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
      <Footer editing={editing} edit={edit} hideModal={hideModal} save={save} />
    </>
  );
}
