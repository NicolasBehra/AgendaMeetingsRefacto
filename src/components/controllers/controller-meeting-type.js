import { Controller } from "react-hook-form";
import Autocomplete from "./components/autocomplete";

export default function ControllerMeetingType({
  control,
  intl,
  meetingTypesPicklist,
  ...props
}) {
  return (
    <Controller
      {...props}
      control={control}
      name={"meetingType"}
      rules={{
        required: {
          value: true,
          message: "Le type d'événement est requis",
        },
      }}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        return (
          <Autocomplete
            intl={intl}
            value={value ?? ""}
            values={meetingTypesPicklist.map((item) => item.value)}
            ref={ref}
            labelId="meeting.eventType"
            helperText="Meeting type"
            size="small"
            onChange={(event, value) => onChange(value)}
            error={error}
          />
        );
      }}
    />
  );
}
