import { useState } from "react";

export const initialTextEditorOptions = [
  {
    id: 1,
    title: "What's the product?",
    content:
      "In this section, you should provide a clear and concise description of your product, service, or project. Answer questions like what it is, what it does, If it's a physical product, describe its key features and how it benefits the user. If it's a service, explain what it entails and how it satisfies a need or solves a specific problem.",
  },
  {
    id: 2,
    title: "What's your value?",
    content:
      "In this section, highlight the unique and valuable aspects of your digital product, service, or project. Explore how it stands out from other available options in the market and why it's a superior choice. This may include distinctive features, additional benefits, competitive advantages, or core values that support your proposal.",
  },
  {
    id: 3,
    title: "How it works?",
    content:
      "In this section, explain how your product, service, or project operates in practice. Detail the steps or processes involved, from acquisition to use or implementation. If it's a product, describe how it's used and what benefits it offers to users. If it's a service, explain how it's delivered and how customers can access it. If it's a project, describe how it will be carried out and what stages or milestones it will involve.",
  },
  {
    id: 4,
    title: "Marketing Strategy",
    content:
      "In this section, describe your general strategy to promote and market your digital product, service, or project. Explore the marketing channels you will utilize, such as social media, email marketing, digital advertising, etc. Detail your specific tactics, like content creation, participation in events, collaboration with influencers, etc. It's also helpful to explain how you will measure and evaluate the success of your marketing efforts.",
  },
];

export const useProjectDetail = () => {
  const [textEditorOptions, setTextEditorOptions] = useState(
    initialTextEditorOptions
  );
  const [selectedOption, setSelectedOption] = useState(
    initialTextEditorOptions[0]
  );
  const [content, setContent] = useState<{ [key: number]: string }>({});
  const [newOptionTitle, setNewOptionTitle] = useState("");
  const [checkboxState, setCheckboxState] = useState<{
    [key: number]: boolean;
  }>({});

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
    };

    setTextEditorOptions([...textEditorOptions, newOption]);
    setSelectedOption(newOption);
    setNewOptionTitle("");
  };

  const handleCheckboxChange = (optionId: number) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [optionId]: !prevState[optionId],
    }));
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
  };
};
