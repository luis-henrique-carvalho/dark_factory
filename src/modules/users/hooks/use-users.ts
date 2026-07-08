import { useQuery } from '@tanstack/react-query'
import { UsersApi } from '../services/users-api'
import { usersQueryKeys } from '../services/users-query-keys'

export function useUsersList() {
  return useQuery({
    queryKey: usersQueryKeys.lists(),
    queryFn: () => UsersApi.list(),
  })
}
