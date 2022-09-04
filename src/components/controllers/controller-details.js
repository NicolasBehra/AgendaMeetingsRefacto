import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";

export default function ControllerDetails({ control, intl, ...props }) {
  return (
    <Controller
      {...props}
      control={control}
      name={"details"}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <>
          <TextField
            inputRef={ref}
            fullWidth
            multiline
            id="details"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            color="primary"
            variant="standard"
            label={intl.formatMessage({
              id: "meeting.describeEvent",
            })}
            helperText=" "
          />
          <FormHelperText error>{error && error.message}</FormHelperText>
        </>
      )}
    />
  );
}
