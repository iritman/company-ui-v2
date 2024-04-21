import React from "react";
import {
  ConfigProvider,
  Row,
  Col,
  Typography,
  InputNumber,
  Input,
  Switch,
} from "antd";
import Words from "../../../../resources/words";
import { DatePicker as DatePickerJalali, TimePicker } from "antd";
// import { DatePicker as DatePickerJalali, TimePicker } from "antd-jalali";
import fa_IR from "antd/lib/locale/fa_IR";
// import moment from "moment";
import utils from "../../../../tools/utils";

const { Text } = Typography;

const JalaliDatePicker = ({ dateValue, onChange }) => {
  return (
    <ConfigProvider locale={fa_IR} direction="rtl">
      <DatePickerJalali
        onChange={onChange}
        // value={
        //   dateValue && dateValue.length > 0 ? utils.jalaliDate(dateValue) : null
        // }
        style={{ width: "100%" }}
      />
    </ConfigProvider>
  );
};

const ProTimePicker = ({ timeValue, onChange }) => {
  return (
    <ConfigProvider locale={fa_IR} direction="rtl">
      <TimePicker
        locale={fa_IR}
        use12Hours
        format="h:mm a"
        // value={
        //   timeValue && timeValue.length > 0 ? moment(timeValue, "HHmm") : null
        // }
        onChange={onChange}
        style={{ width: "100%" }}
      />
    </ConfigProvider>
  );
};

const UserBachFeaturesForm = ({
  features,
  featureValues,
  onChangeFeatureValue,
}) => {
  const getFeatureValue = (featureID) => {
    return featureValues.find((f) => f.FeatureID === featureID)?.FeatureValue;
  };

  const handleChangeInputNumber = (featureID, value) => {
    const fv = [...featureValues];
    const index = fv.findIndex((f) => f.FeatureID === featureID);
    fv[index].FeatureValue = value;

    onChangeFeatureValue(fv);
  };

  const handleChangeInput = (featureID, e) => {
    const { value } = e.currentTarget;

    const fv = [...featureValues];
    const index = fv.findIndex((f) => f.FeatureID === featureID);
    fv[index].FeatureValue = value;

    onChangeFeatureValue(fv);
  };

  const handleChangeSwitch = (featureID, value) => {
    const fv = [...featureValues];
    const index = fv.findIndex((f) => f.FeatureID === featureID);
    fv[index].FeatureValue = value;

    onChangeFeatureValue(fv);
  };

  const handleChangeDate = (featureID, date) => {
    let value = "";

    if (date !== null) {
      const { $jy: jYear, $jM: jMonth, $jD: jDay } = date;

      value = `${jYear}${utils.addFirstZero(
        `${jMonth + 1}`
      )}${utils.addFirstZero(`${jDay}`)}`;
    }

    const fv = [...featureValues];
    const index = fv.findIndex((f) => f.FeatureID === featureID);
    fv[index].FeatureValue = value;

    onChangeFeatureValue(fv);
  };

  const handleChangeTime = (featureID, time) => {
    let value = "";

    if (time !== null) {
      const { $H: hour, $m: minute } = time;
      value = `${utils.addFirstZero(`${hour}`)}${utils.addFirstZero(
        `${minute}`
      )}`;
    }

    const fv = [...featureValues];
    const index = fv.findIndex((f) => f.FeatureID === featureID);
    fv[index].FeatureValue = value;

    onChangeFeatureValue(fv);
  };

  return (
    <div style={{ width: "100%", margin: 5 }}>
      <Row gutter={[0, 10]}>
        {features.map((feature) => (
          <>
            <Col xs={6} key={`title_${feature.FeatureID}`}>
              <Text>{feature.Title}</Text>
            </Col>
            <Col xs={18} key={`control_${feature.FeatureID}`}>
              {feature.ValueTypeID === 1 && (
                <InputNumber
                  min={0}
                  max={999999}
                  value={getFeatureValue(feature.FeatureID)}
                  onChange={(value) =>
                    handleChangeInputNumber(feature.FeatureID, value)
                  }
                />
              )}

              {feature.ValueTypeID === 2 && (
                <InputNumber
                  min={0}
                  max={999999}
                  precision={4}
                  maxLength={7}
                  step="0.01"
                  stringMode
                  decimalText
                  value={getFeatureValue(feature.FeatureID)}
                  onChange={(value) =>
                    handleChangeInputNumber(feature.FeatureID, value)
                  }
                />
              )}

              {feature.ValueTypeID === 3 && (
                <Input
                  maxLength={50}
                  value={getFeatureValue(feature.FeatureID)}
                  onChange={(e) => handleChangeInput(feature.FeatureID, e)}
                />
              )}

              {feature.ValueTypeID === 4 && (
                <Switch
                  checkedChildren={Words.yes}
                  unCheckedChildren={Words.no}
                  checked={getFeatureValue(feature.FeatureID)}
                  onChange={(e) => handleChangeSwitch(feature.FeatureID, e)}
                />
              )}

              {feature.ValueTypeID === 5 && (
                <JalaliDatePicker
                  dateValue={getFeatureValue(feature.FeatureID)}
                  onChange={(date) => handleChangeDate(feature.FeatureID, date)}
                />
              )}

              {feature.ValueTypeID === 6 && (
                <ProTimePicker
                  timeValue={getFeatureValue(feature.FeatureID)}
                  onChange={(time) => handleChangeTime(feature.FeatureID, time)}
                />
              )}
            </Col>
          </>
        ))}
      </Row>
    </div>
  );
};

export default UserBachFeaturesForm;
