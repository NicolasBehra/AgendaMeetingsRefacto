import { Controller } from "react-hook-form";
import FormHelperText from "@mui/material/FormHelperText";
import { ObjectiveTemplatePillarConditionalInput } from "meteor/lfg-roadmap";

export default function ControllerObjectiveTemplateSlug({
  control,
  _pillarsData,
  pillar,
  ...props
}) {
  return (
    <Controller
      control={control}
      name={"objectiveTemplateSlug"}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <>
          <ObjectiveTemplatePillarConditionalInput
            inputRef={ref}
            name="objectiveTemplateSlug"
            document={{ pillar, objectiveTemplateSlug: value }}
            label="Objectifs"
            updateCurrentValues={({ objectiveTemplateSlug }) =>
              onChange(objectiveTemplateSlug)
            }
            options={_pillarsData.map((it) => ({
              label: it?.label,
              value: it?.value,
            }))}
          />
          <FormHelperText error>{error && error.message}</FormHelperText>
        </>
      )}
    />
  );
}
