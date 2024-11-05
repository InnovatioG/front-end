import StepOne from "./one/StepOne";
import { useCampaignStore } from "@/store/campaign/useCampaignStore";

interface FormStepsProps {

}

export default function FormSteps() {
  const { step, title, setTitle, category, setCategory, description, setDescription, handleContinue, handleCreate } = useCampaignStore();

  if (step === 1) {
    return (
      <StepOne title={title} setTitle={setTitle} category={category} setCategory={setCategory} description={description} setDescription={setDescription} handleContinue={handleContinue} />
    )
  }

  return (
    <div>FormSteps</div>
  )
}
