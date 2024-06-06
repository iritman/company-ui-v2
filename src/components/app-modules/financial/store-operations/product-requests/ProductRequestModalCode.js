import { Button } from "antd";
import { PlusOutlined as AddIcon } from "@ant-design/icons";
import Words from "../../../../../resources/words";
import {
  emptyColumn,
  modifyColumn,
  getColumn,
} from "../../../../antd-general-components/FormManager";
import Colors from "../../../../../resources/colors";
import { Label, LabelType } from "../../../../antd-general-components/Label";

export const getItemsColumns = (access, statusID, onEdit, onDelete) => {
  let columns = [
    getColumn(Words.id, 75, "ItemID", { labelProps: { farsi: true } }),
    getColumn(Words.product_code, 150, "ProductCode", {
      labelProps: { farsi: true, color: Colors.orange[6] },
    }),
    getColumn(Words.product, 150, "Title", {
      labelProps: { farsi: true, color: Colors.cyan[6] },
    }),
    getColumn(Words.brand, 150, "Brand", {
      labelProps: { farsi: true, color: Colors.grey[6] },
    }),
    getColumn(Words.commercial_code, 150, "CommercialCode", {
      labelProps: { farsi: true, color: Colors.grey[6] },
    }),
    getColumn(Words.techniacl_info, 100, "TechnicalInfo", {
      noDataIndex: true,
      noSorter: true,
      isDescriptions: true,
    }),
    getColumn(Words.request_count, 150, "RequestCount", {
      labelProps: { farsi: true, color: Colors.red[6] },
    }),
    getColumn(Words.storage_inventory_count, 150, "StorageInventoryCount", {
      labelProps: {
        farsi: true,
        color: Colors.green[6],
      },
      renderFunc: (data) => (!data || data === -1 ? "-" : data),
    }),
    getColumn(Words.store_inventory_count, 150, "StoreInventoryCount", {
      labelProps: {
        farsi: true,
        color: Colors.green[6],
      },
      renderFunc: (data) => (!data || data === -1 ? "-" : data),
    }),
    getColumn(Words.measure_unit, 150, "MeasureUnitTitle", {
      labelProps: { farsi: true, color: Colors.grey[6] },
    }),
    getColumn(Words.descriptions, 100, "DetailsText", {
      noDataIndex: true,
      noSorter: true,
      isDescriptions: true,
    }),
    getColumn(Words.status, 150, "StatusTitle", {
      labelProps: { color: Colors.grey[6] },
    }),
  ];

  if (access) {
    // StatusID : 1 => Not Approve, Not Reject! Just Save...
    if (
      statusID === 1 &&
      ((access.CanDelete && onDelete) || (access.CanEdit && onEdit))
    ) {
      columns = [...columns, modifyColumn(access, onEdit, onDelete)];
    }
  }

  columns = [...columns, emptyColumn];

  return columns;
};

export const getActionsColumns = () => {
  let columns = [
    getColumn(Words.id, 75, "ActionID", { labelProps: { farsi: true } }),
    getColumn(Words.registerar, 150, "", {
      labelProps: {
        farsi: true,
        color: Colors.cyan[6],
      },
      noDataIndex: true,
      noSorter: true,
      renderFunc: (data) => `${data.FirstName} ${data.LastName}`,
    }),
    getColumn(Words.role, 150, "SysRoleTitle", {
      labelProps: {
        farsi: true,
        color: Colors.blue[6],
      },
    }),
    getColumn(Words.status, 150, "IsPassed", {
      noDataIndex: true,
      noSorter: true,
      noDefaultLabel: true,
      renderFunc: (data) => (
        <Label farsi color={data.IsPassed ? Colors.green[6] : Colors.red[6]}>
          {`${data.IsPassed ? Words.accepted : Words.not_accepted}`}
        </Label>
      ),
    }),
    getColumn(Words.descriptions, 100, "DetailsText", {
      noDataIndex: true,
      noSorter: true,
      isDescriptions: true,
    }),
    getColumn(Words.reg_date, 100, "RegDate", {
      labelProps: {
        farsi: true,
        color: Colors.orange[8],
        type: LabelType.date,
      },
    }),
    getColumn(Words.reg_time, 100, "RegTime", {
      labelProps: {
        farsi: true,
        color: Colors.orange[8],
        type: LabelType.time,
      },
    }),
  ];

  columns = [...columns, emptyColumn];

  return columns;
};

export const getNewButton = (disabled, onClick) => {
  return (
    <Button
      type="primary"
      onClick={onClick}
      icon={<AddIcon />}
      disabled={disabled}
    >
      {Words.new}
    </Button>
  );
};
