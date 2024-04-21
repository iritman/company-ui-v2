import React from "react";
import { Tree, Typography } from "antd";
import { DownOutlined as DownIcon } from "@ant-design/icons";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";

const { Text } = Typography;

const RelatedTafsilTypesTree = ({ moeinID, tafsilTypes }) => {
  const getTafsilTypeLevels = () => {
    let levels = [];

    tafsilTypes
      .filter((tt) => tt.MoeinID === moeinID)
      .forEach((tt) => {
        if (!levels.find((l) => l.LevelID === tt.LevelID)) {
          levels = [
            ...levels,
            {
              LevelID: tt.LevelID,
              Title: utils.farsiNum(`${Words.level} ${tt.LevelID}`),
            },
          ];
        }
      });

    return levels;
  };

  const levels = getTafsilTypeLevels();

  const getTafsilTypesData = () => {
    let nodes = [];

    //------

    levels.forEach((level) => {
      nodes = [
        ...nodes,
        {
          title: (
            <Text style={{ color: Colors.volcano[6] }}>{level.Title}</Text>
          ),
          key: level.LevelID,
        },
      ];
    });

    //------

    nodes.forEach((node) => {
      const data = tafsilTypes.filter(
        (tt) => tt.MoeinID === moeinID && tt.LevelID === node.key
      );

      if (data.length > 0) {
        let children = [];

        data.forEach((tafsil_type) => {
          children = [
            ...children,
            {
              title: (
                <Text style={{ color: Colors.blue[7] }}>
                  {tafsil_type.Title}
                </Text>
              ),
              key: `tafsil_type_id_${tafsil_type.TafsilTypeID}`,
            },
          ];
        });

        node.children = [...children];
      }
    });

    //------

    return nodes;
  };

  return (
    <Tree
      showLine
      switcherIcon={<DownIcon />}
      treeData={getTafsilTypesData()}
    />
  );
};

export const getTafsilTypeLevels = (moeinID, tafsilTypes) => {
  let levels = [];

  tafsilTypes
    .filter((tt) => tt.MoeinID === moeinID)
    .forEach((tt) => {
      if (!levels.find((l) => l.LevelID === tt.LevelID)) {
        levels = [
          ...levels,
          {
            LevelID: tt.LevelID,
            Title: utils.farsiNum(`${Words.level} ${tt.LevelID}`),
          },
        ];
      }
    });

  return levels;
};

export default RelatedTafsilTypesTree;
