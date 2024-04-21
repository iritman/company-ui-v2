import { Tag } from "antd";

const TagsPopupContent = ({ tags, selectedTags, onClick }) => {
  return (
    <div style={{ width: 300 }}>
      <section>
        <article
          id="tag-list-content"
          className="scrollbar-normal"
          style={{ minHeight: "300px", maxHeight: "300px" }}
        >
          {tags
            .filter(
              (tag) =>
                selectedTags.filter((t) => t.TagID === tag.TagID).length === 0
            )
            .map((tag) => (
              <Tag
                key={tag.TagID}
                color={tag.Color}
                onClick={() => onClick(tag)}
                style={{ cursor: "pointer", margin: 5 }}
              >
                {tag.Title}
              </Tag>
            ))}
        </article>
      </section>
    </div>
  );
};
export default TagsPopupContent;
