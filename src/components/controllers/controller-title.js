import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";

export default function ControllerTitle({ control, intl, ...props }) {
  return (
    <Controller
      {...props}
      control={control}
      name={"title"}
      rules={{
        required: {
          value: true,
          message: "Le titre est requis",
        },
      }}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <>
          <TextField
            inputRef={ref}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
            name="title"
            id="title"
            color="primary"
            variant="standard"
            label={intl.formatMessage({
              id: "meeting.titleEvent",
            })}
            helperText=" "
          />
          <FormHelperText error>{error && error.message}</FormHelperText>
        </>
      )}
    />
  );
}
