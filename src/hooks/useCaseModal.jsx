import { useState } from "react";
import Select from "react-select";
import { Table } from "react-bootstrap";
import useModal from "./useModal";
import { CaseImage } from "../components/common/cubing/cubeImage";

const CaseModalBody = (props) => {
  const cas = props.case;
  const caseSetDetails = props.caseSetDetails;
  const options = cas.algs.map((a) => ({ value: a, label: a }));
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <div className="text-center">
      <CaseImage caseSetDetails={caseSetDetails} case={cas} size="200" />
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
            <td style={{ width: "350px" }}>
              <Select
                value={selectedOption}
                options={options}
                width="200px"
                onChange={(value) => {
                  setSelectedOption(value);
                }}
              />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

const getCaseModalContent = (cas, caseSetDetails) => {
  const caseModalContent = {
    title: `${cas.name}`,
    body: <CaseModalBody case={cas} caseSetDetails={caseSetDetails} />,
  };
  return caseModalContent;
};

export default function useCaseModal() {
  const [_ModalComponent, _showModal, _hideModal] = useModal();
  const showModal = (cas, caseSetDetails) => {
    _showModal(getCaseModalContent(cas, caseSetDetails));
  };

  const hideModal = _hideModal;
  const ModalComponent = _ModalComponent;

  return [ModalComponent, showModal, hideModal];
}
