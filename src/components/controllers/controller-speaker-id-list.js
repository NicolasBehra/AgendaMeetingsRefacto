import { Controller } from "react-hook-form";
import Autocomplete from "./components/autocomplete";

export default function ControllerSpeakerIdList({
  control,
  intl,
  peoplesFormatted,
  ...props
}) {
  return (
    <Controller
      {...props}
      control={control}
      name={"speakersIdList"}
      rules={{
        required: {
          value: true,
          message: "Intervenant.e.s est requis.e.s",
        },
      }}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <Autocomplete
          intl={intl}
          value={value ?? ""}
          values={peoplesFormatted}
          ref={ref}
          labelId="meeting.speakerList"
          helperText="Meeting speakers"
          size="small"
          onChange={(event, value) => onChange(value)}
          error={error}
        />
      )}
    />
  );
}
