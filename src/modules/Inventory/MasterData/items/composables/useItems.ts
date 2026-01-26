import { useForm } from "vee-validate";
import { itemSchema } from "../validation/ItemSchema";

export function useItems() {
  const { handleSubmit, errors, defineField, setValues } = useForm({
    validationSchema: itemSchema,
  });

  const [code] = defineField("code");
  const [accessScope] = defineField("description");

  return {
    handleSubmit,
    errors,
    code,
    accessScope,
    setValues,
  };
}
