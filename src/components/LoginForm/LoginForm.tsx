import { Box, Button, TextInput } from '@mantine/core'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAxios } from '../../hooks/useAxios'
import useAuthStore from '../../hooks/zustand/useAuthStore'
import { AuthUserGetDto } from '../../types/domains/AuthUserGetDto'
import { urls } from '../../utils/urls'

interface FormValues {
  username: string
  email: string
  password: string // PE 1/3 - is not used for login?
}

const LoginForm = () => {
  const { setAuthUser } = useAuthStore()

  const axios = useAxios()

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<FormValues>({
    defaultValues: { username: '', email: '', password: '' },
  })

  const onSubmit = (values: FormValues) => {
    const authData = {
      username: values.username,
      email: values.email,
      password: values.password,
    }

    axios
      .post<AuthUserGetDto>(urls.api.auth.login, authData)
      .then((res) => {
        const authUser = res.data
        setAuthUser(authUser)
      })
      .catch((e) => {})
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
      <Box>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextInput
              id="email"
              type={'text'}
              label={'Email or username'}
              required
              autoFocus
              {...field}
            />
          )}
        />
      </Box>

      <Box mt={1}>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextInput
              id="password"
              type="password"
              label="Password"
              required
              {...field}
            />
          )}
        />
      </Box>

      <Box mt={2}>
        <Button
          id="auth-submit-button"
          type="submit"
          color="primary"
          loading={isSubmitting}
          style={{
            textTransform: 'none',
            fontSize: 16,
            paddingTop: 10,
            paddingBottom: 10,
          }}
          fullWidth
        >
          SIGN IN
        </Button>
      </Box>
    </form>
  )
}

export default LoginForm
