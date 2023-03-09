import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  FormHelperText,
} from '@mui/material';

type FormValues = {
  email: string,
  password: string,
  rememberme: boolean,
}

const formOptions = {
  emailValidation: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/,
  emailErrorText: "E-Mail-Adresse ist ungültig.",
  passMinLength: 6,
  passErrorText: "Passwort muss mindestens 6 Zeichen lang sein.",
  submitUrl: "https://jsonplaceholder.typicode.com/posts",
  successText: "Formular erfolgreich abgeschickt.",
  failText: "Formular konnte nicht abgeschickt werden.",
}

export default function Formular() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur"
  });

  const onSubmit: SubmitHandler<FormValues> = async data => {
    setError("root.formStatus", {type: "processing", message: ""})
    try {
      const response = await fetch(formOptions.submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setError("root.formStatus", {type: "success", message: formOptions.successText})
      } else {
        setError("root.formStatus", {type: "error", message: formOptions.failText})
      }
    } catch (error) {
      setError("root.formStatus", {type: "error", message: formOptions.failText})
    }
  };

  const handleValidationEmail = (email: string) => {
    return formOptions.emailValidation.test(email);
  };

  const handleValidationPass = (pass: string) => {
    return pass.length >= formOptions.passMinLength;
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4%',
        borderRadius: '10px',
        boxShadow: 2,
      }}
    >
      <Typography component="h1" variant="h5">
        Formular
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          fullWidth
          label="E-Mail"
          autoComplete="email"
          error={errors.email ? true : false}
          helperText={errors.email ? formOptions.emailErrorText : ""}
          {...register('email', { required: true, validate: handleValidationEmail })}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Passwort"
          type="password"
          autoComplete="current-password"
          error={errors.password ? true : false}
          helperText={errors.password ? formOptions.passErrorText : ""}
          {...register('password', { required: true, validate: handleValidationPass })}
        />
        <FormControlLabel
          control={<Checkbox color="primary" {...register('rememberme')}/>}
          label="Remember me"
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ my: 2 }}
          disabled={errors?.root?.formStatus.type == "processing" ? true : false}
        >
          Absenden
        </Button>
        <FormHelperText error={errors?.root?.formStatus.type == "error" ? true : false}>
          {errors?.root?.formStatus ? errors?.root?.formStatus.message : ""}
        </FormHelperText>
      </Box>
    </Box>
  );
}