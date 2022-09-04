import { SnackbarLfg } from "meteor/lfg-lib";
import React, { useEffect, useState } from "react";
import styledRaw from "@emotion/styled";
import { Controller, useForm } from "react-hook-form";
import {
  Components,
  useCreate2,
  useCurrentUser,
  useMulti2,
  useUpdate2,
} from "meteor/vulcan:core";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import { FormattedMessage, intlShape } from "meteor/vulcan:i18n";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import _get from "lodash/get";

import PausePresentationIcon from "@mui/icons-material/PausePresentation";
import Edit from "@mui/icons-material/Edit";
import CampaignIcon from "@mui/icons-material/Campaign";
import LineStyleIcon from "@mui/icons-material/LineStyle";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkIcon from "@mui/icons-material/Link";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SpeakerGroupIcon from "@mui/icons-material/SpeakerGroup";
import EngineeringIcon from "@mui/icons-material/Engineering";
import GroupWorkIcon from "@mui/icons-material/GroupWork";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import DateFnsUtils from "@date-io/date-fns";
import { fr } from "date-fns/locale";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import Tooltip from "@mui/material/Tooltip";
import {
  AlertComponent,
  isAdminOrIsMod,
  personaLabelData,
  regex,
} from "meteor/lfg-lib";
import {
  CustomSelect,
  ObjectiveTemplatePillarConditionalInput,
} from "meteor/lfg-roadmap";
import { useCustomPicklist } from "meteor/lfg-picklist";
import { meetingTypes } from "../../../modules/meetings/meetingSchema";
import { yearsArray } from "meteor/lfg-people";
import { useHistory } from "react-router";
import FormHelperText from "@mui/material/FormHelperText";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const Container = styledRaw.div`
  width: 100%;
  padding: 30px;
  white-space: pre-line;
`;
const Root = styledRaw.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;

  .h1 {
    color: ${(props) => props?.$primaryColor || "#5c239b"};
    font-size: 24px;
    margin-bottom: 20px;
  }

  .MuiPaper-root {
    border-radius: 10px;
    width: 100%;
  }

  .MuiGridRoot {
    align-items: flex-start;
  }

  .MuiInput-input {
    font-size: 16px;
  }

  .MuiInputLabel-root {
    font-size: 17px;
    color: rgba(0,0,0,0.87);
    font-family: raleway;
  }

  .MuiInputLabel-shrink {
    color: ${(props) => props?.$primaryColor || "#5c239b"};
    font-size: 17px;
  }
  .MuiInputLabel-root.Mui-focused {
    color: ${(props) => props?.$primaryColor || "#5c239b"};
    font-size: 17px;
  }
  .MuiInputBase-input {
    font-size: 18px;
  }

  .MuiButton-root {
    margin: 60px 0 50px 28px;
  }

  .MuiFormHelperText-root {
    color: rgba(0, 0, 0, 0.54);
  }

  .SvgIcon-filled {
    margin: 20px 16px 0 0;
    fill: rgba(0, 0, 0, 0.54);
  }

  .MuiFormControl-root {
    width: 100%;
  }

  .MuiFilledInput-root {
    background-color: #fff;
    width: 100%;
  }

  .maxParticipants {
    margin-top: -2px;
  }

  .MuiStack-root {
    width: 100%;
  }
`;

const datePickerTheme = createTheme({
  typography: {
    fontSize: 12,
  },
});

const AgendaMeetings = (props, { intl }) => {
  const theme = useTheme();
  const primaryColor = _get(theme, "palette.primary.main");
  const history = useHistory();

  const meeting = history?.location?.state?.meeting;
  const isCloneable = history?.location?.state?.isCloneable;

  const { currentUser } = useCurrentUser();
  if (!currentUser) throw new Error("currentUser not found");
  if (!currentUser.people) throw new Error("No people found for currentUser");

  const isAdminMod = isAdminOrIsMod(currentUser);
  const [createMeeting] = useCreate2({
    collectionName: "Meetings",
  });
  const [updateMeeting] = useUpdate2({
    collectionName: "Meetings",
  });

  const [pillar, setPillar] = useState(meeting?.pillar);
  const [objectiveTemplateSlug, setObjectiveTemplateSlug] = useState(
    meeting?.objectiveTemplateSlug
  );
  const [title, setTitle] = useState(meeting?.title);

  const { control, getValues, watch, handleSubmit } = useForm({
    mode: "all",
    reValidateMode: "onBlur",
    defaultValues: {
      pillar,
      title,
      objectiveTemplateSlug,
      promotions: meeting?.promotions,
      personaLabel: meeting?.personaLabel,
      connexionLink: meeting?.connexionLink,
      meetingType: meeting?.meetingType,
      details: meeting?.details,
      speakersIdList: meeting?.speakersIdList,
      participantsIdList: meeting?.participantsIdList,
      maxParticipants: meeting?.maxParticipants,
      where: meeting?.where,
      start: meeting?.start || null,
      end: meeting?.end || null,
    },
  });
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [snackBarText, setSnackBarText] = useState(
    "Votre meeting a été enregistré."
  );

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "pillar") {
        setPillar(value?.pillar);
      }

      if (name === "objectiveTemplateSlug") {
        setObjectiveTemplateSlug(value?.objectiveTemplateSlug);
      }

      if (name === "title") {
        setTitle(value?.title);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  /* La méthode est trop complexe, beaucoup trop de if imbriqué, il serait bon de splitter un peu en plusieurs fonction ayant chacun sa responsabilité.
    De plus, les retours de création et de sauvegarde sont quasiment identique sauf la partie history. Il y a moyen de factoriser.
  */
  const onSubmitForms = async () => {
    const values = getValues();

    const data = {
      ...values,
      ...(values.maxParticipants
        ? { maxParticipants: Number(values.maxParticipants) }
        : { maxParticipants: undefined }),
    };
    delete data?.__typename;
    if (meeting) {
      if (isCloneable) {
        return await createMeeting({
          data,
        })
          .then((res) => {
            setOpenSnackBar(true); //Utilisé et dans le then, et dans le catch du coup il pourrait plutôt être mis dans un finally.
            history.push("/bo/meetings");
            return res;
          })
          .catch((err) => {
            // #Factorisation, on peut trouver au minimum trois fois cette méthode. Ligne 237, 255, 267
            setSnackBarText("Une erreur est survenue");
            setOpenSnackBar(true);
            return err;
          });
      }
      await updateMeeting({
        input: {
          id: meeting?._id,
          data,
        },
      })
        .then((res) => {
          setOpenSnackBar(true);
          history.goBack();
          return res;
        })
        // attention à l'utilisation des .catch, ils ne font pas que gérer les erreurs des promesses,
        // il se déclenche aussi s'il y a une erreur dans le then, pour gérés les erreurs de ajax,
        // il vaut mieux utiliser le deuxième paramètre de la méthode then
        .catch((err) => {
          setSnackBarText("Une erreur est survenue");
          setOpenSnackBar(true);
          return err;
        });
    } else {
      await createMeeting({
        data,
      })
        .then((res) => {
          setOpenSnackBar(true);
          history.push(`/agenda/${res?.document?._id}`);
          return res;
        })
        .catch((err) => {
          setSnackBarText("Une erreur est survenue");
          setOpenSnackBar(true);
          return err;
        });
    }
  };

  const { picklist: _pillarsData } = useCustomPicklist("pillars");
  const { picklist: _personaLabelData } = useCustomPicklist(
    "personaLabel",
    personaLabelData
  );

  const { picklist: promotions } = useCustomPicklist("promotions", yearsArray);
  const { picklist: meetingTypesPicklist } = useCustomPicklist(
    "meetingType",
    meetingTypes
  );

  const { loading: loadingPeoples, results: peoples } = useMulti2(
    { collectionName: "Peoples", fragmentName: "BasicPeopleFragment" },
    {
      input: {
        filter: { tenantId: { _eq: currentUser?.tenantId } },
        limit: 1_000_000,
      },
    }
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };
  const getErrors = (errors) => errors && setOpenAlert(true);
  const peoplesFormatted =
    peoples?.map((people) => ({
      label: `${people?.firstName} ${people?.lastName}`,
      value: people?.userId,
    })) || [];

  const findDefaultValue = (arrayList, value) =>
    arrayList?.filter((arrayItem) => value?.includes(arrayItem?.value));

  return (
    <Root $primaryColor={primaryColor}>
      <Container>
        <Grid container>
          <Paper sx={{ padding: 4 }}>
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Grid item>
                <h1 className="h1">
                  {isAdminOrIsMod(currentUser) ? (
                    // Ce code est dupliqué vers la fin, il serait plus judicieux de le sortir d'un composant externe
                    isCloneable ? (
                      <FormattedMessage id="meeting.programCloneEvent" />
                    ) : meeting ? (
                      <FormattedMessage id="meeting.programEditEvent" />
                    ) : (
                      <FormattedMessage id="meeting.programNewEvent" />
                    )
                  ) : (
                    <FormattedMessage id="meeting.suggestEvent" />
                  )}
                </h1>
              </Grid>
              <Tooltip title={"Retour"} placement="bottom">
                <IconButton onClick={() => history.goBack()}>
                  <CloseIcon color={"primary"} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} md={2}>
                <Controller
                  control={control}
                  name={"pillar"}
                  rules={{
                    required: {
                      value: true,
                      message: "Le pilier est requis",
                    },
                  }}
                  render={({
                    field: { onChange, value, ref },
                    fieldState: { error },
                  }) => (
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
                      <FormHelperText error>
                        {error && error.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                {pillar && (
                  <Controller
                    control={control}
                    name={"objectiveTemplateSlug"}
                    render={({
                      field: { onChange, value, ref },
                      fieldState: { error },
                    }) => (
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
                        <FormHelperText error>
                          {error && error.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                )}
              </Grid>
            </Grid>
            <Grid spacing={0} xs={12} container direction="row">
              <Grid item>
                <PausePresentationIcon className="SvgIcon-filled" />
              </Grid>
              <Grid item xs>
                <Controller
                  control={control}
                  name={"meetingType"}
                  rules={{
                    required: {
                      value: true,
                      message: "Le type d'événement est requis",
                    },
                  }}
                  render={({
                    field: { onChange, value, ref },
                    fieldState: { error },
                  }) => {
                    return (
                      <>
                        <Autocomplete
                          value={value ?? ""}
                          inputRef={ref}
                          options={meetingTypesPicklist.map(
                            (item) => item.value
                          )}
                          filterSelectedOptions
                          getOptionLabel={(value) =>
                            meetingTypesPicklist.find(
                              (meetingType) => meetingType.value === value
                            )?.label ?? ""
                          }
                          renderInput={(params) => (
                            <TextField
                              variant="standard"
                              {...params}
                              label={intl.formatMessage({
                                id: "meeting.eventType",
                              })}
                              helperText=" "
                            />
                          )}
                          size="small"
                          onChange={(event, value) => onChange(value)}
                        />
                        <FormHelperText error>
                          {error && error.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={0}>
              <Grid spacing={0} md={6} container direction="row">
                <Grid item>
                  <Edit className="SvgIcon-filled" />
                </Grid>
                <Grid item xs sx={{ mr: "20px" }}>
                  <Controller
                    control={control}
                    name={"title"}
                    rules={{
                      required: {
                        value: true,
                        message: "Le titre est requis",
                      },
                    }}
                    render={({
                      field: { onChange, value, ref },
                      fieldState: { error },
                    }) => (
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
                        <FormHelperText error>
                          {error && error.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid spacing={0} md={6} container direction="row">
                <Grid item>
                  <CampaignIcon className="SvgIcon-filled" />
                </Grid>
                <Grid item xs>
                  <Controller
                    control={control}
                    name={"speakersIdList"}
                    rules={{
                      required: {
                        value: true,
                        message: "Intervenant.e.s est requis.e.s",
                      },
                    }}
                    render={({
                      field: { onChange, value, ref },
                      fieldState: { error },
                    }) => {
                      return (
                        <>
                          <Autocomplete
                            inputRef={ref}
                            value={findDefaultValue(peoplesFormatted, value)}
                            onChange={(event, speakersId) =>
                              onChange(speakersId?.map((it) => it?.value))
                            }
                            multiple
                            options={peoplesFormatted}
                            disableCloseOnSelect
                            filterSelectedOptions
                            getOptionLabel={(option) =>
                              peoplesFormatted?.find(
                                (it) => it?.value === option?.value
                              )?.label ?? ""
                            }
                            renderInput={(params) => (
                              <TextField
                                variant="standard"
                                {...params}
                                label={intl.formatMessage({
                                  id: "meeting.speakerList",
                                })}
                                helperText=" "
                              />
                            )}
                            size="small"
                          />
                          <FormHelperText error>
                            {error && error.message}
                          </FormHelperText>
                        </>
                      );
                    }}
                  />
                </Grid>
              </Grid>
              <Grid spacing={0} xs={12} container direction="row">
                <Grid item>
                  <LineStyleIcon className="SvgIcon-filled" />
                </Grid>
                <Grid item xs>
                  <Controller
                    control={control}
                    name={"details"}
                    render={({
                      field: { onChange, value, ref },
                      fieldState: { error },
                    }) => (
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
                        <FormHelperText error>
                          {error && error.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
              </Grid>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={fr}
                utils={DateFnsUtils}
              >
                <Grid container spacing={0}>
                  <Grid spacing={0} md={6} container direction="row">
                    <Grid item>
                      <Tooltip title={"Date de début"} placement="top">
                        <DateRangeIcon className="SvgIcon-filled" />
                      </Tooltip>
                    </Grid>
                    <Grid item xs sx={{ mr: "20px" }}>
                      <Controller
                        control={control}
                        name={"start"}
                        rules={{
                          required: {
                            value: true,
                            message: "La date est requise",
                          },
                        }}
                        render={({
                          field: { onChange, value, ref },
                          fieldState: { error },
                        }) => (
                          <Grid item xs>
                            <ThemeProvider theme={datePickerTheme}>
                              <DateTimePicker
                                inputRef={ref}
                                name="start"
                                label="Date et heure de début"
                                value={value}
                                disablePast
                                ampm={false}
                                wrapperClassName="dateTimePicker"
                                mask={intl.formatMessage({
                                  id: "datetime.mask",
                                })}
                                inputFormat={intl.formatMessage({
                                  id: "datetime.format",
                                })}
                                inputProps={{
                                  placeholder: intl.formatMessage({
                                    id: "datetime.placeholder",
                                  }),
                                }}
                                onChange={(newValue) => onChange(newValue)}
                                selected={value}
                                renderInput={(params) => (
                                  <TextField
                                    variant="standard"
                                    {...params}
                                    helperText=" "
                                  />
                                )}
                              />
                            </ThemeProvider>
                            <FormHelperText error>
                              {error && error.message}
                            </FormHelperText>
                          </Grid>
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid spacing={0} md={6} container direction="row">
                    <Grid item>
                      <Tooltip title={"Date de fin"} placement="top">
                        <ArrowForward className="SvgIcon-filled" />
                      </Tooltip>
                    </Grid>
                    <Grid item xs>
                      <Controller
                        control={control}
                        name={"end"}
                        rules={{
                          required: {
                            value: true,
                            message:
                              "La date de fin est requise et doit être supérieure à la date de début",
                          },
                        }}
                        render={({
                          field: { onChange, value, ref },
                          fieldState: { error },
                        }) => (
                          <Grid item xs>
                            <ThemeProvider theme={datePickerTheme}>
                              <DateTimePicker
                                inputRef={ref}
                                name="end"
                                label="Date et heure de fin"
                                value={value}
                                ampm={false}
                                mask={intl.formatMessage({
                                  id: "datetime.mask",
                                })}
                                inputFormat={intl.formatMessage({
                                  id: "datetime.format",
                                })}
                                inputProps={{
                                  placeholder: intl.formatMessage({
                                    id: "datetime.placeholder",
                                  }),
                                }}
                                minDateTime={new Date(getValues().start)}
                                onChange={(newValue) => onChange(newValue)}
                                selected={value}
                                renderInput={(params) => (
                                  <TextField
                                    variant="standard"
                                    {...params}
                                    helperText=" "
                                  />
                                )}
                              />
                            </ThemeProvider>
                            <FormHelperText error>
                              {error && error.message}
                            </FormHelperText>
                          </Grid>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </LocalizationProvider>
              <Grid container xs={12} spacing={0}>
                <Grid spacing={0} md={6} container direction="row">
                  <Grid item>
                    <LocationOnIcon className="SvgIcon-filled" />
                  </Grid>
                  <Grid item xs sx={{ mr: "20px" }}>
                    <Controller
                      control={control}
                      name={"where"}
                      rules={{
                        required: {
                          value: true,
                          message: "La localisation est requise",
                        },
                      }}
                      render={({
                        field: { onChange, value, ref },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            inputRef={ref}
                            fullWidth
                            id="where"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            label={intl.formatMessage({
                              id: "meeting.location",
                            })}
                            color="primary"
                            variant="standard"
                            helperText=" "
                          />
                          <FormHelperText error>
                            {error && error.message}
                          </FormHelperText>
                        </>
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid spacing={0} md={6} container direction="row">
                  <Grid item>
                    <LinkIcon className="SvgIcon-filled" />
                  </Grid>
                  <Grid item xs>
                    <Controller
                      control={control}
                      name={"connexionLink"}
                      rules={{
                        pattern: {
                          value: regex.Url,
                          message: "Veuillez saisir un URL valide.",
                        },
                      }}
                      render={({
                        fieldState: { error },
                        field: { onChange, value, ref },
                      }) => (
                        <>
                          <TextField
                            fullWidth
                            inputRef={ref}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            id="connexionLink"
                            label={intl.formatMessage({
                              id: "meeting.link",
                            })}
                            color="primary"
                            variant="standard"
                            helperText=" "
                          />
                          <FormHelperText error>
                            {error && error.message}
                          </FormHelperText>
                        </>
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* Il serait judicieux de sortir la partie admin dans un sous composant, en utilisant Un React.Lazy,
            // pour ne le charger que dans les cas où il est réellement utile. */}
            {isAdminMod && (
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
                            onChange={(event) =>
                              onChange(Number(event.target.value))
                            }
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
                              inputRef={ref}
                              value={findDefaultValue(peoplesFormatted, value)}
                              onChange={(event, participantsIdList) =>
                                onChange(
                                  participantsIdList?.map((it) => it?.value)
                                )
                              }
                              multiple
                              options={peoplesFormatted}
                              disableCloseOnSelect
                              filterSelectedOptions
                              getOptionLabel={(option) =>
                                peoplesFormatted?.find(
                                  (it) => it?.value === option?.value
                                )?.label ?? ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  variant="standard"
                                  {...params}
                                  helperText="Par défaut, tous les participant.e.s y auront accès. Sélectionnez une ou plusieurs personnes pour les inscrire"
                                  label={intl.formatMessage({
                                    id: "meeting.participantAccessEvent",
                                  })}
                                />
                              )}
                              size="small"
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
                    <Grid
                      item
                      xs
                      sx={{ mr: "20px" }}
                      className="promotionAccess"
                    >
                      <Controller
                        control={control}
                        name={"promotions"}
                        render={({ field: { onChange, value, ref } }) => (
                          <Autocomplete
                            inputRef={ref}
                            value={findDefaultValue(promotions, value)}
                            onChange={(event, item) =>
                              onChange(item?.map((it) => it?.value))
                            }
                            multiple
                            options={promotions}
                            disableCloseOnSelect
                            filterSelectedOptions
                            getOptionLabel={(option) =>
                              promotions?.find(
                                (it) => it?.value === option?.value
                              )?.label ?? ""
                            }
                            renderInput={(params) => (
                              <TextField
                                variant="standard"
                                {...params}
                                label={intl.formatMessage({
                                  id: "meeting.promotionAccessEvent",
                                })}
                                helperText="Par défaut, toutes les promotions auront accès à l’événement. Pour restreindre l’accès, choisissez les promotions souhaitées"
                              />
                            )}
                            size="small"
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
                            inputRef={ref}
                            value={findDefaultValue(_personaLabelData, value)}
                            onChange={(event, item) =>
                              onChange(item?.map((it) => it?.value))
                            }
                            multiple
                            disableCloseOnSelect
                            filterSelectedOptions
                            options={_personaLabelData?.map((it) => ({
                              label: it?.label,
                              value: it?.value,
                            }))}
                            getOptionLabel={(option) =>
                              _personaLabelData.find(
                                (it) => it?.value === option?.value
                              )?.label ?? ""
                            }
                            renderInput={(params) => (
                              <TextField
                                variant="standard"
                                {...params}
                                label={intl.formatMessage({
                                  id: "meeting.roleAccessEvent",
                                })}
                                helperText="Par défaut, tous les rôles y auront accès.
                          Sélectionnez une ou plusieurs promotions pour
                          restreindre l’accès."
                              />
                            )}
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
            <Grid container justifyContent="flex-start">
              <Button
                type="submit"
                color="primary"
                variant="contained"
                // disabled={!isDirty || !isValid}
                onClick={handleSubmit(onSubmitForms, getErrors)}
                sx={{ mt: 4, ml: 4 }}
                endIcon={<ArrowForwardIcon />}
              >
                {isCloneable ? (
                  <FormattedMessage id="meeting.programCloneEvent" />
                ) : meeting ? (
                  <FormattedMessage id="meeting.programEditEvent" />
                ) : (
                  <FormattedMessage id="meeting.createNewEvent" />
                )}
              </Button>
            </Grid>
            <AlertComponent
              open={openAlert}
              setOpen={setOpenAlert}
              label={"Veuillez remplir tous les champs obligatoires"}
            />
          </Paper>
        </Grid>
      </Container>
      <SnackbarLfg
        text={snackBarText}
        open={openSnackBar}
        handleClose={handleClose}
      />
    </Root>
  );
};
AgendaMeetings.contextTypes = {
  intl: intlShape,
};
export default AgendaMeetings;
