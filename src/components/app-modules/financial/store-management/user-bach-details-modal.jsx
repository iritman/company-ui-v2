import React from "react";
import { Button, Modal, Row, Col, Typography, Space, Divider } from "antd";
import { getSorter } from "../../../../tools/form-manager";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import DetailsTable from "../../../common/details-table";

const { Text } = Typography;

const convertType = (value, valueTypeID) => {
  let result = value;

  if (valueTypeID === 4) {
    result = value ? Words.yes : Words.no;
  }

  return result;
};

const getFeaturesColumns = () => {
  let columns = [
    // {
    //   title: Words.id,
    //   width: 75,
    //   align: "center",
    //   dataIndex: "FeatureID",
    //   sorter: getSorter("FeatureID"),
    //   render: (FeatureID) => <Text>{utils.farsiNum(`${FeatureID}`)}</Text>,
    // },
    {
      title: Words.title,
      width: 120,
      align: "center",
      dataIndex: "Title",
      sorter: getSorter("Title"),
      render: (Title) => <Text>{Title}</Text>,
    },
    {
      title: Words.value,
      width: 100,
      align: "center",
      //   dataIndex: "FeatureValue",
      sorter: getSorter("FeatureValue"),
      render: (record) => (
        <Text
          style={{
            color: Colors.orange[6],
          }}
        >
          {convertType(record.FeatureValue, record.ValueTypeID)}
        </Text>
      ),
    },
  ];

  return columns;
};

const UserBachDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  return (
    <Modal
      open={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.more_details}
      footer={[
        <Button key="submit-button" type="primary" onClick={onOk}>
          {Words.confirm}
        </Button>,
      ]}
      onCancel={onOk}
      width={650}
    >
      <section>
        <article
          id="info-content"
          className="scrollbar-normal"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <Row gutter={[10, 10]}>
            <Col xs={24}>
              <Space>
                <Text>{`${Words.bach_no}:`}</Text>
                <Text style={{ color: Colors.red[6] }}>
                  {utils.farsiNum(`${selectedObject.BachID}`)}
                </Text>
              </Space>
            </Col>

            <Col xs={24}>
              <Space>
                <Text>{`${Words.product}:`}</Text>
                <Text
                  style={{ color: Colors.green[6] }}
                >{`${selectedObject.ProductCode} - ${selectedObject.Title}`}</Text>
              </Space>
            </Col>
            <Col xs={24}>
              <Space>
                <Text>{`${Words.registerar}:`}</Text>
                <Text
                  style={{ color: Colors.geekblue[6] }}
                >{`${selectedObject.RegFirstName} ${selectedObject.RegLastName}`}</Text>
              </Space>
            </Col>
            <Col xs={24}>
              <Space>
                <Text>{`${Words.reg_date_time}:`}</Text>
                <Text style={{ color: Colors.geekblue[6] }}>
                  {utils.farsiNum(
                    `${utils.slashDate(
                      selectedObject.RegDate
                    )} - ${utils.colonTime(selectedObject.RegTime)}`
                  )}
                </Text>
              </Space>
            </Col>
            {selectedObject.ValueList.length > 0 && (
              <>
                <Col xs={24}>
                  <Divider orientation="right" plain>
                    <Text>{Words.features}</Text>
                  </Divider>
                </Col>
                <Col xs={24}>
                  <DetailsTable
                    records={selectedObject.ValueList}
                    columns={getFeaturesColumns()}
                  />
                </Col>
              </>
            )}
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default UserBachDetailsModal;
