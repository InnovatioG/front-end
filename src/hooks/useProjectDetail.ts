import { useState, useEffect } from "react";
import { initialTextEditorOptions } from "@/utils/constants";

export const useProjectDetail = () => {
  const initialContent = initialTextEditorOptions.reduce((acc, option) => {
    acc[option.id] = "";
    return acc;
  }, {});

  const initialContentReorder = initialTextEditorOptions.reduce(
    (acc, option, index) => {
      acc[option.id] = {
        id: option.id,
        title: option.title,
        content: "",
        order: index * 10,
      };
      return acc;
    },
    {}
  );

  const [textEditorOptions, setTextEditorOptions] = useState(
    initialTextEditorOptions.map((option, index) => ({
      ...option,
      order: index * 10,
    }))
  );
  const [selectedOption, setSelectedOption] = useState(
    initialTextEditorOptions[0]
  );
  const [content, setContent] = useState<{ [key: number]: string }>(
    initialContent
  );
  const [contentReorder, setContentReorder] = useState<{
    [key: number]: {
      id: number;
      title: string;
      content: string;
      order: number;
    };
  }>(initialContentReorder);

  const [newOptionTitle, setNewOptionTitle] = useState("");
  const [checkboxState, setCheckboxState] = useState<{
    [key: number]: boolean;
  }>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const newContentReorder = {};
    textEditorOptions.forEach((option) => {
      newContentReorder[option.id] = {
        id: option.id,
        title: option.title,
        content: content[option.id] || "",
        order: option.order,
      };
    });
    setContentReorder(newContentReorder);
  }, [content, textEditorOptions]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => (event: React.DragEvent) => {
    event.preventDefault();
    if (index === draggedIndex) return;

    const options = [...textEditorOptions];
    const item = options[draggedIndex];
    options.splice(draggedIndex, 1);
    options.splice(index, 0, item);
    setTextEditorOptions(options);

    const updatedContent = {};
    options.forEach((option) => {
      updatedContent[option.id] = content[option.id] || "";
    });
    setContent(updatedContent);

    console.log(
      "New order of options:",
      options.map((option) => option.title)
    );
    setDraggedIndex(index);
  };

  const handleCheckboxChange = (optionId: number) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [optionId]: !prevState[optionId],
    }));
  };

  const handleEditorChange = (newContent: string) => {
    setContent((prevContent) => ({
      ...prevContent,
      [selectedOption.id]: newContent,
    }));
  };

  const handleAddOption = () => {
    if (newOptionTitle.trim() === "") return;

    const newOption = {
      id:
        textEditorOptions.length > 0
          ? Math.max(...textEditorOptions.map((option) => option.id)) + 1
          : 1,
      title: newOptionTitle,
      order: textEditorOptions.length * 10,
    };

    setTextEditorOptions([...textEditorOptions, newOption]);
    setSelectedOption(newOption);
    setNewOptionTitle("");
  };

  const handleDragEnd = () => {
    const newContentReorder = {};
    textEditorOptions.forEach((option, index) => {
      newContentReorder[option.id] = {
        id: option.id,
        title: option.title,
        content: content[option.id] || "",
        order: index * 10,
      };
    });
    setContentReorder(newContentReorder);
    setDraggedIndex(null);
  };

  return {
    textEditorOptions,
    selectedOption,
    content,
    newOptionTitle,
    checkboxState,
    setSelectedOption,
    setNewOptionTitle,
    handleEditorChange,
    handleAddOption,
    handleCheckboxChange,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    contentReorder,
    draggedIndex,
  };
};
