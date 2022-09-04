import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "@types/react";
import FormHelperText from "@mui/material/FormHelperText";

const findDefaultValue = (arrayList, value) =>
  arrayList?.filter((arrayItem) => value?.includes(arrayItem?.value));

export default function FormAutocomplete({
  error,
  values,
  value,
  onChange,
  ref,
  labelId,
  helperText,
  size = "small",
  intl,
  ...props
}) {
  return (
    <>
      <Autocomplete
        {...props}
        inputRef={ref}
        value={findDefaultValue(values, value)}
        onChange={(event, item) => onChange(item?.map((it) => it?.value))}
        multiple
        options={values}
        disableCloseOnSelect
        filterSelectedOptions
        getOptionLabel={(option) =>
          values?.find((it) => it?.value === option?.value)?.label ?? ""
        }
        renderInput={(params) => (
          <TextField
            variant="standard"
            {...params}
            label={intl.formatMessage({ id: labelId })}
            helperText={helperText}
          />
        )}
        size={size}
      />
      <FormHelperText error>{error && error.message}</FormHelperText>
    </>
  );
}
