import React, { useEffect, useState } from "react";

function TextContent({ storyScript, data, type }) {
  const matchedScript = storyScript.find(
    (script) => parseInt(script.title) === data.StoryType
  );
  if (!matchedScript) {
    return null; // 如果未找到匹配项，则返回 null 或默认文本
  }
  const curContent =
    type === "zh" ? matchedScript.zh_content : matchedScript.en_content;
  const answer = type === "zh" ? data.qcht : data.qen;
  const regex = /\[Q(\d)-(\d)\]/g;
  const replacedText = curContent.replace(
    regex,
    (match, questionIndex, placeholderIndex) => {
      // 获取占位符对应的替换文本
      const replacement = answer[questionIndex - 1][placeholderIndex - 1];

      // 如果找到替换文本，则返回替换文本，否则返回原始的匹配内容
      if (replacement !== undefined) {
        return `<span class="font-bold text-white">${replacement}</span>`; // 直接返回替换文本字符串
      } else {
        return match; // 返回原始的匹配内容
      }
    }
  );

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: replacedText }} />
    </>
  );
}

export default TextContent;
