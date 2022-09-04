import { Controller } from "react-hook-form";
import Autocomplete from "./components/autocomplete";
import SpeakerGroupIcon from "@mui/icons-material/SpeakerGroup";
import EngineeringIcon from "@mui/icons-material/Engineering";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

export default function AdminGrid({
  control,
  intl,
  peoples,
  peoplesFormatted,
  loadingPeoples,
  promotions,
  _personaLabelData,
}) {
  return (
    <>
      <Grid container spacing={0} xs={12}>
        <Grid spacing={0} md={6} container direction="row">
          <Grid item>
            <PeopleAltIcon className="SvgIcon-filled" />
          </Grid>
          <Grid item xs sx={{ mr: "20px" }}>
            <Controller
              control={control}
              name={"maxParticipants"}
              rules={{
                valueAsNumber: true,
              }}
              render={({ field: { onChange, value, ref } }) => (
                <TextField
                  inputRef={ref}
                  onChange={(event) => onChange(Number(event.target.value))}
                  value={value}
                  fullWidth
                  id="maxParticipants"
                  label={intl.formatMessage({
                    id: "meeting.numberParticipantAccessEvent",
                  })}
                  InputProps={{ inputProps: { min: 1, max: 10_000 } }}
                  type="number"
                  color="primary"
                  variant="standard"
                  className="maxParticipants"
                  helperText=" "
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid spacing={0} md={6} container direction="row">
          <Grid item>
            <SpeakerGroupIcon className="SvgIcon-filled" />
          </Grid>
          <Grid item xs>
            {!loadingPeoples && peoples && (
              <Controller
                control={control}
                name={"participantsIdList"}
                render={({ field: { onChange, value, ref } }) => (
                  <Autocomplete
                    intl={intl}
                    value={value ?? ""}
                    values={peoplesFormatted}
                    ref={ref}
                    labelId="meeting.participantAccessEvent"
                    helperText="Par défaut, tous les participant.e.s y auront accès. Sélectionnez une ou plusieurs personnes pour les inscrire"
                    size="small"
                    onChange={(event, value) => onChange(value)}
                  />
                )}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={0} xs={12}>
        <Grid spacing={0} md={6} container direction="row">
          <Grid item>
            <EngineeringIcon className="SvgIcon-filled" />
          </Grid>
          <Grid item xs sx={{ mr: "20px" }} className="promotionAccess">
            <Controller
              control={control}
              name={"promotions"}
              render={({ field: { onChange, value, ref } }) => (
                <Autocomplete
                  intl={intl}
                  value={value ?? ""}
                  values={promotions}
                  ref={ref}
                  labelId="meeting.promotionAccessEvent"
                  helperText="Par défaut, toutes les promotions auront accès à l’événement. Pour restreindre l’accès, choisissez les promotions souhaitées"
                  size="small"
                  onChange={(event, value) => onChange(value)}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid spacing={0} md={6} container direction="row">
          <Grid item>
            <GroupWorkIcon className="SvgIcon-filled" />
          </Grid>
          <Grid item xs>
            <Controller
              control={control}
              name={"personaLabel"}
              render={({ field: { onChange, value, ref } }) => (
                <Autocomplete
                  intl={intl}
                  value={value ?? ""}
                  values={_personaLabelData?.map((it) => ({
                    label: it?.label,
                    value: it?.value,
                  }))}
                  ref={ref}
                  labelId="meeting.roleAccessEvent"
                  helperText="Par défaut, tous les rôles y auront accès. électionnez une ou plusieurs promotions pour restreindre l’accès."
                  size="small"
                  onChange={(event, value) => onChange(value)}
                />
              )}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
