import { Controller } from "react-hook-form";
import { CustomSelect } from "meteor/lfg-roadmap";
import FormHelperText from "@mui/material/FormHelperText";

export default function ControllerPillar({ control, _pillarsData, ...props }) {
  return (
    <Controller
      {...props}
      control={control}
      name={"pillar"}
      rules={{
        required: {
          value: true,
          message: "Le pilier est requis",
        },
      }}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <>
          <CustomSelect
            inputRef={ref}
            name="pillar"
            label="Piliers"
            document={{ pillar: value }}
            updateCurrentValues={({ pillar }) => onChange(pillar)}
            options={_pillarsData.map((it) => ({
              label: it.label,
              value: it.value,
            }))}
          />
          <FormHelperText error>{error && error.message}</FormHelperText>
        </>
      )}
    />
  );
}
