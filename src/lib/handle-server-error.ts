import { AxiosError } from 'axios'
import { toast } from 'sonner'

export function handleServerError(error: unknown) {
  let errMsg = 'Something went wrong!'

  if (error instanceof AxiosError) {
    const serverError =
      error.response?.data?.error || error.response?.data?.title
    if (typeof serverError === 'string' && serverError.length > 0) {
      errMsg = serverError
    } else {
      errMsg = error.message
    }
  } else if (error instanceof Error) {
    errMsg = error.message
  }

  toast.error(errMsg)
}
