import StepOne from "./one/StepOne";

interface FormStepsProps {
  step: 1 | 2 | 3 | 4;
  handleContinue: (step: 1 | 2 | 3 | 4) => void;
  handleCreate: () => void;
  title: string;
  setTitle: (title: string) => void;
  category: string;
  setCategory: (category: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

export default function FormSteps(props: FormStepsProps) {
  const { step, title, setTitle, category, setCategory, description, setDescription, handleContinue, handleCreate } = props;

  if (step === 1) {
    return (
      <StepOne title={title} setTitle={setTitle} category={category} setCategory={setCategory} description={description} setDescription={setDescription} handleContinue={handleContinue}/>
    )
  }

  return (
    <div>FormSteps</div>
  )
}
